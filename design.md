# Transcript Intelligence — Design

This document describes the implemented take-home prototype: a readable pipeline, a demo UI with charts, and the reasoning behind both. It is **not** a production platform. See `README.md` for setup and run instructions.

---

## 1. What we are building

A small **offline analysis pipeline** plus a **read-only React dashboard**.

The pipeline reads meeting folders under `dataset/`, produces structured insights, and writes them to `data/processed/`. The dashboard loads those artifacts and lets a product/engineering panel:

1. See **call type + topic/theme** categories with examples.
2. See **sentiment trends** by call type, time, and product, with interpretation copy.
3. Explore **3 bonus insights** that map to support, sales, product, and engineering stakeholders.

The UI is the live demo, [`notebooks/walkthrough.ipynb`](./notebooks/walkthrough.ipynb) is the guided technical walkthrough, and the source code is the complete implementation reference.

---

## 2. Dataset observations (ground truth for the design)

| Fact | Implication |
| --- | --- |
| 100 meetings, each a folder named by `meetingId` | Ingest each meeting folder and join its available files |
| Files include `transcript.json`, `meeting-info.json`, `summary.json`, `speakers.json`, `speaker-meta.json`, `events.json` | Ingest reads meeting info, transcript, summary, and speaker metadata; speaker-side inference uses attendee emails and display-name matching, not the speaker metadata contents. `speakers.json` and `events.json` are not consumed |
| Utterances already have `sentimentType` (`positive` / `neutral` / `negative`) | Use as a **baseline**; recompute duration-weighted customer-side sentiment so vendor politeness does not wash out the signal |
| `summary.json` already has `topics`, `overallSentiment`, `sentimentScore`, `actionItems`, `keyMoments` | Treat as **vendor-provided enrichment**. Re-derive call type, themes, and risk flags so we can explain our method |
| Titles encode a lot: `Support Case #…`, `Aegis / {Customer} - …`, internal names (`Weekly Engineering Standup`, `Detect Outage - …`) | Rule-based **call type** is explainable; optional LLM refinement is limited to themes |
| Emails: `@aegiscloud.com` vs customer domains | Useful for call-type and speaker-side rules; speaker identity can remain unknown when names do not match attendee email local parts |
| Fictional company: **Aegis Cloud Security**; modules **Identity, Detect, Protect, Comply**; dates in **Feb–Apr 2026** | Taxonomy should be product-aware; time series is short (~weeks/months), so weekly buckets, not yearly |
| Recurring storyline: Detect outage, SSO/Identity regressions, Comply v2 launch, renewals | Bonus insights should connect **the same incident across support, AM, and engineering calls** |

Call-type heuristic from titles + attendee domains:

| Call type | Signals |
| --- | --- |
| `support` | At least one non-Aegis attendee and a support/escalation/urgent/incident title signal |
| `external` | At least one non-Aegis attendee and no support title signal |
| `internal` | No non-Aegis attendee detected (standups, retros, war rooms, all-hands, product syncs) |

The implemented order is significant: all-Aegis/no-outside-attendee calls become
internal first; mixed-attendee titles matching support/escalation/urgency rules
become support; other mixed-attendee calls become external. A missing attendee
email can therefore cause a call to be misclassified as internal.

---

## 3. Product thesis (what the panel should remember)

Transcripts are not a search problem. They are a **cross-functional early-warning system**.

- Support leaders need volume, severity, and repeat issues.
- Sales managers need churn/expansion language on customer calls.
- Product managers need feature requests and friction themes tied to modules.
- Engineering leads need the same incident appearing in war rooms **and** in customer calls, with lag.

The design is built so every chart answers: **who should act, and why.**

---

## 4. Approach choices

### 4.1 Topic / theme categorization — **rules + taxonomy, optional LLM refinement**

| Layer | Method | Why |
| --- | --- | --- |
| L1 Call type | Rules on title + attendee domains | Cheap, explainable, already accurate on this set |
| L2 Product module | Keyword matching over title, summary, supplied topics, and the first 40 transcript utterances | Stable taxonomy for charts |
| L3 Theme refinement | Optional OpenAI JSON extraction (primary + secondary theme, rationale, quote) | Adds judgment when an API key is configured; the deterministic taxonomy remains the offline default |

**Clustering is not currently implemented.** The current pipeline favors an explainable, reproducible taxonomy for this small dataset.

**Why not LLM-only?** Call type is deterministic from metadata. Spending tokens on it hides a simple, defensible rule. The panel will ask “why this category?” — rules + a quoted span beat a black box.

The rules-first choice keeps the demo reproducible and usable offline. Optional LLM refinement can help with ambiguous customer language, but it does not replace the taxonomy or call-type rules.

