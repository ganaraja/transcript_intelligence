from __future__ import annotations

import re
from collections import Counter

from pipeline.models import (
    ConfidenceSignal,
    MeetingConfidence,
    MeetingRecord,
    RawMeeting,
    ThemeBucket,
    Utterance,
)
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


def call_type_confidence(meeting: RawMeeting, call_type: str) -> ConfidenceSignal:
    emails = [email.lower() for email in meeting.emails if "@" in email]
    outsiders = [email for email in emails if not email.endswith(f"@{AEGIS_DOMAIN}")]
    customer_domains = sorted({email.rsplit("@", 1)[1] for email in outsiders})
    title = meeting.title.strip().lower()

    if not emails:
        return ConfidenceSignal(
            level="low",
            evidence=["No attendee email domains are available; call type falls back to title/empty-attendee rules."],
        )
    if call_type == "internal":
        return ConfidenceSignal(
            level="high",
            evidence=["All available attendee email domains are @aegiscloud.com."],
        )
    if call_type == "support" and (
        title.startswith(CALL_TYPE_SUPPORT_PREFIXES)
        or title.startswith("support case")
        or any(token in title for token in SUPPORT_URGENCY_TOKENS)
        or title.startswith("incident")
    ):
        return ConfidenceSignal(
            level="high",
            evidence=[
                f"Customer attendee domain(s): {', '.join(customer_domains)}.",
                "Title matches a support/escalation/incident rule.",
            ],
        )
    if outsiders and re.match(r"aegis\s*/", title):
        return ConfidenceSignal(
            level="high",
            evidence=[
                f"Customer attendee domain(s): {', '.join(customer_domains)}.",
                "Title matches the Aegis / account-call pattern.",
            ],
        )
    if outsiders:
        return ConfidenceSignal(
            level="medium",
            evidence=[
                f"Customer attendee domain(s): {', '.join(customer_domains)}.",
                "No specific support title rule matched.",
            ],
        )
    return ConfidenceSignal(
        level="low",
        evidence=["No customer attendee domain was found; this assignment depends on incomplete attendee metadata."],
    )


def theme_confidence(meeting: RawMeeting, theme_id: str) -> ConfidenceSignal:
    title = _norm(meeting.title)
    topics = _norm(" ".join(meeting.provided_topics))
    summary = _norm(meeting.summary)
    quotes = " ".join(u.sentence for u in meeting.utterances[:40])
    transcript = _norm(quotes)
    combined_text = _norm(f"{meeting.title} {meeting.summary} {' '.join(meeting.provided_topics)} {quotes}")
    ranked: list[tuple[int, str]] = []
    selected_keywords: tuple[str, ...] = ()

    for candidate_id, _, keywords in THEMES:
        candidate_title = sum(6 for keyword in keywords if keyword in title)
        candidate_topics = sum(4 for keyword in keywords if keyword in topics)
        candidate_text = sum(1 for keyword in keywords if keyword in combined_text)
        ranked.append(
            (candidate_title + candidate_topics + candidate_text, candidate_id)
        )
        if candidate_id == theme_id:
            selected_keywords = keywords

    ranked.sort(reverse=True)
    assigned_score = next((score for score, candidate in ranked if candidate == theme_id), 0)
    runner_up = max((score for score, candidate in ranked if candidate != theme_id), default=0)
    evidence: list[str] = []
    for source, value in (
        ("title", title),
        ("provided topics", topics),
        ("summary", summary),
        ("transcript excerpt", transcript),
    ):
        matches = [keyword for keyword in selected_keywords if keyword in value]
        if matches:
            evidence.append(f"{source} matched: {', '.join(matches[:3])}.")

    margin = assigned_score - runner_up
    if assigned_score >= 6 and margin >= 4:
        level = "high"
    elif assigned_score >= 2 and margin >= 1:
        level = "medium"
    else:
        level = "low"
    if not evidence:
        evidence.append("No deterministic taxonomy keyword supports the assigned theme.")
    else:
        evidence.append(f"Assigned score {assigned_score}; lead over next theme {margin}.")
    return ConfidenceSignal(level=level, evidence=evidence)


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
    sentiment_speakers = (
        [u for u in raw.utterances if u.side == "customer"]
        if call_type != "internal"
        else raw.utterances
    )
    recognized_sentiments = sum(
        1
        for utt in sentiment_speakers
        if utt.sentiment_type.lower() in {"positive", "neutral", "negative"}
        and utt.sentiment_label_provided is not False
    )
    sentiment_coverage = recognized_sentiments / len(sentiment_speakers) if sentiment_speakers else 0
    if len(sentiment_speakers) >= 8 and sentiment_coverage >= 0.9:
        sentiment_level = "high"
    elif len(sentiment_speakers) >= 3 and sentiment_coverage >= 0.6:
        sentiment_level = "medium"
    else:
        sentiment_level = "low"
    sentiment_evidence = [
        f"Computed from {recognized_sentiments}/{len(sentiment_speakers)} "
        f"{'customer' if call_type != 'internal' else 'total'} utterances with recognized sentiment labels."
    ]
    if not sentiment_speakers:
        sentiment_evidence.append("No utterances from the population used for this call type were identified.")

    risk_evidence: list[str] = []
    moment_types = {str(moment.get("type") or "") for moment in raw.key_moments}
    if "churn" in flags:
        matched_churn = next((phrase for phrase in CHURN_PHRASES if phrase in text), None)
        if "churn_signal" in moment_types:
            risk_evidence.append("Churn key moment: churn_signal.")
        elif matched_churn:
            risk_evidence.append(f"Churn phrase matched: {matched_churn}.")
    if "escalation" in flags:
        if raw.title.lower().startswith(("urgent", "escalation", "incident")):
            risk_evidence.append("Escalation rule matched the call title.")
        elif "churn_signal" in moment_types:
            risk_evidence.append("Escalation rule matched a churn_signal key moment.")
        else:
            escalation_phrase = next(
                (phrase for phrase in ("war room", "complete loss", "escalate this") if phrase in text),
                None,
            )
            if escalation_phrase:
                risk_evidence.append(f"Escalation phrase matched: {escalation_phrase}.")
    if "competitive" in flags:
        risk_evidence.append(f"Competitor mention(s): {', '.join(detect_competitors(text))}.")
    if "negative_customer" in flags and sentiment.get("customer_mean") is not None:
        risk_evidence.append(
            f"Customer-side sentiment {sentiment['customer_mean']:.2f} is below the -0.25 threshold."
        )
    if "compliance_pressure" in flags:
        matched_compliance = next(
            (
                keyword
                for keyword in ("soc 2", "iso 27001", "hipaa", "pci", "compliance")
                if keyword in raw.title.lower()
            ),
            None,
        )
        risk_evidence.append(f"Compliance term matched in title: {matched_compliance}.")
    if raw.provided_overall_sentiment == "very-negative":
        risk_evidence.append("Vendor-provided overall sentiment is very-negative.")
    risk_level = (
        "high"
        if len(flags) >= 2
        else "medium"
        if flags or raw.provided_overall_sentiment == "very-negative"
        else "low"
    )
    if not risk_evidence:
        risk_evidence.append("No configured risk rule triggered.")
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
        confidence=MeetingConfidence(
            call_type=call_type_confidence(raw, call_type),
            theme=theme_confidence(raw, theme_id),
            sentiment=ConfidenceSignal(level=sentiment_level, evidence=sentiment_evidence),
            risk=ConfidenceSignal(level=risk_level, evidence=risk_evidence),
        ),
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
