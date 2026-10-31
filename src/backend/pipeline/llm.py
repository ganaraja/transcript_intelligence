"""Optional LLM theme extraction.

The default pipeline is hybrid rules + provided topics so the demo runs without
an API key. If OPENAI_API_KEY is set, this module can refine primary_theme.
Results are cached under data/cache/llm/.
"""

from __future__ import annotations

import json
import os
from datetime import datetime, timezone
from pathlib import Path

from pipeline.models import RawMeeting

PROMPT_VERSION = "theme-refinement-v1"


def maybe_refine_theme(raw: RawMeeting, cache_dir: Path) -> dict | None:
    refined, _ = maybe_refine_theme_with_provenance(raw, cache_dir)
    return refined


def maybe_refine_theme_with_provenance(
    raw: RawMeeting, cache_dir: Path
) -> tuple[dict | None, dict[str, str] | None]:
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        return None, None
    cache_dir.mkdir(parents=True, exist_ok=True)
    cache_path = cache_dir / f"{raw.meeting_id}.json"
    if cache_path.exists():
        cached = json.loads(cache_path.read_text(encoding="utf-8"))
        if "result" in cached and "provenance" in cached:
            return cached["result"], {**cached["provenance"], "source": "cache"}
        return cached, {
            "source": "legacy_cache",
            "generated_at": "",
            "model": "",
            "prompt_version": "",
        }
    try:
        from openai import OpenAI
    except ImportError:
        return None, None

    model = os.getenv("OPENAI_MODEL", "gpt-4o-mini")
    client = OpenAI(api_key=api_key)
    excerpt = " ".join(u.sentence for u in raw.utterances[:25])[:4000]
    prompt = {
        "title": raw.title,
        "summary": raw.summary,
        "topics": raw.provided_topics,
        "excerpt": excerpt,
    }
    completion = client.chat.completions.create(
        model=model,
        temperature=0,
        response_format={"type": "json_object"},
        messages=[
            {
                "role": "system",
                "content": (
                    "Classify an Aegis Cloud Security call. Return JSON with keys "
                    "primary_theme, secondary_themes, product_modules, rationale, example_quote. "
                    "primary_theme must be one of: detect_outage, sso_identity_failure, "
                    "comply_launch_audit, protect_backup, renewal_commercial, competitive_evaluation, "
                    "onboarding_adoption, incident_communication, product_roadmap, engineering_ops, other."
                ),
            },
            {"role": "user", "content": json.dumps(prompt)},
        ],
    )
    content = completion.choices[0].message.content or "{}"
    data = json.loads(content)
    provenance = {
        "source": "openai",
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "model": model,
        "prompt_version": PROMPT_VERSION,
    }
    cache_path.write_text(
        json.dumps({"result": data, "provenance": provenance}, indent=2),
        encoding="utf-8",
    )
    return data, provenance