Optional LLM output schema (per meeting):

```json
{
  "meeting_id": "...",
  "primary_theme": "sso_outage",
  "secondary_themes": ["incident_communication", "workaround"],
  "product_modules": ["identity"],
  "rationale": "Customer locked out after SAML NameID patch",
  "example_quote": "..."
}
```

The theme inventory is a fixed codebook in `src/backend/pipeline/taxonomy.py`. The deterministic scorer weights title matches above supplied topics and transcript matches. Optional LLM output can refine the assigned label and supporting text.

If no API key is present, the pipeline uses the deterministic taxonomy and supplied `summary.topics`, so the demo still runs.

### 4.2 Sentiment — **recompute from utterance labels**

Do not “just chart” `summary.sentimentScore`.

1. **Utterance baseline:** map `sentimentType` → {-1, 0, +1}; duration-weighted average.
2. **Role-aware score:** compute customer and Aegis speaker means separately. Customer-side sentiment is null when no customer utterances are identified; trend/heatmap visualizations fall back to all-utterance sentiment for internal calls.
3. **Trajectory:** first-third vs last-third of all utterances (did the call recover?).
4. **Independent check (deferred):** compare against an independent sentiment model or score and report agreement with the vendor-provided meeting-level labels.
5. **Trends:** weekly mean of meeting-level scores by call type; product-module × call-type heatmap; call out Detect-outage patterns where supported by the data. The dashboard compares vendor-provided meeting sentiment fields on meeting detail, but does not calculate an independent model agreement score.

Scores are descriptive polarity indices over pre-existing transcript annotations,
not a validated emotion model. The pipeline duration-weights utterances within a
meeting, then aggregates meeting scores without weighting longer meetings more
heavily. Weekly sample sizes vary and should be shown alongside comparisons.

Interpretation is first-class: the pipeline generates takeaway strings from aggregate statistics; they are not generated live by an LLM.

### 4.3 Bonus insights (implement 3)

| Insight | Stakeholder | Why it is not obvious |
| --- | --- | --- |
| **A. Risk radar** — churn, escalation, competitive mention, negative customer polarity, and compliance pressure | Sales + Support | `keyMoments.type` can carry `churn_signal`; the heuristic combines it with customer-side negativity and competitor names into one per-account triage list |
| **B. Cross-surface issue graph** — same theme linking meetings from different call types | Eng + Product | Surfaces themes crossing org boundaries and displays a meeting-date lag; it does not establish incident identity or causality |
| **C. Voice-of-customer → backlog** — phrase/theme-matched feature requests, bugs, process gaps, and praise by module | Product | Turns transcripts into a grouped “what to build or fix” list with quotes |

Deferred ideas (not implemented):

- Action-item completion (no follow-up ground truth).
- Talk-time / interruption as a coaching metric (events are not currently consumed by the pipeline).

The risk radar and VOC backlog are heuristic triage aids, not calibrated predictions or ground-truth labels. The issue graph links meetings to their primary theme and up to two modules, then links representative meetings of a shared theme across at least two call types; the graph does not guarantee every shared theme appears in all three call types. The original proposed 14-day edge limit is not currently applied. VOC matching is rule-based, not an embedding cluster or LLM extraction.

---

## 5. Architecture

```
dataset/{meetingId}/*.json
        │
        ▼
 src/backend/pipeline/ingest.py     load + normalize
        │
        ▼
 src/backend/pipeline/classify.py   call type, themes, modules, risk flags
 src/backend/pipeline/sentiment.py  role-aware scores + trends
 src/backend/pipeline/insights.py   risk radar, issue graph, VOC backlog
        │
        ▼
 data/processed/
   meetings.json             one record per call (join of all features)
   themes.json               codebook + example meeting ids
   sentiment_trends.json
   sentiment_heatmap.json
   risk_radar.json
   issue_graph.json          nodes/edges for the network chart
   voc_backlog.json
   overview.json             KPIs + templated takeaways
        │
        ▼
 src/backend/app/main.py (FastAPI) GET /api/overview, /meetings, /graph, …
        │
        ▼
 src/frontend/ (Vite + React)       dashboard
```

The pipeline writes eight JSON artifacts: meetings, themes, sentiment trends,
sentiment heatmap, risk radar, issue graph, VOC backlog, and overview. API
endpoints read these files on request; there is no database or startup-time
in-memory aggregation.

**No auth, no deploy.** The local demo uses `uvicorn` and Vite's development server.

---

## 6. Data model (processed meeting record)

