from __future__ import annotations

from typing import Literal

from pydantic import BaseModel, Field

CallType = Literal["support", "external", "internal"]
Trajectory = Literal["recovering", "deteriorating", "flat"]


class Utterance(BaseModel):
    sentence: str
    speaker_name: str
    sentiment_type: str = "neutral"
    speaker_id: int | None = None
    time: float | None = None
    end_time: float | None = None
    duration: float = 0.0
    side: Literal["aegis", "customer", "unknown"] = "unknown"


class RawMeeting(BaseModel):
    meeting_id: str
    title: str
    organizer_email: str | None = None
    start_time: str | None = None
    end_time: str | None = None
    duration_min: float = 0.0
    emails: list[str] = Field(default_factory=list)
    summary: str = ""
    action_items: list[str] = Field(default_factory=list)
    provided_topics: list[str] = Field(default_factory=list)
    provided_overall_sentiment: str | None = None
    provided_sentiment_score: float | None = None
    key_moments: list[dict] = Field(default_factory=list)
    utterances: list[Utterance] = Field(default_factory=list)
    speaker_meta: dict[str, str] = Field(default_factory=dict)
    warnings: list[str] = Field(default_factory=list)


class MeetingRecord(BaseModel):
    meeting_id: str
    title: str
    start_time: str | None = None
    duration_min: float = 0.0
    call_type: CallType
    call_type_method: str
    call_type_reason: str
    customer_name: str | None = None
    customer_domains: list[str] = Field(default_factory=list)
    product_modules: list[str] = Field(default_factory=list)
    primary_theme: str
    primary_theme_label: str
    secondary_themes: list[str] = Field(default_factory=list)
    theme_rationale: str
    example_quote: str
    provided_topics: list[str] = Field(default_factory=list)
    provided_overall_sentiment: str | None = None
    provided_sentiment_score: float | None = None
    utterance_sentiment_mean: float = 0.0
    customer_sentiment_mean: float | None = None
    aegis_sentiment_mean: float | None = None
    sentiment_trajectory: Trajectory = "flat"
    risk_flags: list[str] = Field(default_factory=list)
    risk_score: float = 0.0
    competitor_mentions: list[str] = Field(default_factory=list)
    action_item_count: int = 0
    action_items: list[str] = Field(default_factory=list)
    key_moment_types: list[str] = Field(default_factory=list)
    key_moments: list[dict] = Field(default_factory=list)
    summary: str = ""
    transcript_preview: str = ""
    utterance_count: int = 0
    customer_utterance_count: int = 0
    week: str | None = None


class ThemeBucket(BaseModel):
    theme_id: str
    label: str
    count: int
    by_call_type: dict[str, int]
    example_meeting_ids: list[str]
    rationale: str


class SentimentPoint(BaseModel):
    week: str
    call_type: str
    mean_customer: float | None = None
    mean_all: float
    n: int


class GraphNode(BaseModel):
    id: str
    label: str
    kind: Literal["meeting", "theme", "module"]
    call_type: str | None = None
    risk_score: float | None = None


class GraphEdge(BaseModel):
    source: str
    target: str
    kind: str


class VocItem(BaseModel):
    meeting_id: str
    title: str
    voc_type: Literal["bug", "feature_request", "process", "praise"]
    module: str | None = None
    quote: str
    call_type: str
    customer_name: str | None = None
