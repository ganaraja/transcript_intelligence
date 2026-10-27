from __future__ import annotations

import asyncio
import json
from pathlib import Path

import httpx

from app import main


def get_api(path: str) -> httpx.Response:
    async def request() -> httpx.Response:
        transport = httpx.ASGITransport(app=main.app)
        async with httpx.AsyncClient(transport=transport, base_url="http://test") as client:
            return await client.get(path)

    return asyncio.run(request())


def test_health_reports_processed_data_state(tmp_path: Path, monkeypatch) -> None:
    monkeypatch.setattr(main, "processed_dir", lambda: tmp_path)
    (tmp_path / "meetings.json").write_text("[]", encoding="utf-8")

    response = get_api("/api/health")

    assert response.status_code == 200
    assert response.json()["processed"] is True


def test_missing_artifact_returns_actionable_404(tmp_path: Path, monkeypatch) -> None:
    monkeypatch.setattr(main, "processed_dir", lambda: tmp_path)

    response = get_api("/api/overview")

    assert response.status_code == 404
    assert "Run scripts/process-data.sh first" in response.json()["detail"]


def test_sentiment_route_combines_trends_heatmap_and_takeaways(
    tmp_path: Path, monkeypatch
) -> None:
    monkeypatch.setattr(main, "processed_dir", lambda: tmp_path)
    artifacts = {
        "sentiment_trends.json": [{"week": "2026-03-09", "call_type": "support"}],
        "sentiment_heatmap.json": [{"module": "identity", "call_type": "support"}],
        "overview.json": {"takeaways": ["Support is more negative than external calls."]},
    }
    for name, payload in artifacts.items():
        (tmp_path / name).write_text(json.dumps(payload), encoding="utf-8")

    response = get_api("/api/sentiment")

    assert response.status_code == 200
    assert response.json() == {
        "trends": artifacts["sentiment_trends.json"],
        "heatmap": artifacts["sentiment_heatmap.json"],
        "takeaways": artifacts["overview.json"]["takeaways"],
    }


def test_unknown_meeting_returns_404(tmp_path: Path, monkeypatch) -> None:
    monkeypatch.setattr(main, "processed_dir", lambda: tmp_path)
    (tmp_path / "meetings.json").write_text("[]", encoding="utf-8")

    response = get_api("/api/meetings/missing")

    assert response.status_code == 404
    assert response.json()["detail"] == "meeting not found"
