from __future__ import annotations

import pytest

from pipeline.classify import classify_call_type, risk_flags, score_themes, week_key
from pipeline.insights import issue_graph, risk_radar
from pipeline.models import MeetingRecord, RawMeeting, Utterance
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
