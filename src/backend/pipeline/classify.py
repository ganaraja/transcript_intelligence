from __future__ import annotations

import re
from collections import Counter

from pipeline.models import MeetingRecord, RawMeeting, ThemeBucket, Utterance
from pipeline.taxonomy import (
    AEGIS_DOMAIN,
    CALL_TYPE_SUPPORT_PREFIXES,
    CHURN_PHRASES,
    COMPETITORS,
    ESCALATION_PHRASES,
    MODULES,
    SUPPORT_URGENCY_TOKENS,
    THEMES,
)


def _norm(text: str) -> str:
    return re.sub(r"\s+", " ", text.lower())


def blob(meeting: RawMeeting) -> str:
    topics = " ".join(meeting.provided_topics)
    quotes = " ".join(u.sentence for u in meeting.utterances[:40])
    return _norm(f"{meeting.title} {meeting.summary} {topics} {quotes}")


def classify_call_type(meeting: RawMeeting) -> tuple[str, str, str]:
    emails = [e.lower() for e in meeting.emails]
    outsiders = [e for e in emails if not e.endswith(f"@{AEGIS_DOMAIN}")]
    title = meeting.title.strip()
    title_l = title.lower()

    if not outsiders:
        return "internal", "rule", "All attendees are @aegiscloud.com"

    if title_l.startswith(CALL_TYPE_SUPPORT_PREFIXES) or title_l.startswith("support case"):
        return "support", "rule", "Title matches support/escalation case pattern"

    if any(tok in title_l for tok in SUPPORT_URGENCY_TOKENS) and outsiders:
        return "support", "rule", "Customer-facing urgent/escalation title"

    if title_l.startswith("incident") and outsiders:
        return "support", "rule", "Incident title with customer attendees"

    if re.match(r"aegis\s*/", title_l):
        return "external", "rule", "Title uses Aegis / Customer account-management pattern"

    return "external", "rule", "Mixed Aegis + customer attendees without support title"


def score_modules(text: str) -> list[str]:
    hits: list[str] = []
    padded = f" {text} "
    for module, keywords in MODULES.items():
        if any(k in padded or k in text for k in keywords):
            hits.append(module)
    return hits or ["platform"]


def score_themes(text: str, title: str, provided_topics: list[str]) -> tuple[str, str, list[str], str]:
    ranked: list[tuple[int, str, str]] = []
    topic_blob = _norm(" ".join(provided_topics))
    title_n = _norm(title)
    for theme_id, label, keywords in THEMES:
        score = (
            sum(6 for k in keywords if k in title_n)
            + sum(4 for k in keywords if k in topic_blob)
            + sum(1 for k in keywords if k in text)
        )
        if score:
            ranked.append((score, theme_id, label))
    ranked.sort(reverse=True)
    if not ranked:
        return "other", "Other / uncategorized", [], "No taxonomy keywords fired; inspect title and summary."
    primary_id, primary_label = ranked[0][1], ranked[0][2]
    secondary = [t[1] for t in ranked[1:4]]
    rationale = (
        f"Primary theme '{primary_label}' scored highest with title weighted above "
        f"provided topics and transcript keywords."
    )
    return primary_id, primary_label, secondary, rationale


def pick_quote(utterances: list[Utterance], theme_id: str) -> str:
    keywords = next((kw for tid, _, kw in THEMES if tid == theme_id), ())
    customer = [u for u in utterances if u.side == "customer" and len(u.sentence) > 40]
    pool = customer or [u for u in utterances if len(u.sentence) > 40]
    for utt in pool:
        low = utt.sentence.lower()
        if any(k in low for k in keywords):
            return f"{utt.speaker_name}: {utt.sentence.strip()}"
    if pool:
        # Prefer a negative customer sentence
        neg = [u for u in pool if u.sentiment_type == "negative"]
        chosen = (neg or pool)[0]
        return f"{chosen.speaker_name}: {chosen.sentence.strip()}"
    return ""


def detect_competitors(text: str) -> list[str]:
    found = [name.title() for name in COMPETITORS if name in text]
    return sorted(set(found))


