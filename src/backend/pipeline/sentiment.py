from __future__ import annotations

from collections import defaultdict

import pandas as pd

from pipeline.models import MeetingRecord, RawMeeting, SentimentPoint, Utterance

POLARITY = {"positive": 1.0, "neutral": 0.0, "negative": -1.0}


def weighted_mean(utterances: list[Utterance]) -> float | None:
    if not utterances:
        return None
    num = 0.0
    den = 0.0
    for utt in utterances:
        weight = utt.duration or 1.0
        num += POLARITY.get(utt.sentiment_type.lower(), 0.0) * weight
        den += weight
    return round(num / den, 4) if den else None


def trajectory(utterances: list[Utterance]) -> str:
    if len(utterances) < 6:
        return "flat"
    third = max(len(utterances) // 3, 1)
    first = weighted_mean(utterances[:third]) or 0.0
    last = weighted_mean(utterances[-third:]) or 0.0
    delta = last - first
    if delta > 0.12:
        return "recovering"
    if delta < -0.12:
        return "deteriorating"
    return "flat"


def score_meeting(raw: RawMeeting) -> dict:
    all_mean = weighted_mean(raw.utterances) or 0.0
    customer = [u for u in raw.utterances if u.side == "customer"]
    aegis = [u for u in raw.utterances if u.side == "aegis"]
    return {
        "all_mean": all_mean,
        "customer_mean": weighted_mean(customer),
        "aegis_mean": weighted_mean(aegis),
        "trajectory": trajectory(raw.utterances),
    }


def trend_table(records: list[MeetingRecord]) -> list[SentimentPoint]:
    rows: list[SentimentPoint] = []
    grouped: dict[tuple[str, str], list[MeetingRecord]] = defaultdict(list)
    for rec in records:
        if rec.week:
            grouped[(rec.week, rec.call_type)].append(rec)
    for (week, call_type), group in sorted(grouped.items()):
        cust = [m.customer_sentiment_mean for m in group if m.customer_sentiment_mean is not None]
        rows.append(
            SentimentPoint(
                week=week,
                call_type=call_type,
                mean_customer=round(sum(cust) / len(cust), 4) if cust else None,
                mean_all=round(sum(m.utterance_sentiment_mean for m in group) / len(group), 4),
                n=len(group),
            )
        )
    return rows


def module_heatmap(records: list[MeetingRecord]) -> list[dict]:
    cells: dict[tuple[str, str], list[float]] = defaultdict(list)
    for rec in records:
        value = rec.customer_sentiment_mean
        if value is None:
            value = rec.utterance_sentiment_mean
        for module in rec.product_modules:
            cells[(module, rec.call_type)].append(value)
    return [
        {
            "module": module,
            "call_type": call_type,
            "mean": round(sum(vals) / len(vals), 4),
            "n": len(vals),
        }
        for (module, call_type), vals in sorted(cells.items())
    ]


def interpret_trends(records: list[MeetingRecord], points: list[SentimentPoint]) -> list[str]:
    notes: list[str] = []
    by_type: dict[str, list[MeetingRecord]] = defaultdict(list)
    for rec in records:
        by_type[rec.call_type].append(rec)

    def mean_cust(group: list[MeetingRecord]) -> float | None:
        vals = [m.customer_sentiment_mean for m in group if m.customer_sentiment_mean is not None]
        return round(sum(vals) / len(vals), 3) if vals else None

    for call_type, group in by_type.items():
        m = mean_cust(group)
        if m is not None:
            notes.append(
                f"{call_type.title()} calls: customer-side sentiment averages {m:.2f} "
                f"across {len(group)} meetings (duration-weighted utterance polarity)."
            )

    detect = [m for m in records if "detect" in m.product_modules]
    if detect:
        dmean = mean_cust(detect)
        others = [m for m in records if "detect" not in m.product_modules]
        omean = mean_cust(others)
        if dmean is not None and omean is not None and dmean < omean - 0.05:
            notes.append(
                f"Detect-tagged calls sit {omean - dmean:.2f} below the rest of the corpus. "
                "That gap is the outage/reliability plotline showing up in customer language, "
                "not just in engineering war rooms."
            )

    support = by_type.get("support", [])
    external = by_type.get("external", [])
    s = mean_cust(support)
    e = mean_cust(external)
    if s is not None and e is not None:
        if s < e:
            notes.append(
                "Support is more negative than account-management calls. AM conversations can "
                "lag the ticket queue — sales may still hear a calm QBR while support is already "
                "absorbing an outage."
            )
        else:
            notes.append(
                "External/AM sentiment is at or below support. Renewal and competitive conversations "
                "are carrying as much heat as tickets — sales should treat that as a leading churn signal."
            )

    recovering = sum(1 for m in records if m.sentiment_trajectory == "recovering")
    deteriorating = sum(1 for m in records if m.sentiment_trajectory == "deteriorating")
    notes.append(
        f"{recovering} calls recover in the last third of the transcript; {deteriorating} deteriorate. "
        "Recovery is a coaching cue (workaround landed). Deterioration is a process cue (no path to resolution)."
    )

    # Worst week
    if points:
        df = pd.DataFrame([p.model_dump() for p in points])
        if df["mean_customer"].notna().any():
            worst = df.loc[df["mean_customer"].idxmin()]
            notes.append(
                f"Weakest customer-sentiment week: {worst['week']} ({worst['call_type']}, n={int(worst['n'])}). "
                "Use that week as the incident overlay when walking the panel through Detect/Identity spikes."
            )
    return notes
