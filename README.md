# Transcript Intelligence

Demo for exploring ~100 Aegis Cloud Security call transcripts: categorize by call type and theme, track customer sentiment, and surface cross-functional insights for support, sales, product, and engineering.

This is a take-home style analysis app, not a production deployment.

## What you get

1. **Themes** — support / external / internal from title + attendee domains; primary themes from a title-weighted keyword taxonomy (optional OpenAI refine).
2. **Sentiment** — duration-weighted utterance polarity, **customer-side** on mixed calls, weekly trends and module heatmap.
3. **Bonus insights**
   - Risk radar (churn, competitive, escalation)
   - Cross-surface issue graph (same theme across support, AM, and eng)
   - Voice-of-customer backlog by module

Processed artifacts live in `data/processed/` so the dashboard runs without an LLM key.

## Layout

```
dataset/                 raw transcripts
data/processed/          pipeline output (JSON)
src/backend/             FastAPI + analysis pipeline (uv)
src/frontend/            React dashboard (npm)
scripts/                 run helpers
design.md                architecture
requirements.md          original brief
```

## Prerequisites

- Python 3.11+ and [uv](https://docs.astral.sh/uv/)
- Node.js 20+ and npm

Install uv if needed:

```bash
curl -LsSf https://astral.sh/uv/install.sh | sh
```

## How to run

From the repo root:

```bash
# 1. (Re)build insights from dataset/
./scripts/process-data.sh

# 2. API on http://127.0.0.1:8000
./scripts/run-backend.sh

# 3. UI on http://127.0.0.1:5173  (separate terminal)
./scripts/run-frontend.sh
```

Or both (API in background, UI in the foreground):

```bash
./scripts/run-all.sh
```

Open **http://127.0.0.1:5173**. The Vite dev server proxies `/api` to the backend.

OpenAPI docs: http://127.0.0.1:8000/docs

### Notebook walkthrough

The notebook in `notebooks/walkthrough.ipynb` runs the deterministic pipeline
and walks through call-type coverage, theme examples, sentiment trends, and the
three stakeholder insight outputs. It rebuilds the rules-only JSON artifacts
under `data/processed/`; no API key is needed.

Install the optional notebook kernel into the backend environment:

```bash
cd src/backend
uv sync --extra notebook
```

In VS Code, open the notebook and select the `src/backend/.venv` Python
interpreter as its kernel. The Jupyter extension is required.

### Optional LLM theme refine

Copy `.env.example` to `.env` and set `OPENAI_API_KEY`. Then:

```bash
cd src/backend && uv sync --extra llm
cd ../..
# omit --no-llm
cd src/backend && uv run python -m pipeline.run
```

Without a key, `process-data.sh` uses `--no-llm` (rules + taxonomy only).

## Libraries

Python (installed by `uv sync` in `src/backend`): see `src/backend/LIBRARIES.md` and `src/backend/pyproject.toml`.

React (installed by `npm install` in `src/frontend`): see `src/frontend/LIBRARIES.md` and `src/frontend/package.json`.

## Approach in one paragraph

Call type is deterministic from metadata, so we do not spend an LLM on it. Themes use a codebook aligned to Aegis modules (Identity, Detect, Protect, Comply) plus commercial and incident-comms themes. Sentiment uses the utterance `sentimentType` already in the files, but averages **customer speakers only** on support/external calls so vendor courtesy does not cancel a lockout. The issue graph is the “same incident, three rooms” view: Detect/Identity pain in tickets, AM calls, and engineering war rooms.

## API

| Method | Path | Purpose |
| --- | --- | --- |
| GET | `/api/health` | Processed-data status |
| GET | `/api/overview` | KPIs and takeaways |
| GET | `/api/meetings` | All enriched meetings |
| GET | `/api/meetings/{id}` | One meeting |
| GET | `/api/themes` | Theme codebook |
| GET | `/api/sentiment` | Trends + heatmap |
| GET | `/api/risk` | Account risk radar |
| GET | `/api/graph` | Issue graph nodes/edges |
| GET | `/api/voc` | VOC backlog |
| POST | `/api/reprocess` | Re-run pipeline |
