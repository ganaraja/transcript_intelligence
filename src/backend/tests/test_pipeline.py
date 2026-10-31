from __future__ import annotations

import json

import pytest

from pipeline.classify import (
    call_type_confidence,
    classify_call_type,
    enrich_meeting,
    risk_flags,
    score_themes,
    theme_confidence,
    week_key,
)
from pipeline.insights import issue_graph, risk_radar
from pipeline.ingest import load_meeting
from pipeline.run import taxonomy_validation
from pipeline.models import ConfidenceSignal, MeetingConfidence, MeetingRecord, RawMeeting, Utterance
from pipeline.sentiment import module_heatmap, score_meeting, trend_table, trajectory, weighted_mean


def meeting_record(**overrides: object) -> MeetingRecord:
    values: dict[str, object] = {
        "meeting_id": "meeting-1",
        "title": "Support Case #42 - Login failure",
        "call_type": "support",
        "call_type_method": "rule",
        "call_type_reason": "Support case title",
        "primary_theme": "sso_identity_failure",
        "primary_theme_label": "SSO / Identity failures",
        "theme_rationale": "Identity keywords matched.",
        "example_quote": "Customers cannot complete SSO login after the update.",
        "customer_name": "Northwind",
        "product_modules": ["identity"],
        "start_time": "2026-03-10T12:00:00Z",
        "week": "2026-03-09",
        "customer_sentiment_mean": -0.5,
        "utterance_sentiment_mean": -0.25,
        "confidence": MeetingConfidence(
            call_type=ConfidenceSignal(level="high", evidence=["Fixture evidence"]),
            theme=ConfidenceSignal(level="high", evidence=["Fixture evidence"]),
            sentiment=ConfidenceSignal(level="medium", evidence=["Fixture evidence"]),
            risk=ConfidenceSignal(level="low", evidence=["No configured risk rule triggered."]),
        ),
    }
    values.update(overrides)
    return MeetingRecord(**values)


@pytest.mark.parametrize(
    ("title", "emails", "expected_type"),
    [
        ("Weekly Engineering Standup", ["lee@aegiscloud.com"], "internal"),
        ("Support Case #42 - Login failure", ["lee@aegiscloud.com", "sam@northwind.com"], "support"),
        ("URGENT: Northwind - Dashboard down", ["sam@northwind.com"], "support"),
        ("INCIDENT: Detect outage", ["sam@northwind.com"], "support"),
        ("Aegis / Northwind - Renewal review", ["sam@northwind.com"], "external"),
        ("Northwind onboarding", ["lee@aegiscloud.com", "sam@northwind.com"], "external"),
    ],
)
def test_classify_call_type_uses_title_and_attendee_domains(
    title: str, emails: list[str], expected_type: str
) -> None:
    raw = RawMeeting(meeting_id="meeting-1", title=title, emails=emails)

    call_type, method, reason = classify_call_type(raw)

    assert call_type == expected_type
    assert method == "rule"
    assert reason


def test_call_type_confidence_is_low_when_attendee_domains_are_missing() -> None:
    signal = call_type_confidence(RawMeeting(meeting_id="m1", title="Weekly sync"), "internal")

    assert signal.level == "low"
    assert "No attendee email domains" in signal.evidence[0]


def test_call_type_confidence_is_high_for_explicit_account_call_pattern() -> None:
    signal = call_type_confidence(
        RawMeeting(
            meeting_id="m1",
            title="Aegis / Northwind - Renewal review",
            emails=["admin@northwind.com"],
        ),
        "external",
    )

    assert signal.level == "high"
    assert any("Aegis / account-call pattern" in item for item in signal.evidence)


def test_ingest_tracks_whether_utterance_sentiment_was_provided(tmp_path) -> None:
    (tmp_path / "meeting-info.json").write_text(
        json.dumps({"meetingId": "m1", "title": "Support Case", "allEmails": ["a@northwind.com"]}),
        encoding="utf-8",
    )
    (tmp_path / "transcript.json").write_text(
        json.dumps(
            {
                "data": [
                    {"sentence": "A labeled sentence", "speakerName": "Customer", "sentimentType": "negative"},
                    {"sentence": "An unlabeled sentence", "speakerName": "Customer"},
                ]
            }
        ),
        encoding="utf-8",
    )

    raw = load_meeting(tmp_path)

    assert raw.utterances[0].sentiment_label_provided is True
    assert raw.utterances[1].sentiment_label_provided is False


