from __future__ import annotations

import argparse
import hashlib
import json
import os
import subprocess
from collections import Counter
from datetime import datetime, timezone
from importlib.metadata import version
from pathlib import Path

from dotenv import load_dotenv

from pipeline.classify import build_theme_catalog, enrich_meeting, theme_confidence
from pipeline.ingest import load_dataset
from pipeline.insights import issue_graph, risk_radar, voc_backlog
from pipeline.llm import PROMPT_VERSION, maybe_refine_theme_with_provenance
from pipeline.models import MeetingRecord
from pipeline.paths import cache_dir, dataset_dir, processed_dir
from pipeline.sentiment import interpret_trends, module_heatmap, score_meeting, trend_table


def _theme_labels() -> dict[str, str]:
    from pipeline.taxonomy import THEMES

    return {tid: label for tid, label, _ in THEMES} | {"other": "Other / uncategorized"}


def _theme_keywords(theme_id: str) -> set[str]:
    from pipeline.taxonomy import THEMES

    for tid, _, keywords in THEMES:
        if tid == theme_id:
            return {str(k).lower() for k in keywords if str(k).strip()}
    return set()


def taxonomy_validation(records: list[MeetingRecord]) -> dict:
    theme_ids = sorted({record.primary_theme for record in records})
    reviews: list[dict] = []
    passed = 0
    reviewed = 0

    for theme_id in theme_ids:
        theme_records = [record for record in records if record.primary_theme == theme_id]
        samples = theme_records[:3]
        sampled_ids = {record.meeting_id for record in samples}
        samples.extend(
            record
            for record in theme_records
            if record.meeting_id not in sampled_ids and record.confidence.theme.level == "low"
        )
        for record in samples:
            reviewed += 1
            keywords = _theme_keywords(theme_id)
            evidence = {
                "title_match": bool(keywords and any(k in (record.title or "").lower() for k in keywords)),
                "summary_match": bool(keywords and any(k in (record.summary or "").lower() for k in keywords)),
                "topic_match": bool(keywords and any(k in " ".join(record.provided_topics).lower() for k in keywords)),
                "quote_match": bool(keywords and any(k in (record.example_quote or "").lower() for k in keywords)),
            }
            valid = any(evidence.values()) and record.confidence.theme.level != "low"
            if valid:
                passed += 1
            reviews.append(
                {
                    "meeting_id": record.meeting_id,
                    "theme_id": theme_id,
                    "theme_label": record.primary_theme_label,
                    "status": "pass" if valid else "needs_review",
                    "evidence": evidence,
                    "why": (
                        "Theme has supporting evidence and is not classified as low confidence."
                        if valid
                        else "Theme evidence is weak, missing, or ambiguous; a human review is recommended."
                    ),
                }
            )

    sample_size = max(reviewed, 1)
    pass_rate = round(passed / sample_size, 4)
    status = "passed" if pass_rate >= 0.8 else "needs_human_review"

    return {
        "status": status,
        "reviewed_meetings": reviewed,
        "reviewed_themes": len(theme_ids),
        "pass_rate": pass_rate,
        "needs_human_review": len([r for r in reviews if r["status"] == "needs_review"]),
        "criteria": [
            "Primary themes are validated against title, summary, provided topics, and example quote evidence.",
            "A theme is considered valid when at least one evidence signal is present.",
            "Results below 80% pass rate trigger a human review queue.",
        ],
        "reviews": reviews,
    }


def write_json(path: Path, payload: object) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(payload, indent=2, default=str), encoding="utf-8")


def _source_manifest(dataset: Path) -> list[dict[str, str]]:
    source_files: list[dict[str, str]] = []
    for folder in sorted(path for path in dataset.iterdir() if path.is_dir()):
        for filename in ("meeting-info.json", "transcript.json", "summary.json", "speaker-meta.json"):
            path = folder / filename
            if path.is_file():
                digest = hashlib.sha256(path.read_bytes()).hexdigest()
                source_files.append(
                    {
                        "path": path.relative_to(dataset).as_posix(),
                        "sha256": digest,
                    }
                )
    return source_files


def _git_revision() -> str | None:
    repository_root = Path(__file__).resolve().parents[3]
    result = subprocess.run(
        ["git", "rev-parse", "HEAD"],
        cwd=repository_root,
        capture_output=True,
        check=False,
        text=True,
    )
    return result.stdout.strip() if result.returncode == 0 else None


def _code_manifest() -> dict[str, object]:
    backend_root = Path(__file__).resolve().parents[1]
    source_files = sorted(
        [*backend_root.joinpath("pipeline").glob("*.py"), *backend_root.joinpath("app").glob("*.py")]
    )
    file_hashes = [
        {
            "path": path.relative_to(backend_root).as_posix(),
            "sha256": hashlib.sha256(path.read_bytes()).hexdigest(),
        }
        for path in source_files
    ]
    repository_root = backend_root.parents[1]
    status = subprocess.run(
        ["git", "status", "--porcelain"],
        cwd=repository_root,
        capture_output=True,
        check=False,
        text=True,
    )
    return {
        "sha256": hashlib.sha256(
            json.dumps(file_hashes, sort_keys=True, separators=(",", ":")).encode("utf-8")
        ).hexdigest(),
        "files": file_hashes,
        "working_tree_clean": status.returncode == 0 and not status.stdout.strip(),
    }


