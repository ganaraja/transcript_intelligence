from __future__ import annotations

from collections import defaultdict

from pipeline.models import GraphEdge, GraphNode, MeetingRecord, VocItem
from pipeline.taxonomy import VOC_BUG, VOC_FEATURE, VOC_PROCESS


def risk_radar(records: list[MeetingRecord]) -> list[dict]:
    by_account: dict[str, list[MeetingRecord]] = defaultdict(list)
    for rec in records:
        if rec.call_type == "internal":
            continue
        key = rec.customer_name or rec.meeting_id
        by_account[key].append(rec)

    rows: list[dict] = []
    for account, group in by_account.items():
        flags = sorted({f for m in group for f in m.risk_flags})
        score = max(m.risk_score for m in group)
        cust_vals = [m.customer_sentiment_mean for m in group if m.customer_sentiment_mean is not None]
        rows.append(
            {
                "account": account,
                "meetings": len(group),
                "risk_score": score,
                "risk_flags": flags,
                "mean_customer_sentiment": round(sum(cust_vals) / len(cust_vals), 4) if cust_vals else None,
                "call_types": sorted({m.call_type for m in group}),
                "themes": sorted({m.primary_theme_label for m in group}),
                "competitors": sorted({c for m in group for c in m.competitor_mentions}),
                "meeting_ids": [m.meeting_id for m in group],
                "why_it_matters": _risk_why(account, flags, group),
            }
        )
    rows.sort(key=lambda r: (-r["risk_score"], -r["meetings"]))
    return rows


def _risk_why(account: str, flags: list[str], group: list[MeetingRecord]) -> str:
    bits = []
    if "churn" in flags:
        bits.append("churn language or key-moment churn_signal")
    if "competitive" in flags:
        bits.append("competitor mention")
    if "escalation" in flags:
        bits.append("executive/urgent escalation")
    if "negative_customer" in flags:
        bits.append("negative customer-side polarity")
    if not bits:
        bits.append("elevated composite score")
    latest = max(group, key=lambda m: m.start_time or "")
    return (
        f"{account}: {', '.join(bits)}. Latest call “{latest.title}” "
        f"({latest.call_type}). Sales + support should share a single account plan."
    )


def issue_graph(records: list[MeetingRecord]) -> dict:
    nodes: dict[str, GraphNode] = {}
    edges: list[GraphEdge] = []

    for rec in records:
        mid = f"m:{rec.meeting_id}"
        tid = f"t:{rec.primary_theme}"
        nodes[mid] = GraphNode(
            id=mid,
            label=rec.title[:60],
            kind="meeting",
            call_type=rec.call_type,
            risk_score=rec.risk_score,
        )
        nodes[tid] = GraphNode(
            id=tid,
            label=rec.primary_theme_label,
            kind="theme",
        )
        edges.append(GraphEdge(source=mid, target=tid, kind="has_theme"))
        for module in rec.product_modules[:2]:
            nid = f"mod:{module}"
            nodes[nid] = GraphNode(id=nid, label=module.title(), kind="module")
            edges.append(GraphEdge(source=mid, target=nid, kind="has_module"))

    # Cross-surface: same theme in different call types within 14 days
    by_theme: dict[str, list[MeetingRecord]] = defaultdict(list)
    for rec in records:
        by_theme[rec.primary_theme].append(rec)

    import pandas as pd

    cross_theme_ids: list[str] = []
    for theme_id, group in by_theme.items():
        types = {m.call_type for m in group}
        if len(types) >= 2:
            cross_theme_ids.append(theme_id)
            # connect two representative meetings of different types
            ordered = sorted(group, key=lambda m: m.start_time or "")
            seen_types: dict[str, MeetingRecord] = {}
            for rec in ordered:
                if rec.call_type not in seen_types:
                    seen_types[rec.call_type] = rec
            ids = list(seen_types.values())
            for a, b in zip(ids, ids[1:]):
                lag_days = None
                if a.start_time and b.start_time:
                    da = pd.to_datetime(a.start_time, utc=True)
                    db = pd.to_datetime(b.start_time, utc=True)
                    lag_days = abs((db - da).days)
                edges.append(
                    GraphEdge(
                        source=f"m:{a.meeting_id}",
                        target=f"m:{b.meeting_id}",
                        kind=f"cross_surface_lag_{lag_days}d" if lag_days is not None else "cross_surface",
                    )
                )

    return {
        "nodes": [n.model_dump() for n in nodes.values()],
        "edges": [e.model_dump() for e in edges],
        "cross_surface_themes": cross_theme_ids,
        "insight": (
            "Edges labeled cross_surface connect the same theme across support, external, "
            "and internal calls. That is the Detect outage (and Identity regressions) jumping "
            "org boundaries — engineering war rooms and customer tickets are one incident, "
            "not three separate programs."
        ),
    }


def voc_backlog(records: list[MeetingRecord]) -> list[dict]:
    items: list[VocItem] = []
    for rec in records:
        text = f"{rec.summary} {rec.example_quote} {' '.join(rec.provided_topics)}".lower()
        voc_type: str | None = None
        if rec.provided_overall_sentiment in {"very-positive", "positive"} and rec.call_type == "external":
            if any(w in text for w in ("love", "great", "helpful", "exactly")):
                voc_type = "praise"
        if any(w in text for w in VOC_BUG) or rec.primary_theme in {"detect_outage", "sso_identity_failure"}:
            voc_type = "bug"
        elif any(w in text for w in VOC_FEATURE):
            voc_type = "feature_request"
        elif any(w in text for w in VOC_PROCESS) or rec.primary_theme == "incident_communication":
            voc_type = "process"
        if voc_type is None:
            continue
        module = rec.product_modules[0] if rec.product_modules else None
        quote = rec.example_quote or rec.summary[:240]
        items.append(
            VocItem(
                meeting_id=rec.meeting_id,
                title=rec.title,
                voc_type=voc_type,  # type: ignore[arg-type]
                module=module,
                quote=quote[:400],
                call_type=rec.call_type,
                customer_name=rec.customer_name,
            )
        )

    ranked: dict[tuple[str, str | None], list[VocItem]] = defaultdict(list)
    for item in items:
        ranked[(item.voc_type, item.module)].append(item)

    out = []
    for (voc_type, module), group in ranked.items():
        out.append(
            {
                "voc_type": voc_type,
                "module": module,
                "count": len(group),
                "examples": [g.model_dump() for g in group[:4]],
                "why_it_matters": _voc_why(voc_type, module, len(group)),
            }
        )
    out.sort(key=lambda r: -r["count"])
    return out


def _voc_why(voc_type: str, module: str | None, count: int) -> str:
    mod = module or "platform"
    if voc_type == "bug":
        return (
            f"{count} transcripts cluster as {mod} defects. Product + eng should treat this "
            "as a ranked reliability backlog, not isolated tickets."
        )
    if voc_type == "feature_request":
        return f"{count} {mod} feature asks — use as input to roadmap, not as a dump of quotes."
    if voc_type == "process":
        return (
            f"{count} process/comms gaps (status page, docs, handoffs). Support leadership "
            "owns this more than engineering does."
        )
    return f"{count} praise moments on {mod} — reuse in enablement and renewals."