def test_score_themes_weights_title_more_than_supplied_topics() -> None:
    theme_id, label, secondary, rationale = score_themes(
        text="",
        title="SSO login failure",
        provided_topics=["Renewal and billing"],
    )

    assert theme_id == "sso_identity_failure"
    assert label == "SSO / Identity failures"
    assert "renewal_commercial" in secondary
    assert "title weighted" in rationale


def test_taxonomy_validation_reports_review_status() -> None:
    records = [
        meeting_record(
            meeting_id="meeting-1",
            title="Support Case #42 - SSO login failure",
            summary="Customer cannot authenticate via SSO after the patch.",
            provided_topics=["identity"],
            primary_theme="sso_identity_failure",
            primary_theme_label="SSO / Identity failures",
            example_quote="SSO login failed after the identity update.",
        ),
        meeting_record(
            meeting_id="meeting-2",
            title="Aegis / Northwind - Renewal review",
            summary="Discussed annual renewal and contract expansion.",
            provided_topics=["renewal"],
            primary_theme="renewal_commercial",
            primary_theme_label="Renewal & commercial",
            example_quote="We are discussing the annual renewal and billing terms.",
        ),
    ]

    validation = taxonomy_validation(records)

    assert validation["status"] == "passed"
    assert validation["reviewed_meetings"] == 2
    assert validation["needs_human_review"] == 0
    assert validation["pass_rate"] == 1.0


def test_taxonomy_validation_queues_low_confidence_theme_even_with_keyword_hit() -> None:
    low_confidence_record = meeting_record(
        meeting_id="meeting-4",
        confidence=MeetingConfidence(
            call_type=ConfidenceSignal(level="high", evidence=["metadata"]),
            theme=ConfidenceSignal(level="low", evidence=["Ambiguous theme match."]),
            sentiment=ConfidenceSignal(level="medium", evidence=["sample"]),
            risk=ConfidenceSignal(level="low", evidence=["No risk rule."]),
        ),
    )
    records = [
        meeting_record(meeting_id=f"meeting-{index}")
        for index in range(1, 4)
    ] + [low_confidence_record]

    validation = taxonomy_validation(records)

    assert validation["status"] == "needs_human_review"
    assert validation["needs_human_review"] == 1
    queued = next(review for review in validation["reviews"] if review["meeting_id"] == "meeting-4")
    assert queued["status"] == "needs_review"


def test_theme_confidence_uses_keyword_evidence_and_margin() -> None:
    raw = RawMeeting(
        meeting_id="m1",
        title="Support Case - SSO login failure",
        emails=["support@aegiscloud.com", "admin@northwind.com"],
        provided_topics=["SSO"],
    )

    signal = theme_confidence(raw, "sso_identity_failure")

    assert signal.level == "high"
    assert any("title matched" in line for line in signal.evidence)


def test_enrich_meeting_marks_small_customer_sentiment_sample_low_confidence() -> None:
    raw = RawMeeting(
        meeting_id="m1",
        title="Support Case - login failure",
        emails=["support@aegiscloud.com", "admin@northwind.com"],
        utterances=[
            Utterance(
                sentence="I cannot log in through SSO after the identity update.",
                speaker_name="Customer",
                sentiment_type="negative",
                side="customer",
            )
        ],
    )

    record = enrich_meeting(
        raw,
        {"all_mean": -1.0, "customer_mean": -1.0, "aegis_mean": None, "trajectory": "flat"},
    )

    assert record.confidence.call_type.level == "high"
    assert record.confidence.theme.level == "high"
    assert record.confidence.sentiment.level == "low"
    assert record.confidence.risk.level == "medium"
    assert "1/1 customer utterances" in record.confidence.sentiment.evidence[0]


def test_sentiment_confidence_counts_only_labels_present_in_source_data() -> None:
    raw = RawMeeting(
        meeting_id="m1",
        title="Support Case - SSO login",
        emails=["admin@northwind.com"],
        utterances=[
            Utterance(
                sentence="I cannot sign in",
                speaker_name="Customer",
                sentiment_type="neutral",
                sentiment_label_provided=False,
                side="customer",
            )
        ],
    )

    record = enrich_meeting(
        raw,
        {"all_mean": 0.0, "customer_mean": 0.0, "aegis_mean": None, "trajectory": "flat"},
    )

    assert record.confidence.sentiment.level == "low"
    assert "0/1 customer utterances" in record.confidence.sentiment.evidence[0]