def overview(records: list[MeetingRecord], notes: list[str]) -> dict:
    types = Counter(m.call_type for m in records)
    modules = Counter(mod for m in records for mod in m.product_modules)
    return {
        "meeting_count": len(records),
        "call_type_mix": dict(types),
        "module_mix": dict(modules),
        "mean_utterance_sentiment": round(
            sum(m.utterance_sentiment_mean for m in records) / max(len(records), 1), 4
        ),
        "high_risk_accounts": len(
            {
                m.customer_name or m.meeting_id
                for m in records
                if m.risk_score >= 0.5 and m.call_type != "internal"
            }
        ),
        "approach": {
            "call_type": "Rules on title + attendee email domains.",
            "themes": (
                "Keyword taxonomy over title, summary, provided topics, and early transcript. "
                "Optional OpenAI JSON refine if OPENAI_API_KEY is set."
            ),
            "sentiment": (
                "Duration-weighted polarity of utterance sentimentType. Customer-side only "
                "on support/external so Aegis politeness does not wash out the signal."
            ),
        },
        "takeaways": notes,
    }


def run_pipeline(ds: Path | None = None, out: Path | None = None, use_llm: bool = True) -> dict:
    load_dotenv()
    dataset = ds or dataset_dir()
    dest = out or processed_dir()
    dest.mkdir(parents=True, exist_ok=True)

    raw_meetings = load_dataset(dataset)
    records: list[MeetingRecord] = []
    theme_refinement: dict[str, dict[str, str]] = {}
    for raw in raw_meetings:
        sent = score_meeting(raw)
        rec = enrich_meeting(raw, sent)
        if use_llm:
            llm_cache_dir = cache_dir()
            refined, refinement_provenance = maybe_refine_theme_with_provenance(raw, llm_cache_dir)
            if refined and refined.get("primary_theme"):
                if refinement_provenance is None:
                    raise ValueError(f"LLM refinement for {raw.meeting_id} returned no provenance")
                theme_refinement[raw.meeting_id] = refinement_provenance
                rec.primary_theme = refined["primary_theme"]
                labels = _theme_labels()
                rec.primary_theme_label = labels.get(rec.primary_theme, rec.primary_theme)
                rec.secondary_themes = list(refined.get("secondary_themes") or rec.secondary_themes)
                if refined.get("rationale"):
                    rec.theme_rationale = str(refined["rationale"])
                if refined.get("example_quote"):
                    rec.example_quote = str(refined["example_quote"])[:500]
                if refined.get("product_modules"):
                    rec.product_modules = list(refined["product_modules"])
        rec.confidence.theme = theme_confidence(raw, rec.primary_theme)
        records.append(rec)

    records.sort(key=lambda m: m.start_time or "")
    points = trend_table(records)
    notes = interpret_trends(records, points)
    catalog = build_theme_catalog(records)
    validation = taxonomy_validation(records)

    source_files = _source_manifest(dataset)
    manifest = {
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "pipeline_version": version("transcript-intelligence-backend"),
        "git_revision": _git_revision(),
        "code": _code_manifest(),
        "dataset": {
            "origin": "input_dataset; contents not independently verified",
            "synthetic_data_generated_by_pipeline": False,
            "augmentation": "none_by_pipeline",
            "meeting_count": len(raw_meetings),
            "source_file_count": len(source_files),
            "source_files": source_files,
            "sha256": hashlib.sha256(
                json.dumps(source_files, sort_keys=True, separators=(",", ":")).encode("utf-8")
            ).hexdigest(),
        },
        "configuration": {
            "llm_refinement_enabled": use_llm,
            "llm_api_key_configured": bool(os.getenv("OPENAI_API_KEY")),
            "llm_model": os.getenv("OPENAI_MODEL", "gpt-4o-mini") if use_llm else None,
            "llm_prompt_version": PROMPT_VERSION if use_llm else None,
            "sentiment_method": "duration_weighted_source_utterance_labels",
            "taxonomy_method": "rules_keyword_taxonomy",
        },
        "theme_refinement": theme_refinement,
        "theme_refinement_counts": dict(
            Counter(provenance["source"] for provenance in theme_refinement.values())
        ),
        "artifacts": [
            "meetings.json",
            "themes.json",
            "taxonomy_validation.json",
            "sentiment_trends.json",
            "sentiment_heatmap.json",
            "risk_radar.json",
            "issue_graph.json",
            "voc_backlog.json",
            "overview.json",
            "run_manifest.json",
        ],
    }

    payload_meetings = [m.model_dump() for m in records]
    write_json(dest / "meetings.json", payload_meetings)
    write_json(dest / "themes.json", [t.model_dump() for t in catalog])
    write_json(dest / "taxonomy_validation.json", validation)
    write_json(dest / "sentiment_trends.json", [p.model_dump() for p in points])
    write_json(dest / "sentiment_heatmap.json", module_heatmap(records))
    write_json(dest / "risk_radar.json", risk_radar(records))
    write_json(dest / "issue_graph.json", issue_graph(records))
    write_json(dest / "voc_backlog.json", voc_backlog(records))
    write_json(dest / "overview.json", overview(records, notes))
    write_json(dest / "run_manifest.json", manifest)

    return {
        "meetings": len(records),
        "output": str(dest),
        "call_types": dict(Counter(m.call_type for m in records)),
        "manifest": str(dest / "run_manifest.json"),
    }


def main() -> None:
    parser = argparse.ArgumentParser(description="Run Transcript Intelligence pipeline")
    parser.add_argument("--dataset", type=Path, default=None)
    parser.add_argument("--out", type=Path, default=None)
    parser.add_argument("--no-llm", action="store_true", help="Skip optional OpenAI refine")
    args = parser.parse_args()
    result = run_pipeline(args.dataset, args.out, use_llm=not args.no_llm)
    print(json.dumps(result, indent=2))


if __name__ == "__main__":
    main()
