from __future__ import annotations

import json
import re
from pathlib import Path

from pipeline.models import RawMeeting, Utterance
from pipeline.taxonomy import AEGIS_DOMAIN

SENTIMENT_MAP = {"positive": 1.0, "neutral": 0.0, "negative": -1.0}


def load_json(path: Path) -> object | None:
    if not path.exists():
        return None
    with path.open(encoding="utf-8") as handle:
        return json.load(handle)


def _utterance_duration(item: dict) -> float:
    start = item.get("time")
    end = item.get("endTime")
    if isinstance(start, (int, float)) and isinstance(end, (int, float)) and end > start:
        return float(end - start)
    return 1.0


def infer_customer_name(title: str, emails: list[str]) -> str | None:
    support = re.match(r"Support Case #\d+\s*-\s*(.+)$", title, re.I)
    if support:
        name = support.group(1).strip()
        name = re.sub(
            r"\s+(SSO|Detect|Protect|Comply|MFA|LDAP|SCIM|API|SAML|Backup|Invoice|Billing|SIEM).*$",
            "",
            name,
            flags=re.I,
        )
        return name.strip(" -") or None

    aegis_slash = re.match(r"Aegis\s*/\s*(.+?)\s*-\s*", title, re.I)
    if aegis_slash:
        return aegis_slash.group(1).strip()

    urgent = re.match(r"(?:URGENT|ESCALATION):\s*(.+?)\s*-\s*", title, re.I)
    if urgent:
        return urgent.group(1).strip()

    for email in emails:
        if email.lower().endswith(f"@{AEGIS_DOMAIN}"):
            continue
        domain = email.split("@")[-1]
        stem = domain.split(".")[0]
        if stem:
            return stem.replace("-", " ").title()
    return None


def speaker_side(name: str, emails: list[str], speaker_meta: dict[str, str]) -> str:
    customer_emails = [e for e in emails if not e.lower().endswith(f"@{AEGIS_DOMAIN}")]
    if not customer_emails:
        return "aegis"
    # Last-name overlap with email local part is noisy; use domain presence only
    # plus common pattern: Aegis staff appear in organizer-heavy meetings.
    lowered = name.lower()
    aegis_locals = [
        e.split("@")[0].replace(".", " ")
        for e in emails
        if e.lower().endswith(f"@{AEGIS_DOMAIN}")
    ]
    for local in aegis_locals:
        if local and local in lowered:
            return "aegis"
    # If any non-aegis attendee, unknown names default to customer on mixed calls
    for local in (e.split("@")[0].replace(".", " ") for e in customer_emails):
        if local and local in lowered:
            return "customer"
    # Fallback: if the display name is in speaker-meta values only, still unknown
    _ = speaker_meta
    return "unknown"


def load_meeting(folder: Path) -> RawMeeting:
    warnings: list[str] = []
    meeting_id = folder.name
    info = load_json(folder / "meeting-info.json") or {}
    summary = load_json(folder / "summary.json") or {}
    transcript = load_json(folder / "transcript.json") or {}
    speaker_meta_raw = load_json(folder / "speaker-meta.json") or {}

    if not info:
        warnings.append("missing meeting-info.json")
    if not summary:
        warnings.append("missing summary.json")
    if not transcript:
        warnings.append("missing transcript.json")

    emails = list(info.get("allEmails") or info.get("invitees") or [])
    speaker_meta = {str(k): str(v) for k, v in dict(speaker_meta_raw).items()}

    rows = transcript.get("data") if isinstance(transcript, dict) else transcript
    utterances: list[Utterance] = []
    if isinstance(rows, list):
        for item in rows:
            if not isinstance(item, dict):
                continue
            name = item.get("speaker_name") or item.get("speakerName") or "Unknown"
            utterances.append(
                Utterance(
                    sentence=str(item.get("sentence") or ""),
                    speaker_name=str(name),
                    sentiment_type=str(item.get("sentimentType") or "neutral"),
                    speaker_id=item.get("speaker_id"),
                    time=item.get("time"),
                    end_time=item.get("endTime"),
                    duration=_utterance_duration(item),
                    side=speaker_side(str(name), emails, speaker_meta),
                )
            )

    # Second pass: if mixed call and some unknown, treat unknown as customer
    has_customer_email = any(not e.lower().endswith(f"@{AEGIS_DOMAIN}") for e in emails)
    if has_customer_email:
        for utt in utterances:
            if utt.side == "unknown":
                utt.side = "customer"

    return RawMeeting(
        meeting_id=str(info.get("meetingId") or meeting_id),
        title=str(info.get("title") or meeting_id),
        organizer_email=info.get("organizerEmail"),
        start_time=info.get("startTime"),
        end_time=info.get("endTime"),
        duration_min=float(info.get("duration") or 0.0),
        emails=emails,
        summary=str(summary.get("summary") or ""),
        action_items=list(summary.get("actionItems") or []),
        provided_topics=list(summary.get("topics") or []),
        provided_overall_sentiment=summary.get("overallSentiment"),
        provided_sentiment_score=summary.get("sentimentScore"),
        key_moments=list(summary.get("keyMoments") or []),
        utterances=utterances,
        speaker_meta=speaker_meta,
        warnings=warnings,
    )


def load_dataset(dataset_dir: Path) -> list[RawMeeting]:
    meetings: list[RawMeeting] = []
    for folder in sorted(p for p in dataset_dir.iterdir() if p.is_dir()):
        if not (folder / "meeting-info.json").exists() and not (folder / "transcript.json").exists():
            continue
        meetings.append(load_meeting(folder))
    return meetings