def test_weighted_mean_uses_duration_and_defaults_missing_duration_to_one() -> None:
    utterances = [
        Utterance(sentence="long negative", speaker_name="Customer", sentiment_type="negative", duration=3),
        Utterance(sentence="short positive", speaker_name="Customer", sentiment_type="positive", duration=1),
        Utterance(sentence="neutral", speaker_name="Customer", sentiment_type="neutral", duration=0),
    ]

    assert weighted_mean(utterances) == -0.4
    assert weighted_mean([]) is None


def test_score_meeting_separates_customer_and_aegis_speakers() -> None:
    raw = RawMeeting(
        meeting_id="meeting-1",
        title="Support Case #42",
        utterances=[
            Utterance(
                sentence="I cannot log in",
                speaker_name="Customer",
                sentiment_type="negative",
                duration=2,
                side="customer",
            ),
            Utterance(
                sentence="We will help",
                speaker_name="Agent",
                sentiment_type="positive",
                duration=1,
                side="aegis",
            ),
        ],
    )

    result = score_meeting(raw)

    assert result["customer_mean"] == -1.0
    assert result["aegis_mean"] == 1.0
    assert result["all_mean"] == pytest.approx(-1 / 3, abs=0.0001)


def test_trajectory_classifies_recovery_deterioration_and_short_calls() -> None:
    negative = [
        Utterance(sentence="negative", speaker_name="Customer", sentiment_type="negative")
        for _ in range(2)
    ]
    positive = [
        Utterance(sentence="positive", speaker_name="Customer", sentiment_type="positive")
        for _ in range(2)
    ]

    assert trajectory(negative + [Utterance(sentence="neutral", speaker_name="Agent")] * 2 + positive) == "recovering"
    assert trajectory(positive + [Utterance(sentence="neutral", speaker_name="Agent")] * 2 + negative) == "deteriorating"
    assert trajectory(negative + positive) == "flat"


def test_week_key_returns_monday_and_handles_missing_or_invalid_values() -> None:
    assert week_key("2026-03-11T12:30:00Z") == "2026-03-09"
    assert week_key(None) is None
    assert week_key("not-a-date") is None


def test_risk_flags_combine_churn_competitor_and_customer_negativity() -> None:
    raw = RawMeeting(
        meeting_id="meeting-1",
        title="Escalation: Northwind considering switching",
        provided_overall_sentiment="very-negative",
    )

    flags, score = risk_flags(
        raw,
        "Northwind is considering switching to crowdstrike.",
        customer_sent=-0.75,
    )

    assert set(flags) == {"churn", "competitive", "escalation", "negative_customer"}
    assert score == 1.0


def test_trend_and_heatmap_aggregate_by_week_type_and_module() -> None:
    support = meeting_record()
    support2 = meeting_record(
        meeting_id="meeting-2",
        customer_sentiment_mean=0.5,
        utterance_sentiment_mean=0.25,
    )
    internal = meeting_record(
        meeting_id="meeting-3",
        call_type="internal",
        customer_name=None,
        customer_sentiment_mean=None,
        utterance_sentiment_mean=0.75,
        product_modules=["detect"],
    )

    points = trend_table([support, support2, internal])
    cells = module_heatmap([support, internal])

    support_point = next(point for point in points if point.call_type == "support")
    assert support_point.n == 2
    assert support_point.mean_customer == 0.0
    internal_cell = next(cell for cell in cells if cell["call_type"] == "internal")
    assert internal_cell["mean"] == 0.75


def test_risk_radar_aggregates_account_and_excludes_internal_meetings() -> None:
    account_call = meeting_record(risk_score=0.8, risk_flags=["churn"])
    account_call_2 = meeting_record(
        meeting_id="meeting-2",
        call_type="external",
        risk_score=0.3,
        risk_flags=["competitive"],
    )
    internal = meeting_record(
        meeting_id="meeting-3",
        call_type="internal",
        customer_name=None,
        risk_score=1.0,
    )

    rows = risk_radar([account_call, account_call_2, internal])

    assert len(rows) == 1
    assert rows[0]["account"] == "Northwind"
    assert rows[0]["meetings"] == 2
    assert rows[0]["risk_score"] == 0.8
    assert rows[0]["confidence"]["level"] == "low"
    assert rows[0]["risk_flags"] == ["churn", "competitive"]


def test_issue_graph_links_shared_themes_across_call_types() -> None:
    support = meeting_record()
    external = meeting_record(
        meeting_id="meeting-2",
        call_type="external",
        start_time="2026-03-11T12:00:00Z",
    )

    graph = issue_graph([support, external])

    assert graph["cross_surface_themes"] == ["sso_identity_failure"]
    assert any(edge["kind"].startswith("cross_surface_lag_") for edge in graph["edges"])