```text
MeetingRecord
  meeting_id, title, start_time, duration_min
  call_type: support | external | internal
  call_type_method, call_type_reason
  customer_name: str | null
  customer_domains: [str]
  product_modules: [identity | detect | protect | comply | billing | platform]
  primary_theme, secondary_themes, theme_rationale, example_quote
  provided_topics, provided_overall_sentiment, provided_sentiment_score
  summary, key_moments, key_moment_types, primary_theme_label
  utterance_sentiment_mean
  customer_sentiment_mean
  aegis_sentiment_mean
  sentiment_trajectory: recovering | deteriorating | flat
  risk_flags: [churn, escalation, competitive, negative_customer, compliance_pressure]
  risk_score: 0–1
  competitor_mentions: [str]
  action_item_count, action_items
  transcript_preview, utterance_count, customer_utterance_count, week
```

---

## 7. Pipeline details

### 7.1 Ingest

- Parse folders with meeting info or transcript present; missing-file warnings are collected on the raw record but are not currently exposed in processed records.
- Flatten transcript `data[]` into text + per-speaker stats.
- Infer `customer_name` from title (`Aegis / X -`, `Support Case #n - {Company}`) or from non-Aegis email domain.
- Map speaker → side using attendee email local-part matching where possible. On mixed calls, remaining unknown speakers default to customer; this is a practical heuristic, not verified diarization.

### 7.2 Classification

1. Apply call-type rules and retain a human-readable method and reason on each record.
2. Score modules and themes using the keyword tables in `src/backend/pipeline/taxonomy.py`; title matches have the highest weight.
3. Optionally refine theme output with one OpenAI JSON-mode request per meeting, temperature 0. Cache responses in `data/cache/llm/{meeting_id}.json`. Without a key, the deterministic output is used. Clustering is not implemented.

### 7.3 Sentiment

- Weekly buckets from `startTime`.
- Breakdowns: week × call type and module × call type. Account-level summaries are supplied by the risk radar.
- Narrative templates, e.g. “Support customer-side sentiment is X pts below external AM calls in the week of the Detect outage — AM calls may be lagging the ticket queue.”

### 7.4 Insights

**Risk radar:** rule-based score from churn key moments/phrases, escalation title or language, competitor mentions, customer sentiment below a threshold, compliance language, and provided very-negative sentiment. Aggregate meetings by inferred account and rank by the highest per-meeting risk score. Duration is not currently a score input.

**Issue graph:** nodes = meetings + themes + modules; edges connect meetings to their primary theme and up to two modules, plus representative meetings of the same theme across call types. Edge labels include absolute date lag where timestamps exist; the proposed 14-day limit is not currently enforced.

**VOC backlog:** phrase and primary-theme matching assigns `bug | feature_request | process | praise`; results are grouped by type and module with example quotes. It is not currently LLM-extracted or sentiment-ranked.

---

## 8. Frontend

### 8.1 Pages

| Route | Purpose |
| --- | --- |
| `/` Overview | KPI cards (n calls, mix of types, mean utterance polarity), call-type mix, takeaways, VOC backlog, top risks |
| `/themes` | Theme codebook, counts, stacked bar by call type, click → example transcripts |
| `/sentiment` | Weekly trends, module heatmap, trajectory counts, written takeaways |
| `/graph` | Force-directed issue graph (insight B) |
| `/accounts` | Risk radar table |
| `/meetings/:id` | Meeting record, summary, themes, quotes, and provided vs computed sentiment |

### 8.2 UX constraints (take-home)

- Dark, dense, executive — not a marketing site.
- Overview and insight views show interpretation text where the artifact provides it.
- Global call-type, module, and date-range filters are not currently implemented.
- Example transcripts are the evaluation requirement: theme detail must show **title + quote + why**.

---

## 9. Library recommendations

### 9.1 Python (pipeline + API)

| Library | Role | Why this one |
| --- | --- | --- |
| **pydantic** v2 | Schemas for raw + processed records | Typed, self-documenting, FastAPI-native |
| **pandas** | Aggregations, weekly trends | Fast for 100 rows; reviewers know it |
| **openai** (optional extra) | Optional theme refinement | Uses `OPENAI_API_KEY`; response cache is stored on disk |
| **fastapi** + **uvicorn** | Serve JSON to the UI | Thin; no Django |
| **python-dotenv** | Keys | Local only; never commit `.env` |
| **orjson** | Fast JSON IO | Optional; stdlib json is fine |
| **sentence-transformers**, UMAP, clustering, Jupyter | Not currently used | Potential future exploration only |

The default sentiment method uses existing utterance labels with duration and
speaker-side weighting. No separate transformer sentiment model is currently
installed or invoked.

