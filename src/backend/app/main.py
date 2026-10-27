from __future__ import annotations

import json
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from pipeline.paths import processed_dir
from pipeline.run import run_pipeline

app = FastAPI(title="Transcript Intelligence API", version="0.1.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def _load(name: str) -> object:
    path = processed_dir() / name
    if not path.exists():
        raise HTTPException(
            status_code=404,
            detail=f"{name} not found. Run scripts/process-data.sh first.",
        )
    return json.loads(path.read_text(encoding="utf-8"))


@app.get("/api/health")
def health() -> dict:
    dest = processed_dir()
    return {
        "ok": True,
        "processed": dest.exists() and (dest / "meetings.json").exists(),
        "processed_dir": str(dest),
    }


@app.post("/api/reprocess")
def reprocess() -> dict:
    return run_pipeline(use_llm=True)


@app.get("/api/overview")
def overview() -> object:
    return _load("overview.json")


@app.get("/api/meetings")
def meetings() -> object:
    return _load("meetings.json")


@app.get("/api/meetings/{meeting_id}")
def meeting(meeting_id: str) -> object:
    rows = _load("meetings.json")
    for row in rows:
        if row["meeting_id"] == meeting_id:
            return row
    raise HTTPException(status_code=404, detail="meeting not found")


@app.get("/api/themes")
def themes() -> object:
    return _load("themes.json")


@app.get("/api/sentiment")
def sentiment() -> dict:
    return {
        "trends": _load("sentiment_trends.json"),
        "heatmap": _load("sentiment_heatmap.json"),
        "takeaways": _load("overview.json").get("takeaways", []),
    }


@app.get("/api/risk")
def risk() -> object:
    return _load("risk_radar.json")


@app.get("/api/graph")
def graph() -> object:
    return _load("issue_graph.json")


@app.get("/api/voc")
def voc() -> object:
    return _load("voc_backlog.json")
