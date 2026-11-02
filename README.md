# Transcript Intelligence

Demo for exploring ~100 Aegis Cloud Security call transcripts: categorize by call type and theme, track customer sentiment, and surface cross-functional insights for support, sales, product, and engineering.

This is a take-home style analysis app, not a production deployment.

## What you get

1. **Themes** — support / external / internal from title + attendee domains; primary themes from a title-weighted keyword taxonomy (optional OpenAI refine).
2. **Theme validation pass** — an evidence-based review that checks each theme assignment against title, summary, provided topics, and quote support, with a human-review queue when evidence is weak.
3. **Confidence and evidence** — low/medium/high operational confidence for call type, theme, sentiment, and risk. Meeting detail shows evidence; low confidence is a review cue.
4. **Sentiment** — duration-weighted utterance polarity, **customer-side** on mixed calls, weekly trends, module heatmap, filtered trajectory distributions, and provided-label vs utterance-polarity alignment with linked conflicts by call type. The comparison is a consistency check, not independent model validation.
5. **Review queue** — prioritize meetings with a risk score of at least 0.50, low-confidence outputs, or taxonomy evidence flagged for review. Mark or reopen records; status is saved in this browser only.
6. **Bonus insights**
   - Risk radar (churn, competitive, escalation)
   - Cross-surface issue graph (candidate shared-theme conversations across support, AM, and eng; not proof of a shared incident or causality)
   - Voice-of-customer backlog by module

The dashboard has shared stakeholder presets (Support, Sales, Product, Engineering) and composable call-type, product-module, account, and date filters. Selections are encoded in the URL and retained when navigating to meeting details. Overview metrics, theme counts/examples, sentiment aggregates, risk rows, and graph nodes reflect matching meetings. Corpus-wide narratives and other non-filtered summaries are labeled when a filter is active. Open an account from Overview or Risk radar for a filter-aware account summary, risk evidence, sentiment, themes/modules, and chronological call history with meeting links.

Aggregate summaries and subgroups below the low-sample threshold display a warning; treat them as descriptive signals, not conclusive findings. Set the threshold in the dashboard controls to fewer than 3, 5 (default), or 10 meetings; this preference is saved in the current browser.

Open **Review queue** to work through flagged meetings. Risk scores are heuristic, confidence is not calibrated, and review status is local to this browser rather than shared with other analysts. Open a meeting title to inspect its evidence and transcript context.

Processed artifacts live in `data/processed/` so the dashboard runs without an LLM key.
Rebuild artifacts with `./scripts/process-data.sh` after updating the pipeline; the resulting `meetings.json` and `risk_radar.json` include confidence metadata, and `run_manifest.json` records run/data/code lineage.

Confidence levels summarize rule specificity and available evidence/sample coverage. They are not calibrated probabilities. Theme examples show review badges; open a meeting from the themes or risk views and inspect its **Confidence and supporting evidence** section. The account risk page also shows the confidence evidence for the highest-risk meeting.

The run manifest includes the generation timestamp, package/Git/source fingerprints, hashes and relative paths for consumed input JSON files, LLM model/prompt configuration and per-meeting cache/API source. New LLM cache entries keep the original model, prompt version, and generation time; legacy entries are marked with unknown provenance. The manifest does not store transcript contents or credentials. Input data is marked unverified; the pipeline records whether it generated or augmented data (currently neither). Inspect the manifest on the **Overview** page or via `GET /api/provenance`.

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
Stop both services from another terminal with:

```bash
./scripts/stop-all.sh
```

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

### Run tests

Backend tests use pytest and FastAPI's test client:

```bash
cd src/backend
uv sync --extra test
uv run pytest
```

Frontend tests use Vitest and Testing Library:

```bash
cd src/frontend
npm install
npm test
```

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

Call type is deterministic from metadata, so we do not spend an LLM on it. Themes use a codebook aligned to Aegis modules (Identity, Detect, Protect, Comply) plus commercial and incident-comms themes. Sentiment uses the utterance `sentimentType` already in the files, but averages **customer speakers only** on support/external calls so vendor courtesy does not cancel a lockout. The issue graph surfaces candidate shared-theme conversations across tickets, account-management calls, and engineering war rooms. Shared labels are associations, not proof that calls concern the same incident or share a cause.

## API

| Method | Path | Purpose |
| --- | --- | --- |
| GET | `/api/health` | Processed-data status |
| GET | `/api/overview` | KPIs and takeaways |
| GET | `/api/provenance` | Run manifest: input/code hashes, timestamp, and enrichment provenance |
| GET | `/api/meetings` | All enriched meetings |
| GET | `/api/meetings/{id}` | One meeting |
| GET | `/api/themes` | Theme codebook |
| GET | `/api/taxonomy-validation` | Evidence-based theme validation pass rate + items needing human review |
| GET | `/api/sentiment` | Trends + heatmap |
| GET | `/api/risk` | Account risk radar with confidence/evidence for its highest-risk meeting |
| GET | `/api/graph` | Issue graph nodes/edges |
| GET | `/api/voc` | VOC backlog |
| POST | `/api/reprocess` | Re-run pipeline |

## Web pages - screen shots

<img width="1286" height="1818" alt="image" src="https://github.com/user-attachments/assets/76db32f8-0c0e-455b-a16c-fed7c9bc5a0b" />
<img width="1296" height="1794" alt="image" src="https://github.com/user-attachments/assets/40c1fe56-1856-4068-bc7e-740a9cf2a4f3" />
<img width="868" height="1784" alt="image" src="https://github.com/user-attachments/assets/47a194ad-44d6-41ad-a9bb-16effcc594d0" />
<img width="2028" height="1802" alt="image" src="https://github.com/user-attachments/assets/9b3d0e79-a2c4-4b6e-9970-5a058b7ff024" />
<img width="900" height="1754" alt="image" src="https://github.com/user-attachments/assets/34f5f294-76a9-4ee1-b502-ce97aced7354" />
<img width="986" height="1818" alt="image" src="https://github.com/user-attachments/assets/3c2a1d20-547c-42a0-b8f3-6be9cad642c8" />
<img width="706" height="1894" alt="image" src="https://github.com/user-attachments/assets/69b1d059-b1df-4c10-b471-67e876e1c650" />