def risk_flags(meeting: RawMeeting, text: str, customer_sent: float | None) -> tuple[list[str], float]:
    flags: list[str] = []
    score = 0.0
    moment_types = {str(m.get("type") or "") for m in meeting.key_moments}

    title_l = meeting.title.lower()
    if "churn_signal" in moment_types or any(p in text for p in CHURN_PHRASES):
        flags.append("churn")
        score += 0.4
    if title_l.startswith(("urgent", "escalation", "incident")) or "churn_signal" in moment_types:
        flags.append("escalation")
        score += 0.3
    elif any(p in text for p in ("war room", "complete loss", "escalate this")):
        flags.append("escalation")
        score += 0.2
    _ = ESCALATION_PHRASES  # kept in taxonomy for optional LLM prompts
    if detect_competitors(text):
        flags.append("competitive")
        score += 0.25
    if customer_sent is not None and customer_sent < -0.25:
        flags.append("negative_customer")
        score += 0.2
    if any(k in title_l for k in ("soc 2", "iso 27001", "hipaa", "pci", "compliance")):
        flags.append("compliance_pressure")
        score += 0.1
    if meeting.provided_overall_sentiment == "very-negative":
        score += 0.15

    return sorted(set(flags)), round(min(score, 1.0), 3)


def week_key(start_time: str | None) -> str | None:
    if not start_time:
        return None
    import pandas as pd

    ts = pd.to_datetime(start_time, utc=True, errors="coerce")
    if pd.isna(ts):
        return None
    monday = ts.normalize() - pd.Timedelta(days=int(ts.weekday()))
    return monday.strftime("%Y-%m-%d")


def enrich_meeting(raw: RawMeeting, sentiment: dict) -> MeetingRecord:
    text = blob(raw)
    call_type, method, reason = classify_call_type(raw)
    modules = score_modules(text)
    theme_id, theme_label, secondary, rationale = score_themes(text, raw.title, raw.provided_topics)
    quote = pick_quote(raw.utterances, theme_id)
    flags, risk = risk_flags(raw, text, sentiment.get("customer_mean"))
    emails = raw.emails
    domains = sorted(
        {
            e.split("@")[-1].lower()
            for e in emails
            if "@" in e and not e.lower().endswith(f"@{AEGIS_DOMAIN}")
        }
    )
    preview_parts = [u.sentence for u in raw.utterances[:8]]
    return MeetingRecord(
        meeting_id=raw.meeting_id,
        title=raw.title,
        start_time=raw.start_time,
        duration_min=raw.duration_min,
        call_type=call_type,  # type: ignore[arg-type]
        call_type_method=method,
        call_type_reason=reason,
        customer_name=infer_customer_from_raw(raw),
        customer_domains=domains,
        product_modules=modules,
        primary_theme=theme_id,
        primary_theme_label=theme_label,
        secondary_themes=secondary,
        theme_rationale=rationale,
        example_quote=quote[:500],
        provided_topics=raw.provided_topics,
        provided_overall_sentiment=raw.provided_overall_sentiment,
        provided_sentiment_score=raw.provided_sentiment_score,
        utterance_sentiment_mean=sentiment["all_mean"],
        customer_sentiment_mean=sentiment.get("customer_mean"),
        aegis_sentiment_mean=sentiment.get("aegis_mean"),
        sentiment_trajectory=sentiment["trajectory"],
        risk_flags=flags,
        risk_score=risk,
        competitor_mentions=detect_competitors(text),
        action_item_count=len(raw.action_items),
        action_items=raw.action_items,
        key_moment_types=sorted({str(m.get("type") or "") for m in raw.key_moments if m.get("type")}),
        key_moments=raw.key_moments,
        summary=raw.summary,
        transcript_preview=" ".join(preview_parts)[:800],
        utterance_count=len(raw.utterances),
        customer_utterance_count=sum(1 for u in raw.utterances if u.side == "customer"),
        week=week_key(raw.start_time),
    )


def infer_customer_from_raw(raw: RawMeeting) -> str | None:
    from pipeline.ingest import infer_customer_name

    return infer_customer_name(raw.title, raw.emails)


def build_theme_catalog(records: list[MeetingRecord]) -> list[ThemeBucket]:
    by_theme: dict[str, list[MeetingRecord]] = {}
    for rec in records:
        by_theme.setdefault(rec.primary_theme, []).append(rec)
    label_map = {tid: label for tid, label, _ in THEMES}
    label_map["other"] = "Other / uncategorized"
    buckets: list[ThemeBucket] = []
    for theme_id, group in sorted(by_theme.items(), key=lambda kv: -len(kv[1])):
        types = Counter(m.call_type for m in group)
        buckets.append(
            ThemeBucket(
                theme_id=theme_id,
                label=label_map.get(theme_id, theme_id),
                count=len(group),
                by_call_type=dict(types),
                example_meeting_ids=[m.meeting_id for m in group[:5]],
                rationale=group[0].theme_rationale,
            )
        )
    return buckets