### 9.2 React (dashboard + charts + graph)

| Library | Role | Why this one |
| --- | --- | --- |
| **React 19 + TypeScript + Vite** | App shell | Fast local demo, typed API client |
| **TanStack Query** | Fetch `/api/*` | Caching, loading states |
| **React Router 7** | Routes | Familiar route model |
| **Tailwind CSS** | Layout | Speed of polish |
| **Recharts** | Bars, lines, area, heatmap-via-composed | Simple, readable, good for sentiment/theme. Prefer over Chart.js for React |
| **react-force-graph-2d** | Insight B network | Purpose-built; lighter than Cytoscape for 100 nodes |
| **lucide-react** | Icons | Consistent |

Implemented choice: **Recharts for charts + react-force-graph-2d for the issue network.**

---

## 10. Repository layout

```text
transcript_intelligence/
  requirements.md
  design.md
  README.md
  .env.example
  src/backend/
    pyproject.toml
    app/main.py
    pipeline/
      ingest.py
      classify.py
      sentiment.py
      insights.py
      taxonomy.py
      llm.py
      run.py                # CLI: python -m pipeline.run
  src/frontend/
    package.json
    src/...
  data/
    processed/            # committed demo artifacts
    cache/                # optional LLM cache
  scripts/
    process-data.sh
    run-backend.sh
    run-frontend.sh
    run-all.sh
  dataset/                # existing
```

Processed JSON is committed so the dashboard works without an API key. Base
labels are deterministic taxonomy outputs; when optional LLM refinement is used,
record the model and cache provenance for that run.

---

## 11. Requirements alignment and current findings

| Brief requirement | Evidence in this repository | Status and qualification |
| --- | --- | --- |
| Process transcripts and categorize by topic/theme | Pipeline emits call type, primary/secondary themes, modules, rationale, and a codebook. | **Implemented.** Deterministic labels are explainable but have not been independently human-adjudicated. |
| Explain the approach and show examples per category | `design.md`, `README.md`, theme page, and meeting detail expose taxonomy rationale, meeting titles, and utterance quotes. | **Implemented with a quality caveat.** Examples are automatically selected; audit that each quoted transcript genuinely supports its assigned theme before presenting it as representative. |
| Analyze sentiment across call types and explain trends | Sentiment page includes weekly trend, module × call-type table, trajectory counts, and generated takeaways. | **Implemented as descriptive analysis.** Uses pre-existing utterance sentiment annotations; not an independently validated sentiment model or causal analysis. |
| Add 2–3 stakeholder-relevant insights and explain why they matter | Risk radar for sales/support, issue graph for engineering/product, and VOC backlog for product/support. | **Three implemented.** Scores and groupings are triage heuristics; the graph only establishes a shared theme across at least two call types. |
| Provide a readable technical reference | `notebooks/walkthrough.ipynb`, this design, `README.md`, and source code explain setup, decisions, and outputs. | **Implemented.** The notebook invokes the same backend pipeline rather than duplicating its logic. |
| Demo the pipeline, outputs, and visualizations to a panel | The notebook runs the rules-only pipeline and inspects outputs; the React app contains interactive views. | **App and walkthrough are ready to demo.** A slide deck and narrated recording are not included and remain presentation deliverables to prepare. |

### Results from the committed deterministic artifacts

These are descriptive outputs from the current sample, not population estimates.
The pipeline should be rerun before a presentation if its code or data changes.

| Output | Current result | Interpretation / limitation |
| --- | --- | --- |
| Call-type coverage | 100 meetings: 31 support, 39 external, 30 internal | All three requested call types are represented in this corpus. |
| Primary-theme codebook | 10 observed themes: Comply/audit 21; renewal/commercial 18; Identity 10; Detect 10; incident communication 9; product roadmap 8; Protect 7; onboarding 6; competitive evaluation 6; engineering ops 5. | Each theme currently has example meeting IDs; titles and quotes should be audited because keyword matches can be noisy. |
| Customer-side sentiment | Support mean -0.45 across 31 meetings; external mean +0.20 across 39 meetings. | The difference is a reason to compare the support queue with account conversations, not proof that one caused the other. |
| Product signal | Detect-tagged calls average 0.47 polarity points below calls not tagged Detect. The weakest week in the current artifact is 2026-03-09 (support, n=7). | Use as an incident lead for transcript review. Module tagging and weekly sample sizes limit certainty. |
| Call trajectory | 70 calls recover in the final third; 1 deteriorates. | Based on first-third vs last-third utterance polarity; short calls are marked flat and the measure is not a resolution outcome. |
| Cross-surface graph | 8 themes occur in at least two call types. | Shared taxonomy labels are a discovery cue only; dates are not constrained to 14 days and do not prove a single incident. |
| Account risk | 26 distinct non-internal accounts have a risk score ≥0.5 in the current artifacts. | A score is the maximum meeting score for an inferred account; rule-based values can saturate and are not calibrated churn probabilities. |
| VOC backlog | Rule matcher returns 39 Detect bug-tagged meetings and 19 Identity bug-tagged meetings. | These are candidate mentions, not 58 independently confirmed defects or unique backlog items. Review examples before prioritizing work. |

The current theme set and counts are data-dependent. Pipeline fallbacks for
missing utterance scores and attendee metadata should be called out in Q&A;
internal trend and heatmap cells use all-speaker polarity when customer-side
polarity is unavailable.

---

## 12. Presentation mapping and readiness

| Presentation segment | Where it lives |
| --- | --- |
| Categories, rationale, examples | `/themes` and meeting detail |
| Sentiment trends and implications | `/sentiment` and overview takeaways |
| Stakeholder insights | `/graph`, `/accounts`, and VOC on overview |
| Runnable reference and live demo | `README.md`, notebook walkthrough, `scripts/process-data.sh`, FastAPI, and `src/frontend` |
| Suggested 30-minute story | Overview (5) → Themes (8) → Sentiment (8) → Cross-surface graph + risk (7) → next steps (2) |

Before submitting/presenting:

1. Rebuild the rules-only artifacts using `./scripts/process-data.sh`; verify
   the run reports 100 meetings and the three call types.
2. Audit at least one meeting title and quote for each theme; replace weak
   examples or explain genuine taxonomy limitations rather than presenting
   keyword matches as validated truth.
3. Use week sample counts and identify sentiment as annotated-utterance
   polarity. Avoid describing risk scores as probabilities or shared graph
   themes as causal incident links.
4. Open and run `notebooks/walkthrough.ipynb` in the backend Python kernel,
   then prepare the slide deck for the 30-minute panel slot and a short narrated
   pipeline/dashboard walkthrough if using the recording option. Keep the
   repository ready for the 15-minute code-focused Q&A.

No additional synthetic transcripts are generated by the pipeline. Describe
the corpus as the fictional Aegis sample dataset; do not imply that these are
real customer records.

---

## 13. Risks and mitigations

| Risk | Mitigation |
| --- | --- |
| LLM cost / no key in review | Disk cache + committed `data/processed`; rule fallback |
| Overfitting the Detect-outage plotline | Codebook includes Identity, Comply v2, billing, renewals — not a single-theme app |
| Treating `summary.json` as our work | Always show **provided vs computed** side by side |
| Over-engineering | No DB, no auth, no queues |
| False confidence in heuristic classifications | Manually audit examples and describe the risk/VOC results as review queues |
| Synthetic-looking data | State clearly that the corpus is the fictional Aegis sample dataset |

---

## 14. Current status and remaining work

The core take-home path is implemented: dataset ingest, deterministic call-type
classification, taxonomy-based theme and module tags, duration-weighted
sentiment, three supplementary insight outputs, a FastAPI read API, React
dashboard pages, and committed processed artifacts. The rules-based pipeline
runs without an LLM key; optional OpenAI refinement is available separately.

The following items in the original proposal are **not implemented** and should
not be mistaken for current behavior:

1. Human review of taxonomy labels and representative quotes.
2. Embedding/clustering-based taxonomy audit or scatterplot.
3. Independent transformer sentiment comparison and reported agreement.
4. Dashboard-wide filters and an account drill-in beyond the account risk
   table. The sentiment page currently shows trajectory counts, not a detailed
   trajectory distribution.
5. Strict 14-day gating for cross-surface graph edges.
6. Human validation of sentiment labels and VOC classifications, plus risk
   score calibration.
7. Slide deck for the panel; narrated recording if using the recording option.

The first six are optional product/analysis improvements, not requirements for
the local demo. The slide deck is needed for the panel presentation; a narrated
recording is a convenient way to show the pipeline and dashboard. Do not
generate synthetic transcripts unless the source data fails to cover a required
call type; document any augmentation if that changes.

---

## 15. Operational decisions

1. Use deterministic rules and the fixed taxonomy as the reproducible baseline;
   treat LLM refinement as optional enrichment.
2. Keep the local demo file-backed and unauthenticated; no database, queue, or
   deployment setup is in scope.
3. Keep committed processed artifacts so a reviewer can run the dashboard
   without model credentials.
4. Treat risk scores and VOC groupings as triage heuristics, not calibrated
   predictions or ground-truth labels.
