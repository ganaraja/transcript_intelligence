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

## Web pages - screen shots

[UploadingFrom: <Saved by Blink>
[UploaFrom: <Saved by Blink>
[Uploading TranscripFrom: <Saved by Blink>
[Uploading TranscFrom: <Saved by Blink>
[Uploading Transcript IntFrom: <Saved by Blink>
Snapshot-Content-Location: http://127.0.0.1:5173/accounts
Subject: Transcript Intelligence
Date: Tue, 27 Oct 2026 21:32:08 GMT
MIME-Version: 1.0
Content-Type: multipart/related;
	type="text/html";
	boundary="----MultipartBoundary--rzwGfTQHfWYGD767wbxCCTq9KwccB874f1minM7i6m----"


------MultipartBoundary--rzwGfTQHfWYGD767wbxCCTq9KwccB874f1minM7i6m----
Content-Type: text/html
Content-ID: <frame-62FD6B35AC4100AD4EEBB3AFCAB21246@mhtml.blink>
Content-Transfer-Encoding: quoted-printable
Content-Location: http://127.0.0.1:5173/accounts

<!DOCTYPE html><html lang=3D"en"><head><meta http-equiv=3D"Content-Type" co=
ntent=3D"text/html; charset=3DUTF-8"><link rel=3D"stylesheet" type=3D"text/=
css" href=3D"cid:css-c06f8b02-2b0b-4071-a280-c6d562342635@mhtml.blink" /><l=
ink rel=3D"stylesheet" type=3D"text/css" href=3D"cid:css-41efe9be-5bea-4435=
-8174-5850c9132038@mhtml.blink" /><link rel=3D"stylesheet" type=3D"text/css=
" href=3D"cid:css-efca99a4-85cd-4af1-a9c0-5e4c06ff44da@mhtml.blink" />
   =20

   =20

   =20
    <link rel=3D"icon" type=3D"image/svg+xml" href=3D"http://127.0.0.1:5173=
/favicon.svg">
    <meta name=3D"viewport" content=3D"width=3Ddevice-width, initial-scale=
=3D1.0">
    <title>Transcript Intelligence</title>
  </head>
  <body>
    <div id=3D"root"><div class=3D"min-h-screen"><header class=3D"sticky to=
p-0 z-20 border-b border-slate-800 bg-slate-950/90 backdrop-blur"><div clas=
s=3D"mx-auto flex max-w-7xl items-center gap-6 px-6 py-3"><div class=3D"fle=
x items-center gap-2 text-sky-300"><svg xmlns=3D"http://www.w3.org/2000/svg=
" width=3D"20" height=3D"20" viewBox=3D"0 0 24 24" fill=3D"none" stroke=3D"=
currentColor" stroke-width=3D"2" stroke-linecap=3D"round" stroke-linejoin=
=3D"round" class=3D"lucide lucide-audio-lines" aria-hidden=3D"true"><path d=
=3D"M2 10v3"></path><path d=3D"M6 6v11"></path><path d=3D"M10 3v18"></path>=
<path d=3D"M14 8v7"></path><path d=3D"M18 5v13"></path><path d=3D"M22 10v3"=
></path></svg><span class=3D"font-semibold tracking-tight text-slate-100">T=
ranscript Intelligence</span></div><nav class=3D"flex gap-1 text-sm"><a cla=
ss=3D"rounded-md px-3 py-1.5 text-slate-400 hover:text-white" href=3D"http:=
//127.0.0.1:5173/" data-discover=3D"true">Overview</a><a class=3D"rounded-m=
d px-3 py-1.5 text-slate-400 hover:text-white" href=3D"http://127.0.0.1:517=
3/themes" data-discover=3D"true">Themes</a><a class=3D"rounded-md px-3 py-1=
.5 text-slate-400 hover:text-white" href=3D"http://127.0.0.1:5173/sentiment=
" data-discover=3D"true">Sentiment</a><a class=3D"rounded-md px-3 py-1.5 te=
xt-slate-400 hover:text-white" href=3D"http://127.0.0.1:5173/graph" data-di=
scover=3D"true">Issue graph</a><a class=3D"rounded-md px-3 py-1.5 bg-slate-=
800 text-white" href=3D"http://127.0.0.1:5173/accounts" data-discover=3D"tr=
ue" aria-current=3D"page">Risk radar</a></nav></div></header><main class=3D=
"mx-auto max-w-7xl px-6 py-6"><div class=3D"space-y-6"><div><h1 class=3D"te=
xt-2xl font-semibold">Risk radar</h1><p class=3D"mt-1 text-sm text-slate-40=
0">Composite of churn key-moments, competitor mentions, urgent titles, and =
customer-side negativity. Sales and support should share one list =E2=80=94=
 not two CRMs.</p></div><section class=3D"rounded-xl border border-slate-80=
0 bg-slate-900/60 p-4 "><h2 class=3D"mb-3 text-sm font-semibold tracking-wi=
de text-slate-300">Coastal Living Co =C2=B7 score 1.00</h2><p class=3D"mb-2=
 text-sm text-slate-300">Coastal Living Co: churn language or key-moment ch=
urn_signal, competitor mention, executive/urgent escalation, negative custo=
mer-side polarity. Latest call =E2=80=9CAegis / Coastal Living Co - Protect=
 Module Expansion=E2=80=9D (external). Sales + support should share a singl=
e account plan.</p><div class=3D"mb-2 flex flex-wrap gap-1"><span class=3D"=
inline-flex rounded-full px-2 py-0.5 text-xs font-medium bg-rose-500/15 tex=
t-rose-300">churn</span><span class=3D"inline-flex rounded-full px-2 py-0.5=
 text-xs font-medium bg-rose-500/15 text-rose-300">competitive</span><span =
class=3D"inline-flex rounded-full px-2 py-0.5 text-xs font-medium bg-rose-5=
00/15 text-rose-300">escalation</span><span class=3D"inline-flex rounded-fu=
ll px-2 py-0.5 text-xs font-medium bg-rose-500/15 text-rose-300">negative_c=
ustomer</span><span class=3D"inline-flex rounded-full px-2 py-0.5 text-xs f=
ont-medium bg-amber-500/15 text-amber-300">Cloudprime</span><span class=3D"=
inline-flex rounded-full px-2 py-0.5 text-xs font-medium bg-amber-500/15 te=
xt-amber-300">Okta</span><span class=3D"inline-flex rounded-full px-2 py-0.=
5 text-xs font-medium bg-amber-500/15 text-amber-300">Wiz</span><span class=
=3D"text-xs text-slate-500">customer sentiment -0.14</span></div><ul class=
=3D"space-y-1 text-sm"><li><span class=3D"inline-flex rounded-full px-2 py-=
0.5 text-xs font-medium bg-sky-500/15 text-sky-300">external</span> <a clas=
s=3D"text-sky-300 hover:underline" href=3D"http://127.0.0.1:5173/meetings/0=
1KQ9BB82FD97C9607D57E90" data-discover=3D"true">Aegis / Coastal Living Co -=
 Onboarding Kickoff</a></li><li><span class=3D"inline-flex rounded-full px-=
2 py-0.5 text-xs font-medium bg-amber-500/15 text-amber-300">support</span>=
 <a class=3D"text-sky-300 hover:underline" href=3D"http://127.0.0.1:5173/me=
etings/01KQ9772B2348F500FB09D1E" data-discover=3D"true">Support Case #3677 =
- Coastal Living Co MFA Token Failures</a></li><li><span class=3D"inline-fl=
ex rounded-full px-2 py-0.5 text-xs font-medium bg-amber-500/15 text-amber-=
300">support</span> <a class=3D"text-sky-300 hover:underline" href=3D"http:=
//127.0.0.1:5173/meetings/01KQ5EC1665DCFD7A6B62A59" data-discover=3D"true">=
Support Case #8749 - Coastal Living Co SAML Certificate Rotation Bug</a></l=
i><li><span class=3D"inline-flex rounded-full px-2 py-0.5 text-xs font-medi=
um bg-sky-500/15 text-sky-300">external</span> <a class=3D"text-sky-300 hov=
er:underline" href=3D"http://127.0.0.1:5173/meetings/01KQ560FF1570C5E7F71D7=
52" data-discover=3D"true">Aegis / Coastal Living Co - Protect Module Expan=
sion</a></li></ul></section><section class=3D"rounded-xl border border-slat=
e-800 bg-slate-900/60 p-4 "><h2 class=3D"mb-3 text-sm font-semibold trackin=
g-wide text-slate-300">Vanta Health Systems =C2=B7 score 1.00</h2><p class=
=3D"mb-2 text-sm text-slate-300">Vanta Health Systems: churn language or ke=
y-moment churn_signal, competitor mention, executive/urgent escalation, neg=
ative customer-side polarity. Latest call =E2=80=9CAegis / Vanta Health Sys=
tems - Backup Strategy Workshop=E2=80=9D (external). Sales + support should=
 share a single account plan.</p><div class=3D"mb-2 flex flex-wrap gap-1"><=
span class=3D"inline-flex rounded-full px-2 py-0.5 text-xs font-medium bg-r=
ose-500/15 text-rose-300">churn</span><span class=3D"inline-flex rounded-fu=
ll px-2 py-0.5 text-xs font-medium bg-rose-500/15 text-rose-300">competitiv=
e</span><span class=3D"inline-flex rounded-full px-2 py-0.5 text-xs font-me=
dium bg-rose-500/15 text-rose-300">escalation</span><span class=3D"inline-f=
lex rounded-full px-2 py-0.5 text-xs font-medium bg-rose-500/15 text-rose-3=
00">negative_customer</span><span class=3D"inline-flex rounded-full px-2 py=
-0.5 text-xs font-medium bg-amber-500/15 text-amber-300">Cloudprime</span><=
span class=3D"inline-flex rounded-full px-2 py-0.5 text-xs font-medium bg-a=
mber-500/15 text-amber-300">Vanta</span><span class=3D"text-xs text-slate-5=
00">customer sentiment -0.35</span></div><ul class=3D"space-y-1 text-sm"><l=
i><span class=3D"inline-flex rounded-full px-2 py-0.5 text-xs font-medium b=
g-amber-500/15 text-amber-300">support</span> <a class=3D"text-sky-300 hove=
r:underline" href=3D"http://127.0.0.1:5173/meetings/01KQDD5172176D02DB51360=
A" data-discover=3D"true">Support Case #3286 - Vanta Health Systems API Int=
egration Error</a></li><li><span class=3D"inline-flex rounded-full px-2 py-=
0.5 text-xs font-medium bg-amber-500/15 text-amber-300">support</span> <a c=
lass=3D"text-sky-300 hover:underline" href=3D"http://127.0.0.1:5173/meeting=
s/01KQBB7C4D4789DB2F3DA9C2" data-discover=3D"true">Support Case #1750 - Van=
ta Health Systems SIEM Connector Issue</a></li><li><span class=3D"inline-fl=
ex rounded-full px-2 py-0.5 text-xs font-medium bg-sky-500/15 text-sky-300"=
>external</span> <a class=3D"text-sky-300 hover:underline" href=3D"http://1=
27.0.0.1:5173/meetings/01KQA1AFDC1306A000B0C7D9" data-discover=3D"true">Aeg=
is / Vanta Health Systems - Backup Strategy Workshop</a></li></ul></section=
><section class=3D"rounded-xl border border-slate-800 bg-slate-900/60 p-4 "=
><h2 class=3D"mb-3 text-sm font-semibold tracking-wide text-slate-300">Blac=
kridge Investments =C2=B7 score 1.00</h2><p class=3D"mb-2 text-sm text-slat=
e-300">Blackridge Investments: churn language or key-moment churn_signal, c=
ompetitor mention, executive/urgent escalation, negative customer-side pola=
rity. Latest call =E2=80=9CAegis / Blackridge Investments - HIPAA Complianc=
e Review=E2=80=9D (external). Sales + support should share a single account=
 plan.</p><div class=3D"mb-2 flex flex-wrap gap-1"><span class=3D"inline-fl=
ex rounded-full px-2 py-0.5 text-xs font-medium bg-rose-500/15 text-rose-30=
0">churn</span><span class=3D"inline-flex rounded-full px-2 py-0.5 text-xs =
font-medium bg-rose-500/15 text-rose-300">competitive</span><span class=3D"=
inline-flex rounded-full px-2 py-0.5 text-xs font-medium bg-rose-500/15 tex=
t-rose-300">compliance_pressure</span><span class=3D"inline-flex rounded-fu=
ll px-2 py-0.5 text-xs font-medium bg-rose-500/15 text-rose-300">escalation=
</span><span class=3D"inline-flex rounded-full px-2 py-0.5 text-xs font-med=
ium bg-rose-500/15 text-rose-300">negative_customer</span><span class=3D"in=
line-flex rounded-full px-2 py-0.5 text-xs font-medium bg-amber-500/15 text=
-amber-300">Cloudprime</span><span class=3D"inline-flex rounded-full px-2 p=
y-0.5 text-xs font-medium bg-amber-500/15 text-amber-300">Sentinel</span><s=
pan class=3D"text-xs text-slate-500">customer sentiment 0.04</span></div><u=
l class=3D"space-y-1 text-sm"><li><span class=3D"inline-flex rounded-full p=
x-2 py-0.5 text-xs font-medium bg-sky-500/15 text-sky-300">external</span> =
<a class=3D"text-sky-300 hover:underline" href=3D"http://127.0.0.1:5173/mee=
tings/01KQFFC0F889AE8CFEE7A00D" data-discover=3D"true">Aegis / Blackridge I=
nvestments - Renewal Discussion</a></li><li><span class=3D"inline-flex roun=
ded-full px-2 py-0.5 text-xs font-medium bg-amber-500/15 text-amber-300">su=
pport</span> <a class=3D"text-sky-300 hover:underline" href=3D"http://127.0=
.0.1:5173/meetings/01KQ2D93184912F0147315E7" data-discover=3D"true">URGENT:=
 Blackridge Investments - Complete Loss of Threat Visibility</a></li><li><s=
pan class=3D"inline-flex rounded-full px-2 py-0.5 text-xs font-medium bg-sk=
y-500/15 text-sky-300">external</span> <a class=3D"text-sky-300 hover:under=
line" href=3D"http://127.0.0.1:5173/meetings/01KQ3BD8DEEBC7FECD107F0F" data=
-discover=3D"true">Aegis / Blackridge Investments - HIPAA Compliance Review=
</a></li></ul></section><section class=3D"rounded-xl border border-slate-80=
0 bg-slate-900/60 p-4 "><h2 class=3D"mb-3 text-sm font-semibold tracking-wi=
de text-slate-300">Brightpath Commerce =C2=B7 score 1.00</h2><p class=3D"mb=
-2 text-sm text-slate-300">Brightpath Commerce: churn language or key-momen=
t churn_signal, competitor mention, executive/urgent escalation, negative c=
ustomer-side polarity. Latest call =E2=80=9CAegis / Brightpath Commerce - C=
ompetitive Evaluation=E2=80=9D (external). Sales + support should share a s=
ingle account plan.</p><div class=3D"mb-2 flex flex-wrap gap-1"><span class=
=3D"inline-flex rounded-full px-2 py-0.5 text-xs font-medium bg-rose-500/15=
 text-rose-300">churn</span><span class=3D"inline-flex rounded-full px-2 py=
-0.5 text-xs font-medium bg-rose-500/15 text-rose-300">competitive</span><s=
pan class=3D"inline-flex rounded-full px-2 py-0.5 text-xs font-medium bg-ro=
se-500/15 text-rose-300">escalation</span><span class=3D"inline-flex rounde=
d-full px-2 py-0.5 text-xs font-medium bg-rose-500/15 text-rose-300">negati=
ve_customer</span><span class=3D"inline-flex rounded-full px-2 py-0.5 text-=
xs font-medium bg-amber-500/15 text-amber-300">Cloudprime</span><span class=
=3D"inline-flex rounded-full px-2 py-0.5 text-xs font-medium bg-amber-500/1=
5 text-amber-300">Sentinel</span><span class=3D"text-xs text-slate-500">cus=
tomer sentiment -0.01</span></div><ul class=3D"space-y-1 text-sm"><li><span=
 class=3D"inline-flex rounded-full px-2 py-0.5 text-xs font-medium bg-sky-5=
00/15 text-sky-300">external</span> <a class=3D"text-sky-300 hover:underlin=
e" href=3D"http://127.0.0.1:5173/meetings/01KQ77F2867FC54E13A8C495" data-di=
scover=3D"true">Aegis / Brightpath Commerce - Detect Module Deployment</a><=
/li><li><span class=3D"inline-flex rounded-full px-2 py-0.5 text-xs font-me=
dium bg-amber-500/15 text-amber-300">support</span> <a class=3D"text-sky-30=
0 hover:underline" href=3D"http://127.0.0.1:5173/meetings/01KQ773D68723289E=
4A98889" data-discover=3D"true">Support Case #7572 - Brightpath Commerce In=
voice Discrepancy</a></li><li><span class=3D"inline-flex rounded-full px-2 =
py-0.5 text-xs font-medium bg-sky-500/15 text-sky-300">external</span> <a c=
lass=3D"text-sky-300 hover:underline" href=3D"http://127.0.0.1:5173/meeting=
s/01KQ45F6F7349D0A620571F1" data-discover=3D"true">Aegis / Brightpath Comme=
rce - Competitive Evaluation</a></li></ul></section><section class=3D"round=
ed-xl border border-slate-800 bg-slate-900/60 p-4 "><h2 class=3D"mb-3 text-=
sm font-semibold tracking-wide text-slate-300">Nova Retail Group =C2=B7 sco=
re 1.00</h2><p class=3D"mb-2 text-sm text-slate-300">Nova Retail Group: chu=
rn language or key-moment churn_signal, competitor mention, executive/urgen=
t escalation, negative customer-side polarity. Latest call =E2=80=9CAegis /=
 Nova Retail Group - Renewal Discussion=E2=80=9D (external). Sales + suppor=
t should share a single account plan.</p><div class=3D"mb-2 flex flex-wrap =
gap-1"><span class=3D"inline-flex rounded-full px-2 py-0.5 text-xs font-med=
ium bg-rose-500/15 text-rose-300">churn</span><span class=3D"inline-flex ro=
unded-full px-2 py-0.5 text-xs font-medium bg-rose-500/15 text-rose-300">co=
mpetitive</span><span class=3D"inline-flex rounded-full px-2 py-0.5 text-xs=
 font-medium bg-rose-500/15 text-rose-300">escalation</span><span class=3D"=
inline-flex rounded-full px-2 py-0.5 text-xs font-medium bg-rose-500/15 tex=
t-rose-300">negative_customer</span><span class=3D"inline-flex rounded-full=
 px-2 py-0.5 text-xs font-medium bg-amber-500/15 text-amber-300">Okta</span=
><span class=3D"inline-flex rounded-full px-2 py-0.5 text-xs font-medium bg=
-amber-500/15 text-amber-300">Sentinel</span><span class=3D"text-xs text-sl=
ate-500">customer sentiment -0.70</span></div><ul class=3D"space-y-1 text-s=
m"><li><span class=3D"inline-flex rounded-full px-2 py-0.5 text-xs font-med=
ium bg-amber-500/15 text-amber-300">support</span> <a class=3D"text-sky-300=
 hover:underline" href=3D"http://127.0.0.1:5173/meetings/01KQADC32D89E2B76B=
698E84" data-discover=3D"true">Support Case #6635 - Nova Retail Group SSO L=
ogin Failures</a></li><li><span class=3D"inline-flex rounded-full px-2 py-0=
.5 text-xs font-medium bg-sky-500/15 text-sky-300">external</span> <a class=
=3D"text-sky-300 hover:underline" href=3D"http://127.0.0.1:5173/meetings/01=
KQ7FA71CF70FAFEE4B6251" data-discover=3D"true">Aegis / Nova Retail Group - =
Renewal Discussion</a></li></ul></section><section class=3D"rounded-xl bord=
er border-slate-800 bg-slate-900/60 p-4 "><h2 class=3D"mb-3 text-sm font-se=
mibold tracking-wide text-slate-300">Meridian Capital =C2=B7 score 1.00</h2=
><p class=3D"mb-2 text-sm text-slate-300">Meridian Capital: churn language =
or key-moment churn_signal, competitor mention, executive/urgent escalation=
, negative customer-side polarity. Latest call =E2=80=9CAegis / Meridian Ca=
pital - Service Reliability Discussion=E2=80=9D (external). Sales + support=
 should share a single account plan.</p><div class=3D"mb-2 flex flex-wrap g=
ap-1"><span class=3D"inline-flex rounded-full px-2 py-0.5 text-xs font-medi=
um bg-rose-500/15 text-rose-300">churn</span><span class=3D"inline-flex rou=
nded-full px-2 py-0.5 text-xs font-medium bg-rose-500/15 text-rose-300">com=
petitive</span><span class=3D"inline-flex rounded-full px-2 py-0.5 text-xs =
font-medium bg-rose-500/15 text-rose-300">escalation</span><span class=3D"i=
nline-flex rounded-full px-2 py-0.5 text-xs font-medium bg-rose-500/15 text=
-rose-300">negative_customer</span><span class=3D"inline-flex rounded-full =
px-2 py-0.5 text-xs font-medium bg-amber-500/15 text-amber-300">Okta</span>=
<span class=3D"inline-flex rounded-full px-2 py-0.5 text-xs font-medium bg-=
amber-500/15 text-amber-300">Sentinel</span><span class=3D"text-xs text-sla=
te-500">customer sentiment -0.37</span></div><ul class=3D"space-y-1 text-sm=
"><li><span class=3D"inline-flex rounded-full px-2 py-0.5 text-xs font-medi=
um bg-amber-500/15 text-amber-300">support</span> <a class=3D"text-sky-300 =
hover:underline" href=3D"http://127.0.0.1:5173/meetings/01KQ5F364545B542671=
FF9CE" data-discover=3D"true">Support Case #3546 - Meridian Capital SCIM Pr=
ovisioning Request</a></li><li><span class=3D"inline-flex rounded-full px-2=
 py-0.5 text-xs font-medium bg-sky-500/15 text-sky-300">external</span> <a =
class=3D"text-sky-300 hover:underline" href=3D"http://127.0.0.1:5173/meetin=
gs/01KQ2217B066855A3B7814CB" data-discover=3D"true">Aegis / Meridian Capita=
l - Service Reliability Discussion</a></li></ul></section><section class=3D=
"rounded-xl border border-slate-800 bg-slate-900/60 p-4 "><h2 class=3D"mb-3=
 text-sm font-semibold tracking-wide text-slate-300">Cobalt Software =C2=B7=
 score 1.00</h2><p class=3D"mb-2 text-sm text-slate-300">Cobalt Software: c=
hurn language or key-moment churn_signal, competitor mention, executive/urg=
ent escalation, negative customer-side polarity. Latest call =E2=80=9CAegis=
 / Cobalt Software - Q2 Planning=E2=80=9D (external). Sales + support shoul=
d share a single account plan.</p><div class=3D"mb-2 flex flex-wrap gap-1">=
<span class=3D"inline-flex rounded-full px-2 py-0.5 text-xs font-medium bg-=
rose-500/15 text-rose-300">churn</span><span class=3D"inline-flex rounded-f=
ull px-2 py-0.5 text-xs font-medium bg-rose-500/15 text-rose-300">competiti=
ve</span><span class=3D"inline-flex rounded-full px-2 py-0.5 text-xs font-m=
edium bg-rose-500/15 text-rose-300">escalation</span><span class=3D"inline-=
flex rounded-full px-2 py-0.5 text-xs font-medium bg-rose-500/15 text-rose-=
300">negative_customer</span><span class=3D"inline-flex rounded-full px-2 p=
y-0.5 text-xs font-medium bg-amber-500/15 text-amber-300">Cloudprime</span>=
<span class=3D"inline-flex rounded-full px-2 py-0.5 text-xs font-medium bg-=
amber-500/15 text-amber-300">Sentinel</span><span class=3D"text-xs text-sla=
te-500">customer sentiment -0.60</span></div><ul class=3D"space-y-1 text-sm=
"><li><span class=3D"inline-flex rounded-full px-2 py-0.5 text-xs font-medi=
um bg-amber-500/15 text-amber-300">support</span> <a class=3D"text-sky-300 =
hover:underline" href=3D"http://127.0.0.1:5173/meetings/01KQEDB92E33CF9945A=
7F71B" data-discover=3D"true">URGENT: Cobalt Software - Aegis Detect Dashbo=
ard Down</a></li><li><span class=3D"inline-flex rounded-full px-2 py-0.5 te=
xt-xs font-medium bg-sky-500/15 text-sky-300">external</span> <a class=3D"t=
ext-sky-300 hover:underline" href=3D"http://127.0.0.1:5173/meetings/01KQ0F8=
AFF3DA34FD4580008" data-discover=3D"true">Aegis / Cobalt Software - Q2 Plan=
ning</a></li></ul></section><section class=3D"rounded-xl border border-slat=
e-800 bg-slate-900/60 p-4 "><h2 class=3D"mb-3 text-sm font-semibold trackin=
g-wide text-slate-300">Trailhead Marketplace =C2=B7 score 1.00</h2><p class=
=3D"mb-2 text-sm text-slate-300">Trailhead Marketplace: churn language or k=
ey-moment churn_signal, competitor mention, executive/urgent escalation, ne=
gative customer-side polarity. Latest call =E2=80=9CAegis / Trailhead Marke=
tplace - Renewal Confirmation=E2=80=9D (external). Sales + support should s=
hare a single account plan.</p><div class=3D"mb-2 flex flex-wrap gap-1"><sp=
an class=3D"inline-flex rounded-full px-2 py-0.5 text-xs font-medium bg-ros=
e-500/15 text-rose-300">churn</span><span class=3D"inline-flex rounded-full=
 px-2 py-0.5 text-xs font-medium bg-rose-500/15 text-rose-300">competitive<=
/span><span class=3D"inline-flex rounded-full px-2 py-0.5 text-xs font-medi=
um bg-rose-500/15 text-rose-300">escalation</span><span class=3D"inline-fle=
x rounded-full px-2 py-0.5 text-xs font-medium bg-rose-500/15 text-rose-300=
">negative_customer</span><span class=3D"inline-flex rounded-full px-2 py-0=
.5 text-xs font-medium bg-amber-500/15 text-amber-300">Sentinel</span><span=
 class=3D"text-xs text-slate-500">customer sentiment -0.16</span></div><ul =
class=3D"space-y-1 text-sm"><li><span class=3D"inline-flex rounded-full px-=
2 py-0.5 text-xs font-medium bg-amber-500/15 text-amber-300">support</span>=
 <a class=3D"text-sky-300 hover:underline" href=3D"http://127.0.0.1:5173/me=
etings/01KQ7BF0D56037FF89DC89B6" data-discover=3D"true">Support Case #3266 =
- Trailhead Marketplace Detect Alerts Not Firing</a></li><li><span class=3D=
"inline-flex rounded-full px-2 py-0.5 text-xs font-medium bg-sky-500/15 tex=
t-sky-300">external</span> <a class=3D"text-sky-300 hover:underline" href=
=3D"http://127.0.0.1:5173/meetings/01KQ3D8C1EF16C042F31FAFD" data-discover=
=3D"true">Aegis / Trailhead Marketplace - Renewal Confirmation</a></li></ul=
></section><section class=3D"rounded-xl border border-slate-800 bg-slate-90=
0/60 p-4 "><h2 class=3D"mb-3 text-sm font-semibold tracking-wide text-slate=
-300">Northstar Pharma =C2=B7 score 1.00</h2><p class=3D"mb-2 text-sm text-=
slate-300">Northstar Pharma: churn language or key-moment churn_signal, com=
petitor mention, executive/urgent escalation, negative customer-side polari=
ty. Latest call =E2=80=9CESCALATION: Northstar Pharma - Detect Outage Impac=
t on Compliance=E2=80=9D (support). Sales + support should share a single a=
ccount plan.</p><div class=3D"mb-2 flex flex-wrap gap-1"><span class=3D"inl=
ine-flex rounded-full px-2 py-0.5 text-xs font-medium bg-rose-500/15 text-r=
ose-300">churn</span><span class=3D"inline-flex rounded-full px-2 py-0.5 te=
xt-xs font-medium bg-rose-500/15 text-rose-300">competitive</span><span cla=
ss=3D"inline-flex rounded-full px-2 py-0.5 text-xs font-medium bg-rose-500/=
15 text-rose-300">compliance_pressure</span><span class=3D"inline-flex roun=
ded-full px-2 py-0.5 text-xs font-medium bg-rose-500/15 text-rose-300">esca=
lation</span><span class=3D"inline-flex rounded-full px-2 py-0.5 text-xs fo=
nt-medium bg-rose-500/15 text-rose-300">negative_customer</span><span class=
=3D"inline-flex rounded-full px-2 py-0.5 text-xs font-medium bg-amber-500/1=
5 text-amber-300">Sentinel</span><span class=3D"text-xs text-slate-500">cus=
tomer sentiment -0.90</span></div><ul class=3D"space-y-1 text-sm"><li><span=
 class=3D"inline-flex rounded-full px-2 py-0.5 text-xs font-medium bg-amber=
-500/15 text-amber-300">support</span> <a class=3D"text-sky-300 hover:under=
line" href=3D"http://127.0.0.1:5173/meetings/01KQ351E141926AB7CAB668D" data=
-discover=3D"true">Aegis / Northstar Pharma - Urgent: Detect Outage Impact<=
/a></li><li><span class=3D"inline-flex rounded-full px-2 py-0.5 text-xs fon=
t-medium bg-amber-500/15 text-amber-300">support</span> <a class=3D"text-sk=
y-300 hover:underline" href=3D"http://127.0.0.1:5173/meetings/01KQ88B8EAEAA=
819C26CCBE7" data-discover=3D"true">ESCALATION: Northstar Pharma - Detect O=
utage Impact on Compliance</a></li></ul></section><section class=3D"rounded=
-xl border border-slate-800 bg-slate-900/60 p-4 "><h2 class=3D"mb-3 text-sm=
 font-semibold tracking-wide text-slate-300">Quantum Edge =C2=B7 score 1.00=
</h2><p class=3D"mb-2 text-sm text-slate-300">Quantum Edge: churn language =
or key-moment churn_signal, competitor mention, executive/urgent escalation=
, negative customer-side polarity. Latest call =E2=80=9CAegis / Quantum Edg=
e - Renewal Concerns=E2=80=9D (external). Sales + support should share a si=
ngle account plan.</p><div class=3D"mb-2 flex flex-wrap gap-1"><span class=
=3D"inline-flex rounded-full px-2 py-0.5 text-xs font-medium bg-rose-500/15=
 text-rose-300">churn</span><span class=3D"inline-flex rounded-full px-2 py=
-0.5 text-xs font-medium bg-rose-500/15 text-rose-300">competitive</span><s=
pan class=3D"inline-flex rounded-full px-2 py-0.5 text-xs font-medium bg-ro=
se-500/15 text-rose-300">escalation</span><span class=3D"inline-flex rounde=
d-full px-2 py-0.5 text-xs font-medium bg-rose-500/15 text-rose-300">negati=
ve_customer</span><span class=3D"inline-flex rounded-full px-2 py-0.5 text-=
xs font-medium bg-amber-500/15 text-amber-300">Sentinel</span><span class=
=3D"text-xs text-slate-500">customer sentiment -0.65</span></div><ul class=
=3D"space-y-1 text-sm"><li><span class=3D"inline-flex rounded-full px-2 py-=
0.5 text-xs font-medium bg-sky-500/15 text-sky-300">external</span> <a clas=
s=3D"text-sky-300 hover:underline" href=3D"http://127.0.0.1:5173/meetings/0=
1KQ1DCC80852AE384C898C9" data-discover=3D"true">Aegis / Quantum Edge - Rene=
wal Concerns</a></li></ul></section><section class=3D"rounded-xl border bor=
der-slate-800 bg-slate-900/60 p-4 "><h2 class=3D"mb-3 text-sm font-semibold=
 tracking-wide text-slate-300">Forge Industries =C2=B7 score 0.95</h2><p cl=
ass=3D"mb-2 text-sm text-slate-300">Forge Industries: churn language or key=
-moment churn_signal, competitor mention, executive/urgent escalation. Late=
st call =E2=80=9CAegis / Forge Industries - PCI DSS Compliance Review=E2=80=
=9D (external). Sales + support should share a single account plan.</p><div=
 class=3D"mb-2 flex flex-wrap gap-1"><span class=3D"inline-flex rounded-ful=
l px-2 py-0.5 text-xs font-medium bg-rose-500/15 text-rose-300">churn</span=
><span class=3D"inline-flex rounded-full px-2 py-0.5 text-xs font-medium bg=
-rose-500/15 text-rose-300">competitive</span><span class=3D"inline-flex ro=
unded-full px-2 py-0.5 text-xs font-medium bg-rose-500/15 text-rose-300">co=
mpliance_pressure</span><span class=3D"inline-flex rounded-full px-2 py-0.5=
 text-xs font-medium bg-rose-500/15 text-rose-300">escalation</span><span c=
lass=3D"inline-flex rounded-full px-2 py-0.5 text-xs font-medium bg-amber-5=
00/15 text-amber-300">Vanta</span><span class=3D"text-xs text-slate-500">cu=
stomer sentiment 0.36</span></div><ul class=3D"space-y-1 text-sm"><li><span=
 class=3D"inline-flex rounded-full px-2 py-0.5 text-xs font-medium bg-amber=
-500/15 text-amber-300">support</span> <a class=3D"text-sky-300 hover:under=
line" href=3D"http://127.0.0.1:5173/meetings/01KQ5D47170D4828E89EDE37" data=
-discover=3D"true">Support Case #7537 - Forge Industries Detect Recovery Co=
nfirmation</a></li><li><span class=3D"inline-flex rounded-full px-2 py-0.5 =
text-xs font-medium bg-amber-500/15 text-amber-300">support</span> <a class=
=3D"text-sky-300 hover:underline" href=3D"http://127.0.0.1:5173/meetings/01=
KQ56786DD1E8A1BF174FDD" data-discover=3D"true">Support Case #1993 - Forge I=
ndustries Comply v2 Early Access Question</a></li><li><span class=3D"inline=
-flex rounded-full px-2 py-0.5 text-xs font-medium bg-sky-500/15 text-sky-3=
00">external</span> <a class=3D"text-sky-300 hover:underline" href=3D"http:=
//127.0.0.1:5173/meetings/01KQB95605C6F873C6036285" data-discover=3D"true">=
Aegis / Forge Industries - PCI DSS Compliance Review</a></li></ul></section=
><section class=3D"rounded-xl border border-slate-800 bg-slate-900/60 p-4 "=
><h2 class=3D"mb-3 text-sm font-semibold tracking-wide text-slate-300">Meri=
dian Capital Granular Restore Request =C2=B7 score 0.95</h2><p class=3D"mb-=
2 text-sm text-slate-300">Meridian Capital Granular Restore Request: churn =
language or key-moment churn_signal, competitor mention, executive/urgent e=
scalation. Latest call =E2=80=9CSupport Case #1514 - Meridian Capital Granu=
lar Restore Request=E2=80=9D (support). Sales + support should share a sing=
le account plan.</p><div class=3D"mb-2 flex flex-wrap gap-1"><span class=3D=
"inline-flex rounded-full px-2 py-0.5 text-xs font-medium bg-rose-500/15 te=
xt-rose-300">churn</span><span class=3D"inline-flex rounded-full px-2 py-0.=
5 text-xs font-medium bg-rose-500/15 text-rose-300">competitive</span><span=
 class=3D"inline-flex rounded-full px-2 py-0.5 text-xs font-medium bg-rose-=
500/15 text-rose-300">escalation</span><span class=3D"inline-flex rounded-f=
ull px-2 py-0.5 text-xs font-medium bg-amber-500/15 text-amber-300">Cloudpr=
ime</span><span class=3D"text-xs text-slate-500">customer sentiment -0.09</=
span></div><ul class=3D"space-y-1 text-sm"><li><span class=3D"inline-flex r=
ounded-full px-2 py-0.5 text-xs font-medium bg-amber-500/15 text-amber-300"=
>support</span> <a class=3D"text-sky-300 hover:underline" href=3D"http://12=
7.0.0.1:5173/meetings/01KQ25D8AED944B5D2A9FF60" data-discover=3D"true">Supp=
ort Case #1514 - Meridian Capital Granular Restore Request</a></li></ul></s=
ection><section class=3D"rounded-xl border border-slate-800 bg-slate-900/60=
 p-4 "><h2 class=3D"mb-3 text-sm font-semibold tracking-wide text-slate-300=
">Ironclad Financial =C2=B7 score 0.95</h2><p class=3D"mb-2 text-sm text-sl=
ate-300">Ironclad Financial: churn language or key-moment churn_signal, com=
petitor mention, executive/urgent escalation. Latest call =E2=80=9CAegis / =
Ironclad Financial - Account Recovery Check-in=E2=80=9D (external). Sales +=
 support should share a single account plan.</p><div class=3D"mb-2 flex fle=
x-wrap gap-1"><span class=3D"inline-flex rounded-full px-2 py-0.5 text-xs f=
ont-medium bg-rose-500/15 text-rose-300">churn</span><span class=3D"inline-=
flex rounded-full px-2 py-0.5 text-xs font-medium bg-rose-500/15 text-rose-=
300">competitive</span><span class=3D"inline-flex rounded-full px-2 py-0.5 =
text-xs font-medium bg-rose-500/15 text-rose-300">escalation</span><span cl=
ass=3D"inline-flex rounded-full px-2 py-0.5 text-xs font-medium bg-amber-50=
0/15 text-amber-300">Sentinel</span><span class=3D"text-xs text-slate-500">=
customer sentiment -0.02</span></div><ul class=3D"space-y-1 text-sm"><li><s=
pan class=3D"inline-flex rounded-full px-2 py-0.5 text-xs font-medium bg-sk=
y-500/15 text-sky-300">external</span> <a class=3D"text-sky-300 hover:under=
line" href=3D"http://127.0.0.1:5173/meetings/01KQC1267BEB344076DD7656" data=
-discover=3D"true">Aegis / Ironclad Financial - Account Recovery Check-in</=
a></li></ul></section><section class=3D"rounded-xl border border-slate-800 =
bg-slate-900/60 p-4 "><h2 class=3D"mb-3 text-sm font-semibold tracking-wide=
 text-slate-300">Axiom Labs =C2=B7 score 0.95</h2><p class=3D"mb-2 text-sm =
text-slate-300">Axiom Labs: churn language or key-moment churn_signal, comp=
etitor mention, executive/urgent escalation. Latest call =E2=80=9CAegis / A=
xiom Labs - Multi-Year Renewal=E2=80=9D (external). Sales + support should =
share a single account plan.</p><div class=3D"mb-2 flex flex-wrap gap-1"><s=
pan class=3D"inline-flex rounded-full px-2 py-0.5 text-xs font-medium bg-ro=
se-500/15 text-rose-300">churn</span><span class=3D"inline-flex rounded-ful=
l px-2 py-0.5 text-xs font-medium bg-rose-500/15 text-rose-300">competitive=
</span><span class=3D"inline-flex rounded-full px-2 py-0.5 text-xs font-med=
ium bg-rose-500/15 text-rose-300">escalation</span><span class=3D"inline-fl=
ex rounded-full px-2 py-0.5 text-xs font-medium bg-amber-500/15 text-amber-=
300">Sentinel</span><span class=3D"text-xs text-slate-500">customer sentime=
nt 0.70</span></div><ul class=3D"space-y-1 text-sm"><li><span class=3D"inli=
ne-flex rounded-full px-2 py-0.5 text-xs font-medium bg-sky-500/15 text-sky=
-300">external</span> <a class=3D"text-sky-300 hover:underline" href=3D"htt=
p://127.0.0.1:5173/meetings/01KQ410FB7E434BA3F99EE7D" data-discover=3D"true=
">Aegis / Axiom Labs - Multi-Year Renewal</a></li></ul></section><section c=
lass=3D"rounded-xl border border-slate-800 bg-slate-900/60 p-4 "><h2 class=
=3D"mb-3 text-sm font-semibold tracking-wide text-slate-300">Silverline Bra=
nds =C2=B7 score 0.90</h2><p class=3D"mb-2 text-sm text-slate-300">Silverli=
ne Brands: churn language or key-moment churn_signal, executive/urgent esca=
lation, negative customer-side polarity. Latest call =E2=80=9CSupport Case =
#7570 - Silverline Brands Comply v2 License Upgrade=E2=80=9D (support). Sal=
es + support should share a single account plan.</p><div class=3D"mb-2 flex=
 flex-wrap gap-1"><span class=3D"inline-flex rounded-full px-2 py-0.5 text-=
xs font-medium bg-rose-500/15 text-rose-300">churn</span><span class=3D"inl=
ine-flex rounded-full px-2 py-0.5 text-xs font-medium bg-rose-500/15 text-r=
ose-300">escalation</span><span class=3D"inline-flex rounded-full px-2 py-0=
.5 text-xs font-medium bg-rose-500/15 text-rose-300">negative_customer</spa=
n><span class=3D"text-xs text-slate-500">customer sentiment -0.12</span></d=
iv><ul class=3D"space-y-1 text-sm"><li><span class=3D"inline-flex rounded-f=
ull px-2 py-0.5 text-xs font-medium bg-amber-500/15 text-amber-300">support=
</span> <a class=3D"text-sky-300 hover:underline" href=3D"http://127.0.0.1:=
5173/meetings/01KQEDE682B4A8D67C657CF1" data-discover=3D"true">Support Case=
 #3103 - Silverline Brands Detect False Positives After Patch</a></li><li><=
span class=3D"inline-flex rounded-full px-2 py-0.5 text-xs font-medium bg-s=
ky-500/15 text-sky-300">external</span> <a class=3D"text-sky-300 hover:unde=
rline" href=3D"http://127.0.0.1:5173/meetings/01KQ45C0AD36B351A3571940" dat=
a-discover=3D"true">Aegis / Silverline Brands - Comply v2 Early Access Demo=
</a></li><li><span class=3D"inline-flex rounded-full px-2 py-0.5 text-xs fo=
nt-medium bg-amber-500/15 text-amber-300">support</span> <a class=3D"text-s=
ky-300 hover:underline" href=3D"http://127.0.0.1:5173/meetings/01KQA7DFCE12=
85F52192B34B" data-discover=3D"true">Support Case #9856 - Silverline Brands=
 Backup Window Exceeded</a></li><li><span class=3D"inline-flex rounded-full=
 px-2 py-0.5 text-xs font-medium bg-amber-500/15 text-amber-300">support</s=
pan> <a class=3D"text-sky-300 hover:underline" href=3D"http://127.0.0.1:517=
3/meetings/01KQB632F1ADC378C42F2C03" data-discover=3D"true">Support Case #7=
570 - Silverline Brands Comply v2 License Upgrade</a></li></ul></section><s=
ection class=3D"rounded-xl border border-slate-800 bg-slate-900/60 p-4 "><h=
2 class=3D"mb-3 text-sm font-semibold tracking-wide text-slate-300">Summit =
Trust =C2=B7 score 0.90</h2><p class=3D"mb-2 text-sm text-slate-300">Summit=
 Trust: churn language or key-moment churn_signal, executive/urgent escalat=
ion, negative customer-side polarity. Latest call =E2=80=9CSupport Case #61=
47 - Summit Trust Detect Alert Delays=E2=80=9D (support). Sales + support s=
hould share a single account plan.</p><div class=3D"mb-2 flex flex-wrap gap=
-1"><span class=3D"inline-flex rounded-full px-2 py-0.5 text-xs font-medium=
 bg-rose-500/15 text-rose-300">churn</span><span class=3D"inline-flex round=
ed-full px-2 py-0.5 text-xs font-medium bg-rose-500/15 text-rose-300">escal=
ation</span><span class=3D"inline-flex rounded-full px-2 py-0.5 text-xs fon=
t-medium bg-rose-500/15 text-rose-300">negative_customer</span><span class=
=3D"text-xs text-slate-500">customer sentiment -0.35</span></div><ul class=
=3D"space-y-1 text-sm"><li><span class=3D"inline-flex rounded-full px-2 py-=
0.5 text-xs font-medium bg-amber-500/15 text-amber-300">support</span> <a c=
lass=3D"text-sky-300 hover:underline" href=3D"http://127.0.0.1:5173/meeting=
s/01KQ0C1280EDA4E70AAD7C35" data-discover=3D"true">Support Case #9279 - Sum=
mit Trust Billing Inquiry</a></li><li><span class=3D"inline-flex rounded-fu=
ll px-2 py-0.5 text-xs font-medium bg-sky-500/15 text-sky-300">external</sp=
an> <a class=3D"text-sky-300 hover:underline" href=3D"http://127.0.0.1:5173=
/meetings/01KQ5A966832A146DA4B7D41" data-discover=3D"true">Aegis / Summit T=
rust - Platform Concerns Discussion</a></li><li><span class=3D"inline-flex =
rounded-full px-2 py-0.5 text-xs font-medium bg-amber-500/15 text-amber-300=
">support</span> <a class=3D"text-sky-300 hover:underline" href=3D"http://1=
27.0.0.1:5173/meetings/01KQBBF753B44DE677670E6D" data-discover=3D"true">Sup=
port Case #6147 - Summit Trust Detect Alert Delays</a></li></ul></section><=
section class=3D"rounded-xl border border-slate-800 bg-slate-900/60 p-4 "><=
h2 class=3D"mb-3 text-sm font-semibold tracking-wide text-slate-300">Ridgel=
ine Logistics =C2=B7 score 0.90</h2><p class=3D"mb-2 text-sm text-slate-300=
">Ridgeline Logistics: churn language or key-moment churn_signal, executive=
/urgent escalation, negative customer-side polarity. Latest call =E2=80=9CS=
upport Case #5889 - Ridgeline Logistics Detect Latency Issues=E2=80=9D (sup=
port). Sales + support should share a single account plan.</p><div class=3D=
"mb-2 flex flex-wrap gap-1"><span class=3D"inline-flex rounded-full px-2 py=
-0.5 text-xs font-medium bg-rose-500/15 text-rose-300">churn</span><span cl=
ass=3D"inline-flex rounded-full px-2 py-0.5 text-xs font-medium bg-rose-500=
/15 text-rose-300">escalation</span><span class=3D"inline-flex rounded-full=
 px-2 py-0.5 text-xs font-medium bg-rose-500/15 text-rose-300">negative_cus=
tomer</span><span class=3D"text-xs text-slate-500">customer sentiment -0.64=
</span></div><ul class=3D"space-y-1 text-sm"><li><span class=3D"inline-flex=
 rounded-full px-2 py-0.5 text-xs font-medium bg-sky-500/15 text-sky-300">e=
xternal</span> <a class=3D"text-sky-300 hover:underline" href=3D"http://127=
.0.0.1:5173/meetings/01KQCA6EA8B603EBB6C9FE34" data-discover=3D"true">Aegis=
 / Ridgeline Logistics - Identity Roadmap Discussion</a></li><li><span clas=
s=3D"inline-flex rounded-full px-2 py-0.5 text-xs font-medium bg-amber-500/=
15 text-amber-300">support</span> <a class=3D"text-sky-300 hover:underline"=
 href=3D"http://127.0.0.1:5173/meetings/01KQ94C2B8B9B4668F3D3491" data-disc=
over=3D"true">Support Case #6573 - Ridgeline Logistics Detect Data Gaps</a>=
</li><li><span class=3D"inline-flex rounded-full px-2 py-0.5 text-xs font-m=
edium bg-amber-500/15 text-amber-300">support</span> <a class=3D"text-sky-3=
00 hover:underline" href=3D"http://127.0.0.1:5173/meetings/01KQ325BDEDEE927=
D2970775" data-discover=3D"true">Support Case #5889 - Ridgeline Logistics D=
etect Latency Issues</a></li></ul></section><section class=3D"rounded-xl bo=
rder border-slate-800 bg-slate-900/60 p-4 "><h2 class=3D"mb-3 text-sm font-=
semibold tracking-wide text-slate-300">Redwood Clinical =C2=B7 score 0.90</=
h2><p class=3D"mb-2 text-sm text-slate-300">Redwood Clinical: churn languag=
e or key-moment churn_signal, executive/urgent escalation, negative custome=
r-side polarity. Latest call =E2=80=9CAegis / Redwood Clinical - ISO 27001 =
Preparation=E2=80=9D (external). Sales + support should share a single acco=
unt plan.</p><div class=3D"mb-2 flex flex-wrap gap-1"><span class=3D"inline=
-flex rounded-full px-2 py-0.5 text-xs font-medium bg-rose-500/15 text-rose=
-300">churn</span><span class=3D"inline-flex rounded-full px-2 py-0.5 text-=
xs font-medium bg-rose-500/15 text-rose-300">compliance_pressure</span><spa=
n class=3D"inline-flex rounded-full px-2 py-0.5 text-xs font-medium bg-rose=
-500/15 text-rose-300">escalation</span><span class=3D"inline-flex rounded-=
full px-2 py-0.5 text-xs font-medium bg-rose-500/15 text-rose-300">negative=
_customer</span><span class=3D"text-xs text-slate-500">customer sentiment 0=
.21</span></div><ul class=3D"space-y-1 text-sm"><li><span class=3D"inline-f=
lex rounded-full px-2 py-0.5 text-xs font-medium bg-sky-500/15 text-sky-300=
">external</span> <a class=3D"text-sky-300 hover:underline" href=3D"http://=
127.0.0.1:5173/meetings/01KQ51DC4345D9DAE005678C" data-discover=3D"true">Ae=
gis / Redwood Clinical - Product Feedback Session</a></li><li><span class=
=3D"inline-flex rounded-full px-2 py-0.5 text-xs font-medium bg-sky-500/15 =
text-sky-300">external</span> <a class=3D"text-sky-300 hover:underline" hre=
f=3D"http://127.0.0.1:5173/meetings/01KQ0DFE299AC7A74E8022CA" data-discover=
=3D"true">Aegis / Redwood Clinical - ISO 27001 Preparation</a></li></ul></s=
ection><section class=3D"rounded-xl border border-slate-800 bg-slate-900/60=
 p-4 "><h2 class=3D"mb-3 text-sm font-semibold tracking-wide text-slate-300=
">Steelpoint Manufacturing =C2=B7 score 0.90</h2><p class=3D"mb-2 text-sm t=
ext-slate-300">Steelpoint Manufacturing: churn language or key-moment churn=
_signal, executive/urgent escalation, negative customer-side polarity. Late=
st call =E2=80=9CAegis / Steelpoint Manufacturing - Contract Review=E2=80=
=9D (external). Sales + support should share a single account plan.</p><div=
 class=3D"mb-2 flex flex-wrap gap-1"><span class=3D"inline-flex rounded-ful=
l px-2 py-0.5 text-xs font-medium bg-rose-500/15 text-rose-300">churn</span=
><span class=3D"inline-flex rounded-full px-2 py-0.5 text-xs font-medium bg=
-rose-500/15 text-rose-300">escalation</span><span class=3D"inline-flex rou=
nded-full px-2 py-0.5 text-xs font-medium bg-rose-500/15 text-rose-300">neg=
ative_customer</span><span class=3D"text-xs text-slate-500">customer sentim=
ent -0.41</span></div><ul class=3D"space-y-1 text-sm"><li><span class=3D"in=
line-flex rounded-full px-2 py-0.5 text-xs font-medium bg-amber-500/15 text=
-amber-300">support</span> <a class=3D"text-sky-300 hover:underline" href=
=3D"http://127.0.0.1:5173/meetings/01KQ6A5CEAAFFBE3B0099E75" data-discover=
=3D"true">Support Case #6539 - Steelpoint Manufacturing LDAP Sync Failures<=
/a></li><li><span class=3D"inline-flex rounded-full px-2 py-0.5 text-xs fon=
t-medium bg-sky-500/15 text-sky-300">external</span> <a class=3D"text-sky-3=
00 hover:underline" href=3D"http://127.0.0.1:5173/meetings/01KQ45C76AF3AEA6=
B3EA6697" data-discover=3D"true">Aegis / Steelpoint Manufacturing - Contrac=
t Review</a></li></ul></section><section class=3D"rounded-xl border border-=
slate-800 bg-slate-900/60 p-4 "><h2 class=3D"mb-3 text-sm font-semibold tra=
cking-wide text-slate-300">Brightpath Commerce Slow =C2=B7 score 0.90</h2><=
p class=3D"mb-2 text-sm text-slate-300">Brightpath Commerce Slow: churn lan=
guage or key-moment churn_signal, executive/urgent escalation, negative cus=
tomer-side polarity. Latest call =E2=80=9CSupport Case #6977 - Brightpath C=
ommerce Slow Backup Performance=E2=80=9D (support). Sales + support should =
share a single account plan.</p><div class=3D"mb-2 flex flex-wrap gap-1"><s=
pan class=3D"inline-flex rounded-full px-2 py-0.5 text-xs font-medium bg-ro=
se-500/15 text-rose-300">churn</span><span class=3D"inline-flex rounded-ful=
l px-2 py-0.5 text-xs font-medium bg-rose-500/15 text-rose-300">escalation<=
/span><span class=3D"inline-flex rounded-full px-2 py-0.5 text-xs font-medi=
um bg-rose-500/15 text-rose-300">negative_customer</span><span class=3D"tex=
t-xs text-slate-500">customer sentiment -0.83</span></div><ul class=3D"spac=
e-y-1 text-sm"><li><span class=3D"inline-flex rounded-full px-2 py-0.5 text=
-xs font-medium bg-amber-500/15 text-amber-300">support</span> <a class=3D"=
text-sky-300 hover:underline" href=3D"http://127.0.0.1:5173/meetings/01KQ1A=
6B7E81B06F4A13B60D" data-discover=3D"true">Support Case #6977 - Brightpath =
Commerce Slow Backup Performance</a></li></ul></section><section class=3D"r=
ounded-xl border border-slate-800 bg-slate-900/60 p-4 "><h2 class=3D"mb-3 t=
ext-sm font-semibold tracking-wide text-slate-300">Helix Data =C2=B7 score =
0.90</h2><p class=3D"mb-2 text-sm text-slate-300">Helix Data: churn languag=
e or key-moment churn_signal, executive/urgent escalation, negative custome=
r-side polarity. Latest call =E2=80=9CAegis / Helix Data - Post-Incident Re=
view=E2=80=9D (external). Sales + support should share a single account pla=
n.</p><div class=3D"mb-2 flex flex-wrap gap-1"><span class=3D"inline-flex r=
ounded-full px-2 py-0.5 text-xs font-medium bg-rose-500/15 text-rose-300">c=
hurn</span><span class=3D"inline-flex rounded-full px-2 py-0.5 text-xs font=
-medium bg-rose-500/15 text-rose-300">escalation</span><span class=3D"inlin=
e-flex rounded-full px-2 py-0.5 text-xs font-medium bg-rose-500/15 text-ros=
e-300">negative_customer</span><span class=3D"text-xs text-slate-500">custo=
mer sentiment -0.52</span></div><ul class=3D"space-y-1 text-sm"><li><span c=
lass=3D"inline-flex rounded-full px-2 py-0.5 text-xs font-medium bg-sky-500=
/15 text-sky-300">external</span> <a class=3D"text-sky-300 hover:underline"=
 href=3D"http://127.0.0.1:5173/meetings/01KQ8C5A044F54EE1774D53C" data-disc=
over=3D"true">Aegis / Helix Data - Post-Incident Review</a></li></ul></sect=
ion><section class=3D"rounded-xl border border-slate-800 bg-slate-900/60 p-=
4 "><h2 class=3D"mb-3 text-sm font-semibold tracking-wide text-slate-300">C=
learwater Medical Overage Charges Dispute =C2=B7 score 0.90</h2><p class=3D=
"mb-2 text-sm text-slate-300">Clearwater Medical Overage Charges Dispute: c=
hurn language or key-moment churn_signal, executive/urgent escalation, nega=
tive customer-side polarity. Latest call =E2=80=9CSupport Case #8179 - Clea=
rwater Medical Overage Charges Dispute=E2=80=9D (support). Sales + support =
should share a single account plan.</p><div class=3D"mb-2 flex flex-wrap ga=
p-1"><span class=3D"inline-flex rounded-full px-2 py-0.5 text-xs font-mediu=
m bg-rose-500/15 text-rose-300">churn</span><span class=3D"inline-flex roun=
ded-full px-2 py-0.5 text-xs font-medium bg-rose-500/15 text-rose-300">esca=
lation</span><span class=3D"inline-flex rounded-full px-2 py-0.5 text-xs fo=
nt-medium bg-rose-500/15 text-rose-300">negative_customer</span><span class=
=3D"text-xs text-slate-500">customer sentiment -0.93</span></div><ul class=
=3D"space-y-1 text-sm"><li><span class=3D"inline-flex rounded-full px-2 py-=
0.5 text-xs font-medium bg-amber-500/15 text-amber-300">support</span> <a c=
lass=3D"text-sky-300 hover:underline" href=3D"http://127.0.0.1:5173/meeting=
s/01KQ56AA6B60801ABC01AB1C" data-discover=3D"true">Support Case #8179 - Cle=
arwater Medical Overage Charges Dispute</a></li></ul></section><section cla=
ss=3D"rounded-xl border border-slate-800 bg-slate-900/60 p-4 "><h2 class=3D=
"mb-3 text-sm font-semibold tracking-wide text-slate-300">Ironworks Corp =
=C2=B7 score 0.90</h2><p class=3D"mb-2 text-sm text-slate-300">Ironworks Co=
rp: churn language or key-moment churn_signal, executive/urgent escalation,=
 negative customer-side polarity. Latest call =E2=80=9CAegis / Ironworks Co=
rp - Vendor Comparison Discussion=E2=80=9D (external). Sales + support shou=
ld share a single account plan.</p><div class=3D"mb-2 flex flex-wrap gap-1"=
><span class=3D"inline-flex rounded-full px-2 py-0.5 text-xs font-medium bg=
-rose-500/15 text-rose-300">churn</span><span class=3D"inline-flex rounded-=
full px-2 py-0.5 text-xs font-medium bg-rose-500/15 text-rose-300">escalati=
on</span><span class=3D"inline-flex rounded-full px-2 py-0.5 text-xs font-m=
edium bg-rose-500/15 text-rose-300">negative_customer</span><span class=3D"=
text-xs text-slate-500">customer sentiment -0.65</span></div><ul class=3D"s=
pace-y-1 text-sm"><li><span class=3D"inline-flex rounded-full px-2 py-0.5 t=
ext-xs font-medium bg-sky-500/15 text-sky-300">external</span> <a class=3D"=
text-sky-300 hover:underline" href=3D"http://127.0.0.1:5173/meetings/01KQ6C=
AA850EAFDC48B52846" data-discover=3D"true">Aegis / Ironworks Corp - Vendor =
Comparison Discussion</a></li></ul></section><section class=3D"rounded-xl b=
order border-slate-800 bg-slate-900/60 p-4 "><h2 class=3D"mb-3 text-sm font=
-semibold tracking-wide text-slate-300">Stratos Cloud LogVault Integration =
Timeout =C2=B7 score 0.90</h2><p class=3D"mb-2 text-sm text-slate-300">Stra=
tos Cloud LogVault Integration Timeout: churn language or key-moment churn_=
signal, executive/urgent escalation, negative customer-side polarity. Lates=
t call =E2=80=9CSupport Case #3536 - Stratos Cloud LogVault Integration Tim=
eout=E2=80=9D (support). Sales + support should share a single account plan=
.</p><div class=3D"mb-2 flex flex-wrap gap-1"><span class=3D"inline-flex ro=
unded-full px-2 py-0.5 text-xs font-medium bg-rose-500/15 text-rose-300">ch=
urn</span><span class=3D"inline-flex rounded-full px-2 py-0.5 text-xs font-=
medium bg-rose-500/15 text-rose-300">escalation</span><span class=3D"inline=
-flex rounded-full px-2 py-0.5 text-xs font-medium bg-rose-500/15 text-rose=
-300">negative_customer</span><span class=3D"text-xs text-slate-500">custom=
er sentiment -0.76</span></div><ul class=3D"space-y-1 text-sm"><li><span cl=
ass=3D"inline-flex rounded-full px-2 py-0.5 text-xs font-medium bg-amber-50=
0/15 text-amber-300">support</span> <a class=3D"text-sky-300 hover:underlin=
e" href=3D"http://127.0.0.1:5173/meetings/01KQ56D878454E5783DC6D94" data-di=
scover=3D"true">Support Case #3536 - Stratos Cloud LogVault Integration Tim=
eout</a></li></ul></section><section class=3D"rounded-xl border border-slat=
e-800 bg-slate-900/60 p-4 "><h2 class=3D"mb-3 text-sm font-semibold trackin=
g-wide text-slate-300">Crestline Wealth Group Policy Sync Delay =C2=B7 scor=
e 0.90</h2><p class=3D"mb-2 text-sm text-slate-300">Crestline Wealth Group =
Policy Sync Delay: churn language or key-moment churn_signal, executive/urg=
ent escalation, negative customer-side polarity. Latest call =E2=80=9CSuppo=
rt Case #7615 - Crestline Wealth Group Policy Sync Delay=E2=80=9D (support)=
. Sales + support should share a single account plan.</p><div class=3D"mb-2=
 flex flex-wrap gap-1"><span class=3D"inline-flex rounded-full px-2 py-0.5 =
text-xs font-medium bg-rose-500/15 text-rose-300">churn</span><span class=
=3D"inline-flex rounded-full px-2 py-0.5 text-xs font-medium bg-rose-500/15=
 text-rose-300">escalation</span><span class=3D"inline-flex rounded-full px=
-2 py-0.5 text-xs font-medium bg-rose-500/15 text-rose-300">negative_custom=
er</span><span class=3D"text-xs text-slate-500">customer sentiment -0.77</s=
pan></div><ul class=3D"space-y-1 text-sm"><li><span class=3D"inline-flex ro=
unded-full px-2 py-0.5 text-xs font-medium bg-amber-500/15 text-amber-300">=
support</span> <a class=3D"text-sky-300 hover:underline" href=3D"http://127=
.0.0.1:5173/meetings/01KQC166F678CBA584AAFF8B" data-discover=3D"true">Suppo=
rt Case #7615 - Crestline Wealth Group Policy Sync Delay</a></li></ul></sec=
tion><section class=3D"rounded-xl border border-slate-800 bg-slate-900/60 p=
-4 "><h2 class=3D"mb-3 text-sm font-semibold tracking-wide text-slate-300">=
Pinnacle Insurance =C2=B7 score 0.70</h2><p class=3D"mb-2 text-sm text-slat=
e-300">Pinnacle Insurance: churn language or key-moment churn_signal, execu=
tive/urgent escalation. Latest call =E2=80=9CAegis / Pinnacle Insurance - D=
etect Roadmap Review=E2=80=9D (external). Sales + support should share a si=
ngle account plan.</p><div class=3D"mb-2 flex flex-wrap gap-1"><span class=
=3D"inline-flex rounded-full px-2 py-0.5 text-xs font-medium bg-rose-500/15=
 text-rose-300">churn</span><span class=3D"inline-flex rounded-full px-2 py=
-0.5 text-xs font-medium bg-rose-500/15 text-rose-300">escalation</span><sp=
an class=3D"text-xs text-slate-500">customer sentiment -0.06</span></div><u=
l class=3D"space-y-1 text-sm"><li><span class=3D"inline-flex rounded-full p=
x-2 py-0.5 text-xs font-medium bg-amber-500/15 text-amber-300">support</spa=
n> <a class=3D"text-sky-300 hover:underline" href=3D"http://127.0.0.1:5173/=
meetings/01KQ38FE02AEE5AA5157F042" data-discover=3D"true">Support Case #329=
6 - Pinnacle Insurance Comply v2 Report Formatting Issue</a></li><li><span =
class=3D"inline-flex rounded-full px-2 py-0.5 text-xs font-medium bg-sky-50=
0/15 text-sky-300">external</span> <a class=3D"text-sky-300 hover:underline=
" href=3D"http://127.0.0.1:5173/meetings/01KQ8D9A06510DD623EFB1A6" data-dis=
cover=3D"true">Aegis / Pinnacle Insurance - Detect Roadmap Review</a></li><=
/ul></section><section class=3D"rounded-xl border border-slate-800 bg-slate=
-900/60 p-4 "><h2 class=3D"mb-3 text-sm font-semibold tracking-wide text-sl=
ate-300">Maplewood Goods =C2=B7 score 0.35</h2><p class=3D"mb-2 text-sm tex=
t-slate-300">Maplewood Goods: competitor mention. Latest call =E2=80=9CAegi=
s / Maplewood Goods - SOC 2 Prep Review=E2=80=9D (external). Sales + suppor=
t should share a single account plan.</p><div class=3D"mb-2 flex flex-wrap =
gap-1"><span class=3D"inline-flex rounded-full px-2 py-0.5 text-xs font-med=
ium bg-rose-500/15 text-rose-300">competitive</span><span class=3D"inline-f=
lex rounded-full px-2 py-0.5 text-xs font-medium bg-rose-500/15 text-rose-3=
00">compliance_pressure</span><span class=3D"inline-flex rounded-full px-2 =
py-0.5 text-xs font-medium bg-amber-500/15 text-amber-300">Cloudprime</span=
><span class=3D"inline-flex rounded-full px-2 py-0.5 text-xs font-medium bg=
-amber-500/15 text-amber-300">Vanta</span><span class=3D"text-xs text-slate=
-500">customer sentiment 0.45</span></div><ul class=3D"space-y-1 text-sm"><=
li><span class=3D"inline-flex rounded-full px-2 py-0.5 text-xs font-medium =
bg-sky-500/15 text-sky-300">external</span> <a class=3D"text-sky-300 hover:=
underline" href=3D"http://127.0.0.1:5173/meetings/01KQAFB8DBF6E1E2FDEF0B75"=
 data-discover=3D"true">Aegis / Maplewood Goods - SOC 2 Prep Review</a></li=
></ul></section><section class=3D"rounded-xl border border-slate-800 bg-sla=
te-900/60 p-4 "><h2 class=3D"mb-3 text-sm font-semibold tracking-wide text-=
slate-300">Frostbyte AI =C2=B7 score 0.25</h2><p class=3D"mb-2 text-sm text=
-slate-300">Frostbyte AI: competitor mention. Latest call =E2=80=9CAegis / =
Frostbyte AI - Product Feedback=E2=80=9D (external). Sales + support should=
 share a single account plan.</p><div class=3D"mb-2 flex flex-wrap gap-1"><=
span class=3D"inline-flex rounded-full px-2 py-0.5 text-xs font-medium bg-r=
ose-500/15 text-rose-300">competitive</span><span class=3D"inline-flex roun=
ded-full px-2 py-0.5 text-xs font-medium bg-amber-500/15 text-amber-300">Ok=
ta</span><span class=3D"text-xs text-slate-500">customer sentiment 0.22</sp=
an></div><ul class=3D"space-y-1 text-sm"><li><span class=3D"inline-flex rou=
nded-full px-2 py-0.5 text-xs font-medium bg-sky-500/15 text-sky-300">exter=
nal</span> <a class=3D"text-sky-300 hover:underline" href=3D"http://127.0.0=
.1:5173/meetings/01KQC3A2EBC501837E973B16" data-discover=3D"true">Aegis / F=
rostbyte AI - Identity Module Setup</a></li><li><span class=3D"inline-flex =
rounded-full px-2 py-0.5 text-xs font-medium bg-sky-500/15 text-sky-300">ex=
ternal</span> <a class=3D"text-sky-300 hover:underline" href=3D"http://127.=
0.0.1:5173/meetings/01KQ65D43540846FA994B6C4" data-discover=3D"true">Aegis =
/ Frostbyte AI - Product Feedback</a></li></ul></section><section class=3D"=
rounded-xl border border-slate-800 bg-slate-900/60 p-4 "><h2 class=3D"mb-3 =
text-sm font-semibold tracking-wide text-slate-300">Atlas Precision =C2=B7 =
score 0.25</h2><p class=3D"mb-2 text-sm text-slate-300">Atlas Precision: co=
mpetitor mention. Latest call =E2=80=9CAegis / Atlas Precision - Annual Rev=
iew &amp; Renewal=E2=80=9D (external). Sales + support should share a singl=
e account plan.</p><div class=3D"mb-2 flex flex-wrap gap-1"><span class=3D"=
inline-flex rounded-full px-2 py-0.5 text-xs font-medium bg-rose-500/15 tex=
t-rose-300">competitive</span><span class=3D"inline-flex rounded-full px-2 =
py-0.5 text-xs font-medium bg-amber-500/15 text-amber-300">Sentinel</span><=
span class=3D"text-xs text-slate-500">customer sentiment 0.34</span></div><=
ul class=3D"space-y-1 text-sm"><li><span class=3D"inline-flex rounded-full =
px-2 py-0.5 text-xs font-medium bg-sky-500/15 text-sky-300">external</span>=
 <a class=3D"text-sky-300 hover:underline" href=3D"http://127.0.0.1:5173/me=
etings/01KQ1DC6CA536DE1B31ED8F5" data-discover=3D"true">Aegis / Atlas Preci=
sion - Contract Discussion</a></li><li><span class=3D"inline-flex rounded-f=
ull px-2 py-0.5 text-xs font-medium bg-sky-500/15 text-sky-300">external</s=
pan> <a class=3D"text-sky-300 hover:underline" href=3D"http://127.0.0.1:517=
3/meetings/01KQD199788883B6F18C81E8" data-discover=3D"true">Aegis / Atlas P=
recision - Annual Review &amp; Renewal</a></li></ul></section><section clas=
s=3D"rounded-xl border border-slate-800 bg-slate-900/60 p-4 "><h2 class=3D"=
mb-3 text-sm font-semibold tracking-wide text-slate-300">Pineridge Systems =
=C2=B7 score 0.25</h2><p class=3D"mb-2 text-sm text-slate-300">Pineridge Sy=
stems: competitor mention. Latest call =E2=80=9CAegis / Pineridge Systems -=
 Q1 Business Review=E2=80=9D (external). Sales + support should share a sin=
gle account plan.</p><div class=3D"mb-2 flex flex-wrap gap-1"><span class=
=3D"inline-flex rounded-full px-2 py-0.5 text-xs font-medium bg-rose-500/15=
 text-rose-300">competitive</span><span class=3D"inline-flex rounded-full p=
x-2 py-0.5 text-xs font-medium bg-amber-500/15 text-amber-300">Sentinel</sp=
an><span class=3D"text-xs text-slate-500">customer sentiment 0.96</span></d=
iv><ul class=3D"space-y-1 text-sm"><li><span class=3D"inline-flex rounded-f=
ull px-2 py-0.5 text-xs font-medium bg-sky-500/15 text-sky-300">external</s=
pan> <a class=3D"text-sky-300 hover:underline" href=3D"http://127.0.0.1:517=
3/meetings/01KQA502E222E2A60330237B" data-discover=3D"true">Aegis / Pinerid=
ge Systems - Q1 Business Review</a></li></ul></section><section class=3D"ro=
unded-xl border border-slate-800 bg-slate-900/60 p-4 "><h2 class=3D"mb-3 te=
xt-sm font-semibold tracking-wide text-slate-300">Pineridge Systems CloudPr=
ime S3 =C2=B7 score 0.25</h2><p class=3D"mb-2 text-sm text-slate-300">Piner=
idge Systems CloudPrime S3: competitor mention. Latest call =E2=80=9CSuppor=
t Case #2638 - Pineridge Systems CloudPrime S3 Backup Connector=E2=80=9D (s=
upport). Sales + support should share a single account plan.</p><div class=
=3D"mb-2 flex flex-wrap gap-1"><span class=3D"inline-flex rounded-full px-2=
 py-0.5 text-xs font-medium bg-rose-500/15 text-rose-300">competitive</span=
><span class=3D"inline-flex rounded-full px-2 py-0.5 text-xs font-medium bg=
-amber-500/15 text-amber-300">Cloudprime</span><span class=3D"text-xs text-=
slate-500">customer sentiment 0.18</span></div><ul class=3D"space-y-1 text-=
sm"><li><span class=3D"inline-flex rounded-full px-2 py-0.5 text-xs font-me=
dium bg-amber-500/15 text-amber-300">support</span> <a class=3D"text-sky-30=
0 hover:underline" href=3D"http://127.0.0.1:5173/meetings/01KQ3C837D7EF6894=
08DCF95" data-discover=3D"true">Support Case #2638 - Pineridge Systems Clou=
dPrime S3 Backup Connector</a></li></ul></section><section class=3D"rounded=
-xl border border-slate-800 bg-slate-900/60 p-4 "><h2 class=3D"mb-3 text-sm=
 font-semibold tracking-wide text-slate-300">Harborview Banking =C2=B7 scor=
e 0.25</h2><p class=3D"mb-2 text-sm text-slate-300">Harborview Banking: com=
petitor mention. Latest call =E2=80=9CAegis / Harborview Banking - Threat D=
etection Tuning=E2=80=9D (external). Sales + support should share a single =
account plan.</p><div class=3D"mb-2 flex flex-wrap gap-1"><span class=3D"in=
line-flex rounded-full px-2 py-0.5 text-xs font-medium bg-rose-500/15 text-=
rose-300">competitive</span><span class=3D"inline-flex rounded-full px-2 py=
-0.5 text-xs font-medium bg-amber-500/15 text-amber-300">Cloudprime</span><=
span class=3D"text-xs text-slate-500">customer sentiment -0.08</span></div>=
<ul class=3D"space-y-1 text-sm"><li><span class=3D"inline-flex rounded-full=
 px-2 py-0.5 text-xs font-medium bg-sky-500/15 text-sky-300">external</span=
> <a class=3D"text-sky-300 hover:underline" href=3D"http://127.0.0.1:5173/m=
eetings/01KQ41FB5CCFD9EA583FB020" data-discover=3D"true">Aegis / Harborview=
 Banking - Threat Detection Tuning</a></li></ul></section><section class=3D=
"rounded-xl border border-slate-800 bg-slate-900/60 p-4 "><h2 class=3D"mb-3=
 text-sm font-semibold tracking-wide text-slate-300">Stratos Cloud =C2=B7 s=
core 0.25</h2><p class=3D"mb-2 text-sm text-slate-300">Stratos Cloud: compe=
titor mention. Latest call =E2=80=9CAegis / Stratos Cloud - Audit Preparati=
on=E2=80=9D (external). Sales + support should share a single account plan.=
</p><div class=3D"mb-2 flex flex-wrap gap-1"><span class=3D"inline-flex rou=
nded-full px-2 py-0.5 text-xs font-medium bg-rose-500/15 text-rose-300">com=
petitive</span><span class=3D"inline-flex rounded-full px-2 py-0.5 text-xs =
font-medium bg-amber-500/15 text-amber-300">Cloudprime</span><span class=3D=
"text-xs text-slate-500">customer sentiment 0.54</span></div><ul class=3D"s=
pace-y-1 text-sm"><li><span class=3D"inline-flex rounded-full px-2 py-0.5 t=
ext-xs font-medium bg-sky-500/15 text-sky-300">external</span> <a class=3D"=
text-sky-300 hover:underline" href=3D"http://127.0.0.1:5173/meetings/01KQ2B=
4878EC7B3EE5547007" data-discover=3D"true">Aegis / Stratos Cloud - Audit Pr=
eparation</a></li></ul></section><section class=3D"rounded-xl border border=
-slate-800 bg-slate-900/60 p-4 "><h2 class=3D"mb-3 text-sm font-semibold tr=
acking-wide text-slate-300">Clearwater Medical =C2=B7 score 0.25</h2><p cla=
ss=3D"mb-2 text-sm text-slate-300">Clearwater Medical: competitor mention. =
Latest call =E2=80=9CAegis / Clearwater Medical - Comply v2 Deployment Kick=
off=E2=80=9D (external). Sales + support should share a single account plan=
.</p><div class=3D"mb-2 flex flex-wrap gap-1"><span class=3D"inline-flex ro=
unded-full px-2 py-0.5 text-xs font-medium bg-rose-500/15 text-rose-300">co=
mpetitive</span><span class=3D"inline-flex rounded-full px-2 py-0.5 text-xs=
 font-medium bg-amber-500/15 text-amber-300">Cloudprime</span><span class=
=3D"text-xs text-slate-500">customer sentiment 0.83</span></div><ul class=
=3D"space-y-1 text-sm"><li><span class=3D"inline-flex rounded-full px-2 py-=
0.5 text-xs font-medium bg-sky-500/15 text-sky-300">external</span> <a clas=
s=3D"text-sky-300 hover:underline" href=3D"http://127.0.0.1:5173/meetings/0=
1KQ4D01DCB15C69672AB5AF" data-discover=3D"true">Aegis / Clearwater Medical =
- Comply v2 Deployment Kickoff</a></li></ul></section><section class=3D"rou=
nded-xl border border-slate-800 bg-slate-900/60 p-4 "><h2 class=3D"mb-3 tex=
t-sm font-semibold tracking-wide text-slate-300">Nimbus Platform Custom Rep=
ort Request =C2=B7 score 0.20</h2><p class=3D"mb-2 text-sm text-slate-300">=
Nimbus Platform Custom Report Request: executive/urgent escalation. Latest =
call =E2=80=9CSupport Case #3615 - Nimbus Platform Custom Report Request=E2=
=80=9D (support). Sales + support should share a single account plan.</p><d=
iv class=3D"mb-2 flex flex-wrap gap-1"><span class=3D"inline-flex rounded-f=
ull px-2 py-0.5 text-xs font-medium bg-rose-500/15 text-rose-300">escalatio=
n</span><span class=3D"text-xs text-slate-500">customer sentiment 0.01</spa=
n></div><ul class=3D"space-y-1 text-sm"><li><span class=3D"inline-flex roun=
ded-full px-2 py-0.5 text-xs font-medium bg-amber-500/15 text-amber-300">su=
pport</span> <a class=3D"text-sky-300 hover:underline" href=3D"http://127.0=
.0.1:5173/meetings/01KQ9A6BE09D73A9BB5798C7" data-discover=3D"true">Support=
 Case #3615 - Nimbus Platform Custom Report Request</a></li></ul></section>=
<section class=3D"rounded-xl border border-slate-800 bg-slate-900/60 p-4 ">=
<h2 class=3D"mb-3 text-sm font-semibold tracking-wide text-slate-300">Bridg=
eport Health =C2=B7 score 0.10</h2><p class=3D"mb-2 text-sm text-slate-300"=
>Bridgeport Health: elevated composite score. Latest call =E2=80=9CAegis / =
Bridgeport Health - Renewal Finalization=E2=80=9D (external). Sales + suppo=
rt should share a single account plan.</p><div class=3D"mb-2 flex flex-wrap=
 gap-1"><span class=3D"inline-flex rounded-full px-2 py-0.5 text-xs font-me=
dium bg-rose-500/15 text-rose-300">compliance_pressure</span><span class=3D=
"text-xs text-slate-500">customer sentiment 0.62</span></div><ul class=3D"s=
pace-y-1 text-sm"><li><span class=3D"inline-flex rounded-full px-2 py-0.5 t=
ext-xs font-medium bg-sky-500/15 text-sky-300">external</span> <a class=3D"=
text-sky-300 hover:underline" href=3D"http://127.0.0.1:5173/meetings/01KQ85=
D10E82A26A8F754FB8" data-discover=3D"true">Aegis / Bridgeport Health - Comp=
liance Review</a></li><li><span class=3D"inline-flex rounded-full px-2 py-0=
.5 text-xs font-medium bg-sky-500/15 text-sky-300">external</span> <a class=
=3D"text-sky-300 hover:underline" href=3D"http://127.0.0.1:5173/meetings/01=
KQ4D71CDFB1045A2458216" data-discover=3D"true">Aegis / Bridgeport Health - =
Renewal Finalization</a></li></ul></section><section class=3D"rounded-xl bo=
rder border-slate-800 bg-slate-900/60 p-4 "><h2 class=3D"mb-3 text-sm font-=
semibold tracking-wide text-slate-300">Blackridge Investments Custom Compli=
ance Template =C2=B7 score 0.10</h2><p class=3D"mb-2 text-sm text-slate-300=
">Blackridge Investments Custom Compliance Template: elevated composite sco=
re. Latest call =E2=80=9CSupport Case #8811 - Blackridge Investments Custom=
 Compliance Template=E2=80=9D (support). Sales + support should share a sin=
gle account plan.</p><div class=3D"mb-2 flex flex-wrap gap-1"><span class=
=3D"inline-flex rounded-full px-2 py-0.5 text-xs font-medium bg-rose-500/15=
 text-rose-300">compliance_pressure</span><span class=3D"text-xs text-slate=
-500">customer sentiment 0.79</span></div><ul class=3D"space-y-1 text-sm"><=
li><span class=3D"inline-flex rounded-full px-2 py-0.5 text-xs font-medium =
bg-amber-500/15 text-amber-300">support</span> <a class=3D"text-sky-300 hov=
er:underline" href=3D"http://127.0.0.1:5173/meetings/01KQ92EA85FE4C53740022=
7D" data-discover=3D"true">Support Case #8811 - Blackridge Investments Cust=
om Compliance Template</a></li></ul></section><section class=3D"rounded-xl =
border border-slate-800 bg-slate-900/60 p-4 "><h2 class=3D"mb-3 text-sm fon=
t-semibold tracking-wide text-slate-300">Crestline Wealth =C2=B7 score 0.00=
</h2><p class=3D"mb-2 text-sm text-slate-300">Crestline Wealth: elevated co=
mposite score. Latest call =E2=80=9CAegis / Crestline Wealth - Identity Mod=
ule Deployment=E2=80=9D (external). Sales + support should share a single a=
ccount plan.</p><div class=3D"mb-2 flex flex-wrap gap-1"><span class=3D"tex=
t-xs text-slate-500">customer sentiment 0.29</span></div><ul class=3D"space=
-y-1 text-sm"><li><span class=3D"inline-flex rounded-full px-2 py-0.5 text-=
xs font-medium bg-sky-500/15 text-sky-300">external</span> <a class=3D"text=
-sky-300 hover:underline" href=3D"http://127.0.0.1:5173/meetings/01KQAEA504=
36D047BC39CFC7" data-discover=3D"true">Aegis / Crestline Wealth - Account R=
eview</a></li><li><span class=3D"inline-flex rounded-full px-2 py-0.5 text-=
xs font-medium bg-sky-500/15 text-sky-300">external</span> <a class=3D"text=
-sky-300 hover:underline" href=3D"http://127.0.0.1:5173/meetings/01KQ5AFAE8=
264DDC0ED2AE7F" data-discover=3D"true">Aegis / Crestline Wealth - Identity =
Module Deployment</a></li></ul></section><section class=3D"rounded-xl borde=
r border-slate-800 bg-slate-900/60 p-4 "><h2 class=3D"mb-3 text-sm font-sem=
ibold tracking-wide text-slate-300">Keystone Health =C2=B7 score 0.00</h2><=
p class=3D"mb-2 text-sm text-slate-300">Keystone Health: elevated composite=
 score. Latest call =E2=80=9CAegis / Keystone Health - Renewal Planning=E2=
=80=9D (external). Sales + support should share a single account plan.</p><=
div class=3D"mb-2 flex flex-wrap gap-1"><span class=3D"text-xs text-slate-5=
00">customer sentiment 0.76</span></div><ul class=3D"space-y-1 text-sm"><li=
><span class=3D"inline-flex rounded-full px-2 py-0.5 text-xs font-medium bg=
-sky-500/15 text-sky-300">external</span> <a class=3D"text-sky-300 hover:un=
derline" href=3D"http://127.0.0.1:5173/meetings/01KQD4D9DEBA2D55AC2AA9F5" d=
ata-discover=3D"true">Aegis / Keystone Health - Renewal Planning</a></li></=
ul></section><section class=3D"rounded-xl border border-slate-800 bg-slate-=
900/60 p-4 "><h2 class=3D"mb-3 text-sm font-semibold tracking-wide text-sla=
te-300">Nimbus Platform =C2=B7 score 0.00</h2><p class=3D"mb-2 text-sm text=
-slate-300">Nimbus Platform: elevated composite score. Latest call =E2=80=
=9CAegis / Nimbus Platform - Comply v2 Preview=E2=80=9D (external). Sales +=
 support should share a single account plan.</p><div class=3D"mb-2 flex fle=
x-wrap gap-1"><span class=3D"text-xs text-slate-500">customer sentiment 0.7=
8</span></div><ul class=3D"space-y-1 text-sm"><li><span class=3D"inline-fle=
x rounded-full px-2 py-0.5 text-xs font-medium bg-sky-500/15 text-sky-300">=
external</span> <a class=3D"text-sky-300 hover:underline" href=3D"http://12=
7.0.0.1:5173/meetings/01KQ54917E3931712516916D" data-discover=3D"true">Aegi=
s / Nimbus Platform - Comply v2 Preview</a></li></ul></section></div></main=
></div></div>
   =20
 =20

<span id=3D"recharts_measurement_span" aria-hidden=3D"true" style=3D"positi=
on: absolute; top: -20000px; left: 0px; padding: 0px; margin: 0px; border-w=
idth: medium; border-style: none; border-color: currentcolor; border-image:=
 none; white-space: pre; font-size: 16px; letter-spacing: normal;">-1</span=
></body></html>
------MultipartBoundary--rzwGfTQHfWYGD767wbxCCTq9KwccB874f1minM7i6m----
Content-Type: text/css
Content-Transfer-Encoding: quoted-printable
Content-Location: cid:css-efca99a4-85cd-4af1-a9c0-5e4c06ff44da@mhtml.blink

@charset "utf-8";

@layer properties;

@layer theme, base, components, utilities;

@layer theme {
  :root, :host { --font-sans: -apple-system, BlinkMacSystemFont, "Segoe UI"=
, Roboto, "Helvetica Neue",
      "Noto Sans", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji"=
,
      "Segoe UI Symbol", "Noto Color Emoji"; --font-mono: ui-monospace, SFM=
ono-Regular, Menlo, Monaco, Consolas, "Liberation Mono",
      "Courier New", monospace; --color-amber-300: oklch(87.9% 0.169 91.605=
); --color-amber-400: oklch(82.8% 0.189 84.429); --color-amber-500: oklch(7=
6.9% 0.188 70.08); --color-amber-700: oklch(55.5% 0.163 48.998); --color-em=
erald-300: oklch(84.5% 0.143 164.978); --color-emerald-400: oklch(76.5% 0.1=
77 163.223); --color-emerald-500: oklch(69.6% 0.17 162.48); --color-sky-300=
: oklch(82.8% 0.111 230.318); --color-sky-400: oklch(74.6% 0.16 232.661); -=
-color-sky-500: oklch(68.5% 0.169 237.323); --color-sky-700: oklch(50% 0.13=
4 242.749); --color-violet-300: oklch(81.1% 0.111 293.571); --color-violet-=
400: oklch(70.2% 0.183 293.541); --color-violet-500: oklch(60.6% 0.25 292.7=
17); --color-rose-300: oklch(81% 0.117 11.638); --color-rose-500: oklch(64.=
5% 0.246 16.439); --color-slate-100: oklch(96.8% 0.007 247.896); --color-sl=
ate-200: oklch(92.9% 0.013 255.508); --color-slate-300: oklch(86.9% 0.022 2=
52.894); --color-slate-400: oklch(70.4% 0.04 256.788); --color-slate-500: o=
klch(55.4% 0.046 257.417); --color-slate-800: oklch(27.9% 0.041 260.031); -=
-color-slate-900: oklch(20.8% 0.042 265.755); --color-slate-950: oklch(12.9=
% 0.042 264.695); --color-white: #fff; --spacing: 0.25rem; --container-3xl:=
 48rem; --container-7xl: 80rem; --text-xs: 0.75rem; --text-xs--line-height:=
 calc(1 / 0.75); --text-sm: 0.875rem; --text-sm--line-height: calc(1.25 / 0=
.875); --text-xl: 1.25rem; --text-xl--line-height: calc(1.75 / 1.25); --tex=
t-2xl: 1.5rem; --text-2xl--line-height: calc(2 / 1.5); --font-weight-medium=
: 500; --font-weight-semibold: 600; --tracking-tight: -0.025em; --tracking-=
wide: 0.025em; --radius-md: 0.375rem; --radius-lg: 0.5rem; --radius-xl: 0.7=
5rem; --default-font-family: var(--font-sans); --default-mono-font-family: =
var(--font-mono); }
}

@layer base {
  *, ::after, ::before, ::backdrop, ::file-selector-button { box-sizing: bo=
rder-box; margin: 0px; padding: 0px; border: 0px solid; }
  html, :host { line-height: 1.5; text-size-adjust: 100%; tab-size: 4; font=
-family: var(--default-font-family, -apple-system, BlinkMacSystemFont, "Seg=
oe UI", Roboto, "Helvetica Neue", "Noto Sans", Arial, sans-serif, "Apple Co=
lor Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"); font-=
feature-settings: var(--default-font-feature-settings, normal); font-variat=
ion-settings: var(--default-font-variation-settings, normal); -webkit-tap-h=
ighlight-color: transparent; }
  hr { height: 0px; color: inherit; border-top-width: 1px; }
  abbr:where([title]) { text-decoration: underline dotted; }
  h1, h2, h3, h4, h5, h6 { font-size: inherit; font-weight: inherit; }
  a { color: inherit; text-decoration: inherit; }
  b, strong { font-weight: bolder; }
  code, kbd, samp, pre { font-family: var(--default-mono-font-family, ui-mo=
nospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Couri=
er New", monospace); font-feature-settings: var(--default-mono-font-feature=
-settings, normal); font-variation-settings: var(--default-mono-font-variat=
ion-settings, normal); font-size: 1em; }
  small { font-size: 80%; }
  sub, sup { font-size: 75%; line-height: 0; position: relative; vertical-a=
lign: baseline; }
  sub { bottom: -0.25em; }
  sup { top: -0.5em; }
  table { text-indent: 0px; border-color: inherit; border-collapse: collaps=
e; }
  progress { vertical-align: baseline; }
  summary { display: list-item; }
  ol, ul, menu { list-style: none; }
  img, svg, video, canvas, audio, iframe, embed, object { display: block; v=
ertical-align: middle; }
  img, video { max-width: 100%; height: auto; }
  button, input, select, optgroup, textarea, ::file-selector-button { font:=
 inherit; letter-spacing: inherit; color: inherit; border-radius: 0px; back=
ground-color: transparent; opacity: 1; }
  :where(select:is([multiple], [size])) optgroup { font-weight: bolder; }
  :where(select:is([multiple], [size])) optgroup option { padding-inline-st=
art: 20px; }
  ::file-selector-button { margin-inline-end: 4px; }
  ::placeholder { opacity: 1; }
  @supports (not (-webkit-appearance: -apple-pay-button)) or (contain-intri=
nsic-size: 1px) {
  ::placeholder {
  color: currentcolor;
  @supports (color: color-mix(in lab, red, red)) {
  color: color-mix(currentcolor, transparent);
}
}
}
  textarea { resize: vertical; }
  ::-webkit-search-decoration { appearance: none; }
  ::-webkit-date-and-time-value { min-height: 1lh; text-align: inherit; }
  ::-webkit-datetime-edit { display: inline-flex; }
  ::-webkit-datetime-edit-fields-wrapper { padding: 0px; }
  ::-webkit-datetime-edit, ::-webkit-datetime-edit-year-field, ::-webkit-da=
tetime-edit-month-field, ::-webkit-datetime-edit-day-field, ::-webkit-datet=
ime-edit-hour-field, ::-webkit-datetime-edit-minute-field, ::-webkit-dateti=
me-edit-second-field, ::-webkit-datetime-edit-millisecond-field, ::-webkit-=
datetime-edit-meridiem-field { padding-block: 0px; }
  ::-webkit-calendar-picker-indicator { line-height: 1; }
  button, input:where([type=3D"button"], [type=3D"reset"], [type=3D"submit"=
]), ::file-selector-button { appearance: button; }
  ::-webkit-inner-spin-button, ::-webkit-outer-spin-button { height: auto; =
}
  [hidden]:where(:not([hidden=3D"until-found"])) { display: none !important=
; }
}

@layer utilities {
  .sticky { position: sticky; }
  .top-0 { top: 0px; }
  .z-20 { z-index: 20; }
  .float-right { float: right; }
  .mx-auto { margin-inline: auto; }
  .mt-1 { margin-top: var(--spacing); }
  .mt-3 { margin-top: calc(var(--spacing) * 3); }
  .mr-1 { margin-right: var(--spacing); }
  .mb-1 { margin-bottom: var(--spacing); }
  .mb-2 { margin-bottom: calc(var(--spacing) * 2); }
  .mb-3 { margin-bottom: calc(var(--spacing) * 3); }
  .ml-1 { margin-left: var(--spacing); }
  .ml-auto { margin-left: auto; }
  .flex { display: flex; }
  .grid { display: grid; }
  .inline-block { display: inline-block; }
  .inline-flex { display: inline-flex; }
  .h-2 { height: calc(var(--spacing) * 2); }
  .h-64 { height: calc(var(--spacing) * 64); }
  .h-80 { height: calc(var(--spacing) * 80); }
  .h-\[640px\] { height: 640px; }
  .min-h-screen { min-height: 100vh; }
  .w-2 { width: calc(var(--spacing) * 2); }
  .w-full { width: 100%; }
  .max-w-3xl { max-width: var(--container-3xl); }
  .max-w-7xl { max-width: var(--container-7xl); }
  .transform { transform: var(--tw-rotate-x,) var(--tw-rotate-y,) var(--tw-=
rotate-z,) var(--tw-skew-x,) var(--tw-skew-y,); }
  .list-disc { list-style-type: disc; }
  .grid-cols-2 { grid-template-columns: repeat(2, minmax(0px, 1fr)); }
  .flex-wrap { flex-wrap: wrap; }
  .items-center { align-items: center; }
  .gap-1 { gap: var(--spacing); }
  .gap-2 { gap: calc(var(--spacing) * 2); }
  .gap-3 { gap: calc(var(--spacing) * 3); }
  .gap-4 { gap: calc(var(--spacing) * 4); }
  .gap-6 { gap: calc(var(--spacing) * 6); }
  :where(.space-y-1 > :not(:last-child)) { --tw-space-y-reverse: 0; margin-=
block-start: calc(var(--spacing) * var(--tw-space-y-reverse)); margin-block=
-end: calc(var(--spacing) * calc(1 - var(--tw-space-y-reverse))); }
  :where(.space-y-2 > :not(:last-child)) { --tw-space-y-reverse: 0; margin-=
block-start: calc(calc(var(--spacing) * 2) * var(--tw-space-y-reverse)); ma=
rgin-block-end: calc(calc(var(--spacing) * 2) * calc(1 - var(--tw-space-y-r=
everse))); }
  :where(.space-y-3 > :not(:last-child)) { --tw-space-y-reverse: 0; margin-=
block-start: calc(calc(var(--spacing) * 3) * var(--tw-space-y-reverse)); ma=
rgin-block-end: calc(calc(var(--spacing) * 3) * calc(1 - var(--tw-space-y-r=
everse))); }
  :where(.space-y-4 > :not(:last-child)) { --tw-space-y-reverse: 0; margin-=
block-start: calc(calc(var(--spacing) * 4) * var(--tw-space-y-reverse)); ma=
rgin-block-end: calc(calc(var(--spacing) * 4) * calc(1 - var(--tw-space-y-r=
everse))); }
  :where(.space-y-6 > :not(:last-child)) { --tw-space-y-reverse: 0; margin-=
block-start: calc(calc(var(--spacing) * 6) * var(--tw-space-y-reverse)); ma=
rgin-block-end: calc(calc(var(--spacing) * 6) * calc(1 - var(--tw-space-y-r=
everse))); }
  :where(.space-x-1 > :not(:last-child)) { --tw-space-x-reverse: 0; margin-=
inline-start: calc(var(--spacing) * var(--tw-space-x-reverse)); margin-inli=
ne-end: calc(var(--spacing) * calc(1 - var(--tw-space-x-reverse))); }
  .overflow-hidden { overflow: hidden; }
  .overflow-x-auto { overflow-x: auto; }
  .rounded { border-radius: 0.25rem; }
  .rounded-full { border-radius: calc(infinity * 1px); }
  .rounded-lg { border-radius: var(--radius-lg); }
  .rounded-md { border-radius: var(--radius-md); }
  .rounded-xl { border-radius: var(--radius-xl); }
  .border { border-style: var(--tw-border-style); border-width: 1px; }
  .border-t { border-top-style: var(--tw-border-style); border-top-width: 1=
px; }
  .border-b { border-bottom-style: var(--tw-border-style); border-bottom-wi=
dth: 1px; }
  .border-l-2 { border-left-style: var(--tw-border-style); border-left-widt=
h: 2px; }
  .border-amber-700 { border-color: var(--color-amber-700); }
  .border-sky-700 { border-color: var(--color-sky-700); }
  .border-slate-800 { border-color: var(--color-slate-800); }
  .bg-amber-400 { background-color: var(--color-amber-400); }
  .bg-amber-500\/15 {
  background-color: color-mix(in srgb, oklch(0.769 0.188 70.08) 15%, transp=
arent 85%);
  @supports (color: color-mix(in lab, red, red)) {
  background-color: color-mix(in oklab, var(--color-amber-500) 15%, transpa=
rent);
}
}
  .bg-emerald-400 { background-color: var(--color-emerald-400); }
  .bg-emerald-500\/15 {
  background-color: color-mix(in srgb, oklch(0.696 0.17 162.48) 15%, transp=
arent 85%);
  @supports (color: color-mix(in lab, red, red)) {
  background-color: color-mix(in oklab, var(--color-emerald-500) 15%, trans=
parent);
}
}
  .bg-rose-500\/15 {
  background-color: color-mix(in srgb, oklch(0.645 0.246 16.439) 15%, trans=
parent 85%);
  @supports (color: color-mix(in lab, red, red)) {
  background-color: color-mix(in oklab, var(--color-rose-500) 15%, transpar=
ent);
}
}
  .bg-sky-400 { background-color: var(--color-sky-400); }
  .bg-sky-500\/15 {
  background-color: color-mix(in srgb, oklch(0.685 0.169 237.323) 15%, tran=
sparent 85%);
  @supports (color: color-mix(in lab, red, red)) {
  background-color: color-mix(in oklab, var(--color-sky-500) 15%, transpare=
nt);
}
}
  .bg-slate-800 { background-color: var(--color-slate-800); }
  .bg-slate-900\/60 {
  background-color: color-mix(in srgb, oklch(0.208 0.042 265.755) 60%, tran=
sparent 40%);
  @supports (color: color-mix(in lab, red, red)) {
  background-color: color-mix(in oklab, var(--color-slate-900) 60%, transpa=
rent);
}
}
  .bg-slate-950 { background-color: var(--color-slate-950); }
  .bg-slate-950\/90 {
  background-color: color-mix(in srgb, oklch(0.129 0.042 264.695) 90%, tran=
sparent 10%);
  @supports (color: color-mix(in lab, red, red)) {
  background-color: color-mix(in oklab, var(--color-slate-950) 90%, transpa=
rent);
}
}
  .bg-violet-400 { background-color: var(--color-violet-400); }
  .bg-violet-500\/15 {
  background-color: color-mix(in srgb, oklch(0.606 0.25 292.717) 15%, trans=
parent 85%);
  @supports (color: color-mix(in lab, red, red)) {
  background-color: color-mix(in oklab, var(--color-violet-500) 15%, transp=
arent);
}
}
  .p-3 { padding: calc(var(--spacing) * 3); }
  .p-4 { padding: calc(var(--spacing) * 4); }
  .p-8 { padding: calc(var(--spacing) * 8); }
  .px-2 { padding-inline: calc(var(--spacing) * 2); }
  .px-3 { padding-inline: calc(var(--spacing) * 3); }
  .px-6 { padding-inline: calc(var(--spacing) * 6); }
  .py-0\.5 { padding-block: calc(var(--spacing) * 0.5); }
  .py-1 { padding-block: var(--spacing); }
  .py-1\.5 { padding-block: calc(var(--spacing) * 1.5); }
  .py-2 { padding-block: calc(var(--spacing) * 2); }
  .py-3 { padding-block: calc(var(--spacing) * 3); }
  .py-6 { padding-block: calc(var(--spacing) * 6); }
  .pl-3 { padding-left: calc(var(--spacing) * 3); }
  .pl-5 { padding-left: calc(var(--spacing) * 5); }
  .text-left { text-align: left; }
  .text-right { text-align: right; }
  .text-2xl { font-size: var(--text-2xl); line-height: var(--tw-leading, va=
r(--text-2xl--line-height)); }
  .text-sm { font-size: var(--text-sm); line-height: var(--tw-leading, var(=
--text-sm--line-height)); }
  .text-xl { font-size: var(--text-xl); line-height: var(--tw-leading, var(=
--text-xl--line-height)); }
  .text-xs { font-size: var(--text-xs); line-height: var(--tw-leading, var(=
--text-xs--line-height)); }
  .text-\[10px\] { font-size: 10px; }
  .font-medium { --tw-font-weight: var(--font-weight-medium); font-weight: =
var(--font-weight-medium); }
  .font-semibold { --tw-font-weight: var(--font-weight-semibold); font-weig=
ht: var(--font-weight-semibold); }
  .tracking-tight { --tw-tracking: var(--tracking-tight); letter-spacing: v=
ar(--tracking-tight); }
  .tracking-wide { --tw-tracking: var(--tracking-wide); letter-spacing: var=
(--tracking-wide); }
  .text-amber-300 { color: var(--color-amber-300); }
  .text-emerald-300 { color: var(--color-emerald-300); }
  .text-rose-300 { color: var(--color-rose-300); }
  .text-sky-300 { color: var(--color-sky-300); }
  .text-slate-100 { color: var(--color-slate-100); }
  .text-slate-200 { color: var(--color-slate-200); }
  .text-slate-300 { color: var(--color-slate-300); }
  .text-slate-400 { color: var(--color-slate-400); }
  .text-slate-500 { color: var(--color-slate-500); }
  .text-violet-300 { color: var(--color-violet-300); }
  .text-white { color: var(--color-white); }
  .capitalize { text-transform: capitalize; }
  .uppercase { text-transform: uppercase; }
  .italic { font-style: italic; }
  .filter { filter: var(--tw-blur,) var(--tw-brightness,) var(--tw-contrast=
,) var(--tw-grayscale,) var(--tw-hue-rotate,) var(--tw-invert,) var(--tw-sa=
turate,) var(--tw-sepia,) var(--tw-drop-shadow,); }
  .backdrop-blur { --tw-backdrop-blur: blur(8px); backdrop-filter: var(--tw=
-backdrop-blur,) var(--tw-backdrop-brightness,) var(--tw-backdrop-contrast,=
) var(--tw-backdrop-grayscale,) var(--tw-backdrop-hue-rotate,) var(--tw-bac=
kdrop-invert,) var(--tw-backdrop-opacity,) var(--tw-backdrop-saturate,) var=
(--tw-backdrop-sepia,); }
  @media (hover: hover) {
  .hover\:bg-slate-800\/60:hover { background-color: color-mix(in srgb, okl=
ch(0.279 0.041 260.031) 60%, transparent 40%); }
  @supports (color: color-mix(in lab, red, red)) {
  .hover\:bg-slate-800\/60:hover { background-color: color-mix(in oklab, va=
r(--color-slate-800) 60%, transparent); }
}
  .hover\:text-white:hover { color: var(--color-white); }
  .hover\:underline:hover { text-decoration-line: underline; }
}
  @media (width >=3D 48rem) {
  .md\:grid-cols-2 { grid-template-columns: repeat(2, minmax(0px, 1fr)); }
  .md\:grid-cols-3 { grid-template-columns: repeat(3, minmax(0px, 1fr)); }
  .md\:grid-cols-4 { grid-template-columns: repeat(4, minmax(0px, 1fr)); }
}
  @media (width >=3D 64rem) {
  .lg\:col-span-1 { grid-column: span 1 / span 1; }
  .lg\:col-span-2 { grid-column: span 2 / span 2; }
  .lg\:grid-cols-2 { grid-template-columns: repeat(2, minmax(0px, 1fr)); }
  .lg\:grid-cols-3 { grid-template-columns: repeat(3, minmax(0px, 1fr)); }
}
}

:root { color-scheme: dark; }

body { margin: 0px; min-height: 100vh; background: rgb(11, 18, 32); color: =
rgb(232, 238, 249); font-family: "IBM Plex Sans", "Segoe UI", system-ui, sa=
ns-serif; }

#root { min-height: 100vh; }

@property --tw-rotate-x { syntax: "*"; inherits: false; }

@property --tw-rotate-y { syntax: "*"; inherits: false; }

@property --tw-rotate-z { syntax: "*"; inherits: false; }

@property --tw-skew-x { syntax: "*"; inherits: false; }

@property --tw-skew-y { syntax: "*"; inherits: false; }

@property --tw-space-y-reverse { syntax: "*"; inherits: false; initial-valu=
e: 0; }

@property --tw-space-x-reverse { syntax: "*"; inherits: false; initial-valu=
e: 0; }

@property --tw-border-style { syntax: "*"; inherits: false; initial-value: =
solid; }

@property --tw-font-weight { syntax: "*"; inherits: false; }

@property --tw-tracking { syntax: "*"; inherits: false; }

@property --tw-blur { syntax: "*"; inherits: false; }

@property --tw-brightness { syntax: "*"; inherits: false; }

@property --tw-contrast { syntax: "*"; inherits: false; }

@property --tw-grayscale { syntax: "*"; inherits: false; }

@property --tw-hue-rotate { syntax: "*"; inherits: false; }

@property --tw-invert { syntax: "*"; inherits: false; }

@property --tw-opacity { syntax: "*"; inherits: false; }

@property --tw-saturate { syntax: "*"; inherits: false; }

@property --tw-sepia { syntax: "*"; inherits: false; }

@property --tw-drop-shadow { syntax: "*"; inherits: false; }

@property --tw-drop-shadow-color { syntax: "*"; inherits: false; }

@property --tw-drop-shadow-alpha { syntax: "<percentage>"; inherits: false;=
 initial-value: 100%; }

@property --tw-drop-shadow-size { syntax: "*"; inherits: false; }

@property --tw-backdrop-blur { syntax: "*"; inherits: false; }

@property --tw-backdrop-brightness { syntax: "*"; inherits: false; }

@property --tw-backdrop-contrast { syntax: "*"; inherits: false; }

@property --tw-backdrop-grayscale { syntax: "*"; inherits: false; }

@property --tw-backdrop-hue-rotate { syntax: "*"; inherits: false; }

@property --tw-backdrop-invert { syntax: "*"; inherits: false; }

@property --tw-backdrop-opacity { syntax: "*"; inherits: false; }

@property --tw-backdrop-saturate { syntax: "*"; inherits: false; }

@property --tw-backdrop-sepia { syntax: "*"; inherits: false; }

@layer properties {
  @supports ((-webkit-hyphens: none) and (not (margin-trim: inline))) or ((=
-moz-orient: inline) and (not (color:rgb(from red r g b)))) {
  *, ::before, ::after, ::backdrop { --tw-rotate-x: initial; --tw-rotate-y:=
 initial; --tw-rotate-z: initial; --tw-skew-x: initial; --tw-skew-y: initia=
l; --tw-space-y-reverse: 0; --tw-space-x-reverse: 0; --tw-border-style: sol=
id; --tw-font-weight: initial; --tw-tracking: initial; --tw-blur: initial; =
--tw-brightness: initial; --tw-contrast: initial; --tw-grayscale: initial; =
--tw-hue-rotate: initial; --tw-invert: initial; --tw-opacity: initial; --tw=
-saturate: initial; --tw-sepia: initial; --tw-drop-shadow: initial; --tw-dr=
op-shadow-color: initial; --tw-drop-shadow-alpha: 100%; --tw-drop-shadow-si=
ze: initial; --tw-backdrop-blur: initial; --tw-backdrop-brightness: initial=
; --tw-backdrop-contrast: initial; --tw-backdrop-grayscale: initial; --tw-b=
ackdrop-hue-rotate: initial; --tw-backdrop-invert: initial; --tw-backdrop-o=
pacity: initial; --tw-backdrop-saturate: initial; --tw-backdrop-sepia: init=
ial; }
}
}
------MultipartBoundary--rzwGfTQHfWYGD767wbxCCTq9KwccB874f1minM7i6m----
Content-Type: text/css
Content-Transfer-Encoding: quoted-printable
Content-Location: cid:css-41efe9be-5bea-4435-8174-5850c9132038@mhtml.blink

@charset "utf-8";

.force-graph-container canvas { display: block; user-select: none; outline:=
 none; -webkit-tap-highlight-color: transparent; }

.force-graph-container .clickable { cursor: pointer; }

.force-graph-container .grabbable { cursor: -webkit-grab; }

.force-graph-container .grabbable:active { cursor: -webkit-grabbing; }
------MultipartBoundary--rzwGfTQHfWYGD767wbxCCTq9KwccB874f1minM7i6m----
Content-Type: text/css
Content-Transfer-Encoding: quoted-printable
Content-Location: cid:css-c06f8b02-2b0b-4071-a280-c6d562342635@mhtml.blink

@charset "utf-8";

.float-tooltip-kap { position: absolute; width: max-content; max-width: max=
(50%, 150px); padding: 3px 5px; border-radius: 3px; font: 12px sans-serif; =
color: rgb(238, 238, 238); background: rgba(0, 0, 0, 0.6); pointer-events: =
none; }
------MultipartBoundary--rzwGfTQHfWYGD767wbxCCTq9KwccB874f1minM7i6m------
elligence5.mhtml…]()

Snapshot-Content-Location: http://127.0.0.1:5173/graph
Subject: Transcript Intelligence
Date: Tue, 27 Oct 2026 21:31:59 GMT
MIME-Version: 1.0
Content-Type: multipart/related;
	type="text/html";
	boundary="----MultipartBoundary--jJgtFTorXTSbeVJGBJ3dsxVDbY63FNoQh8FGBDgjoS----"


------MultipartBoundary--jJgtFTorXTSbeVJGBJ3dsxVDbY63FNoQh8FGBDgjoS----
Content-Type: text/html
Content-ID: <frame-62FD6B35AC4100AD4EEBB3AFCAB21246@mhtml.blink>
Content-Transfer-Encoding: quoted-printable
Content-Location: http://127.0.0.1:5173/graph

<!DOCTYPE html><html lang=3D"en"><head><meta http-equiv=3D"Content-Type" co=
ntent=3D"text/html; charset=3DUTF-8"><link rel=3D"stylesheet" type=3D"text/=
css" href=3D"cid:css-83baa6d8-9a6b-48ec-8d8e-e350a39357ae@mhtml.blink" /><l=
ink rel=3D"stylesheet" type=3D"text/css" href=3D"cid:css-76ed1bd9-50c5-426a=
-b75a-97d7a923412a@mhtml.blink" /><link rel=3D"stylesheet" type=3D"text/css=
" href=3D"cid:css-a3743187-b261-43be-a8d1-926d95256801@mhtml.blink" />
   =20

   =20

   =20
    <link rel=3D"icon" type=3D"image/svg+xml" href=3D"http://127.0.0.1:5173=
/favicon.svg">
    <meta name=3D"viewport" content=3D"width=3Ddevice-width, initial-scale=
=3D1.0">
    <title>Transcript Intelligence</title>
  </head>
  <body>
    <div id=3D"root"><div class=3D"min-h-screen"><header class=3D"sticky to=
p-0 z-20 border-b border-slate-800 bg-slate-950/90 backdrop-blur"><div clas=
s=3D"mx-auto flex max-w-7xl items-center gap-6 px-6 py-3"><div class=3D"fle=
x items-center gap-2 text-sky-300"><svg xmlns=3D"http://www.w3.org/2000/svg=
" width=3D"20" height=3D"20" viewBox=3D"0 0 24 24" fill=3D"none" stroke=3D"=
currentColor" stroke-width=3D"2" stroke-linecap=3D"round" stroke-linejoin=
=3D"round" class=3D"lucide lucide-audio-lines" aria-hidden=3D"true"><path d=
=3D"M2 10v3"></path><path d=3D"M6 6v11"></path><path d=3D"M10 3v18"></path>=
<path d=3D"M14 8v7"></path><path d=3D"M18 5v13"></path><path d=3D"M22 10v3"=
></path></svg><span class=3D"font-semibold tracking-tight text-slate-100">T=
ranscript Intelligence</span></div><nav class=3D"flex gap-1 text-sm"><a cla=
ss=3D"rounded-md px-3 py-1.5 text-slate-400 hover:text-white" href=3D"http:=
//127.0.0.1:5173/" data-discover=3D"true">Overview</a><a class=3D"rounded-m=
d px-3 py-1.5 text-slate-400 hover:text-white" href=3D"http://127.0.0.1:517=
3/themes" data-discover=3D"true">Themes</a><a class=3D"rounded-md px-3 py-1=
.5 text-slate-400 hover:text-white" href=3D"http://127.0.0.1:5173/sentiment=
" data-discover=3D"true">Sentiment</a><a class=3D"rounded-md px-3 py-1.5 bg=
-slate-800 text-white" href=3D"http://127.0.0.1:5173/graph" data-discover=
=3D"true" aria-current=3D"page">Issue graph</a><a class=3D"rounded-md px-3 =
py-1.5 text-slate-400 hover:text-white" href=3D"http://127.0.0.1:5173/accou=
nts" data-discover=3D"true">Risk radar</a></nav></div></header><main class=
=3D"mx-auto max-w-7xl px-6 py-6"><div class=3D"space-y-4"><div><h1 class=3D=
"text-2xl font-semibold">Cross-surface issue graph</h1><p class=3D"mt-1 tex=
t-sm text-slate-400">Edges labeled cross_surface connect the same theme acr=
oss support, external, and internal calls. That is the Detect outage (and I=
dentity regressions) jumping org boundaries =E2=80=94 engineering war rooms=
 and customer tickets are one incident, not three separate programs.</p></d=
iv><section class=3D"rounded-xl border border-slate-800 bg-slate-900/60 p-4=
 "><div class=3D"mb-2 flex flex-wrap gap-3 text-xs text-slate-400"><span><i=
 class=3D"mr-1 inline-block h-2 w-2 rounded-full bg-amber-400"></i> support=
</span><span><i class=3D"mr-1 inline-block h-2 w-2 rounded-full bg-sky-400"=
></i> external</span><span><i class=3D"mr-1 inline-block h-2 w-2 rounded-fu=
ll bg-violet-400"></i> internal</span><span><i class=3D"mr-1 inline-block h=
-2 w-2 rounded-full bg-emerald-400"></i> theme</span><span>Click a meeting =
node to open the transcript record.</span></div><div class=3D"h-[640px] ove=
rflow-hidden rounded-lg bg-slate-950"><div><div class=3D"force-graph-contai=
ner" style=3D"position: relative;"><canvas width=3D"3456" height=3D"1800" s=
tyle=3D"background: rgb(2, 6, 23); width: 1728px; height: 900px;"></canvas>=
<div class=3D"float-tooltip-kap" style=3D"left: -10000px; display: none;"><=
/div></div></div></div></section></div></main></div></div>
   =20
 =20

<span id=3D"recharts_measurement_span" aria-hidden=3D"true" style=3D"positi=
on: absolute; top: -20000px; left: 0px; padding: 0px; margin: 0px; border-w=
idth: medium; border-style: none; border-color: currentcolor; border-image:=
 none; white-space: pre; font-size: 16px; letter-spacing: normal;">-1</span=
></body></html>
------MultipartBoundary--jJgtFTorXTSbeVJGBJ3dsxVDbY63FNoQh8FGBDgjoS----
Content-Type: text/css
Content-Transfer-Encoding: quoted-printable
Content-Location: cid:css-a3743187-b261-43be-a8d1-926d95256801@mhtml.blink

@charset "utf-8";

@layer properties;

@layer theme, base, components, utilities;

@layer theme {
  :root, :host { --font-sans: -apple-system, BlinkMacSystemFont, "Segoe UI"=
, Roboto, "Helvetica Neue",
      "Noto Sans", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji"=
,
      "Segoe UI Symbol", "Noto Color Emoji"; --font-mono: ui-monospace, SFM=
ono-Regular, Menlo, Monaco, Consolas, "Liberation Mono",
      "Courier New", monospace; --color-amber-300: oklch(87.9% 0.169 91.605=
); --color-amber-400: oklch(82.8% 0.189 84.429); --color-amber-500: oklch(7=
6.9% 0.188 70.08); --color-amber-700: oklch(55.5% 0.163 48.998); --color-em=
erald-300: oklch(84.5% 0.143 164.978); --color-emerald-400: oklch(76.5% 0.1=
77 163.223); --color-emerald-500: oklch(69.6% 0.17 162.48); --color-sky-300=
: oklch(82.8% 0.111 230.318); --color-sky-400: oklch(74.6% 0.16 232.661); -=
-color-sky-500: oklch(68.5% 0.169 237.323); --color-sky-700: oklch(50% 0.13=
4 242.749); --color-violet-300: oklch(81.1% 0.111 293.571); --color-violet-=
400: oklch(70.2% 0.183 293.541); --color-violet-500: oklch(60.6% 0.25 292.7=
17); --color-rose-300: oklch(81% 0.117 11.638); --color-rose-500: oklch(64.=
5% 0.246 16.439); --color-slate-100: oklch(96.8% 0.007 247.896); --color-sl=
ate-200: oklch(92.9% 0.013 255.508); --color-slate-300: oklch(86.9% 0.022 2=
52.894); --color-slate-400: oklch(70.4% 0.04 256.788); --color-slate-500: o=
klch(55.4% 0.046 257.417); --color-slate-800: oklch(27.9% 0.041 260.031); -=
-color-slate-900: oklch(20.8% 0.042 265.755); --color-slate-950: oklch(12.9=
% 0.042 264.695); --color-white: #fff; --spacing: 0.25rem; --container-3xl:=
 48rem; --container-7xl: 80rem; --text-xs: 0.75rem; --text-xs--line-height:=
 calc(1 / 0.75); --text-sm: 0.875rem; --text-sm--line-height: calc(1.25 / 0=
.875); --text-xl: 1.25rem; --text-xl--line-height: calc(1.75 / 1.25); --tex=
t-2xl: 1.5rem; --text-2xl--line-height: calc(2 / 1.5); --font-weight-medium=
: 500; --font-weight-semibold: 600; --tracking-tight: -0.025em; --tracking-=
wide: 0.025em; --radius-md: 0.375rem; --radius-lg: 0.5rem; --radius-xl: 0.7=
5rem; --default-font-family: var(--font-sans); --default-mono-font-family: =
var(--font-mono); }
}

@layer base {
  *, ::after, ::before, ::backdrop, ::file-selector-button { box-sizing: bo=
rder-box; margin: 0px; padding: 0px; border: 0px solid; }
  html, :host { line-height: 1.5; text-size-adjust: 100%; tab-size: 4; font=
-family: var(--default-font-family, -apple-system, BlinkMacSystemFont, "Seg=
oe UI", Roboto, "Helvetica Neue", "Noto Sans", Arial, sans-serif, "Apple Co=
lor Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"); font-=
feature-settings: var(--default-font-feature-settings, normal); font-variat=
ion-settings: var(--default-font-variation-settings, normal); -webkit-tap-h=
ighlight-color: transparent; }
  hr { height: 0px; color: inherit; border-top-width: 1px; }
  abbr:where([title]) { text-decoration: underline dotted; }
  h1, h2, h3, h4, h5, h6 { font-size: inherit; font-weight: inherit; }
  a { color: inherit; text-decoration: inherit; }
  b, strong { font-weight: bolder; }
  code, kbd, samp, pre { font-family: var(--default-mono-font-family, ui-mo=
nospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Couri=
er New", monospace); font-feature-settings: var(--default-mono-font-feature=
-settings, normal); font-variation-settings: var(--default-mono-font-variat=
ion-settings, normal); font-size: 1em; }
  small { font-size: 80%; }
  sub, sup { font-size: 75%; line-height: 0; position: relative; vertical-a=
lign: baseline; }
  sub { bottom: -0.25em; }
  sup { top: -0.5em; }
  table { text-indent: 0px; border-color: inherit; border-collapse: collaps=
e; }
  progress { vertical-align: baseline; }
  summary { display: list-item; }
  ol, ul, menu { list-style: none; }
  img, svg, video, canvas, audio, iframe, embed, object { display: block; v=
ertical-align: middle; }
  img, video { max-width: 100%; height: auto; }
  button, input, select, optgroup, textarea, ::file-selector-button { font:=
 inherit; letter-spacing: inherit; color: inherit; border-radius: 0px; back=
ground-color: transparent; opacity: 1; }
  :where(select:is([multiple], [size])) optgroup { font-weight: bolder; }
  :where(select:is([multiple], [size])) optgroup option { padding-inline-st=
art: 20px; }
  ::file-selector-button { margin-inline-end: 4px; }
  ::placeholder { opacity: 1; }
  @supports (not (-webkit-appearance: -apple-pay-button)) or (contain-intri=
nsic-size: 1px) {
  ::placeholder {
  color: currentcolor;
  @supports (color: color-mix(in lab, red, red)) {
  color: color-mix(currentcolor, transparent);
}
}
}
  textarea { resize: vertical; }
  ::-webkit-search-decoration { appearance: none; }
  ::-webkit-date-and-time-value { min-height: 1lh; text-align: inherit; }
  ::-webkit-datetime-edit { display: inline-flex; }
  ::-webkit-datetime-edit-fields-wrapper { padding: 0px; }
  ::-webkit-datetime-edit, ::-webkit-datetime-edit-year-field, ::-webkit-da=
tetime-edit-month-field, ::-webkit-datetime-edit-day-field, ::-webkit-datet=
ime-edit-hour-field, ::-webkit-datetime-edit-minute-field, ::-webkit-dateti=
me-edit-second-field, ::-webkit-datetime-edit-millisecond-field, ::-webkit-=
datetime-edit-meridiem-field { padding-block: 0px; }
  ::-webkit-calendar-picker-indicator { line-height: 1; }
  button, input:where([type=3D"button"], [type=3D"reset"], [type=3D"submit"=
]), ::file-selector-button { appearance: button; }
  ::-webkit-inner-spin-button, ::-webkit-outer-spin-button { height: auto; =
}
  [hidden]:where(:not([hidden=3D"until-found"])) { display: none !important=
; }
}

@layer utilities {
  .sticky { position: sticky; }
  .top-0 { top: 0px; }
  .z-20 { z-index: 20; }
  .float-right { float: right; }
  .mx-auto { margin-inline: auto; }
  .mt-1 { margin-top: var(--spacing); }
  .mt-3 { margin-top: calc(var(--spacing) * 3); }
  .mr-1 { margin-right: var(--spacing); }
  .mb-1 { margin-bottom: var(--spacing); }
  .mb-2 { margin-bottom: calc(var(--spacing) * 2); }
  .mb-3 { margin-bottom: calc(var(--spacing) * 3); }
  .ml-1 { margin-left: var(--spacing); }
  .ml-auto { margin-left: auto; }
  .flex { display: flex; }
  .grid { display: grid; }
  .inline-block { display: inline-block; }
  .inline-flex { display: inline-flex; }
  .h-2 { height: calc(var(--spacing) * 2); }
  .h-64 { height: calc(var(--spacing) * 64); }
  .h-80 { height: calc(var(--spacing) * 80); }
  .h-\[640px\] { height: 640px; }
  .min-h-screen { min-height: 100vh; }
  .w-2 { width: calc(var(--spacing) * 2); }
  .w-full { width: 100%; }
  .max-w-3xl { max-width: var(--container-3xl); }
  .max-w-7xl { max-width: var(--container-7xl); }
  .transform { transform: var(--tw-rotate-x,) var(--tw-rotate-y,) var(--tw-=
rotate-z,) var(--tw-skew-x,) var(--tw-skew-y,); }
  .list-disc { list-style-type: disc; }
  .grid-cols-2 { grid-template-columns: repeat(2, minmax(0px, 1fr)); }
  .flex-wrap { flex-wrap: wrap; }
  .items-center { align-items: center; }
  .gap-1 { gap: var(--spacing); }
  .gap-2 { gap: calc(var(--spacing) * 2); }
  .gap-3 { gap: calc(var(--spacing) * 3); }
  .gap-4 { gap: calc(var(--spacing) * 4); }
  .gap-6 { gap: calc(var(--spacing) * 6); }
  :where(.space-y-1 > :not(:last-child)) { --tw-space-y-reverse: 0; margin-=
block-start: calc(var(--spacing) * var(--tw-space-y-reverse)); margin-block=
-end: calc(var(--spacing) * calc(1 - var(--tw-space-y-reverse))); }
  :where(.space-y-2 > :not(:last-child)) { --tw-space-y-reverse: 0; margin-=
block-start: calc(calc(var(--spacing) * 2) * var(--tw-space-y-reverse)); ma=
rgin-block-end: calc(calc(var(--spacing) * 2) * calc(1 - var(--tw-space-y-r=
everse))); }
  :where(.space-y-3 > :not(:last-child)) { --tw-space-y-reverse: 0; margin-=
block-start: calc(calc(var(--spacing) * 3) * var(--tw-space-y-reverse)); ma=
rgin-block-end: calc(calc(var(--spacing) * 3) * calc(1 - var(--tw-space-y-r=
everse))); }
  :where(.space-y-4 > :not(:last-child)) { --tw-space-y-reverse: 0; margin-=
block-start: calc(calc(var(--spacing) * 4) * var(--tw-space-y-reverse)); ma=
rgin-block-end: calc(calc(var(--spacing) * 4) * calc(1 - var(--tw-space-y-r=
everse))); }
  :where(.space-y-6 > :not(:last-child)) { --tw-space-y-reverse: 0; margin-=
block-start: calc(calc(var(--spacing) * 6) * var(--tw-space-y-reverse)); ma=
rgin-block-end: calc(calc(var(--spacing) * 6) * calc(1 - var(--tw-space-y-r=
everse))); }
  :where(.space-x-1 > :not(:last-child)) { --tw-space-x-reverse: 0; margin-=
inline-start: calc(var(--spacing) * var(--tw-space-x-reverse)); margin-inli=
ne-end: calc(var(--spacing) * calc(1 - var(--tw-space-x-reverse))); }
  .overflow-hidden { overflow: hidden; }
  .overflow-x-auto { overflow-x: auto; }
  .rounded { border-radius: 0.25rem; }
  .rounded-full { border-radius: calc(infinity * 1px); }
  .rounded-lg { border-radius: var(--radius-lg); }
  .rounded-md { border-radius: var(--radius-md); }
  .rounded-xl { border-radius: var(--radius-xl); }
  .border { border-style: var(--tw-border-style); border-width: 1px; }
  .border-t { border-top-style: var(--tw-border-style); border-top-width: 1=
px; }
  .border-b { border-bottom-style: var(--tw-border-style); border-bottom-wi=
dth: 1px; }
  .border-l-2 { border-left-style: var(--tw-border-style); border-left-widt=
h: 2px; }
  .border-amber-700 { border-color: var(--color-amber-700); }
  .border-sky-700 { border-color: var(--color-sky-700); }
  .border-slate-800 { border-color: var(--color-slate-800); }
  .bg-amber-400 { background-color: var(--color-amber-400); }
  .bg-amber-500\/15 {
  background-color: color-mix(in srgb, oklch(0.769 0.188 70.08) 15%, transp=
arent 85%);
  @supports (color: color-mix(in lab, red, red)) {
  background-color: color-mix(in oklab, var(--color-amber-500) 15%, transpa=
rent);
}
}
  .bg-emerald-400 { background-color: var(--color-emerald-400); }
  .bg-emerald-500\/15 {
  background-color: color-mix(in srgb, oklch(0.696 0.17 162.48) 15%, transp=
arent 85%);
  @supports (color: color-mix(in lab, red, red)) {
  background-color: color-mix(in oklab, var(--color-emerald-500) 15%, trans=
parent);
}
}
  .bg-rose-500\/15 {
  background-color: color-mix(in srgb, oklch(0.645 0.246 16.439) 15%, trans=
parent 85%);
  @supports (color: color-mix(in lab, red, red)) {
  background-color: color-mix(in oklab, var(--color-rose-500) 15%, transpar=
ent);
}
}
  .bg-sky-400 { background-color: var(--color-sky-400); }
  .bg-sky-500\/15 {
  background-color: color-mix(in srgb, oklch(0.685 0.169 237.323) 15%, tran=
sparent 85%);
  @supports (color: color-mix(in lab, red, red)) {
  background-color: color-mix(in oklab, var(--color-sky-500) 15%, transpare=
nt);
}
}
  .bg-slate-800 { background-color: var(--color-slate-800); }
  .bg-slate-900\/60 {
  background-color: color-mix(in srgb, oklch(0.208 0.042 265.755) 60%, tran=
sparent 40%);
  @supports (color: color-mix(in lab, red, red)) {
  background-color: color-mix(in oklab, var(--color-slate-900) 60%, transpa=
rent);
}
}
  .bg-slate-950 { background-color: var(--color-slate-950); }
  .bg-slate-950\/90 {
  background-color: color-mix(in srgb, oklch(0.129 0.042 264.695) 90%, tran=
sparent 10%);
  @supports (color: color-mix(in lab, red, red)) {
  background-color: color-mix(in oklab, var(--color-slate-950) 90%, transpa=
rent);
}
}
  .bg-violet-400 { background-color: var(--color-violet-400); }
  .bg-violet-500\/15 {
  background-color: color-mix(in srgb, oklch(0.606 0.25 292.717) 15%, trans=
parent 85%);
  @supports (color: color-mix(in lab, red, red)) {
  background-color: color-mix(in oklab, var(--color-violet-500) 15%, transp=
arent);
}
}
  .p-3 { padding: calc(var(--spacing) * 3); }
  .p-4 { padding: calc(var(--spacing) * 4); }
  .p-8 { padding: calc(var(--spacing) * 8); }
  .px-2 { padding-inline: calc(var(--spacing) * 2); }
  .px-3 { padding-inline: calc(var(--spacing) * 3); }
  .px-6 { padding-inline: calc(var(--spacing) * 6); }
  .py-0\.5 { padding-block: calc(var(--spacing) * 0.5); }
  .py-1 { padding-block: var(--spacing); }
  .py-1\.5 { padding-block: calc(var(--spacing) * 1.5); }
  .py-2 { padding-block: calc(var(--spacing) * 2); }
  .py-3 { padding-block: calc(var(--spacing) * 3); }
  .py-6 { padding-block: calc(var(--spacing) * 6); }
  .pl-3 { padding-left: calc(var(--spacing) * 3); }
  .pl-5 { padding-left: calc(var(--spacing) * 5); }
  .text-left { text-align: left; }
  .text-right { text-align: right; }
  .text-2xl { font-size: var(--text-2xl); line-height: var(--tw-leading, va=
r(--text-2xl--line-height)); }
  .text-sm { font-size: var(--text-sm); line-height: var(--tw-leading, var(=
--text-sm--line-height)); }
  .text-xl { font-size: var(--text-xl); line-height: var(--tw-leading, var(=
--text-xl--line-height)); }
  .text-xs { font-size: var(--text-xs); line-height: var(--tw-leading, var(=
--text-xs--line-height)); }
  .text-\[10px\] { font-size: 10px; }
  .font-medium { --tw-font-weight: var(--font-weight-medium); font-weight: =
var(--font-weight-medium); }
  .font-semibold { --tw-font-weight: var(--font-weight-semibold); font-weig=
ht: var(--font-weight-semibold); }
  .tracking-tight { --tw-tracking: var(--tracking-tight); letter-spacing: v=
ar(--tracking-tight); }
  .tracking-wide { --tw-tracking: var(--tracking-wide); letter-spacing: var=
(--tracking-wide); }
  .text-amber-300 { color: var(--color-amber-300); }
  .text-emerald-300 { color: var(--color-emerald-300); }
  .text-rose-300 { color: var(--color-rose-300); }
  .text-sky-300 { color: var(--color-sky-300); }
  .text-slate-100 { color: var(--color-slate-100); }
  .text-slate-200 { color: var(--color-slate-200); }
  .text-slate-300 { color: var(--color-slate-300); }
  .text-slate-400 { color: var(--color-slate-400); }
  .text-slate-500 { color: var(--color-slate-500); }
  .text-violet-300 { color: var(--color-violet-300); }
  .text-white { color: var(--color-white); }
  .capitalize { text-transform: capitalize; }
  .uppercase { text-transform: uppercase; }
  .italic { font-style: italic; }
  .filter { filter: var(--tw-blur,) var(--tw-brightness,) var(--tw-contrast=
,) var(--tw-grayscale,) var(--tw-hue-rotate,) var(--tw-invert,) var(--tw-sa=
turate,) var(--tw-sepia,) var(--tw-drop-shadow,); }
  .backdrop-blur { --tw-backdrop-blur: blur(8px); backdrop-filter: var(--tw=
-backdrop-blur,) var(--tw-backdrop-brightness,) var(--tw-backdrop-contrast,=
) var(--tw-backdrop-grayscale,) var(--tw-backdrop-hue-rotate,) var(--tw-bac=
kdrop-invert,) var(--tw-backdrop-opacity,) var(--tw-backdrop-saturate,) var=
(--tw-backdrop-sepia,); }
  @media (hover: hover) {
  .hover\:bg-slate-800\/60:hover { background-color: color-mix(in srgb, okl=
ch(0.279 0.041 260.031) 60%, transparent 40%); }
  @supports (color: color-mix(in lab, red, red)) {
  .hover\:bg-slate-800\/60:hover { background-color: color-mix(in oklab, va=
r(--color-slate-800) 60%, transparent); }
}
  .hover\:text-white:hover { color: var(--color-white); }
  .hover\:underline:hover { text-decoration-line: underline; }
}
  @media (width >=3D 48rem) {
  .md\:grid-cols-2 { grid-template-columns: repeat(2, minmax(0px, 1fr)); }
  .md\:grid-cols-3 { grid-template-columns: repeat(3, minmax(0px, 1fr)); }
  .md\:grid-cols-4 { grid-template-columns: repeat(4, minmax(0px, 1fr)); }
}
  @media (width >=3D 64rem) {
  .lg\:col-span-1 { grid-column: span 1 / span 1; }
  .lg\:col-span-2 { grid-column: span 2 / span 2; }
  .lg\:grid-cols-2 { grid-template-columns: repeat(2, minmax(0px, 1fr)); }
  .lg\:grid-cols-3 { grid-template-columns: repeat(3, minmax(0px, 1fr)); }
}
}

:root { color-scheme: dark; }

body { margin: 0px; min-height: 100vh; background: rgb(11, 18, 32); color: =
rgb(232, 238, 249); font-family: "IBM Plex Sans", "Segoe UI", system-ui, sa=
ns-serif; }

#root { min-height: 100vh; }

@property --tw-rotate-x { syntax: "*"; inherits: false; }

@property --tw-rotate-y { syntax: "*"; inherits: false; }

@property --tw-rotate-z { syntax: "*"; inherits: false; }

@property --tw-skew-x { syntax: "*"; inherits: false; }

@property --tw-skew-y { syntax: "*"; inherits: false; }

@property --tw-space-y-reverse { syntax: "*"; inherits: false; initial-valu=
e: 0; }

@property --tw-space-x-reverse { syntax: "*"; inherits: false; initial-valu=
e: 0; }

@property --tw-border-style { syntax: "*"; inherits: false; initial-value: =
solid; }

@property --tw-font-weight { syntax: "*"; inherits: false; }

@property --tw-tracking { syntax: "*"; inherits: false; }

@property --tw-blur { syntax: "*"; inherits: false; }

@property --tw-brightness { syntax: "*"; inherits: false; }

@property --tw-contrast { syntax: "*"; inherits: false; }

@property --tw-grayscale { syntax: "*"; inherits: false; }

@property --tw-hue-rotate { syntax: "*"; inherits: false; }

@property --tw-invert { syntax: "*"; inherits: false; }

@property --tw-opacity { syntax: "*"; inherits: false; }

@property --tw-saturate { syntax: "*"; inherits: false; }

@property --tw-sepia { syntax: "*"; inherits: false; }

@property --tw-drop-shadow { syntax: "*"; inherits: false; }

@property --tw-drop-shadow-color { syntax: "*"; inherits: false; }

@property --tw-drop-shadow-alpha { syntax: "<percentage>"; inherits: false;=
 initial-value: 100%; }

@property --tw-drop-shadow-size { syntax: "*"; inherits: false; }

@property --tw-backdrop-blur { syntax: "*"; inherits: false; }

@property --tw-backdrop-brightness { syntax: "*"; inherits: false; }

@property --tw-backdrop-contrast { syntax: "*"; inherits: false; }

@property --tw-backdrop-grayscale { syntax: "*"; inherits: false; }

@property --tw-backdrop-hue-rotate { syntax: "*"; inherits: false; }

@property --tw-backdrop-invert { syntax: "*"; inherits: false; }

@property --tw-backdrop-opacity { syntax: "*"; inherits: false; }

@property --tw-backdrop-saturate { syntax: "*"; inherits: false; }

@property --tw-backdrop-sepia { syntax: "*"; inherits: false; }

@layer properties {
  @supports ((-webkit-hyphens: none) and (not (margin-trim: inline))) or ((=
-moz-orient: inline) and (not (color:rgb(from red r g b)))) {
  *, ::before, ::after, ::backdrop { --tw-rotate-x: initial; --tw-rotate-y:=
 initial; --tw-rotate-z: initial; --tw-skew-x: initial; --tw-skew-y: initia=
l; --tw-space-y-reverse: 0; --tw-space-x-reverse: 0; --tw-border-style: sol=
id; --tw-font-weight: initial; --tw-tracking: initial; --tw-blur: initial; =
--tw-brightness: initial; --tw-contrast: initial; --tw-grayscale: initial; =
--tw-hue-rotate: initial; --tw-invert: initial; --tw-opacity: initial; --tw=
-saturate: initial; --tw-sepia: initial; --tw-drop-shadow: initial; --tw-dr=
op-shadow-color: initial; --tw-drop-shadow-alpha: 100%; --tw-drop-shadow-si=
ze: initial; --tw-backdrop-blur: initial; --tw-backdrop-brightness: initial=
; --tw-backdrop-contrast: initial; --tw-backdrop-grayscale: initial; --tw-b=
ackdrop-hue-rotate: initial; --tw-backdrop-invert: initial; --tw-backdrop-o=
pacity: initial; --tw-backdrop-saturate: initial; --tw-backdrop-sepia: init=
ial; }
}
}
------MultipartBoundary--jJgtFTorXTSbeVJGBJ3dsxVDbY63FNoQh8FGBDgjoS----
Content-Type: text/css
Content-Transfer-Encoding: quoted-printable
Content-Location: cid:css-76ed1bd9-50c5-426a-b75a-97d7a923412a@mhtml.blink

@charset "utf-8";

.force-graph-container canvas { display: block; user-select: none; outline:=
 none; -webkit-tap-highlight-color: transparent; }

.force-graph-container .clickable { cursor: pointer; }

.force-graph-container .grabbable { cursor: -webkit-grab; }

.force-graph-container .grabbable:active { cursor: -webkit-grabbing; }
------MultipartBoundary--jJgtFTorXTSbeVJGBJ3dsxVDbY63FNoQh8FGBDgjoS----
Content-Type: text/css
Content-Transfer-Encoding: quoted-printable
Content-Location: cid:css-83baa6d8-9a6b-48ec-8d8e-e350a39357ae@mhtml.blink

@charset "utf-8";

.float-tooltip-kap { position: absolute; width: max-content; max-width: max=
(50%, 150px); padding: 3px 5px; border-radius: 3px; font: 12px sans-serif; =
color: rgb(238, 238, 238); background: rgba(0, 0, 0, 0.6); pointer-events: =
none; }
------MultipartBoundary--jJgtFTorXTSbeVJGBJ3dsxVDbY63FNoQh8FGBDgjoS------
ript Intelligence4.mhtml…]()

Snapshot-Content-Location: http://127.0.0.1:5173/sentiment
Subject: Transcript Intelligence
Date: Tue, 27 Oct 2026 21:31:48 GMT
MIME-Version: 1.0
Content-Type: multipart/related;
	type="text/html";
	boundary="----MultipartBoundary--Y1GfPOTrIxtZ4vb6GFlum3ucfXEanGTcg0egN0Vme4----"


------MultipartBoundary--Y1GfPOTrIxtZ4vb6GFlum3ucfXEanGTcg0egN0Vme4----
Content-Type: text/html
Content-ID: <frame-62FD6B35AC4100AD4EEBB3AFCAB21246@mhtml.blink>
Content-Transfer-Encoding: quoted-printable
Content-Location: http://127.0.0.1:5173/sentiment

<!DOCTYPE html><html lang=3D"en"><head><meta http-equiv=3D"Content-Type" co=
ntent=3D"text/html; charset=3DUTF-8"><link rel=3D"stylesheet" type=3D"text/=
css" href=3D"cid:css-61fe4a01-505c-43db-87a0-fa72e0f801b1@mhtml.blink" /><l=
ink rel=3D"stylesheet" type=3D"text/css" href=3D"cid:css-f76cf059-be18-49e9=
-997b-1fa337bf382c@mhtml.blink" /><link rel=3D"stylesheet" type=3D"text/css=
" href=3D"cid:css-05524a7d-3065-4981-b345-db2710f35c6c@mhtml.blink" />
   =20

   =20

   =20
    <link rel=3D"icon" type=3D"image/svg+xml" href=3D"http://127.0.0.1:5173=
/favicon.svg">
    <meta name=3D"viewport" content=3D"width=3Ddevice-width, initial-scale=
=3D1.0">
    <title>Transcript Intelligence</title>
  </head>
  <body>
    <div id=3D"root"><div class=3D"min-h-screen"><header class=3D"sticky to=
p-0 z-20 border-b border-slate-800 bg-slate-950/90 backdrop-blur"><div clas=
s=3D"mx-auto flex max-w-7xl items-center gap-6 px-6 py-3"><div class=3D"fle=
x items-center gap-2 text-sky-300"><svg xmlns=3D"http://www.w3.org/2000/svg=
" width=3D"20" height=3D"20" viewBox=3D"0 0 24 24" fill=3D"none" stroke=3D"=
currentColor" stroke-width=3D"2" stroke-linecap=3D"round" stroke-linejoin=
=3D"round" class=3D"lucide lucide-audio-lines" aria-hidden=3D"true"><path d=
=3D"M2 10v3"></path><path d=3D"M6 6v11"></path><path d=3D"M10 3v18"></path>=
<path d=3D"M14 8v7"></path><path d=3D"M18 5v13"></path><path d=3D"M22 10v3"=
></path></svg><span class=3D"font-semibold tracking-tight text-slate-100">T=
ranscript Intelligence</span></div><nav class=3D"flex gap-1 text-sm"><a cla=
ss=3D"rounded-md px-3 py-1.5 text-slate-400 hover:text-white" href=3D"http:=
//127.0.0.1:5173/" data-discover=3D"true">Overview</a><a class=3D"rounded-m=
d px-3 py-1.5 text-slate-400 hover:text-white" href=3D"http://127.0.0.1:517=
3/themes" data-discover=3D"true">Themes</a><a class=3D"rounded-md px-3 py-1=
.5 bg-slate-800 text-white" href=3D"http://127.0.0.1:5173/sentiment" data-d=
iscover=3D"true" aria-current=3D"page">Sentiment</a><a class=3D"rounded-md =
px-3 py-1.5 text-slate-400 hover:text-white" href=3D"http://127.0.0.1:5173/=
graph" data-discover=3D"true">Issue graph</a><a class=3D"rounded-md px-3 py=
-1.5 text-slate-400 hover:text-white" href=3D"http://127.0.0.1:5173/account=
s" data-discover=3D"true">Risk radar</a></nav></div></header><main class=3D=
"mx-auto max-w-7xl px-6 py-6"><div class=3D"space-y-6"><div><h1 class=3D"te=
xt-2xl font-semibold">Sentiment</h1><p class=3D"mt-1 text-sm text-slate-400=
">Not the vendor summary score. Duration-weighted utterance polarity, custo=
mer-side on support and external calls, so Aegis politeness does not hide t=
he ticket.</p></div><section class=3D"rounded-xl border border-slate-800 bg=
-slate-900/60 p-4 "><h2 class=3D"mb-3 text-sm font-semibold tracking-wide t=
ext-slate-300">Weekly customer polarity by call type</h2><div class=3D"h-80=
"><div class=3D"recharts-responsive-container" style=3D"width: 100%; height=
: 100%; min-width: 0px;"><div style=3D"width: 0px; height: 0px; overflow: v=
isible;"><div width=3D"1198" height=3D"320" class=3D"recharts-wrapper" styl=
e=3D"position: relative; cursor: default; width: 1198px; height: 320px;"><d=
iv xmlns=3D"http://www.w3.org/1999/xhtml" tabindex=3D"-1" class=3D"recharts=
-tooltip-wrapper recharts-tooltip-wrapper-right recharts-tooltip-wrapper-to=
p" style=3D"visibility: hidden; pointer-events: none; position: absolute; t=
op: 0px; left: 0px; transform: translate(1015px, 210px);"><div class=3D"rec=
harts-default-tooltip" role=3D"status" aria-live=3D"assertive" style=3D"mar=
gin: 0px; padding: 10px; background-color: rgb(255, 255, 255); border: 1px =
solid rgb(204, 204, 204); white-space: nowrap;"><p class=3D"recharts-toolti=
p-label" style=3D"margin: 0px;"></p></div></div><div class=3D"recharts-lege=
nd-wrapper" style=3D"position: absolute; width: 1188px; height: auto; left:=
 5px; bottom: 5px;"><ul class=3D"recharts-default-legend" style=3D"padding:=
 0px; margin: 0px; text-align: center;"><li class=3D"recharts-legend-item l=
egend-item-0" style=3D"display: inline-block; margin-right: 10px; white-spa=
ce: nowrap;"><svg aria-label=3D"external legend icon" class=3D"recharts-sur=
face" width=3D"14" height=3D"14" viewBox=3D"0 0 32 32" style=3D"display: in=
line-block; vertical-align: middle; margin-right: 4px;"><title></title><des=
c></desc><path stroke-width=3D"4" fill=3D"none" stroke=3D"#38bdf8" d=3D"M0,=
16h10.666666666666666
            A5.333333333333333,5.333333333333333,0,1,1,21.333333333333332,1=
6
            H32M21.333333333333332,16
            A5.333333333333333,5.333333333333333,0,1,1,10.666666666666666,1=
6" class=3D"recharts-legend-icon"></path></svg><span class=3D"recharts-lege=
nd-item-text" style=3D"color: rgb(56, 189, 248); white-space: normal; overf=
low-wrap: break-word;">external</span></li><li class=3D"recharts-legend-ite=
m legend-item-1" style=3D"display: inline-block; margin-right: 10px; white-=
space: nowrap;"><svg aria-label=3D"internal legend icon" class=3D"recharts-=
surface" width=3D"14" height=3D"14" viewBox=3D"0 0 32 32" style=3D"display:=
 inline-block; vertical-align: middle; margin-right: 4px;"><title></title><=
desc></desc><path stroke-width=3D"4" fill=3D"none" stroke=3D"#a78bfa" d=3D"=
M0,16h10.666666666666666
            A5.333333333333333,5.333333333333333,0,1,1,21.333333333333332,1=
6
            H32M21.333333333333332,16
            A5.333333333333333,5.333333333333333,0,1,1,10.666666666666666,1=
6" class=3D"recharts-legend-icon"></path></svg><span class=3D"recharts-lege=
nd-item-text" style=3D"color: rgb(167, 139, 250); white-space: normal; over=
flow-wrap: break-word;">internal</span></li><li class=3D"recharts-legend-it=
em legend-item-2" style=3D"display: inline-block; margin-right: 10px; white=
-space: nowrap;"><svg aria-label=3D"support legend icon" class=3D"recharts-=
surface" width=3D"14" height=3D"14" viewBox=3D"0 0 32 32" style=3D"display:=
 inline-block; vertical-align: middle; margin-right: 4px;"><title></title><=
desc></desc><path stroke-width=3D"4" fill=3D"none" stroke=3D"#f59e0b" d=3D"=
M0,16h10.666666666666666
            A5.333333333333333,5.333333333333333,0,1,1,21.333333333333332,1=
6
            H32M21.333333333333332,16
            A5.333333333333333,5.333333333333333,0,1,1,10.666666666666666,1=
6" class=3D"recharts-legend-icon"></path></svg><span class=3D"recharts-lege=
nd-item-text" style=3D"color: rgb(245, 158, 11); white-space: normal; overf=
low-wrap: break-word;">support</span></li></ul></div><svg role=3D"applicati=
on" tabindex=3D"0" class=3D"recharts-surface" width=3D"1198" height=3D"320"=
 viewBox=3D"0 0 1198 320" style=3D"width: 100%; height: 100%; display: bloc=
k;"><title></title><desc></desc><g tabindex=3D"-1" class=3D"recharts-zIndex=
-layer_-100"><g class=3D"recharts-cartesian-grid"><g class=3D"recharts-cart=
esian-grid-horizontal"><line stroke=3D"#1e293b" x=3D"65" y=3D"5" width=3D"1=
128" height=3D"256" x1=3D"65" y1=3D"261" x2=3D"1193" y2=3D"261" fill=3D"non=
e"></line><line stroke=3D"#1e293b" x=3D"65" y=3D"5" width=3D"1128" height=
=3D"256" x1=3D"65" y1=3D"197" x2=3D"1193" y2=3D"197" fill=3D"none"></line><=
line stroke=3D"#1e293b" x=3D"65" y=3D"5" width=3D"1128" height=3D"256" x1=
=3D"65" y1=3D"133" x2=3D"1193" y2=3D"133" fill=3D"none"></line><line stroke=
=3D"#1e293b" x=3D"65" y=3D"5" width=3D"1128" height=3D"256" x1=3D"65" y1=3D=
"69" x2=3D"1193" y2=3D"69" fill=3D"none"></line><line stroke=3D"#1e293b" x=
=3D"65" y=3D"5" width=3D"1128" height=3D"256" x1=3D"65" y1=3D"5" x2=3D"1193=
" y2=3D"5" fill=3D"none"></line></g><g class=3D"recharts-cartesian-grid-ver=
tical"><line stroke=3D"#1e293b" x=3D"65" y=3D"5" width=3D"1128" height=3D"2=
56" x1=3D"65" y1=3D"5" x2=3D"65" y2=3D"261" fill=3D"none"></line><line stro=
ke=3D"#1e293b" x=3D"65" y=3D"5" width=3D"1128" height=3D"256" x1=3D"253" y1=
=3D"5" x2=3D"253" y2=3D"261" fill=3D"none"></line><line stroke=3D"#1e293b" =
x=3D"65" y=3D"5" width=3D"1128" height=3D"256" x1=3D"441" y1=3D"5" x2=3D"44=
1" y2=3D"261" fill=3D"none"></line><line stroke=3D"#1e293b" x=3D"65" y=3D"5=
" width=3D"1128" height=3D"256" x1=3D"629" y1=3D"5" x2=3D"629" y2=3D"261" f=
ill=3D"none"></line><line stroke=3D"#1e293b" x=3D"65" y=3D"5" width=3D"1128=
" height=3D"256" x1=3D"817" y1=3D"5" x2=3D"817" y2=3D"261" fill=3D"none"></=
line><line stroke=3D"#1e293b" x=3D"65" y=3D"5" width=3D"1128" height=3D"256=
" x1=3D"1005" y1=3D"5" x2=3D"1005" y2=3D"261" fill=3D"none"></line><line st=
roke=3D"#1e293b" x=3D"65" y=3D"5" width=3D"1128" height=3D"256" x1=3D"1193"=
 y1=3D"5" x2=3D"1193" y2=3D"261" fill=3D"none"></line></g></g></g><g tabind=
ex=3D"-1" class=3D"recharts-zIndex-layer_-50"></g><defs><clipPath id=3D"rec=
harts4634-clip"><rect x=3D"65" y=3D"5" height=3D"256" width=3D"1128"></rect=
></clipPath></defs><g tabindex=3D"-1" class=3D"recharts-zIndex-layer_100"><=
/g><g tabindex=3D"-1" class=3D"recharts-zIndex-layer_200"></g><g tabindex=
=3D"-1" class=3D"recharts-zIndex-layer_300"></g><g tabindex=3D"-1" class=3D=
"recharts-zIndex-layer_400"><g class=3D"recharts-layer recharts-line"><g cl=
ass=3D"recharts-layer recharts-shape"><path stroke=3D"#f59e0b" fill=3D"none=
" stroke-width=3D"1" id=3D"recharts-line-_r_b_" height=3D"256" width=3D"112=
8" class=3D"recharts-curve recharts-line-curve" d=3D"M65,170.158C96.333,172=
.189,127.667,174.22,159,182.344C190.333,190.468,221.667,228.142,253,228.142=
C284.333,228.142,315.667,194.909,347,176.558C378.333,158.207,409.667,118.03=
7,441,118.037C472.333,118.037,503.667,250.658,535,250.658C566.333,250.658,5=
97.667,186.555,629,186.555C660.333,186.555,691.667,191.765,723,191.765C754.=
333,191.765,785.667,54.152,817,54.152C848.333,54.152,879.667,201.71,911,201=
.71C942.333,201.71,973.667,171.865,1005,160.162C1036.333,148.458,1067.667,1=
31.49,1099,131.49C1130.333,131.49,1161.667,181.474,1193,231.458"></path></g=
></g><g class=3D"recharts-layer recharts-line"><g class=3D"recharts-layer r=
echarts-shape"><path stroke=3D"#38bdf8" fill=3D"none" stroke-width=3D"1" id=
=3D"recharts-line-_r_c_" height=3D"256" width=3D"1128" class=3D"recharts-cu=
rve recharts-line-curve" d=3D"M65,58.069C96.333,65.063,127.667,72.057,159,8=
4.488C190.333,96.919,221.667,132.654,253,132.654C284.333,132.654,315.667,10=
7.31,347,102.958C378.333,98.606,409.667,96.43,441,96.43C472.333,96.43,503.6=
67,116.234,535,135.035C566.333,153.836,597.667,209.237,629,209.237C660.333,=
209.237,691.667,195.528,723,168.11C754.333,140.693,785.667,38.728,817,38.72=
8C848.333,38.728,879.667,70.408,911,83.925C942.333,97.442,973.667,119.829,1=
005,119.829C1036.333,119.829,1067.667,97.418,1099,85.23C1130.333,73.043,116=
1.667,59.873,1193,46.702"></path></g></g><g class=3D"recharts-layer rechart=
s-line"><g class=3D"recharts-layer recharts-shape"><path stroke=3D"#a78bfa"=
 fill=3D"none" stroke-width=3D"1" id=3D"recharts-line-_r_d_" height=3D"256"=
 width=3D"1128" class=3D"recharts-curve recharts-line-curve" d=3D"M65,137.7=
62C96.333,117.576,127.667,97.39,159,97.39C190.333,97.39,221.667,131.566,253=
,131.566C284.333,131.566,315.667,105.621,347,105.621C378.333,105.621,409.66=
7,114.747,441,133C472.333,151.253,503.667,220.514,535,220.514C566.333,220.5=
14,597.667,177.685,629,163.822C660.333,149.96,691.667,154.995,723,137.339C7=
54.333,119.684,785.667,46.216,817,46.216C848.333,46.216,879.667,112.767,911=
,122.222C942.333,131.677,973.667,136.405,1005,136.405C1036.333,136.405,1067=
.667,120.398,1099,105.723C1130.333,91.048,1161.667,69.701,1193,48.354"></pa=
th></g></g></g><g tabindex=3D"-1" class=3D"recharts-zIndex-layer_500"><g cl=
ass=3D"recharts-layer recharts-cartesian-axis recharts-xAxis xAxis"><line a=
ngle=3D"0" height=3D"30" orientation=3D"bottom" x=3D"65" y=3D"261" width=3D=
"1128" class=3D"recharts-cartesian-axis-line" stroke=3D"#666" fill=3D"none"=
 x1=3D"65" y1=3D"261" x2=3D"1193" y2=3D"261"></line><g class=3D"recharts-ca=
rtesian-axis-ticks recharts-xAxis-ticks"><g class=3D"recharts-cartesian-axi=
s-tick-lines recharts-xAxis-tick-lines"><g class=3D"recharts-layer recharts=
-cartesian-axis-tick"><line angle=3D"0" height=3D"30" orientation=3D"bottom=
" x=3D"65" y=3D"261" width=3D"1128" class=3D"recharts-cartesian-axis-tick-l=
ine" stroke=3D"#666" fill=3D"none" x1=3D"65" y1=3D"267" x2=3D"65" y2=3D"261=
"></line></g><g class=3D"recharts-layer recharts-cartesian-axis-tick"><line=
 angle=3D"0" height=3D"30" orientation=3D"bottom" x=3D"65" y=3D"261" width=
=3D"1128" class=3D"recharts-cartesian-axis-tick-line" stroke=3D"#666" fill=
=3D"none" x1=3D"159" y1=3D"267" x2=3D"159" y2=3D"261"></line></g><g class=
=3D"recharts-layer recharts-cartesian-axis-tick"><line angle=3D"0" height=
=3D"30" orientation=3D"bottom" x=3D"65" y=3D"261" width=3D"1128" class=3D"r=
echarts-cartesian-axis-tick-line" stroke=3D"#666" fill=3D"none" x1=3D"253" =
y1=3D"267" x2=3D"253" y2=3D"261"></line></g><g class=3D"recharts-layer rech=
arts-cartesian-axis-tick"><line angle=3D"0" height=3D"30" orientation=3D"bo=
ttom" x=3D"65" y=3D"261" width=3D"1128" class=3D"recharts-cartesian-axis-ti=
ck-line" stroke=3D"#666" fill=3D"none" x1=3D"347" y1=3D"267" x2=3D"347" y2=
=3D"261"></line></g><g class=3D"recharts-layer recharts-cartesian-axis-tick=
"><line angle=3D"0" height=3D"30" orientation=3D"bottom" x=3D"65" y=3D"261"=
 width=3D"1128" class=3D"recharts-cartesian-axis-tick-line" stroke=3D"#666"=
 fill=3D"none" x1=3D"441" y1=3D"267" x2=3D"441" y2=3D"261"></line></g><g cl=
ass=3D"recharts-layer recharts-cartesian-axis-tick"><line angle=3D"0" heigh=
t=3D"30" orientation=3D"bottom" x=3D"65" y=3D"261" width=3D"1128" class=3D"=
recharts-cartesian-axis-tick-line" stroke=3D"#666" fill=3D"none" x1=3D"535"=
 y1=3D"267" x2=3D"535" y2=3D"261"></line></g><g class=3D"recharts-layer rec=
harts-cartesian-axis-tick"><line angle=3D"0" height=3D"30" orientation=3D"b=
ottom" x=3D"65" y=3D"261" width=3D"1128" class=3D"recharts-cartesian-axis-t=
ick-line" stroke=3D"#666" fill=3D"none" x1=3D"629" y1=3D"267" x2=3D"629" y2=
=3D"261"></line></g><g class=3D"recharts-layer recharts-cartesian-axis-tick=
"><line angle=3D"0" height=3D"30" orientation=3D"bottom" x=3D"65" y=3D"261"=
 width=3D"1128" class=3D"recharts-cartesian-axis-tick-line" stroke=3D"#666"=
 fill=3D"none" x1=3D"723" y1=3D"267" x2=3D"723" y2=3D"261"></line></g><g cl=
ass=3D"recharts-layer recharts-cartesian-axis-tick"><line angle=3D"0" heigh=
t=3D"30" orientation=3D"bottom" x=3D"65" y=3D"261" width=3D"1128" class=3D"=
recharts-cartesian-axis-tick-line" stroke=3D"#666" fill=3D"none" x1=3D"817"=
 y1=3D"267" x2=3D"817" y2=3D"261"></line></g><g class=3D"recharts-layer rec=
harts-cartesian-axis-tick"><line angle=3D"0" height=3D"30" orientation=3D"b=
ottom" x=3D"65" y=3D"261" width=3D"1128" class=3D"recharts-cartesian-axis-t=
ick-line" stroke=3D"#666" fill=3D"none" x1=3D"911" y1=3D"267" x2=3D"911" y2=
=3D"261"></line></g><g class=3D"recharts-layer recharts-cartesian-axis-tick=
"><line angle=3D"0" height=3D"30" orientation=3D"bottom" x=3D"65" y=3D"261"=
 width=3D"1128" class=3D"recharts-cartesian-axis-tick-line" stroke=3D"#666"=
 fill=3D"none" x1=3D"1005" y1=3D"267" x2=3D"1005" y2=3D"261"></line></g><g =
class=3D"recharts-layer recharts-cartesian-axis-tick"><line angle=3D"0" hei=
ght=3D"30" orientation=3D"bottom" x=3D"65" y=3D"261" width=3D"1128" class=
=3D"recharts-cartesian-axis-tick-line" stroke=3D"#666" fill=3D"none" x1=3D"=
1193" y1=3D"267" x2=3D"1193" y2=3D"261"></line></g></g></g></g><g class=3D"=
recharts-layer recharts-cartesian-axis recharts-yAxis yAxis"><line angle=3D=
"0" orientation=3D"left" width=3D"60" x=3D"5" y=3D"5" height=3D"256" class=
=3D"recharts-cartesian-axis-line" stroke=3D"#666" fill=3D"none" x1=3D"65" y=
1=3D"5" x2=3D"65" y2=3D"261"></line><g class=3D"recharts-cartesian-axis-tic=
ks recharts-yAxis-ticks"><g class=3D"recharts-cartesian-axis-tick-lines rec=
harts-yAxis-tick-lines"><g class=3D"recharts-layer recharts-cartesian-axis-=
tick"><line angle=3D"0" orientation=3D"left" width=3D"60" x=3D"5" y=3D"5" h=
eight=3D"256" class=3D"recharts-cartesian-axis-tick-line" stroke=3D"#666" f=
ill=3D"none" x1=3D"59" y1=3D"261" x2=3D"65" y2=3D"261"></line></g><g class=
=3D"recharts-layer recharts-cartesian-axis-tick"><line angle=3D"0" orientat=
ion=3D"left" width=3D"60" x=3D"5" y=3D"5" height=3D"256" class=3D"recharts-=
cartesian-axis-tick-line" stroke=3D"#666" fill=3D"none" x1=3D"59" y1=3D"197=
" x2=3D"65" y2=3D"197"></line></g><g class=3D"recharts-layer recharts-carte=
sian-axis-tick"><line angle=3D"0" orientation=3D"left" width=3D"60" x=3D"5"=
 y=3D"5" height=3D"256" class=3D"recharts-cartesian-axis-tick-line" stroke=
=3D"#666" fill=3D"none" x1=3D"59" y1=3D"133" x2=3D"65" y2=3D"133"></line></=
g><g class=3D"recharts-layer recharts-cartesian-axis-tick"><line angle=3D"0=
" orientation=3D"left" width=3D"60" x=3D"5" y=3D"5" height=3D"256" class=3D=
"recharts-cartesian-axis-tick-line" stroke=3D"#666" fill=3D"none" x1=3D"59"=
 y1=3D"69" x2=3D"65" y2=3D"69"></line></g><g class=3D"recharts-layer rechar=
ts-cartesian-axis-tick"><line angle=3D"0" orientation=3D"left" width=3D"60"=
 x=3D"5" y=3D"5" height=3D"256" class=3D"recharts-cartesian-axis-tick-line"=
 stroke=3D"#666" fill=3D"none" x1=3D"59" y1=3D"5" x2=3D"65" y2=3D"5"></line=
></g></g></g></g></g><g tabindex=3D"-1" class=3D"recharts-zIndex-layer_600"=
></g><g tabindex=3D"-1" class=3D"recharts-zIndex-layer_1000"></g><g tabinde=
x=3D"-1" class=3D"recharts-zIndex-layer_1100"></g><g tabindex=3D"-1" class=
=3D"recharts-zIndex-layer_1200"></g><g tabindex=3D"-1" class=3D"recharts-zI=
ndex-layer_2000"><g class=3D"recharts-cartesian-axis-tick-labels recharts-x=
Axis-tick-labels"><g class=3D"recharts-layer recharts-cartesian-axis-tick-l=
abel"><text height=3D"30" orientation=3D"bottom" width=3D"1128" stroke=3D"n=
one" font-size=3D"11" x=3D"65" y=3D"269" class=3D"recharts-text recharts-ca=
rtesian-axis-tick-value" text-anchor=3D"middle" fill=3D"#94a3b8"><tspan x=
=3D"65" dy=3D"0.71em">2026-02-02</tspan></text></g><g class=3D"recharts-lay=
er recharts-cartesian-axis-tick-label"><text height=3D"30" orientation=3D"b=
ottom" width=3D"1128" stroke=3D"none" font-size=3D"11" x=3D"159" y=3D"269" =
class=3D"recharts-text recharts-cartesian-axis-tick-value" text-anchor=3D"m=
iddle" fill=3D"#94a3b8"><tspan x=3D"159" dy=3D"0.71em">2026-02-09</tspan></=
text></g><g class=3D"recharts-layer recharts-cartesian-axis-tick-label"><te=
xt height=3D"30" orientation=3D"bottom" width=3D"1128" stroke=3D"none" font=
-size=3D"11" x=3D"253" y=3D"269" class=3D"recharts-text recharts-cartesian-=
axis-tick-value" text-anchor=3D"middle" fill=3D"#94a3b8"><tspan x=3D"253" d=
y=3D"0.71em">2026-02-16</tspan></text></g><g class=3D"recharts-layer rechar=
ts-cartesian-axis-tick-label"><text height=3D"30" orientation=3D"bottom" wi=
dth=3D"1128" stroke=3D"none" font-size=3D"11" x=3D"347" y=3D"269" class=3D"=
recharts-text recharts-cartesian-axis-tick-value" text-anchor=3D"middle" fi=
ll=3D"#94a3b8"><tspan x=3D"347" dy=3D"0.71em">2026-02-23</tspan></text></g>=
<g class=3D"recharts-layer recharts-cartesian-axis-tick-label"><text height=
=3D"30" orientation=3D"bottom" width=3D"1128" stroke=3D"none" font-size=3D"=
11" x=3D"441" y=3D"269" class=3D"recharts-text recharts-cartesian-axis-tick=
-value" text-anchor=3D"middle" fill=3D"#94a3b8"><tspan x=3D"441" dy=3D"0.71=
em">2026-03-02</tspan></text></g><g class=3D"recharts-layer recharts-cartes=
ian-axis-tick-label"><text height=3D"30" orientation=3D"bottom" width=3D"11=
28" stroke=3D"none" font-size=3D"11" x=3D"535" y=3D"269" class=3D"recharts-=
text recharts-cartesian-axis-tick-value" text-anchor=3D"middle" fill=3D"#94=
a3b8"><tspan x=3D"535" dy=3D"0.71em">2026-03-09</tspan></text></g><g class=
=3D"recharts-layer recharts-cartesian-axis-tick-label"><text height=3D"30" =
orientation=3D"bottom" width=3D"1128" stroke=3D"none" font-size=3D"11" x=3D=
"629" y=3D"269" class=3D"recharts-text recharts-cartesian-axis-tick-value" =
text-anchor=3D"middle" fill=3D"#94a3b8"><tspan x=3D"629" dy=3D"0.71em">2026=
-03-16</tspan></text></g><g class=3D"recharts-layer recharts-cartesian-axis=
-tick-label"><text height=3D"30" orientation=3D"bottom" width=3D"1128" stro=
ke=3D"none" font-size=3D"11" x=3D"723" y=3D"269" class=3D"recharts-text rec=
harts-cartesian-axis-tick-value" text-anchor=3D"middle" fill=3D"#94a3b8"><t=
span x=3D"723" dy=3D"0.71em">2026-03-23</tspan></text></g><g class=3D"recha=
rts-layer recharts-cartesian-axis-tick-label"><text height=3D"30" orientati=
on=3D"bottom" width=3D"1128" stroke=3D"none" font-size=3D"11" x=3D"817" y=
=3D"269" class=3D"recharts-text recharts-cartesian-axis-tick-value" text-an=
chor=3D"middle" fill=3D"#94a3b8"><tspan x=3D"817" dy=3D"0.71em">2026-03-30<=
/tspan></text></g><g class=3D"recharts-layer recharts-cartesian-axis-tick-l=
abel"><text height=3D"30" orientation=3D"bottom" width=3D"1128" stroke=3D"n=
one" font-size=3D"11" x=3D"911" y=3D"269" class=3D"recharts-text recharts-c=
artesian-axis-tick-value" text-anchor=3D"middle" fill=3D"#94a3b8"><tspan x=
=3D"911" dy=3D"0.71em">2026-04-06</tspan></text></g><g class=3D"recharts-la=
yer recharts-cartesian-axis-tick-label"><text height=3D"30" orientation=3D"=
bottom" width=3D"1128" stroke=3D"none" font-size=3D"11" x=3D"1005" y=3D"269=
" class=3D"recharts-text recharts-cartesian-axis-tick-value" text-anchor=3D=
"middle" fill=3D"#94a3b8"><tspan x=3D"1005" dy=3D"0.71em">2026-04-13</tspan=
></text></g><g class=3D"recharts-layer recharts-cartesian-axis-tick-label">=
<text height=3D"30" orientation=3D"bottom" width=3D"1128" stroke=3D"none" f=
ont-size=3D"11" x=3D"1165.4296875" y=3D"269" class=3D"recharts-text rechart=
s-cartesian-axis-tick-value" text-anchor=3D"middle" fill=3D"#94a3b8"><tspan=
 x=3D"1165.4296875" dy=3D"0.71em">2026-04-27</tspan></text></g></g><g class=
=3D"recharts-cartesian-axis-tick-labels recharts-yAxis-tick-labels"><g clas=
s=3D"recharts-layer recharts-cartesian-axis-tick-label"><text orientation=
=3D"left" width=3D"60" height=3D"256" stroke=3D"none" x=3D"57" y=3D"261" cl=
ass=3D"recharts-text recharts-cartesian-axis-tick-value" text-anchor=3D"end=
" fill=3D"#94a3b8"><tspan x=3D"57" dy=3D"0.355em">-1</tspan></text></g><g c=
lass=3D"recharts-layer recharts-cartesian-axis-tick-label"><text orientatio=
n=3D"left" width=3D"60" height=3D"256" stroke=3D"none" x=3D"57" y=3D"197" c=
lass=3D"recharts-text recharts-cartesian-axis-tick-value" text-anchor=3D"en=
d" fill=3D"#94a3b8"><tspan x=3D"57" dy=3D"0.355em">-0.5</tspan></text></g><=
g class=3D"recharts-layer recharts-cartesian-axis-tick-label"><text orienta=
tion=3D"left" width=3D"60" height=3D"256" stroke=3D"none" x=3D"57" y=3D"133=
" class=3D"recharts-text recharts-cartesian-axis-tick-value" text-anchor=3D=
"end" fill=3D"#94a3b8"><tspan x=3D"57" dy=3D"0.355em">0</tspan></text></g><=
g class=3D"recharts-layer recharts-cartesian-axis-tick-label"><text orienta=
tion=3D"left" width=3D"60" height=3D"256" stroke=3D"none" x=3D"57" y=3D"69"=
 class=3D"recharts-text recharts-cartesian-axis-tick-value" text-anchor=3D"=
end" fill=3D"#94a3b8"><tspan x=3D"57" dy=3D"0.355em">0.5</tspan></text></g>=
<g class=3D"recharts-layer recharts-cartesian-axis-tick-label"><text orient=
ation=3D"left" width=3D"60" height=3D"256" stroke=3D"none" x=3D"57" y=3D"12=
" class=3D"recharts-text recharts-cartesian-axis-tick-value" text-anchor=3D=
"end" fill=3D"#94a3b8"><tspan x=3D"57" dy=3D"0.355em">1</tspan></text></g><=
/g></g></svg></div></div></div></div></section><div class=3D"grid gap-4 lg:=
grid-cols-2"><section class=3D"rounded-xl border border-slate-800 bg-slate-=
900/60 p-4 "><h2 class=3D"mb-3 text-sm font-semibold tracking-wide text-sla=
te-300">Module =C3=97 call type (mean polarity)</h2><table class=3D"w-full =
text-sm"><thead><tr class=3D"text-xs uppercase text-slate-500"><th class=3D=
"py-1 text-left">Module</th><th class=3D"text-right capitalize">support</th=
><th class=3D"text-right capitalize">external</th><th class=3D"text-right c=
apitalize">internal</th></tr></thead><tbody><tr class=3D"border-t border-sl=
ate-800"><td class=3D"py-2 capitalize">billing</td><td class=3D"py-2 text-r=
ight text-rose-300">-0.54<span class=3D"ml-1 text-[10px] text-slate-500">n=
=3D11</span></td><td class=3D"py-2 text-right text-emerald-300">0.21<span c=
lass=3D"ml-1 text-[10px] text-slate-500">n=3D27</span></td><td class=3D"py-=
2 text-right text-slate-300">0.14<span class=3D"ml-1 text-[10px] text-slate=
-500">n=3D9</span></td></tr><tr class=3D"border-t border-slate-800"><td cla=
ss=3D"py-2 capitalize">comply</td><td class=3D"py-2 text-right text-rose-30=
0">-0.22<span class=3D"ml-1 text-[10px] text-slate-500">n=3D11</span></td><=
td class=3D"py-2 text-right text-emerald-300">0.25<span class=3D"ml-1 text-=
[10px] text-slate-500">n=3D34</span></td><td class=3D"py-2 text-right text-=
emerald-300">0.15<span class=3D"ml-1 text-[10px] text-slate-500">n=3D19</sp=
an></td></tr><tr class=3D"border-t border-slate-800"><td class=3D"py-2 capi=
talize">detect</td><td class=3D"py-2 text-right text-rose-300">-0.75<span c=
lass=3D"ml-1 text-[10px] text-slate-500">n=3D17</span></td><td class=3D"py-=
2 text-right text-slate-300">0.06<span class=3D"ml-1 text-[10px] text-slate=
-500">n=3D21</span></td><td class=3D"py-2 text-right text-slate-300">-0.00<=
span class=3D"ml-1 text-[10px] text-slate-500">n=3D26</span></td></tr><tr c=
lass=3D"border-t border-slate-800"><td class=3D"py-2 capitalize">identity</=
td><td class=3D"py-2 text-right text-rose-300">-0.50<span class=3D"ml-1 tex=
t-[10px] text-slate-500">n=3D7</span></td><td class=3D"py-2 text-right text=
-emerald-300">0.24<span class=3D"ml-1 text-[10px] text-slate-500">n=3D11</s=
pan></td><td class=3D"py-2 text-right text-emerald-300">0.17<span class=3D"=
ml-1 text-[10px] text-slate-500">n=3D7</span></td></tr><tr class=3D"border-=
t border-slate-800"><td class=3D"py-2 capitalize">platform</td><td class=3D=
"py-2 text-right text-rose-300">-0.48<span class=3D"ml-1 text-[10px] text-s=
late-500">n=3D10</span></td><td class=3D"py-2 text-right text-slate-300">-0=
.09<span class=3D"ml-1 text-[10px] text-slate-500">n=3D3</span></td><td cla=
ss=3D"py-2 text-right text-rose-300">-0.69<span class=3D"ml-1 text-[10px] t=
ext-slate-500">n=3D3</span></td></tr><tr class=3D"border-t border-slate-800=
"><td class=3D"py-2 capitalize">protect</td><td class=3D"py-2 text-right te=
xt-rose-300">-0.49<span class=3D"ml-1 text-[10px] text-slate-500">n=3D13</s=
pan></td><td class=3D"py-2 text-right text-emerald-300">0.39<span class=3D"=
ml-1 text-[10px] text-slate-500">n=3D17</span></td><td class=3D"py-2 text-r=
ight text-slate-300">-0.07<span class=3D"ml-1 text-[10px] text-slate-500">n=
=3D7</span></td></tr></tbody></table></section><section class=3D"rounded-xl=
 border border-slate-800 bg-slate-900/60 p-4 "><h2 class=3D"mb-3 text-sm fo=
nt-semibold tracking-wide text-slate-300">Call trajectory + interpretation<=
/h2><p class=3D"mb-3 text-sm text-slate-300">Recovering 70 =C2=B7 Flat 29 =
=C2=B7 Deteriorating 1</p><ul class=3D"space-y-2 text-sm text-slate-300"><l=
i class=3D"border-l-2 border-amber-700 pl-3">Support calls: customer-side s=
entiment averages -0.45 across 31 meetings (duration-weighted utterance pol=
arity).</li><li class=3D"border-l-2 border-amber-700 pl-3">External calls: =
customer-side sentiment averages 0.20 across 39 meetings (duration-weighted=
 utterance polarity).</li><li class=3D"border-l-2 border-amber-700 pl-3">De=
tect-tagged calls sit 0.47 below the rest of the corpus. That gap is the ou=
tage/reliability plotline showing up in customer language, not just in engi=
neering war rooms.</li><li class=3D"border-l-2 border-amber-700 pl-3">Suppo=
rt is more negative than account-management calls. AM conversations can lag=
 the ticket queue =E2=80=94 sales may still hear a calm QBR while support i=
s already absorbing an outage.</li><li class=3D"border-l-2 border-amber-700=
 pl-3">70 calls recover in the last third of the transcript; 1 deteriorate.=
 Recovery is a coaching cue (workaround landed). Deterioration is a process=
 cue (no path to resolution).</li><li class=3D"border-l-2 border-amber-700 =
pl-3">Weakest customer-sentiment week: 2026-03-09 (support, n=3D7). Use tha=
t week as the incident overlay when walking the panel through Detect/Identi=
ty spikes.</li></ul></section></div></div></main></div></div>
   =20
 =20

<span id=3D"recharts_measurement_span" aria-hidden=3D"true" style=3D"positi=
on: absolute; top: -20000px; left: 0px; padding: 0px; margin: 0px; border-w=
idth: medium; border-style: none; border-color: currentcolor; border-image:=
 none; white-space: pre; font-size: 16px; letter-spacing: normal;">-1</span=
></body></html>
------MultipartBoundary--Y1GfPOTrIxtZ4vb6GFlum3ucfXEanGTcg0egN0Vme4----
Content-Type: text/css
Content-Transfer-Encoding: quoted-printable
Content-Location: cid:css-05524a7d-3065-4981-b345-db2710f35c6c@mhtml.blink

@charset "utf-8";

@layer properties;

@layer theme, base, components, utilities;

@layer theme {
  :root, :host { --font-sans: -apple-system, BlinkMacSystemFont, "Segoe UI"=
, Roboto, "Helvetica Neue",
      "Noto Sans", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji"=
,
      "Segoe UI Symbol", "Noto Color Emoji"; --font-mono: ui-monospace, SFM=
ono-Regular, Menlo, Monaco, Consolas, "Liberation Mono",
      "Courier New", monospace; --color-amber-300: oklch(87.9% 0.169 91.605=
); --color-amber-400: oklch(82.8% 0.189 84.429); --color-amber-500: oklch(7=
6.9% 0.188 70.08); --color-amber-700: oklch(55.5% 0.163 48.998); --color-em=
erald-300: oklch(84.5% 0.143 164.978); --color-emerald-400: oklch(76.5% 0.1=
77 163.223); --color-emerald-500: oklch(69.6% 0.17 162.48); --color-sky-300=
: oklch(82.8% 0.111 230.318); --color-sky-400: oklch(74.6% 0.16 232.661); -=
-color-sky-500: oklch(68.5% 0.169 237.323); --color-sky-700: oklch(50% 0.13=
4 242.749); --color-violet-300: oklch(81.1% 0.111 293.571); --color-violet-=
400: oklch(70.2% 0.183 293.541); --color-violet-500: oklch(60.6% 0.25 292.7=
17); --color-rose-300: oklch(81% 0.117 11.638); --color-rose-500: oklch(64.=
5% 0.246 16.439); --color-slate-100: oklch(96.8% 0.007 247.896); --color-sl=
ate-200: oklch(92.9% 0.013 255.508); --color-slate-300: oklch(86.9% 0.022 2=
52.894); --color-slate-400: oklch(70.4% 0.04 256.788); --color-slate-500: o=
klch(55.4% 0.046 257.417); --color-slate-800: oklch(27.9% 0.041 260.031); -=
-color-slate-900: oklch(20.8% 0.042 265.755); --color-slate-950: oklch(12.9=
% 0.042 264.695); --color-white: #fff; --spacing: 0.25rem; --container-3xl:=
 48rem; --container-7xl: 80rem; --text-xs: 0.75rem; --text-xs--line-height:=
 calc(1 / 0.75); --text-sm: 0.875rem; --text-sm--line-height: calc(1.25 / 0=
.875); --text-xl: 1.25rem; --text-xl--line-height: calc(1.75 / 1.25); --tex=
t-2xl: 1.5rem; --text-2xl--line-height: calc(2 / 1.5); --font-weight-medium=
: 500; --font-weight-semibold: 600; --tracking-tight: -0.025em; --tracking-=
wide: 0.025em; --radius-md: 0.375rem; --radius-lg: 0.5rem; --radius-xl: 0.7=
5rem; --default-font-family: var(--font-sans); --default-mono-font-family: =
var(--font-mono); }
}

@layer base {
  *, ::after, ::before, ::backdrop, ::file-selector-button { box-sizing: bo=
rder-box; margin: 0px; padding: 0px; border: 0px solid; }
  html, :host { line-height: 1.5; text-size-adjust: 100%; tab-size: 4; font=
-family: var(--default-font-family, -apple-system, BlinkMacSystemFont, "Seg=
oe UI", Roboto, "Helvetica Neue", "Noto Sans", Arial, sans-serif, "Apple Co=
lor Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"); font-=
feature-settings: var(--default-font-feature-settings, normal); font-variat=
ion-settings: var(--default-font-variation-settings, normal); -webkit-tap-h=
ighlight-color: transparent; }
  hr { height: 0px; color: inherit; border-top-width: 1px; }
  abbr:where([title]) { text-decoration: underline dotted; }
  h1, h2, h3, h4, h5, h6 { font-size: inherit; font-weight: inherit; }
  a { color: inherit; text-decoration: inherit; }
  b, strong { font-weight: bolder; }
  code, kbd, samp, pre { font-family: var(--default-mono-font-family, ui-mo=
nospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Couri=
er New", monospace); font-feature-settings: var(--default-mono-font-feature=
-settings, normal); font-variation-settings: var(--default-mono-font-variat=
ion-settings, normal); font-size: 1em; }
  small { font-size: 80%; }
  sub, sup { font-size: 75%; line-height: 0; position: relative; vertical-a=
lign: baseline; }
  sub { bottom: -0.25em; }
  sup { top: -0.5em; }
  table { text-indent: 0px; border-color: inherit; border-collapse: collaps=
e; }
  progress { vertical-align: baseline; }
  summary { display: list-item; }
  ol, ul, menu { list-style: none; }
  img, svg, video, canvas, audio, iframe, embed, object { display: block; v=
ertical-align: middle; }
  img, video { max-width: 100%; height: auto; }
  button, input, select, optgroup, textarea, ::file-selector-button { font:=
 inherit; letter-spacing: inherit; color: inherit; border-radius: 0px; back=
ground-color: transparent; opacity: 1; }
  :where(select:is([multiple], [size])) optgroup { font-weight: bolder; }
  :where(select:is([multiple], [size])) optgroup option { padding-inline-st=
art: 20px; }
  ::file-selector-button { margin-inline-end: 4px; }
  ::placeholder { opacity: 1; }
  @supports (not (-webkit-appearance: -apple-pay-button)) or (contain-intri=
nsic-size: 1px) {
  ::placeholder {
  color: currentcolor;
  @supports (color: color-mix(in lab, red, red)) {
  color: color-mix(currentcolor, transparent);
}
}
}
  textarea { resize: vertical; }
  ::-webkit-search-decoration { appearance: none; }
  ::-webkit-date-and-time-value { min-height: 1lh; text-align: inherit; }
  ::-webkit-datetime-edit { display: inline-flex; }
  ::-webkit-datetime-edit-fields-wrapper { padding: 0px; }
  ::-webkit-datetime-edit, ::-webkit-datetime-edit-year-field, ::-webkit-da=
tetime-edit-month-field, ::-webkit-datetime-edit-day-field, ::-webkit-datet=
ime-edit-hour-field, ::-webkit-datetime-edit-minute-field, ::-webkit-dateti=
me-edit-second-field, ::-webkit-datetime-edit-millisecond-field, ::-webkit-=
datetime-edit-meridiem-field { padding-block: 0px; }
  ::-webkit-calendar-picker-indicator { line-height: 1; }
  button, input:where([type=3D"button"], [type=3D"reset"], [type=3D"submit"=
]), ::file-selector-button { appearance: button; }
  ::-webkit-inner-spin-button, ::-webkit-outer-spin-button { height: auto; =
}
  [hidden]:where(:not([hidden=3D"until-found"])) { display: none !important=
; }
}

@layer utilities {
  .sticky { position: sticky; }
  .top-0 { top: 0px; }
  .z-20 { z-index: 20; }
  .float-right { float: right; }
  .mx-auto { margin-inline: auto; }
  .mt-1 { margin-top: var(--spacing); }
  .mt-3 { margin-top: calc(var(--spacing) * 3); }
  .mr-1 { margin-right: var(--spacing); }
  .mb-1 { margin-bottom: var(--spacing); }
  .mb-2 { margin-bottom: calc(var(--spacing) * 2); }
  .mb-3 { margin-bottom: calc(var(--spacing) * 3); }
  .ml-1 { margin-left: var(--spacing); }
  .ml-auto { margin-left: auto; }
  .flex { display: flex; }
  .grid { display: grid; }
  .inline-block { display: inline-block; }
  .inline-flex { display: inline-flex; }
  .h-2 { height: calc(var(--spacing) * 2); }
  .h-64 { height: calc(var(--spacing) * 64); }
  .h-80 { height: calc(var(--spacing) * 80); }
  .h-\[640px\] { height: 640px; }
  .min-h-screen { min-height: 100vh; }
  .w-2 { width: calc(var(--spacing) * 2); }
  .w-full { width: 100%; }
  .max-w-3xl { max-width: var(--container-3xl); }
  .max-w-7xl { max-width: var(--container-7xl); }
  .transform { transform: var(--tw-rotate-x,) var(--tw-rotate-y,) var(--tw-=
rotate-z,) var(--tw-skew-x,) var(--tw-skew-y,); }
  .list-disc { list-style-type: disc; }
  .grid-cols-2 { grid-template-columns: repeat(2, minmax(0px, 1fr)); }
  .flex-wrap { flex-wrap: wrap; }
  .items-center { align-items: center; }
  .gap-1 { gap: var(--spacing); }
  .gap-2 { gap: calc(var(--spacing) * 2); }
  .gap-3 { gap: calc(var(--spacing) * 3); }
  .gap-4 { gap: calc(var(--spacing) * 4); }
  .gap-6 { gap: calc(var(--spacing) * 6); }
  :where(.space-y-1 > :not(:last-child)) { --tw-space-y-reverse: 0; margin-=
block-start: calc(var(--spacing) * var(--tw-space-y-reverse)); margin-block=
-end: calc(var(--spacing) * calc(1 - var(--tw-space-y-reverse))); }
  :where(.space-y-2 > :not(:last-child)) { --tw-space-y-reverse: 0; margin-=
block-start: calc(calc(var(--spacing) * 2) * var(--tw-space-y-reverse)); ma=
rgin-block-end: calc(calc(var(--spacing) * 2) * calc(1 - var(--tw-space-y-r=
everse))); }
  :where(.space-y-3 > :not(:last-child)) { --tw-space-y-reverse: 0; margin-=
block-start: calc(calc(var(--spacing) * 3) * var(--tw-space-y-reverse)); ma=
rgin-block-end: calc(calc(var(--spacing) * 3) * calc(1 - var(--tw-space-y-r=
everse))); }
  :where(.space-y-4 > :not(:last-child)) { --tw-space-y-reverse: 0; margin-=
block-start: calc(calc(var(--spacing) * 4) * var(--tw-space-y-reverse)); ma=
rgin-block-end: calc(calc(var(--spacing) * 4) * calc(1 - var(--tw-space-y-r=
everse))); }
  :where(.space-y-6 > :not(:last-child)) { --tw-space-y-reverse: 0; margin-=
block-start: calc(calc(var(--spacing) * 6) * var(--tw-space-y-reverse)); ma=
rgin-block-end: calc(calc(var(--spacing) * 6) * calc(1 - var(--tw-space-y-r=
everse))); }
  :where(.space-x-1 > :not(:last-child)) { --tw-space-x-reverse: 0; margin-=
inline-start: calc(var(--spacing) * var(--tw-space-x-reverse)); margin-inli=
ne-end: calc(var(--spacing) * calc(1 - var(--tw-space-x-reverse))); }
  .overflow-hidden { overflow: hidden; }
  .overflow-x-auto { overflow-x: auto; }
  .rounded { border-radius: 0.25rem; }
  .rounded-full { border-radius: calc(infinity * 1px); }
  .rounded-lg { border-radius: var(--radius-lg); }
  .rounded-md { border-radius: var(--radius-md); }
  .rounded-xl { border-radius: var(--radius-xl); }
  .border { border-style: var(--tw-border-style); border-width: 1px; }
  .border-t { border-top-style: var(--tw-border-style); border-top-width: 1=
px; }
  .border-b { border-bottom-style: var(--tw-border-style); border-bottom-wi=
dth: 1px; }
  .border-l-2 { border-left-style: var(--tw-border-style); border-left-widt=
h: 2px; }
  .border-amber-700 { border-color: var(--color-amber-700); }
  .border-sky-700 { border-color: var(--color-sky-700); }
  .border-slate-800 { border-color: var(--color-slate-800); }
  .bg-amber-400 { background-color: var(--color-amber-400); }
  .bg-amber-500\/15 {
  background-color: color-mix(in srgb, oklch(0.769 0.188 70.08) 15%, transp=
arent 85%);
  @supports (color: color-mix(in lab, red, red)) {
  background-color: color-mix(in oklab, var(--color-amber-500) 15%, transpa=
rent);
}
}
  .bg-emerald-400 { background-color: var(--color-emerald-400); }
  .bg-emerald-500\/15 {
  background-color: color-mix(in srgb, oklch(0.696 0.17 162.48) 15%, transp=
arent 85%);
  @supports (color: color-mix(in lab, red, red)) {
  background-color: color-mix(in oklab, var(--color-emerald-500) 15%, trans=
parent);
}
}
  .bg-rose-500\/15 {
  background-color: color-mix(in srgb, oklch(0.645 0.246 16.439) 15%, trans=
parent 85%);
  @supports (color: color-mix(in lab, red, red)) {
  background-color: color-mix(in oklab, var(--color-rose-500) 15%, transpar=
ent);
}
}
  .bg-sky-400 { background-color: var(--color-sky-400); }
  .bg-sky-500\/15 {
  background-color: color-mix(in srgb, oklch(0.685 0.169 237.323) 15%, tran=
sparent 85%);
  @supports (color: color-mix(in lab, red, red)) {
  background-color: color-mix(in oklab, var(--color-sky-500) 15%, transpare=
nt);
}
}
  .bg-slate-800 { background-color: var(--color-slate-800); }
  .bg-slate-900\/60 {
  background-color: color-mix(in srgb, oklch(0.208 0.042 265.755) 60%, tran=
sparent 40%);
  @supports (color: color-mix(in lab, red, red)) {
  background-color: color-mix(in oklab, var(--color-slate-900) 60%, transpa=
rent);
}
}
  .bg-slate-950 { background-color: var(--color-slate-950); }
  .bg-slate-950\/90 {
  background-color: color-mix(in srgb, oklch(0.129 0.042 264.695) 90%, tran=
sparent 10%);
  @supports (color: color-mix(in lab, red, red)) {
  background-color: color-mix(in oklab, var(--color-slate-950) 90%, transpa=
rent);
}
}
  .bg-violet-400 { background-color: var(--color-violet-400); }
  .bg-violet-500\/15 {
  background-color: color-mix(in srgb, oklch(0.606 0.25 292.717) 15%, trans=
parent 85%);
  @supports (color: color-mix(in lab, red, red)) {
  background-color: color-mix(in oklab, var(--color-violet-500) 15%, transp=
arent);
}
}
  .p-3 { padding: calc(var(--spacing) * 3); }
  .p-4 { padding: calc(var(--spacing) * 4); }
  .p-8 { padding: calc(var(--spacing) * 8); }
  .px-2 { padding-inline: calc(var(--spacing) * 2); }
  .px-3 { padding-inline: calc(var(--spacing) * 3); }
  .px-6 { padding-inline: calc(var(--spacing) * 6); }
  .py-0\.5 { padding-block: calc(var(--spacing) * 0.5); }
  .py-1 { padding-block: var(--spacing); }
  .py-1\.5 { padding-block: calc(var(--spacing) * 1.5); }
  .py-2 { padding-block: calc(var(--spacing) * 2); }
  .py-3 { padding-block: calc(var(--spacing) * 3); }
  .py-6 { padding-block: calc(var(--spacing) * 6); }
  .pl-3 { padding-left: calc(var(--spacing) * 3); }
  .pl-5 { padding-left: calc(var(--spacing) * 5); }
  .text-left { text-align: left; }
  .text-right { text-align: right; }
  .text-2xl { font-size: var(--text-2xl); line-height: var(--tw-leading, va=
r(--text-2xl--line-height)); }
  .text-sm { font-size: var(--text-sm); line-height: var(--tw-leading, var(=
--text-sm--line-height)); }
  .text-xl { font-size: var(--text-xl); line-height: var(--tw-leading, var(=
--text-xl--line-height)); }
  .text-xs { font-size: var(--text-xs); line-height: var(--tw-leading, var(=
--text-xs--line-height)); }
  .text-\[10px\] { font-size: 10px; }
  .font-medium { --tw-font-weight: var(--font-weight-medium); font-weight: =
var(--font-weight-medium); }
  .font-semibold { --tw-font-weight: var(--font-weight-semibold); font-weig=
ht: var(--font-weight-semibold); }
  .tracking-tight { --tw-tracking: var(--tracking-tight); letter-spacing: v=
ar(--tracking-tight); }
  .tracking-wide { --tw-tracking: var(--tracking-wide); letter-spacing: var=
(--tracking-wide); }
  .text-amber-300 { color: var(--color-amber-300); }
  .text-emerald-300 { color: var(--color-emerald-300); }
  .text-rose-300 { color: var(--color-rose-300); }
  .text-sky-300 { color: var(--color-sky-300); }
  .text-slate-100 { color: var(--color-slate-100); }
  .text-slate-200 { color: var(--color-slate-200); }
  .text-slate-300 { color: var(--color-slate-300); }
  .text-slate-400 { color: var(--color-slate-400); }
  .text-slate-500 { color: var(--color-slate-500); }
  .text-violet-300 { color: var(--color-violet-300); }
  .text-white { color: var(--color-white); }
  .capitalize { text-transform: capitalize; }
  .uppercase { text-transform: uppercase; }
  .italic { font-style: italic; }
  .filter { filter: var(--tw-blur,) var(--tw-brightness,) var(--tw-contrast=
,) var(--tw-grayscale,) var(--tw-hue-rotate,) var(--tw-invert,) var(--tw-sa=
turate,) var(--tw-sepia,) var(--tw-drop-shadow,); }
  .backdrop-blur { --tw-backdrop-blur: blur(8px); backdrop-filter: var(--tw=
-backdrop-blur,) var(--tw-backdrop-brightness,) var(--tw-backdrop-contrast,=
) var(--tw-backdrop-grayscale,) var(--tw-backdrop-hue-rotate,) var(--tw-bac=
kdrop-invert,) var(--tw-backdrop-opacity,) var(--tw-backdrop-saturate,) var=
(--tw-backdrop-sepia,); }
  @media (hover: hover) {
  .hover\:bg-slate-800\/60:hover { background-color: color-mix(in srgb, okl=
ch(0.279 0.041 260.031) 60%, transparent 40%); }
  @supports (color: color-mix(in lab, red, red)) {
  .hover\:bg-slate-800\/60:hover { background-color: color-mix(in oklab, va=
r(--color-slate-800) 60%, transparent); }
}
  .hover\:text-white:hover { color: var(--color-white); }
  .hover\:underline:hover { text-decoration-line: underline; }
}
  @media (width >=3D 48rem) {
  .md\:grid-cols-2 { grid-template-columns: repeat(2, minmax(0px, 1fr)); }
  .md\:grid-cols-3 { grid-template-columns: repeat(3, minmax(0px, 1fr)); }
  .md\:grid-cols-4 { grid-template-columns: repeat(4, minmax(0px, 1fr)); }
}
  @media (width >=3D 64rem) {
  .lg\:col-span-1 { grid-column: span 1 / span 1; }
  .lg\:col-span-2 { grid-column: span 2 / span 2; }
  .lg\:grid-cols-2 { grid-template-columns: repeat(2, minmax(0px, 1fr)); }
  .lg\:grid-cols-3 { grid-template-columns: repeat(3, minmax(0px, 1fr)); }
}
}

:root { color-scheme: dark; }

body { margin: 0px; min-height: 100vh; background: rgb(11, 18, 32); color: =
rgb(232, 238, 249); font-family: "IBM Plex Sans", "Segoe UI", system-ui, sa=
ns-serif; }

#root { min-height: 100vh; }

@property --tw-rotate-x { syntax: "*"; inherits: false; }

@property --tw-rotate-y { syntax: "*"; inherits: false; }

@property --tw-rotate-z { syntax: "*"; inherits: false; }

@property --tw-skew-x { syntax: "*"; inherits: false; }

@property --tw-skew-y { syntax: "*"; inherits: false; }

@property --tw-space-y-reverse { syntax: "*"; inherits: false; initial-valu=
e: 0; }

@property --tw-space-x-reverse { syntax: "*"; inherits: false; initial-valu=
e: 0; }

@property --tw-border-style { syntax: "*"; inherits: false; initial-value: =
solid; }

@property --tw-font-weight { syntax: "*"; inherits: false; }

@property --tw-tracking { syntax: "*"; inherits: false; }

@property --tw-blur { syntax: "*"; inherits: false; }

@property --tw-brightness { syntax: "*"; inherits: false; }

@property --tw-contrast { syntax: "*"; inherits: false; }

@property --tw-grayscale { syntax: "*"; inherits: false; }

@property --tw-hue-rotate { syntax: "*"; inherits: false; }

@property --tw-invert { syntax: "*"; inherits: false; }

@property --tw-opacity { syntax: "*"; inherits: false; }

@property --tw-saturate { syntax: "*"; inherits: false; }

@property --tw-sepia { syntax: "*"; inherits: false; }

@property --tw-drop-shadow { syntax: "*"; inherits: false; }

@property --tw-drop-shadow-color { syntax: "*"; inherits: false; }

@property --tw-drop-shadow-alpha { syntax: "<percentage>"; inherits: false;=
 initial-value: 100%; }

@property --tw-drop-shadow-size { syntax: "*"; inherits: false; }

@property --tw-backdrop-blur { syntax: "*"; inherits: false; }

@property --tw-backdrop-brightness { syntax: "*"; inherits: false; }

@property --tw-backdrop-contrast { syntax: "*"; inherits: false; }

@property --tw-backdrop-grayscale { syntax: "*"; inherits: false; }

@property --tw-backdrop-hue-rotate { syntax: "*"; inherits: false; }

@property --tw-backdrop-invert { syntax: "*"; inherits: false; }

@property --tw-backdrop-opacity { syntax: "*"; inherits: false; }

@property --tw-backdrop-saturate { syntax: "*"; inherits: false; }

@property --tw-backdrop-sepia { syntax: "*"; inherits: false; }

@layer properties {
  @supports ((-webkit-hyphens: none) and (not (margin-trim: inline))) or ((=
-moz-orient: inline) and (not (color:rgb(from red r g b)))) {
  *, ::before, ::after, ::backdrop { --tw-rotate-x: initial; --tw-rotate-y:=
 initial; --tw-rotate-z: initial; --tw-skew-x: initial; --tw-skew-y: initia=
l; --tw-space-y-reverse: 0; --tw-space-x-reverse: 0; --tw-border-style: sol=
id; --tw-font-weight: initial; --tw-tracking: initial; --tw-blur: initial; =
--tw-brightness: initial; --tw-contrast: initial; --tw-grayscale: initial; =
--tw-hue-rotate: initial; --tw-invert: initial; --tw-opacity: initial; --tw=
-saturate: initial; --tw-sepia: initial; --tw-drop-shadow: initial; --tw-dr=
op-shadow-color: initial; --tw-drop-shadow-alpha: 100%; --tw-drop-shadow-si=
ze: initial; --tw-backdrop-blur: initial; --tw-backdrop-brightness: initial=
; --tw-backdrop-contrast: initial; --tw-backdrop-grayscale: initial; --tw-b=
ackdrop-hue-rotate: initial; --tw-backdrop-invert: initial; --tw-backdrop-o=
pacity: initial; --tw-backdrop-saturate: initial; --tw-backdrop-sepia: init=
ial; }
}
}
------MultipartBoundary--Y1GfPOTrIxtZ4vb6GFlum3ucfXEanGTcg0egN0Vme4----
Content-Type: text/css
Content-Transfer-Encoding: quoted-printable
Content-Location: cid:css-f76cf059-be18-49e9-997b-1fa337bf382c@mhtml.blink

@charset "utf-8";

.force-graph-container canvas { display: block; user-select: none; outline:=
 none; -webkit-tap-highlight-color: transparent; }

.force-graph-container .clickable { cursor: pointer; }

.force-graph-container .grabbable { cursor: -webkit-grab; }

.force-graph-container .grabbable:active { cursor: -webkit-grabbing; }
------MultipartBoundary--Y1GfPOTrIxtZ4vb6GFlum3ucfXEanGTcg0egN0Vme4----
Content-Type: text/css
Content-Transfer-Encoding: quoted-printable
Content-Location: cid:css-61fe4a01-505c-43db-87a0-fa72e0f801b1@mhtml.blink

@charset "utf-8";

.float-tooltip-kap { position: absolute; width: max-content; max-width: max=
(50%, 150px); padding: 3px 5px; border-radius: 3px; font: 12px sans-serif; =
color: rgb(238, 238, 238); background: rgba(0, 0, 0, 0.6); pointer-events: =
none; }
------MultipartBoundary--Y1GfPOTrIxtZ4vb6GFlum3ucfXEanGTcg0egN0Vme4------
t Intelligence3.mhtml…]()

Snapshot-Content-Location: http://127.0.0.1:5173/themes
Subject: Transcript Intelligence
Date: Tue, 27 Oct 2026 21:31:01 GMT
MIME-Version: 1.0
Content-Type: multipart/related;
	type="text/html";
	boundary="----MultipartBoundary--gcWkh37lRcCKiU39VJCKjzFghSBIJdgM7vDWYkYsXU----"


------MultipartBoundary--gcWkh37lRcCKiU39VJCKjzFghSBIJdgM7vDWYkYsXU----
Content-Type: text/html
Content-ID: <frame-62FD6B35AC4100AD4EEBB3AFCAB21246@mhtml.blink>
Content-Transfer-Encoding: quoted-printable
Content-Location: http://127.0.0.1:5173/themes

<!DOCTYPE html><html lang=3D"en"><head><meta http-equiv=3D"Content-Type" co=
ntent=3D"text/html; charset=3DUTF-8"><link rel=3D"stylesheet" type=3D"text/=
css" href=3D"cid:css-bb632ecd-e9ab-4fcb-8655-195e4c339af2@mhtml.blink" /><l=
ink rel=3D"stylesheet" type=3D"text/css" href=3D"cid:css-aef89a88-1023-4639=
-bbf6-b0e8eb014af2@mhtml.blink" /><link rel=3D"stylesheet" type=3D"text/css=
" href=3D"cid:css-b8665d07-b249-41d3-aa11-2d829f9eaeb0@mhtml.blink" />
   =20

   =20

   =20
    <link rel=3D"icon" type=3D"image/svg+xml" href=3D"http://127.0.0.1:5173=
/favicon.svg">
    <meta name=3D"viewport" content=3D"width=3Ddevice-width, initial-scale=
=3D1.0">
    <title>Transcript Intelligence</title>
  </head>
  <body>
    <div id=3D"root"><div class=3D"min-h-screen"><header class=3D"sticky to=
p-0 z-20 border-b border-slate-800 bg-slate-950/90 backdrop-blur"><div clas=
s=3D"mx-auto flex max-w-7xl items-center gap-6 px-6 py-3"><div class=3D"fle=
x items-center gap-2 text-sky-300"><svg xmlns=3D"http://www.w3.org/2000/svg=
" width=3D"20" height=3D"20" viewBox=3D"0 0 24 24" fill=3D"none" stroke=3D"=
currentColor" stroke-width=3D"2" stroke-linecap=3D"round" stroke-linejoin=
=3D"round" class=3D"lucide lucide-audio-lines" aria-hidden=3D"true"><path d=
=3D"M2 10v3"></path><path d=3D"M6 6v11"></path><path d=3D"M10 3v18"></path>=
<path d=3D"M14 8v7"></path><path d=3D"M18 5v13"></path><path d=3D"M22 10v3"=
></path></svg><span class=3D"font-semibold tracking-tight text-slate-100">T=
ranscript Intelligence</span></div><nav class=3D"flex gap-1 text-sm"><a cla=
ss=3D"rounded-md px-3 py-1.5 text-slate-400 hover:text-white" href=3D"http:=
//127.0.0.1:5173/" data-discover=3D"true">Overview</a><a class=3D"rounded-m=
d px-3 py-1.5 bg-slate-800 text-white" href=3D"http://127.0.0.1:5173/themes=
" data-discover=3D"true" aria-current=3D"page">Themes</a><a class=3D"rounde=
d-md px-3 py-1.5 text-slate-400 hover:text-white" href=3D"http://127.0.0.1:=
5173/sentiment" data-discover=3D"true">Sentiment</a><a class=3D"rounded-md =
px-3 py-1.5 text-slate-400 hover:text-white" href=3D"http://127.0.0.1:5173/=
graph" data-discover=3D"true">Issue graph</a><a class=3D"rounded-md px-3 py=
-1.5 text-slate-400 hover:text-white" href=3D"http://127.0.0.1:5173/account=
s" data-discover=3D"true">Risk radar</a></nav></div></header><main class=3D=
"mx-auto max-w-7xl px-6 py-6"><div class=3D"space-y-6"><div><h1 class=3D"te=
xt-2xl font-semibold">Themes</h1><p class=3D"mt-1 text-sm text-slate-400">C=
all type is rules. Primary theme is a title-weighted keyword taxonomy over =
summary topics and the transcript. Click a bar or row for examples =E2=80=
=94 that is the evaluation requirement, not just a count.</p></div><section=
 class=3D"rounded-xl border border-slate-800 bg-slate-900/60 p-4 "><h2 clas=
s=3D"mb-3 text-sm font-semibold tracking-wide text-slate-300">Primary theme=
 =C3=97 call type</h2><div class=3D"h-80"><div class=3D"recharts-responsive=
-container" style=3D"width: 100%; height: 100%; min-width: 0px;"><div style=
=3D"width: 0px; height: 0px; overflow: visible;"><div width=3D"1198" height=
=3D"320" class=3D"recharts-wrapper" style=3D"position: relative; cursor: de=
fault; width: 1198px; height: 320px;"><div xmlns=3D"http://www.w3.org/1999/=
xhtml" tabindex=3D"-1" class=3D"recharts-tooltip-wrapper" style=3D"visibili=
ty: hidden; pointer-events: none; position: absolute; top: 0px; left: 0px;"=
><div class=3D"recharts-default-tooltip" role=3D"status" aria-live=3D"asser=
tive" style=3D"margin: 0px; padding: 10px; background-color: rgb(255, 255, =
255); border: 1px solid rgb(204, 204, 204); white-space: nowrap;"><p class=
=3D"recharts-tooltip-label" style=3D"margin: 0px;"></p></div></div><div cla=
ss=3D"recharts-legend-wrapper" style=3D"position: absolute; width: 1188px; =
height: auto; left: 5px; bottom: 5px;"><ul class=3D"recharts-default-legend=
" style=3D"padding: 0px; margin: 0px; text-align: center;"><li class=3D"rec=
harts-legend-item legend-item-0" style=3D"display: inline-block; margin-rig=
ht: 10px; white-space: nowrap;"><svg aria-label=3D"external legend icon" cl=
ass=3D"recharts-surface" width=3D"14" height=3D"14" viewBox=3D"0 0 32 32" s=
tyle=3D"display: inline-block; vertical-align: middle; margin-right: 4px;">=
<title></title><desc></desc><path stroke=3D"none" fill=3D"#38bdf8" d=3D"M0,=
4h32v24h-32z" class=3D"recharts-legend-icon"></path></svg><span class=3D"re=
charts-legend-item-text" style=3D"color: rgb(56, 189, 248); white-space: no=
rmal; overflow-wrap: break-word;">external</span></li><li class=3D"recharts=
-legend-item legend-item-1" style=3D"display: inline-block; margin-right: 1=
0px; white-space: nowrap;"><svg aria-label=3D"internal legend icon" class=
=3D"recharts-surface" width=3D"14" height=3D"14" viewBox=3D"0 0 32 32" styl=
e=3D"display: inline-block; vertical-align: middle; margin-right: 4px;"><ti=
tle></title><desc></desc><path stroke=3D"none" fill=3D"#a78bfa" d=3D"M0,4h3=
2v24h-32z" class=3D"recharts-legend-icon"></path></svg><span class=3D"recha=
rts-legend-item-text" style=3D"color: rgb(167, 139, 250); white-space: norm=
al; overflow-wrap: break-word;">internal</span></li><li class=3D"recharts-l=
egend-item legend-item-2" style=3D"display: inline-block; margin-right: 10p=
x; white-space: nowrap;"><svg aria-label=3D"support legend icon" class=3D"r=
echarts-surface" width=3D"14" height=3D"14" viewBox=3D"0 0 32 32" style=3D"=
display: inline-block; vertical-align: middle; margin-right: 4px;"><title><=
/title><desc></desc><path stroke=3D"none" fill=3D"#f59e0b" d=3D"M0,4h32v24h=
-32z" class=3D"recharts-legend-icon"></path></svg><span class=3D"recharts-l=
egend-item-text" style=3D"color: rgb(245, 158, 11); white-space: normal; ov=
erflow-wrap: break-word;">support</span></li></ul></div><svg role=3D"applic=
ation" tabindex=3D"0" class=3D"recharts-surface" width=3D"1198" height=3D"3=
20" viewBox=3D"0 0 1198 320" style=3D"width: 100%; height: 100%; display: b=
lock;"><title></title><desc></desc><g tabindex=3D"-1" class=3D"recharts-zIn=
dex-layer_-100"><g class=3D"recharts-cartesian-grid"><g class=3D"recharts-c=
artesian-grid-horizontal"><line stroke-dasharray=3D"3 3" stroke=3D"#1e293b"=
 x=3D"65" y=3D"5" width=3D"1128" height=3D"206" x1=3D"65" y1=3D"211" x2=3D"=
1193" y2=3D"211" fill=3D"none"></line><line stroke-dasharray=3D"3 3" stroke=
=3D"#1e293b" x=3D"65" y=3D"5" width=3D"1128" height=3D"206" x1=3D"65" y1=3D=
"159.5" x2=3D"1193" y2=3D"159.5" fill=3D"none"></line><line stroke-dasharra=
y=3D"3 3" stroke=3D"#1e293b" x=3D"65" y=3D"5" width=3D"1128" height=3D"206"=
 x1=3D"65" y1=3D"108" x2=3D"1193" y2=3D"108" fill=3D"none"></line><line str=
oke-dasharray=3D"3 3" stroke=3D"#1e293b" x=3D"65" y=3D"5" width=3D"1128" he=
ight=3D"206" x1=3D"65" y1=3D"56.5" x2=3D"1193" y2=3D"56.5" fill=3D"none"></=
line><line stroke-dasharray=3D"3 3" stroke=3D"#1e293b" x=3D"65" y=3D"5" wid=
th=3D"1128" height=3D"206" x1=3D"65" y1=3D"5" x2=3D"1193" y2=3D"5" fill=3D"=
none"></line></g><g class=3D"recharts-cartesian-grid-vertical"><line stroke=
-dasharray=3D"3 3" stroke=3D"#1e293b" x=3D"65" y=3D"5" width=3D"1128" heigh=
t=3D"206" x1=3D"121.4" y1=3D"5" x2=3D"121.4" y2=3D"211" fill=3D"none"></lin=
e><line stroke-dasharray=3D"3 3" stroke=3D"#1e293b" x=3D"65" y=3D"5" width=
=3D"1128" height=3D"206" x1=3D"234.20000000000002" y1=3D"5" x2=3D"234.20000=
000000002" y2=3D"211" fill=3D"none"></line><line stroke-dasharray=3D"3 3" s=
troke=3D"#1e293b" x=3D"65" y=3D"5" width=3D"1128" height=3D"206" x1=3D"347"=
 y1=3D"5" x2=3D"347" y2=3D"211" fill=3D"none"></line><line stroke-dasharray=
=3D"3 3" stroke=3D"#1e293b" x=3D"65" y=3D"5" width=3D"1128" height=3D"206" =
x1=3D"459.79999999999995" y1=3D"5" x2=3D"459.79999999999995" y2=3D"211" fil=
l=3D"none"></line><line stroke-dasharray=3D"3 3" stroke=3D"#1e293b" x=3D"65=
" y=3D"5" width=3D"1128" height=3D"206" x1=3D"572.6" y1=3D"5" x2=3D"572.6" =
y2=3D"211" fill=3D"none"></line><line stroke-dasharray=3D"3 3" stroke=3D"#1=
e293b" x=3D"65" y=3D"5" width=3D"1128" height=3D"206" x1=3D"685.4" y1=3D"5"=
 x2=3D"685.4" y2=3D"211" fill=3D"none"></line><line stroke-dasharray=3D"3 3=
" stroke=3D"#1e293b" x=3D"65" y=3D"5" width=3D"1128" height=3D"206" x1=3D"7=
98.1999999999999" y1=3D"5" x2=3D"798.1999999999999" y2=3D"211" fill=3D"none=
"></line><line stroke-dasharray=3D"3 3" stroke=3D"#1e293b" x=3D"65" y=3D"5"=
 width=3D"1128" height=3D"206" x1=3D"911" y1=3D"5" x2=3D"911" y2=3D"211" fi=
ll=3D"none"></line><line stroke-dasharray=3D"3 3" stroke=3D"#1e293b" x=3D"6=
5" y=3D"5" width=3D"1128" height=3D"206" x1=3D"1023.8" y1=3D"5" x2=3D"1023.=
8" y2=3D"211" fill=3D"none"></line><line stroke-dasharray=3D"3 3" stroke=3D=
"#1e293b" x=3D"65" y=3D"5" width=3D"1128" height=3D"206" x1=3D"1136.6" y1=
=3D"5" x2=3D"1136.6" y2=3D"211" fill=3D"none"></line><line stroke-dasharray=
=3D"3 3" stroke=3D"#1e293b" x=3D"65" y=3D"5" width=3D"1128" height=3D"206" =
x1=3D"65" y1=3D"5" x2=3D"65" y2=3D"211" fill=3D"none"></line><line stroke-d=
asharray=3D"3 3" stroke=3D"#1e293b" x=3D"65" y=3D"5" width=3D"1128" height=
=3D"206" x1=3D"1193" y1=3D"5" x2=3D"1193" y2=3D"211" fill=3D"none"></line><=
/g></g></g><g tabindex=3D"-1" class=3D"recharts-zIndex-layer_-50"></g><defs=
><clipPath id=3D"recharts2326-clip"><rect x=3D"65" y=3D"5" height=3D"206" w=
idth=3D"1128"></rect></clipPath></defs><g tabindex=3D"-1" class=3D"recharts=
-zIndex-layer_100"></g><g tabindex=3D"-1" class=3D"recharts-zIndex-layer_20=
0"></g><g tabindex=3D"-1" class=3D"recharts-zIndex-layer_300"><g class=3D"r=
echarts-layer recharts-bar" id=3D"recharts-bar-_r_7_"><g class=3D"recharts-=
layer recharts-bar-rectangles"><g class=3D"recharts-layer"><g class=3D"rech=
arts-layer recharts-bar-rectangle"><g class=3D"recharts-layer recharts-inac=
tive-bar"><path fill=3D"#f59e0b" name=3D"Comply v2
audit readiness" x=3D"76.28" y=3D"159.5" width=3D"90" height=3D"51.5" radiu=
s=3D"0" class=3D"recharts-rectangle" d=3D"M 76.28,159.5 h 90 v 51.5 h -90 Z=
"></path></g></g><g class=3D"recharts-layer recharts-bar-rectangle"><g clas=
s=3D"recharts-layer recharts-inactive-bar"><path fill=3D"#f59e0b" name=3D"R=
enewal &amp; commercial" x=3D"189.08" y=3D"185.25" width=3D"90" height=3D"2=
5.75" radius=3D"0" class=3D"recharts-rectangle" d=3D"M 189.08,185.25 h 90 v=
 25.75 h -90 Z"></path></g></g><g class=3D"recharts-layer recharts-bar-rect=
angle"><g class=3D"recharts-layer recharts-inactive-bar"><path fill=3D"#f59=
e0b" name=3D"SSO
Identity failures" x=3D"301.88" y=3D"159.5" width=3D"90" height=3D"51.5" ra=
dius=3D"0" class=3D"recharts-rectangle" d=3D"M 301.88,159.5 h 90 v 51.5 h -=
90 Z"></path></g></g><g class=3D"recharts-layer recharts-bar-rectangle"><g =
class=3D"recharts-layer recharts-inactive-bar"><path fill=3D"#f59e0b" name=
=3D"Detect reliability
outage" x=3D"414.68" y=3D"159.5" width=3D"90" height=3D"51.5" radius=3D"0" =
class=3D"recharts-rectangle" d=3D"M 414.68,159.5 h 90 v 51.5 h -90 Z"></pat=
h></g></g><g class=3D"recharts-layer recharts-bar-rectangle"><g class=3D"re=
charts-layer recharts-inactive-bar"><path fill=3D"#f59e0b" name=3D"Incident=
 communication gaps" x=3D"527.48" y=3D"176.6667" width=3D"90" height=3D"34.=
3333" radius=3D"0" class=3D"recharts-rectangle" d=3D"M 527.48,176.6667 h 90=
 v 34.3333 h -90 Z"></path></g></g><g class=3D"recharts-layer recharts-bar-=
rectangle"><g class=3D"recharts-layer recharts-inactive-bar"><path fill=3D"=
#f59e0b" name=3D"Protect
backup &amp; restore" x=3D"753.08" y=3D"159.5" width=3D"90" height=3D"51.5"=
 radius=3D"0" class=3D"recharts-rectangle" d=3D"M 753.08,159.5 h 90 v 51.5 =
h -90 Z"></path></g></g></g></g></g><g class=3D"recharts-layer recharts-bar=
" id=3D"recharts-bar-_r_8_"><g class=3D"recharts-layer recharts-bar-rectang=
les"><g class=3D"recharts-layer"><g class=3D"recharts-layer recharts-bar-re=
ctangle"><g class=3D"recharts-layer recharts-inactive-bar"><path fill=3D"#3=
8bdf8" name=3D"Comply v2
audit readiness" x=3D"76.28" y=3D"90.8333" width=3D"90" height=3D"68.6667" =
radius=3D"0" class=3D"recharts-rectangle" d=3D"M 76.28,90.8333 h 90 v 68.66=
67 h -90 Z"></path></g></g><g class=3D"recharts-layer recharts-bar-rectangl=
e"><g class=3D"recharts-layer recharts-inactive-bar"><path fill=3D"#38bdf8"=
 name=3D"Renewal &amp; commercial" x=3D"189.08" y=3D"56.5" width=3D"90" hei=
ght=3D"128.75" radius=3D"0" class=3D"recharts-rectangle" d=3D"M 189.08,56.5=
 h 90 v 128.75 h -90 Z"></path></g></g><g class=3D"recharts-layer recharts-=
bar-rectangle"><g class=3D"recharts-layer recharts-inactive-bar"><path fill=
=3D"#38bdf8" name=3D"SSO
Identity failures" x=3D"301.88" y=3D"142.3333" width=3D"90" height=3D"17.16=
67" radius=3D"0" class=3D"recharts-rectangle" d=3D"M 301.88,142.3333 h 90 v=
 17.1667 h -90 Z"></path></g></g><g class=3D"recharts-layer recharts-bar-re=
ctangle"><g class=3D"recharts-layer recharts-inactive-bar"><path fill=3D"#3=
8bdf8" name=3D"Incident communication gaps" x=3D"527.48" y=3D"159.5" width=
=3D"90" height=3D"17.1667" radius=3D"0" class=3D"recharts-rectangle" d=3D"M=
 527.48,159.5 h 90 v 17.1667 h -90 Z"></path></g></g><g class=3D"recharts-l=
ayer recharts-bar-rectangle"><g class=3D"recharts-layer recharts-inactive-b=
ar"><path fill=3D"#38bdf8" name=3D"Product roadmap &amp; planning" x=3D"640=
.28" y=3D"185.25" width=3D"90" height=3D"25.75" radius=3D"0" class=3D"recha=
rts-rectangle" d=3D"M 640.28,185.25 h 90 v 25.75 h -90 Z"></path></g></g><g=
 class=3D"recharts-layer recharts-bar-rectangle"><g class=3D"recharts-layer=
 recharts-inactive-bar"><path fill=3D"#38bdf8" name=3D"Protect
backup &amp; restore" x=3D"753.08" y=3D"150.9167" width=3D"90" height=3D"8.=
5833" radius=3D"0" class=3D"recharts-rectangle" d=3D"M 753.08,150.9167 h 90=
 v 8.5833 h -90 Z"></path></g></g><g class=3D"recharts-layer recharts-bar-r=
ectangle"><g class=3D"recharts-layer recharts-inactive-bar"><path fill=3D"#=
38bdf8" name=3D"Onboarding &amp; adoption" x=3D"865.88" y=3D"159.5" width=
=3D"90" height=3D"51.5" radius=3D"0" class=3D"recharts-rectangle" d=3D"M 86=
5.88,159.5 h 90 v 51.5 h -90 Z"></path></g></g><g class=3D"recharts-layer r=
echarts-bar-rectangle"><g class=3D"recharts-layer recharts-inactive-bar"><p=
ath fill=3D"#38bdf8" name=3D"Competitive evaluation" x=3D"978.68" y=3D"193.=
8333" width=3D"90" height=3D"17.1667" radius=3D"0" class=3D"recharts-rectan=
gle" d=3D"M 978.68,193.8333 h 90 v 17.1667 h -90 Z"></path></g></g></g></g>=
</g><g class=3D"recharts-layer recharts-bar" id=3D"recharts-bar-_r_9_"><g c=
lass=3D"recharts-layer recharts-bar-rectangles"><g class=3D"recharts-layer"=
><g class=3D"recharts-layer recharts-bar-rectangle"><g class=3D"recharts-la=
yer recharts-inactive-bar"><path fill=3D"#a78bfa" name=3D"Comply v2
audit readiness" x=3D"76.28" y=3D"30.75" width=3D"90" height=3D"60.0833" ra=
dius=3D"0" class=3D"recharts-rectangle" d=3D"M 76.28,30.75 h 90 v 60.0833 h=
 -90 Z"></path></g></g><g class=3D"recharts-layer recharts-bar-rectangle"><=
g class=3D"recharts-layer recharts-inactive-bar"><path fill=3D"#a78bfa" nam=
e=3D"SSO
Identity failures" x=3D"301.88" y=3D"125.1667" width=3D"90" height=3D"17.16=
67" radius=3D"0" class=3D"recharts-rectangle" d=3D"M 301.88,125.1667 h 90 v=
 17.1667 h -90 Z"></path></g></g><g class=3D"recharts-layer recharts-bar-re=
ctangle"><g class=3D"recharts-layer recharts-inactive-bar"><path fill=3D"#a=
78bfa" name=3D"Detect reliability
outage" x=3D"414.68" y=3D"125.1667" width=3D"90" height=3D"34.3333" radius=
=3D"0" class=3D"recharts-rectangle" d=3D"M 414.68,125.1667 h 90 v 34.3333 h=
 -90 Z"></path></g></g><g class=3D"recharts-layer recharts-bar-rectangle"><=
g class=3D"recharts-layer recharts-inactive-bar"><path fill=3D"#a78bfa" nam=
e=3D"Incident communication gaps" x=3D"527.48" y=3D"133.75" width=3D"90" he=
ight=3D"25.75" radius=3D"0" class=3D"recharts-rectangle" d=3D"M 527.48,133.=
75 h 90 v 25.75 h -90 Z"></path></g></g><g class=3D"recharts-layer recharts=
-bar-rectangle"><g class=3D"recharts-layer recharts-inactive-bar"><path fil=
l=3D"#a78bfa" name=3D"Product roadmap &amp; planning" x=3D"640.28" y=3D"142=
.3333" width=3D"90" height=3D"42.9167" radius=3D"0" class=3D"recharts-recta=
ngle" d=3D"M 640.28,142.3333 h 90 v 42.9167 h -90 Z"></path></g></g><g clas=
s=3D"recharts-layer recharts-bar-rectangle"><g class=3D"recharts-layer rech=
arts-inactive-bar"><path fill=3D"#a78bfa" name=3D"Competitive evaluation" x=
=3D"978.68" y=3D"159.5" width=3D"90" height=3D"34.3333" radius=3D"0" class=
=3D"recharts-rectangle" d=3D"M 978.68,159.5 h 90 v 34.3333 h -90 Z"></path>=
</g></g><g class=3D"recharts-layer recharts-bar-rectangle"><g class=3D"rech=
arts-layer recharts-inactive-bar"><path fill=3D"#a78bfa" name=3D"Internal e=
ngineering ops" x=3D"1091.48" y=3D"168.0833" width=3D"90" height=3D"42.9167=
" radius=3D"0" class=3D"recharts-rectangle" d=3D"M 1091.48,168.0833 h 90 v =
42.9167 h -90 Z"></path></g></g></g></g></g></g><g tabindex=3D"-1" class=3D=
"recharts-zIndex-layer_400"></g><g tabindex=3D"-1" class=3D"recharts-zIndex=
-layer_500"><g class=3D"recharts-layer recharts-cartesian-axis recharts-xAx=
is xAxis"><line angle=3D"-25" text-anchor=3D"end" height=3D"80" orientation=
=3D"bottom" x=3D"65" y=3D"211" width=3D"1128" class=3D"recharts-cartesian-a=
xis-line" stroke=3D"#666" fill=3D"none" x1=3D"65" y1=3D"211" x2=3D"1193" y2=
=3D"211"></line><g class=3D"recharts-cartesian-axis-ticks recharts-xAxis-ti=
cks"><g class=3D"recharts-cartesian-axis-tick-lines recharts-xAxis-tick-lin=
es"><g class=3D"recharts-layer recharts-cartesian-axis-tick"><line angle=3D=
"-25" text-anchor=3D"end" height=3D"80" orientation=3D"bottom" x=3D"65" y=
=3D"211" width=3D"1128" class=3D"recharts-cartesian-axis-tick-line" stroke=
=3D"#666" fill=3D"none" x1=3D"121.4" y1=3D"217" x2=3D"121.4" y2=3D"211"></l=
ine></g><g class=3D"recharts-layer recharts-cartesian-axis-tick"><line angl=
e=3D"-25" text-anchor=3D"end" height=3D"80" orientation=3D"bottom" x=3D"65"=
 y=3D"211" width=3D"1128" class=3D"recharts-cartesian-axis-tick-line" strok=
e=3D"#666" fill=3D"none" x1=3D"234.20000000000002" y1=3D"217" x2=3D"234.200=
00000000002" y2=3D"211"></line></g><g class=3D"recharts-layer recharts-cart=
esian-axis-tick"><line angle=3D"-25" text-anchor=3D"end" height=3D"80" orie=
ntation=3D"bottom" x=3D"65" y=3D"211" width=3D"1128" class=3D"recharts-cart=
esian-axis-tick-line" stroke=3D"#666" fill=3D"none" x1=3D"347" y1=3D"217" x=
2=3D"347" y2=3D"211"></line></g><g class=3D"recharts-layer recharts-cartesi=
an-axis-tick"><line angle=3D"-25" text-anchor=3D"end" height=3D"80" orienta=
tion=3D"bottom" x=3D"65" y=3D"211" width=3D"1128" class=3D"recharts-cartesi=
an-axis-tick-line" stroke=3D"#666" fill=3D"none" x1=3D"459.79999999999995" =
y1=3D"217" x2=3D"459.79999999999995" y2=3D"211"></line></g><g class=3D"rech=
arts-layer recharts-cartesian-axis-tick"><line angle=3D"-25" text-anchor=3D=
"end" height=3D"80" orientation=3D"bottom" x=3D"65" y=3D"211" width=3D"1128=
" class=3D"recharts-cartesian-axis-tick-line" stroke=3D"#666" fill=3D"none"=
 x1=3D"572.6" y1=3D"217" x2=3D"572.6" y2=3D"211"></line></g><g class=3D"rec=
harts-layer recharts-cartesian-axis-tick"><line angle=3D"-25" text-anchor=
=3D"end" height=3D"80" orientation=3D"bottom" x=3D"65" y=3D"211" width=3D"1=
128" class=3D"recharts-cartesian-axis-tick-line" stroke=3D"#666" fill=3D"no=
ne" x1=3D"685.4" y1=3D"217" x2=3D"685.4" y2=3D"211"></line></g><g class=3D"=
recharts-layer recharts-cartesian-axis-tick"><line angle=3D"-25" text-ancho=
r=3D"end" height=3D"80" orientation=3D"bottom" x=3D"65" y=3D"211" width=3D"=
1128" class=3D"recharts-cartesian-axis-tick-line" stroke=3D"#666" fill=3D"n=
one" x1=3D"798.1999999999999" y1=3D"217" x2=3D"798.1999999999999" y2=3D"211=
"></line></g><g class=3D"recharts-layer recharts-cartesian-axis-tick"><line=
 angle=3D"-25" text-anchor=3D"end" height=3D"80" orientation=3D"bottom" x=
=3D"65" y=3D"211" width=3D"1128" class=3D"recharts-cartesian-axis-tick-line=
" stroke=3D"#666" fill=3D"none" x1=3D"911" y1=3D"217" x2=3D"911" y2=3D"211"=
></line></g><g class=3D"recharts-layer recharts-cartesian-axis-tick"><line =
angle=3D"-25" text-anchor=3D"end" height=3D"80" orientation=3D"bottom" x=3D=
"65" y=3D"211" width=3D"1128" class=3D"recharts-cartesian-axis-tick-line" s=
troke=3D"#666" fill=3D"none" x1=3D"1023.8" y1=3D"217" x2=3D"1023.8" y2=3D"2=
11"></line></g><g class=3D"recharts-layer recharts-cartesian-axis-tick"><li=
ne angle=3D"-25" text-anchor=3D"end" height=3D"80" orientation=3D"bottom" x=
=3D"65" y=3D"211" width=3D"1128" class=3D"recharts-cartesian-axis-tick-line=
" stroke=3D"#666" fill=3D"none" x1=3D"1136.6" y1=3D"217" x2=3D"1136.6" y2=
=3D"211"></line></g></g></g></g><g class=3D"recharts-layer recharts-cartesi=
an-axis recharts-yAxis yAxis"><line angle=3D"0" orientation=3D"left" width=
=3D"60" x=3D"5" y=3D"5" height=3D"206" class=3D"recharts-cartesian-axis-lin=
e" stroke=3D"#666" fill=3D"none" x1=3D"65" y1=3D"5" x2=3D"65" y2=3D"211"></=
line><g class=3D"recharts-cartesian-axis-ticks recharts-yAxis-ticks"><g cla=
ss=3D"recharts-cartesian-axis-tick-lines recharts-yAxis-tick-lines"><g clas=
s=3D"recharts-layer recharts-cartesian-axis-tick"><line angle=3D"0" orienta=
tion=3D"left" width=3D"60" x=3D"5" y=3D"5" height=3D"206" class=3D"recharts=
-cartesian-axis-tick-line" stroke=3D"#666" fill=3D"none" x1=3D"59" y1=3D"21=
1" x2=3D"65" y2=3D"211"></line></g><g class=3D"recharts-layer recharts-cart=
esian-axis-tick"><line angle=3D"0" orientation=3D"left" width=3D"60" x=3D"5=
" y=3D"5" height=3D"206" class=3D"recharts-cartesian-axis-tick-line" stroke=
=3D"#666" fill=3D"none" x1=3D"59" y1=3D"159.5" x2=3D"65" y2=3D"159.5"></lin=
e></g><g class=3D"recharts-layer recharts-cartesian-axis-tick"><line angle=
=3D"0" orientation=3D"left" width=3D"60" x=3D"5" y=3D"5" height=3D"206" cla=
ss=3D"recharts-cartesian-axis-tick-line" stroke=3D"#666" fill=3D"none" x1=
=3D"59" y1=3D"108" x2=3D"65" y2=3D"108"></line></g><g class=3D"recharts-lay=
er recharts-cartesian-axis-tick"><line angle=3D"0" orientation=3D"left" wid=
th=3D"60" x=3D"5" y=3D"5" height=3D"206" class=3D"recharts-cartesian-axis-t=
ick-line" stroke=3D"#666" fill=3D"none" x1=3D"59" y1=3D"56.5" x2=3D"65" y2=
=3D"56.5"></line></g><g class=3D"recharts-layer recharts-cartesian-axis-tic=
k"><line angle=3D"0" orientation=3D"left" width=3D"60" x=3D"5" y=3D"5" heig=
ht=3D"206" class=3D"recharts-cartesian-axis-tick-line" stroke=3D"#666" fill=
=3D"none" x1=3D"59" y1=3D"5" x2=3D"65" y2=3D"5"></line></g></g></g></g></g>=
<g tabindex=3D"-1" class=3D"recharts-zIndex-layer_600"></g><g tabindex=3D"-=
1" class=3D"recharts-zIndex-layer_1000"></g><g tabindex=3D"-1" class=3D"rec=
harts-zIndex-layer_1100"></g><g tabindex=3D"-1" class=3D"recharts-zIndex-la=
yer_1200"></g><g tabindex=3D"-1" class=3D"recharts-zIndex-layer_2000"><g cl=
ass=3D"recharts-cartesian-axis-tick-labels recharts-xAxis-tick-labels"><g c=
lass=3D"recharts-layer recharts-cartesian-axis-tick-label"><text height=3D"=
80" orientation=3D"bottom" width=3D"1128" stroke=3D"none" font-size=3D"10" =
transform=3D"rotate(-25, 121.4, 219)" x=3D"121.4" y=3D"219" class=3D"rechar=
ts-text recharts-cartesian-axis-tick-value" text-anchor=3D"end" fill=3D"#94=
a3b8"><tspan x=3D"121.4" dy=3D"0.71em">Comply v2 / audit readiness</tspan><=
/text></g><g class=3D"recharts-layer recharts-cartesian-axis-tick-label"><t=
ext height=3D"80" orientation=3D"bottom" width=3D"1128" stroke=3D"none" fon=
t-size=3D"10" transform=3D"rotate(-25, 234.20000000000002, 219)" x=3D"234.2=
0000000000002" y=3D"219" class=3D"recharts-text recharts-cartesian-axis-tic=
k-value" text-anchor=3D"end" fill=3D"#94a3b8"><tspan x=3D"234.2000000000000=
2" dy=3D"0.71em">Renewal &amp; commercial</tspan></text></g><g class=3D"rec=
harts-layer recharts-cartesian-axis-tick-label"><text height=3D"80" orienta=
tion=3D"bottom" width=3D"1128" stroke=3D"none" font-size=3D"10" transform=
=3D"rotate(-25, 347, 219)" x=3D"347" y=3D"219" class=3D"recharts-text recha=
rts-cartesian-axis-tick-value" text-anchor=3D"end" fill=3D"#94a3b8"><tspan =
x=3D"347" dy=3D"0.71em">SSO / Identity failures</tspan></text></g><g class=
=3D"recharts-layer recharts-cartesian-axis-tick-label"><text height=3D"80" =
orientation=3D"bottom" width=3D"1128" stroke=3D"none" font-size=3D"10" tran=
sform=3D"rotate(-25, 459.79999999999995, 219)" x=3D"459.79999999999995" y=
=3D"219" class=3D"recharts-text recharts-cartesian-axis-tick-value" text-an=
chor=3D"end" fill=3D"#94a3b8"><tspan x=3D"459.79999999999995" dy=3D"0.71em"=
>Detect reliability / outage</tspan></text></g><g class=3D"recharts-layer r=
echarts-cartesian-axis-tick-label"><text height=3D"80" orientation=3D"botto=
m" width=3D"1128" stroke=3D"none" font-size=3D"10" transform=3D"rotate(-25,=
 572.6, 219)" x=3D"572.6" y=3D"219" class=3D"recharts-text recharts-cartesi=
an-axis-tick-value" text-anchor=3D"end" fill=3D"#94a3b8"><tspan x=3D"572.6"=
 dy=3D"0.71em">Incident communication gaps</tspan></text></g><g class=3D"re=
charts-layer recharts-cartesian-axis-tick-label"><text height=3D"80" orient=
ation=3D"bottom" width=3D"1128" stroke=3D"none" font-size=3D"10" transform=
=3D"rotate(-25, 685.4, 219)" x=3D"685.4" y=3D"219" class=3D"recharts-text r=
echarts-cartesian-axis-tick-value" text-anchor=3D"end" fill=3D"#94a3b8"><ts=
pan x=3D"685.4" dy=3D"0.71em">Product roadmap &amp; planning</tspan></text>=
</g><g class=3D"recharts-layer recharts-cartesian-axis-tick-label"><text he=
ight=3D"80" orientation=3D"bottom" width=3D"1128" stroke=3D"none" font-size=
=3D"10" transform=3D"rotate(-25, 798.1999999999999, 219)" x=3D"798.19999999=
99999" y=3D"219" class=3D"recharts-text recharts-cartesian-axis-tick-value"=
 text-anchor=3D"end" fill=3D"#94a3b8"><tspan x=3D"798.1999999999999" dy=3D"=
0.71em">Protect / backup &amp; restore</tspan></text></g><g class=3D"rechar=
ts-layer recharts-cartesian-axis-tick-label"><text height=3D"80" orientatio=
n=3D"bottom" width=3D"1128" stroke=3D"none" font-size=3D"10" transform=3D"r=
otate(-25, 911, 219)" x=3D"911" y=3D"219" class=3D"recharts-text recharts-c=
artesian-axis-tick-value" text-anchor=3D"end" fill=3D"#94a3b8"><tspan x=3D"=
911" dy=3D"0.71em">Onboarding &amp; adoption</tspan></text></g><g class=3D"=
recharts-layer recharts-cartesian-axis-tick-label"><text height=3D"80" orie=
ntation=3D"bottom" width=3D"1128" stroke=3D"none" font-size=3D"10" transfor=
m=3D"rotate(-25, 1023.8, 219)" x=3D"1023.8" y=3D"219" class=3D"recharts-tex=
t recharts-cartesian-axis-tick-value" text-anchor=3D"end" fill=3D"#94a3b8">=
<tspan x=3D"1023.8" dy=3D"0.71em">Competitive evaluation</tspan></text></g>=
<g class=3D"recharts-layer recharts-cartesian-axis-tick-label"><text height=
=3D"80" orientation=3D"bottom" width=3D"1128" stroke=3D"none" font-size=3D"=
10" transform=3D"rotate(-25, 1136.6, 219)" x=3D"1136.6" y=3D"219" class=3D"=
recharts-text recharts-cartesian-axis-tick-value" text-anchor=3D"end" fill=
=3D"#94a3b8"><tspan x=3D"1136.6" dy=3D"0.71em">Internal engineering ops</ts=
pan></text></g></g><g class=3D"recharts-cartesian-axis-tick-labels recharts=
-yAxis-tick-labels"><g class=3D"recharts-layer recharts-cartesian-axis-tick=
-label"><text orientation=3D"left" width=3D"60" height=3D"206" stroke=3D"no=
ne" x=3D"57" y=3D"211" class=3D"recharts-text recharts-cartesian-axis-tick-=
value" text-anchor=3D"end" fill=3D"#94a3b8"><tspan x=3D"57" dy=3D"0.355em">=
0</tspan></text></g><g class=3D"recharts-layer recharts-cartesian-axis-tick=
-label"><text orientation=3D"left" width=3D"60" height=3D"206" stroke=3D"no=
ne" x=3D"57" y=3D"159.5" class=3D"recharts-text recharts-cartesian-axis-tic=
k-value" text-anchor=3D"end" fill=3D"#94a3b8"><tspan x=3D"57" dy=3D"0.355em=
">6</tspan></text></g><g class=3D"recharts-layer recharts-cartesian-axis-ti=
ck-label"><text orientation=3D"left" width=3D"60" height=3D"206" stroke=3D"=
none" x=3D"57" y=3D"108" class=3D"recharts-text recharts-cartesian-axis-tic=
k-value" text-anchor=3D"end" fill=3D"#94a3b8"><tspan x=3D"57" dy=3D"0.355em=
">12</tspan></text></g><g class=3D"recharts-layer recharts-cartesian-axis-t=
ick-label"><text orientation=3D"left" width=3D"60" height=3D"206" stroke=3D=
"none" x=3D"57" y=3D"56.5" class=3D"recharts-text recharts-cartesian-axis-t=
ick-value" text-anchor=3D"end" fill=3D"#94a3b8"><tspan x=3D"57" dy=3D"0.355=
em">18</tspan></text></g><g class=3D"recharts-layer recharts-cartesian-axis=
-tick-label"><text orientation=3D"left" width=3D"60" height=3D"206" stroke=
=3D"none" x=3D"57" y=3D"12" class=3D"recharts-text recharts-cartesian-axis-=
tick-value" text-anchor=3D"end" fill=3D"#94a3b8"><tspan x=3D"57" dy=3D"0.35=
5em">24</tspan></text></g></g></g></svg></div></div></div></div></section><=
div class=3D"grid gap-4 lg:grid-cols-3"><section class=3D"rounded-xl border=
 border-slate-800 bg-slate-900/60 p-4 lg:col-span-1"><h2 class=3D"mb-3 text=
-sm font-semibold tracking-wide text-slate-300">Codebook</h2><ul class=3D"s=
pace-y-1 text-sm"><li><button type=3D"button" class=3D"w-full rounded px-2 =
py-1 text-left bg-slate-800"><span class=3D"font-medium">Comply v2 / audit =
readiness</span><span class=3D"float-right text-slate-500">21</span></butto=
n></li><li><button type=3D"button" class=3D"w-full rounded px-2 py-1 text-l=
eft hover:bg-slate-800/60"><span class=3D"font-medium">Renewal &amp; commer=
cial</span><span class=3D"float-right text-slate-500">18</span></button></l=
i><li><button type=3D"button" class=3D"w-full rounded px-2 py-1 text-left h=
over:bg-slate-800/60"><span class=3D"font-medium">SSO / Identity failures</=
span><span class=3D"float-right text-slate-500">10</span></button></li><li>=
<button type=3D"button" class=3D"w-full rounded px-2 py-1 text-left hover:b=
g-slate-800/60"><span class=3D"font-medium">Detect reliability / outage</sp=
an><span class=3D"float-right text-slate-500">10</span></button></li><li><b=
utton type=3D"button" class=3D"w-full rounded px-2 py-1 text-left hover:bg-=
slate-800/60"><span class=3D"font-medium">Incident communication gaps</span=
><span class=3D"float-right text-slate-500">9</span></button></li><li><butt=
on type=3D"button" class=3D"w-full rounded px-2 py-1 text-left hover:bg-sla=
te-800/60"><span class=3D"font-medium">Product roadmap &amp; planning</span=
><span class=3D"float-right text-slate-500">8</span></button></li><li><butt=
on type=3D"button" class=3D"w-full rounded px-2 py-1 text-left hover:bg-sla=
te-800/60"><span class=3D"font-medium">Protect / backup &amp; restore</span=
><span class=3D"float-right text-slate-500">7</span></button></li><li><butt=
on type=3D"button" class=3D"w-full rounded px-2 py-1 text-left hover:bg-sla=
te-800/60"><span class=3D"font-medium">Onboarding &amp; adoption</span><spa=
n class=3D"float-right text-slate-500">6</span></button></li><li><button ty=
pe=3D"button" class=3D"w-full rounded px-2 py-1 text-left hover:bg-slate-80=
0/60"><span class=3D"font-medium">Competitive evaluation</span><span class=
=3D"float-right text-slate-500">6</span></button></li><li><button type=3D"b=
utton" class=3D"w-full rounded px-2 py-1 text-left hover:bg-slate-800/60"><=
span class=3D"font-medium">Internal engineering ops</span><span class=3D"fl=
oat-right text-slate-500">5</span></button></li></ul></section><section cla=
ss=3D"rounded-xl border border-slate-800 bg-slate-900/60 p-4 lg:col-span-2"=
><h2 class=3D"mb-3 text-sm font-semibold tracking-wide text-slate-300">Comp=
ly v2 / audit readiness =E2=80=94 examples</h2><p class=3D"mb-3 text-xs tex=
t-slate-500">Primary theme 'Comply v2 / audit readiness' scored highest wit=
h title weighted above provided topics and transcript keywords.</p><div cla=
ss=3D"space-y-3"><div class=3D"rounded-lg border border-slate-800 p-3"><div=
 class=3D"mb-1 flex flex-wrap items-center gap-2"><span class=3D"inline-fle=
x rounded-full px-2 py-0.5 text-xs font-medium bg-amber-500/15 text-amber-3=
00">support</span><a class=3D"text-sky-300 hover:underline" href=3D"http://=
127.0.0.1:5173/meetings/01KQ9A6BE09D73A9BB5798C7" data-discover=3D"true">Su=
pport Case #3615 - Nimbus Platform Custom Report Request</a></div><p class=
=3D"text-xs italic text-slate-400">=E2=80=9CKeith Donovan: So right now the=
 reports we're pulling out of Comply are pretty much the standard framework=
 reports, right =E2=80=94 you get your SOC 2 summary, your control status, =
all that. Which is fine. But what we need is the ability to kind of cross-r=
eference controls across multiple frameworks in a single report. So for exa=
mple, I want to see a control that maps to both SOC 2 and ISO 27001 in the =
same view, side by side.=E2=80=9D</p></div><div class=3D"rounded-lg border =
border-slate-800 p-3"><div class=3D"mb-1 flex flex-wrap items-center gap-2"=
><span class=3D"inline-flex rounded-full px-2 py-0.5 text-xs font-medium bg=
-sky-500/15 text-sky-300">external</span><a class=3D"text-sky-300 hover:und=
erline" href=3D"http://127.0.0.1:5173/meetings/01KQ85D10E82A26A8F754FB8" da=
ta-discover=3D"true">Aegis / Bridgeport Health - Compliance Review</a></div=
><p class=3D"text-xs italic text-slate-400">=E2=80=9CEvelyn Park: It's hone=
stly a little bit of everything. We've got a HIPAA audit coming up in Q2, o=
ur board has been asking more pointed questions about our security posture,=
 and um, we just onboarded two new hospital systems into our network so the=
 scope of what we're responsible for has expanded significantly.=E2=80=9D</=
p></div><div class=3D"rounded-lg border border-slate-800 p-3"><div class=3D=
"mb-1 flex flex-wrap items-center gap-2"><span class=3D"inline-flex rounded=
-full px-2 py-0.5 text-xs font-medium bg-violet-500/15 text-violet-300">int=
ernal</span><a class=3D"text-sky-300 hover:underline" href=3D"http://127.0.=
0.1:5173/meetings/01KQ0CAE7F064EC93F0540CA" data-discover=3D"true">Weekly E=
ngineering Standup</a></div><p class=3D"text-xs italic text-slate-400">=E2=
=80=9CChris Lee: No worries. Okay, so usual format =E2=80=94 let's do a qui=
ck status round, then I want to spend some time on the Detect pipeline work=
 and the Comply v2 timeline. Mike, you want to kick us off?=E2=80=9D</p></d=
iv><div class=3D"rounded-lg border border-slate-800 p-3"><div class=3D"mb-1=
 flex flex-wrap items-center gap-2"><span class=3D"inline-flex rounded-full=
 px-2 py-0.5 text-xs font-medium bg-violet-500/15 text-violet-300">internal=
</span><a class=3D"text-sky-300 hover:underline" href=3D"http://127.0.0.1:5=
173/meetings/01KQ1267C6AA7D9B3125FEC8" data-discover=3D"true">SOC 2 Audit P=
reparation - Internal</a></div><p class=3D"text-xs italic text-slate-400">=
=E2=80=9CRaj Kapoor: No worries. Okay so, the reason I pulled everyone toge=
ther today =E2=80=94 as you all know we've got our SOC 2 Type II audit wind=
ow coming up, and I want to make sure we're not scrambling at the last minu=
te. The auditors are going to want evidence going back several months so we=
 need to be organized now.=E2=80=9D</p></div><div class=3D"rounded-lg borde=
r border-slate-800 p-3"><div class=3D"mb-1 flex flex-wrap items-center gap-=
2"><span class=3D"inline-flex rounded-full px-2 py-0.5 text-xs font-medium =
bg-sky-500/15 text-sky-300">external</span><a class=3D"text-sky-300 hover:u=
nderline" href=3D"http://127.0.0.1:5173/meetings/01KQAFB8DBF6E1E2FDEF0B75" =
data-discover=3D"true">Aegis / Maplewood Goods - SOC 2 Prep Review</a></div=
><p class=3D"text-xs italic text-slate-400">=E2=80=9CNathan Perry: Yeah, li=
kewise Sofia. And honestly, the timing on this couldn't be better for us. W=
e've got an auditor engagement scoped for, uh, Q2 =E2=80=94 so probably May=
 or June =E2=80=94 and we're kind of scrambling to get our evidence collect=
ion and reporting story together.=E2=80=9D</p></div><div class=3D"rounded-l=
g border border-slate-800 p-3"><div class=3D"mb-1 flex flex-wrap items-cent=
er gap-2"><span class=3D"inline-flex rounded-full px-2 py-0.5 text-xs font-=
medium bg-sky-500/15 text-sky-300">external</span><a class=3D"text-sky-300 =
hover:underline" href=3D"http://127.0.0.1:5173/meetings/01KQ2B4878EC7B3EE55=
47007" data-discover=3D"true">Aegis / Stratos Cloud - Audit Preparation</a>=
</div><p class=3D"text-xs italic text-slate-400">=E2=80=9CDamien Rowe: Yeah=
, it's been a busy year for us, that's for sure. We've got a pretty big aud=
it coming up and honestly that's =E2=80=94 that's the main driver for this =
call today.=E2=80=9D</p></div></div></section></div></div></main></div></di=
v>
   =20
 =20

<span id=3D"recharts_measurement_span" aria-hidden=3D"true" style=3D"positi=
on: absolute; top: -20000px; left: 0px; padding: 0px; margin: 0px; border-w=
idth: medium; border-style: none; border-color: currentcolor; border-image:=
 none; white-space: pre; font-size: 16px; letter-spacing: normal;">-1</span=
></body></html>
------MultipartBoundary--gcWkh37lRcCKiU39VJCKjzFghSBIJdgM7vDWYkYsXU----
Content-Type: text/css
Content-Transfer-Encoding: quoted-printable
Content-Location: cid:css-b8665d07-b249-41d3-aa11-2d829f9eaeb0@mhtml.blink

@charset "utf-8";

@layer properties;

@layer theme, base, components, utilities;

@layer theme {
  :root, :host { --font-sans: -apple-system, BlinkMacSystemFont, "Segoe UI"=
, Roboto, "Helvetica Neue",
      "Noto Sans", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji"=
,
      "Segoe UI Symbol", "Noto Color Emoji"; --font-mono: ui-monospace, SFM=
ono-Regular, Menlo, Monaco, Consolas, "Liberation Mono",
      "Courier New", monospace; --color-amber-300: oklch(87.9% 0.169 91.605=
); --color-amber-400: oklch(82.8% 0.189 84.429); --color-amber-500: oklch(7=
6.9% 0.188 70.08); --color-amber-700: oklch(55.5% 0.163 48.998); --color-em=
erald-300: oklch(84.5% 0.143 164.978); --color-emerald-400: oklch(76.5% 0.1=
77 163.223); --color-emerald-500: oklch(69.6% 0.17 162.48); --color-sky-300=
: oklch(82.8% 0.111 230.318); --color-sky-400: oklch(74.6% 0.16 232.661); -=
-color-sky-500: oklch(68.5% 0.169 237.323); --color-sky-700: oklch(50% 0.13=
4 242.749); --color-violet-300: oklch(81.1% 0.111 293.571); --color-violet-=
400: oklch(70.2% 0.183 293.541); --color-violet-500: oklch(60.6% 0.25 292.7=
17); --color-rose-300: oklch(81% 0.117 11.638); --color-rose-500: oklch(64.=
5% 0.246 16.439); --color-slate-100: oklch(96.8% 0.007 247.896); --color-sl=
ate-200: oklch(92.9% 0.013 255.508); --color-slate-300: oklch(86.9% 0.022 2=
52.894); --color-slate-400: oklch(70.4% 0.04 256.788); --color-slate-500: o=
klch(55.4% 0.046 257.417); --color-slate-800: oklch(27.9% 0.041 260.031); -=
-color-slate-900: oklch(20.8% 0.042 265.755); --color-slate-950: oklch(12.9=
% 0.042 264.695); --color-white: #fff; --spacing: 0.25rem; --container-3xl:=
 48rem; --container-7xl: 80rem; --text-xs: 0.75rem; --text-xs--line-height:=
 calc(1 / 0.75); --text-sm: 0.875rem; --text-sm--line-height: calc(1.25 / 0=
.875); --text-xl: 1.25rem; --text-xl--line-height: calc(1.75 / 1.25); --tex=
t-2xl: 1.5rem; --text-2xl--line-height: calc(2 / 1.5); --font-weight-medium=
: 500; --font-weight-semibold: 600; --tracking-tight: -0.025em; --tracking-=
wide: 0.025em; --radius-md: 0.375rem; --radius-lg: 0.5rem; --radius-xl: 0.7=
5rem; --default-font-family: var(--font-sans); --default-mono-font-family: =
var(--font-mono); }
}

@layer base {
  *, ::after, ::before, ::backdrop, ::file-selector-button { box-sizing: bo=
rder-box; margin: 0px; padding: 0px; border: 0px solid; }
  html, :host { line-height: 1.5; text-size-adjust: 100%; tab-size: 4; font=
-family: var(--default-font-family, -apple-system, BlinkMacSystemFont, "Seg=
oe UI", Roboto, "Helvetica Neue", "Noto Sans", Arial, sans-serif, "Apple Co=
lor Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"); font-=
feature-settings: var(--default-font-feature-settings, normal); font-variat=
ion-settings: var(--default-font-variation-settings, normal); -webkit-tap-h=
ighlight-color: transparent; }
  hr { height: 0px; color: inherit; border-top-width: 1px; }
  abbr:where([title]) { text-decoration: underline dotted; }
  h1, h2, h3, h4, h5, h6 { font-size: inherit; font-weight: inherit; }
  a { color: inherit; text-decoration: inherit; }
  b, strong { font-weight: bolder; }
  code, kbd, samp, pre { font-family: var(--default-mono-font-family, ui-mo=
nospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Couri=
er New", monospace); font-feature-settings: var(--default-mono-font-feature=
-settings, normal); font-variation-settings: var(--default-mono-font-variat=
ion-settings, normal); font-size: 1em; }
  small { font-size: 80%; }
  sub, sup { font-size: 75%; line-height: 0; position: relative; vertical-a=
lign: baseline; }
  sub { bottom: -0.25em; }
  sup { top: -0.5em; }
  table { text-indent: 0px; border-color: inherit; border-collapse: collaps=
e; }
  progress { vertical-align: baseline; }
  summary { display: list-item; }
  ol, ul, menu { list-style: none; }
  img, svg, video, canvas, audio, iframe, embed, object { display: block; v=
ertical-align: middle; }
  img, video { max-width: 100%; height: auto; }
  button, input, select, optgroup, textarea, ::file-selector-button { font:=
 inherit; letter-spacing: inherit; color: inherit; border-radius: 0px; back=
ground-color: transparent; opacity: 1; }
  :where(select:is([multiple], [size])) optgroup { font-weight: bolder; }
  :where(select:is([multiple], [size])) optgroup option { padding-inline-st=
art: 20px; }
  ::file-selector-button { margin-inline-end: 4px; }
  ::placeholder { opacity: 1; }
  @supports (not (-webkit-appearance: -apple-pay-button)) or (contain-intri=
nsic-size: 1px) {
  ::placeholder {
  color: currentcolor;
  @supports (color: color-mix(in lab, red, red)) {
  color: color-mix(currentcolor, transparent);
}
}
}
  textarea { resize: vertical; }
  ::-webkit-search-decoration { appearance: none; }
  ::-webkit-date-and-time-value { min-height: 1lh; text-align: inherit; }
  ::-webkit-datetime-edit { display: inline-flex; }
  ::-webkit-datetime-edit-fields-wrapper { padding: 0px; }
  ::-webkit-datetime-edit, ::-webkit-datetime-edit-year-field, ::-webkit-da=
tetime-edit-month-field, ::-webkit-datetime-edit-day-field, ::-webkit-datet=
ime-edit-hour-field, ::-webkit-datetime-edit-minute-field, ::-webkit-dateti=
me-edit-second-field, ::-webkit-datetime-edit-millisecond-field, ::-webkit-=
datetime-edit-meridiem-field { padding-block: 0px; }
  ::-webkit-calendar-picker-indicator { line-height: 1; }
  button, input:where([type=3D"button"], [type=3D"reset"], [type=3D"submit"=
]), ::file-selector-button { appearance: button; }
  ::-webkit-inner-spin-button, ::-webkit-outer-spin-button { height: auto; =
}
  [hidden]:where(:not([hidden=3D"until-found"])) { display: none !important=
; }
}

@layer utilities {
  .sticky { position: sticky; }
  .top-0 { top: 0px; }
  .z-20 { z-index: 20; }
  .float-right { float: right; }
  .mx-auto { margin-inline: auto; }
  .mt-1 { margin-top: var(--spacing); }
  .mt-3 { margin-top: calc(var(--spacing) * 3); }
  .mr-1 { margin-right: var(--spacing); }
  .mb-1 { margin-bottom: var(--spacing); }
  .mb-2 { margin-bottom: calc(var(--spacing) * 2); }
  .mb-3 { margin-bottom: calc(var(--spacing) * 3); }
  .ml-1 { margin-left: var(--spacing); }
  .ml-auto { margin-left: auto; }
  .flex { display: flex; }
  .grid { display: grid; }
  .inline-block { display: inline-block; }
  .inline-flex { display: inline-flex; }
  .h-2 { height: calc(var(--spacing) * 2); }
  .h-64 { height: calc(var(--spacing) * 64); }
  .h-80 { height: calc(var(--spacing) * 80); }
  .h-\[640px\] { height: 640px; }
  .min-h-screen { min-height: 100vh; }
  .w-2 { width: calc(var(--spacing) * 2); }
  .w-full { width: 100%; }
  .max-w-3xl { max-width: var(--container-3xl); }
  .max-w-7xl { max-width: var(--container-7xl); }
  .transform { transform: var(--tw-rotate-x,) var(--tw-rotate-y,) var(--tw-=
rotate-z,) var(--tw-skew-x,) var(--tw-skew-y,); }
  .list-disc { list-style-type: disc; }
  .grid-cols-2 { grid-template-columns: repeat(2, minmax(0px, 1fr)); }
  .flex-wrap { flex-wrap: wrap; }
  .items-center { align-items: center; }
  .gap-1 { gap: var(--spacing); }
  .gap-2 { gap: calc(var(--spacing) * 2); }
  .gap-3 { gap: calc(var(--spacing) * 3); }
  .gap-4 { gap: calc(var(--spacing) * 4); }
  .gap-6 { gap: calc(var(--spacing) * 6); }
  :where(.space-y-1 > :not(:last-child)) { --tw-space-y-reverse: 0; margin-=
block-start: calc(var(--spacing) * var(--tw-space-y-reverse)); margin-block=
-end: calc(var(--spacing) * calc(1 - var(--tw-space-y-reverse))); }
  :where(.space-y-2 > :not(:last-child)) { --tw-space-y-reverse: 0; margin-=
block-start: calc(calc(var(--spacing) * 2) * var(--tw-space-y-reverse)); ma=
rgin-block-end: calc(calc(var(--spacing) * 2) * calc(1 - var(--tw-space-y-r=
everse))); }
  :where(.space-y-3 > :not(:last-child)) { --tw-space-y-reverse: 0; margin-=
block-start: calc(calc(var(--spacing) * 3) * var(--tw-space-y-reverse)); ma=
rgin-block-end: calc(calc(var(--spacing) * 3) * calc(1 - var(--tw-space-y-r=
everse))); }
  :where(.space-y-4 > :not(:last-child)) { --tw-space-y-reverse: 0; margin-=
block-start: calc(calc(var(--spacing) * 4) * var(--tw-space-y-reverse)); ma=
rgin-block-end: calc(calc(var(--spacing) * 4) * calc(1 - var(--tw-space-y-r=
everse))); }
  :where(.space-y-6 > :not(:last-child)) { --tw-space-y-reverse: 0; margin-=
block-start: calc(calc(var(--spacing) * 6) * var(--tw-space-y-reverse)); ma=
rgin-block-end: calc(calc(var(--spacing) * 6) * calc(1 - var(--tw-space-y-r=
everse))); }
  :where(.space-x-1 > :not(:last-child)) { --tw-space-x-reverse: 0; margin-=
inline-start: calc(var(--spacing) * var(--tw-space-x-reverse)); margin-inli=
ne-end: calc(var(--spacing) * calc(1 - var(--tw-space-x-reverse))); }
  .overflow-hidden { overflow: hidden; }
  .overflow-x-auto { overflow-x: auto; }
  .rounded { border-radius: 0.25rem; }
  .rounded-full { border-radius: calc(infinity * 1px); }
  .rounded-lg { border-radius: var(--radius-lg); }
  .rounded-md { border-radius: var(--radius-md); }
  .rounded-xl { border-radius: var(--radius-xl); }
  .border { border-style: var(--tw-border-style); border-width: 1px; }
  .border-t { border-top-style: var(--tw-border-style); border-top-width: 1=
px; }
  .border-b { border-bottom-style: var(--tw-border-style); border-bottom-wi=
dth: 1px; }
  .border-l-2 { border-left-style: var(--tw-border-style); border-left-widt=
h: 2px; }
  .border-amber-700 { border-color: var(--color-amber-700); }
  .border-sky-700 { border-color: var(--color-sky-700); }
  .border-slate-800 { border-color: var(--color-slate-800); }
  .bg-amber-400 { background-color: var(--color-amber-400); }
  .bg-amber-500\/15 {
  background-color: color-mix(in srgb, oklch(0.769 0.188 70.08) 15%, transp=
arent 85%);
  @supports (color: color-mix(in lab, red, red)) {
  background-color: color-mix(in oklab, var(--color-amber-500) 15%, transpa=
rent);
}
}
  .bg-emerald-400 { background-color: var(--color-emerald-400); }
  .bg-emerald-500\/15 {
  background-color: color-mix(in srgb, oklch(0.696 0.17 162.48) 15%, transp=
arent 85%);
  @supports (color: color-mix(in lab, red, red)) {
  background-color: color-mix(in oklab, var(--color-emerald-500) 15%, trans=
parent);
}
}
  .bg-rose-500\/15 {
  background-color: color-mix(in srgb, oklch(0.645 0.246 16.439) 15%, trans=
parent 85%);
  @supports (color: color-mix(in lab, red, red)) {
  background-color: color-mix(in oklab, var(--color-rose-500) 15%, transpar=
ent);
}
}
  .bg-sky-400 { background-color: var(--color-sky-400); }
  .bg-sky-500\/15 {
  background-color: color-mix(in srgb, oklch(0.685 0.169 237.323) 15%, tran=
sparent 85%);
  @supports (color: color-mix(in lab, red, red)) {
  background-color: color-mix(in oklab, var(--color-sky-500) 15%, transpare=
nt);
}
}
  .bg-slate-800 { background-color: var(--color-slate-800); }
  .bg-slate-900\/60 {
  background-color: color-mix(in srgb, oklch(0.208 0.042 265.755) 60%, tran=
sparent 40%);
  @supports (color: color-mix(in lab, red, red)) {
  background-color: color-mix(in oklab, var(--color-slate-900) 60%, transpa=
rent);
}
}
  .bg-slate-950 { background-color: var(--color-slate-950); }
  .bg-slate-950\/90 {
  background-color: color-mix(in srgb, oklch(0.129 0.042 264.695) 90%, tran=
sparent 10%);
  @supports (color: color-mix(in lab, red, red)) {
  background-color: color-mix(in oklab, var(--color-slate-950) 90%, transpa=
rent);
}
}
  .bg-violet-400 { background-color: var(--color-violet-400); }
  .bg-violet-500\/15 {
  background-color: color-mix(in srgb, oklch(0.606 0.25 292.717) 15%, trans=
parent 85%);
  @supports (color: color-mix(in lab, red, red)) {
  background-color: color-mix(in oklab, var(--color-violet-500) 15%, transp=
arent);
}
}
  .p-3 { padding: calc(var(--spacing) * 3); }
  .p-4 { padding: calc(var(--spacing) * 4); }
  .p-8 { padding: calc(var(--spacing) * 8); }
  .px-2 { padding-inline: calc(var(--spacing) * 2); }
  .px-3 { padding-inline: calc(var(--spacing) * 3); }
  .px-6 { padding-inline: calc(var(--spacing) * 6); }
  .py-0\.5 { padding-block: calc(var(--spacing) * 0.5); }
  .py-1 { padding-block: var(--spacing); }
  .py-1\.5 { padding-block: calc(var(--spacing) * 1.5); }
  .py-2 { padding-block: calc(var(--spacing) * 2); }
  .py-3 { padding-block: calc(var(--spacing) * 3); }
  .py-6 { padding-block: calc(var(--spacing) * 6); }
  .pl-3 { padding-left: calc(var(--spacing) * 3); }
  .pl-5 { padding-left: calc(var(--spacing) * 5); }
  .text-left { text-align: left; }
  .text-right { text-align: right; }
  .text-2xl { font-size: var(--text-2xl); line-height: var(--tw-leading, va=
r(--text-2xl--line-height)); }
  .text-sm { font-size: var(--text-sm); line-height: var(--tw-leading, var(=
--text-sm--line-height)); }
  .text-xl { font-size: var(--text-xl); line-height: var(--tw-leading, var(=
--text-xl--line-height)); }
  .text-xs { font-size: var(--text-xs); line-height: var(--tw-leading, var(=
--text-xs--line-height)); }
  .text-\[10px\] { font-size: 10px; }
  .font-medium { --tw-font-weight: var(--font-weight-medium); font-weight: =
var(--font-weight-medium); }
  .font-semibold { --tw-font-weight: var(--font-weight-semibold); font-weig=
ht: var(--font-weight-semibold); }
  .tracking-tight { --tw-tracking: var(--tracking-tight); letter-spacing: v=
ar(--tracking-tight); }
  .tracking-wide { --tw-tracking: var(--tracking-wide); letter-spacing: var=
(--tracking-wide); }
  .text-amber-300 { color: var(--color-amber-300); }
  .text-emerald-300 { color: var(--color-emerald-300); }
  .text-rose-300 { color: var(--color-rose-300); }
  .text-sky-300 { color: var(--color-sky-300); }
  .text-slate-100 { color: var(--color-slate-100); }
  .text-slate-200 { color: var(--color-slate-200); }
  .text-slate-300 { color: var(--color-slate-300); }
  .text-slate-400 { color: var(--color-slate-400); }
  .text-slate-500 { color: var(--color-slate-500); }
  .text-violet-300 { color: var(--color-violet-300); }
  .text-white { color: var(--color-white); }
  .capitalize { text-transform: capitalize; }
  .uppercase { text-transform: uppercase; }
  .italic { font-style: italic; }
  .filter { filter: var(--tw-blur,) var(--tw-brightness,) var(--tw-contrast=
,) var(--tw-grayscale,) var(--tw-hue-rotate,) var(--tw-invert,) var(--tw-sa=
turate,) var(--tw-sepia,) var(--tw-drop-shadow,); }
  .backdrop-blur { --tw-backdrop-blur: blur(8px); backdrop-filter: var(--tw=
-backdrop-blur,) var(--tw-backdrop-brightness,) var(--tw-backdrop-contrast,=
) var(--tw-backdrop-grayscale,) var(--tw-backdrop-hue-rotate,) var(--tw-bac=
kdrop-invert,) var(--tw-backdrop-opacity,) var(--tw-backdrop-saturate,) var=
(--tw-backdrop-sepia,); }
  @media (hover: hover) {
  .hover\:bg-slate-800\/60:hover { background-color: color-mix(in srgb, okl=
ch(0.279 0.041 260.031) 60%, transparent 40%); }
  @supports (color: color-mix(in lab, red, red)) {
  .hover\:bg-slate-800\/60:hover { background-color: color-mix(in oklab, va=
r(--color-slate-800) 60%, transparent); }
}
  .hover\:text-white:hover { color: var(--color-white); }
  .hover\:underline:hover { text-decoration-line: underline; }
}
  @media (width >=3D 48rem) {
  .md\:grid-cols-2 { grid-template-columns: repeat(2, minmax(0px, 1fr)); }
  .md\:grid-cols-3 { grid-template-columns: repeat(3, minmax(0px, 1fr)); }
  .md\:grid-cols-4 { grid-template-columns: repeat(4, minmax(0px, 1fr)); }
}
  @media (width >=3D 64rem) {
  .lg\:col-span-1 { grid-column: span 1 / span 1; }
  .lg\:col-span-2 { grid-column: span 2 / span 2; }
  .lg\:grid-cols-2 { grid-template-columns: repeat(2, minmax(0px, 1fr)); }
  .lg\:grid-cols-3 { grid-template-columns: repeat(3, minmax(0px, 1fr)); }
}
}

:root { color-scheme: dark; }

body { margin: 0px; min-height: 100vh; background: rgb(11, 18, 32); color: =
rgb(232, 238, 249); font-family: "IBM Plex Sans", "Segoe UI", system-ui, sa=
ns-serif; }

#root { min-height: 100vh; }

@property --tw-rotate-x { syntax: "*"; inherits: false; }

@property --tw-rotate-y { syntax: "*"; inherits: false; }

@property --tw-rotate-z { syntax: "*"; inherits: false; }

@property --tw-skew-x { syntax: "*"; inherits: false; }

@property --tw-skew-y { syntax: "*"; inherits: false; }

@property --tw-space-y-reverse { syntax: "*"; inherits: false; initial-valu=
e: 0; }

@property --tw-space-x-reverse { syntax: "*"; inherits: false; initial-valu=
e: 0; }

@property --tw-border-style { syntax: "*"; inherits: false; initial-value: =
solid; }

@property --tw-font-weight { syntax: "*"; inherits: false; }

@property --tw-tracking { syntax: "*"; inherits: false; }

@property --tw-blur { syntax: "*"; inherits: false; }

@property --tw-brightness { syntax: "*"; inherits: false; }

@property --tw-contrast { syntax: "*"; inherits: false; }

@property --tw-grayscale { syntax: "*"; inherits: false; }

@property --tw-hue-rotate { syntax: "*"; inherits: false; }

@property --tw-invert { syntax: "*"; inherits: false; }

@property --tw-opacity { syntax: "*"; inherits: false; }

@property --tw-saturate { syntax: "*"; inherits: false; }

@property --tw-sepia { syntax: "*"; inherits: false; }

@property --tw-drop-shadow { syntax: "*"; inherits: false; }

@property --tw-drop-shadow-color { syntax: "*"; inherits: false; }

@property --tw-drop-shadow-alpha { syntax: "<percentage>"; inherits: false;=
 initial-value: 100%; }

@property --tw-drop-shadow-size { syntax: "*"; inherits: false; }

@property --tw-backdrop-blur { syntax: "*"; inherits: false; }

@property --tw-backdrop-brightness { syntax: "*"; inherits: false; }

@property --tw-backdrop-contrast { syntax: "*"; inherits: false; }

@property --tw-backdrop-grayscale { syntax: "*"; inherits: false; }

@property --tw-backdrop-hue-rotate { syntax: "*"; inherits: false; }

@property --tw-backdrop-invert { syntax: "*"; inherits: false; }

@property --tw-backdrop-opacity { syntax: "*"; inherits: false; }

@property --tw-backdrop-saturate { syntax: "*"; inherits: false; }

@property --tw-backdrop-sepia { syntax: "*"; inherits: false; }

@layer properties {
  @supports ((-webkit-hyphens: none) and (not (margin-trim: inline))) or ((=
-moz-orient: inline) and (not (color:rgb(from red r g b)))) {
  *, ::before, ::after, ::backdrop { --tw-rotate-x: initial; --tw-rotate-y:=
 initial; --tw-rotate-z: initial; --tw-skew-x: initial; --tw-skew-y: initia=
l; --tw-space-y-reverse: 0; --tw-space-x-reverse: 0; --tw-border-style: sol=
id; --tw-font-weight: initial; --tw-tracking: initial; --tw-blur: initial; =
--tw-brightness: initial; --tw-contrast: initial; --tw-grayscale: initial; =
--tw-hue-rotate: initial; --tw-invert: initial; --tw-opacity: initial; --tw=
-saturate: initial; --tw-sepia: initial; --tw-drop-shadow: initial; --tw-dr=
op-shadow-color: initial; --tw-drop-shadow-alpha: 100%; --tw-drop-shadow-si=
ze: initial; --tw-backdrop-blur: initial; --tw-backdrop-brightness: initial=
; --tw-backdrop-contrast: initial; --tw-backdrop-grayscale: initial; --tw-b=
ackdrop-hue-rotate: initial; --tw-backdrop-invert: initial; --tw-backdrop-o=
pacity: initial; --tw-backdrop-saturate: initial; --tw-backdrop-sepia: init=
ial; }
}
}
------MultipartBoundary--gcWkh37lRcCKiU39VJCKjzFghSBIJdgM7vDWYkYsXU----
Content-Type: text/css
Content-Transfer-Encoding: quoted-printable
Content-Location: cid:css-aef89a88-1023-4639-bbf6-b0e8eb014af2@mhtml.blink

@charset "utf-8";

.force-graph-container canvas { display: block; user-select: none; outline:=
 none; -webkit-tap-highlight-color: transparent; }

.force-graph-container .clickable { cursor: pointer; }

.force-graph-container .grabbable { cursor: -webkit-grab; }

.force-graph-container .grabbable:active { cursor: -webkit-grabbing; }
------MultipartBoundary--gcWkh37lRcCKiU39VJCKjzFghSBIJdgM7vDWYkYsXU----
Content-Type: text/css
Content-Transfer-Encoding: quoted-printable
Content-Location: cid:css-bb632ecd-e9ab-4fcb-8655-195e4c339af2@mhtml.blink

@charset "utf-8";

.float-tooltip-kap { position: absolute; width: max-content; max-width: max=
(50%, 150px); padding: 3px 5px; border-radius: 3px; font: 12px sans-serif; =
color: rgb(238, 238, 238); background: rgba(0, 0, 0, 0.6); pointer-events: =
none; }
------MultipartBoundary--gcWkh37lRcCKiU39VJCKjzFghSBIJdgM7vDWYkYsXU------
ding Transcript Intelligence2.mhtml…]()

Snapshot-Content-Location: http://127.0.0.1:5173/
Subject: Transcript Intelligence
Date: Tue, 27 Oct 2026 21:31:34 GMT
MIME-Version: 1.0
Content-Type: multipart/related;
	type="text/html";
	boundary="----MultipartBoundary--tv0D3G3Q9MpdjmvZlK8HE9TYlrIOjCcUGymQL3ENVp----"


------MultipartBoundary--tv0D3G3Q9MpdjmvZlK8HE9TYlrIOjCcUGymQL3ENVp----
Content-Type: text/html
Content-ID: <frame-62FD6B35AC4100AD4EEBB3AFCAB21246@mhtml.blink>
Content-Transfer-Encoding: quoted-printable
Content-Location: http://127.0.0.1:5173/

<!DOCTYPE html><html lang=3D"en"><head><meta http-equiv=3D"Content-Type" co=
ntent=3D"text/html; charset=3DUTF-8"><link rel=3D"stylesheet" type=3D"text/=
css" href=3D"cid:css-6d267748-57dd-401f-acd0-e5504d5db0a2@mhtml.blink" /><l=
ink rel=3D"stylesheet" type=3D"text/css" href=3D"cid:css-77189f43-36a0-49e8=
-9a6b-12ea2652d65b@mhtml.blink" /><link rel=3D"stylesheet" type=3D"text/css=
" href=3D"cid:css-72a03e4f-3563-4f4b-92a6-a60ff2d84ea2@mhtml.blink" />
   =20

   =20

   =20
    <link rel=3D"icon" type=3D"image/svg+xml" href=3D"http://127.0.0.1:5173=
/favicon.svg">
    <meta name=3D"viewport" content=3D"width=3Ddevice-width, initial-scale=
=3D1.0">
    <title>Transcript Intelligence</title>
  </head>
  <body>
    <div id=3D"root"><div class=3D"min-h-screen"><header class=3D"sticky to=
p-0 z-20 border-b border-slate-800 bg-slate-950/90 backdrop-blur"><div clas=
s=3D"mx-auto flex max-w-7xl items-center gap-6 px-6 py-3"><div class=3D"fle=
x items-center gap-2 text-sky-300"><svg xmlns=3D"http://www.w3.org/2000/svg=
" width=3D"20" height=3D"20" viewBox=3D"0 0 24 24" fill=3D"none" stroke=3D"=
currentColor" stroke-width=3D"2" stroke-linecap=3D"round" stroke-linejoin=
=3D"round" class=3D"lucide lucide-audio-lines" aria-hidden=3D"true"><path d=
=3D"M2 10v3"></path><path d=3D"M6 6v11"></path><path d=3D"M10 3v18"></path>=
<path d=3D"M14 8v7"></path><path d=3D"M18 5v13"></path><path d=3D"M22 10v3"=
></path></svg><span class=3D"font-semibold tracking-tight text-slate-100">T=
ranscript Intelligence</span></div><nav class=3D"flex gap-1 text-sm"><a cla=
ss=3D"rounded-md px-3 py-1.5 bg-slate-800 text-white" href=3D"http://127.0.=
0.1:5173/" data-discover=3D"true" aria-current=3D"page">Overview</a><a clas=
s=3D"rounded-md px-3 py-1.5 text-slate-400 hover:text-white" href=3D"http:/=
/127.0.0.1:5173/themes" data-discover=3D"true">Themes</a><a class=3D"rounde=
d-md px-3 py-1.5 text-slate-400 hover:text-white" href=3D"http://127.0.0.1:=
5173/sentiment" data-discover=3D"true">Sentiment</a><a class=3D"rounded-md =
px-3 py-1.5 text-slate-400 hover:text-white" href=3D"http://127.0.0.1:5173/=
graph" data-discover=3D"true">Issue graph</a><a class=3D"rounded-md px-3 py=
-1.5 text-slate-400 hover:text-white" href=3D"http://127.0.0.1:5173/account=
s" data-discover=3D"true">Risk radar</a></nav></div></header><main class=3D=
"mx-auto max-w-7xl px-6 py-6"><div class=3D"space-y-6"><div><h1 class=3D"te=
xt-2xl font-semibold">Aegis Cloud =E2=80=94 100 calls, one early-warning sy=
stem</h1><p class=3D"mt-1 max-w-3xl text-sm text-slate-400">Hybrid pipeline=
: rules for call type, keyword taxonomy for themes, duration-weighted custo=
mer sentiment. Three extras: risk radar, cross-surface issue graph, VOC bac=
klog.</p></div><div class=3D"grid grid-cols-2 gap-3 md:grid-cols-4"><sectio=
n class=3D"rounded-xl border border-slate-800 bg-slate-900/60 p-4 "><div cl=
ass=3D"text-xs uppercase tracking-wide text-slate-500">Meetings</div><div c=
lass=3D"mt-1 text-xl font-semibold">100</div></section><section class=3D"ro=
unded-xl border border-slate-800 bg-slate-900/60 p-4 "><div class=3D"text-x=
s uppercase tracking-wide text-slate-500">Support / AM / Internal</div><div=
 class=3D"mt-1 text-xl font-semibold">31 / 39 / 30</div></section><section =
class=3D"rounded-xl border border-slate-800 bg-slate-900/60 p-4 "><div clas=
s=3D"text-xs uppercase tracking-wide text-slate-500">Mean polarity</div><di=
v class=3D"mt-1 text-xl font-semibold">0.08</div></section><section class=
=3D"rounded-xl border border-slate-800 bg-slate-900/60 p-4 "><div class=3D"=
text-xs uppercase tracking-wide text-slate-500">High-risk accounts</div><di=
v class=3D"mt-1 text-xl font-semibold">26</div></section></div><div class=
=3D"grid gap-4 lg:grid-cols-2"><section class=3D"rounded-xl border border-s=
late-800 bg-slate-900/60 p-4 "><h2 class=3D"mb-3 text-sm font-semibold trac=
king-wide text-slate-300">Call type mix (rule-based)</h2><div class=3D"h-64=
"><div class=3D"recharts-responsive-container" style=3D"width: 100%; height=
: 100%; min-width: 0px;"><div style=3D"width: 0px; height: 0px; overflow: v=
isible;"><div width=3D"574" height=3D"256" class=3D"recharts-wrapper" style=
=3D"position: relative; cursor: default; width: 574px; height: 256px;"><div=
 xmlns=3D"http://www.w3.org/1999/xhtml" tabindex=3D"-1" class=3D"recharts-t=
ooltip-wrapper" style=3D"visibility: hidden; pointer-events: none; position=
: absolute; top: 0px; left: 0px;"><div class=3D"recharts-default-tooltip" r=
ole=3D"status" aria-live=3D"assertive" style=3D"margin: 0px; padding: 10px;=
 background-color: rgb(255, 255, 255); border: 1px solid rgb(204, 204, 204)=
; white-space: nowrap;"><p class=3D"recharts-tooltip-label" style=3D"margin=
: 0px;"></p></div></div><svg cx=3D"50%" cy=3D"50%" role=3D"application" tab=
index=3D"0" class=3D"recharts-surface" width=3D"574" height=3D"256" viewBox=
=3D"0 0 574 256" style=3D"width: 100%; height: 100%; display: block;"><titl=
e></title><desc></desc><g tabindex=3D"-1" class=3D"recharts-zIndex-layer_-1=
00"></g><g tabindex=3D"-1" class=3D"recharts-zIndex-layer_-50"></g><defs><c=
lipPath id=3D"recharts4626-clip"><rect x=3D"5" y=3D"5" height=3D"246" width=
=3D"564"></rect></clipPath></defs><g tabindex=3D"-1" class=3D"recharts-zInd=
ex-layer_100"><g class=3D"recharts-layer recharts-pie" tabindex=3D"0"><g cl=
ass=3D"recharts-layer"><g class=3D"recharts-layer recharts-pie-sector" tabi=
ndex=3D"-1"><g class=3D"recharts-layer recharts-shape"><path cx=3D"287" cy=
=3D"128" fill=3D"#f59e0b" stroke=3D"#fff" name=3D"support" tabindex=3D"-1" =
data-recharts-item-index=3D"0" data-recharts-item-id=3D"recharts-pie-_r_a_"=
 class=3D"recharts-sector" d=3D"M 377,128
    A 90,90,0,
    0,0,
    253.8688,44.3201
  L 268.5938,81.5112
            A 50,50,0,
            0,1,
            337,128 Z"></path></g></g><g class=3D"recharts-layer recharts-p=
ie-sector" tabindex=3D"-1"><g class=3D"recharts-layer recharts-shape"><path=
 cx=3D"287" cy=3D"128" fill=3D"#38bdf8" stroke=3D"#fff" name=3D"external" t=
abindex=3D"-1" data-recharts-item-index=3D"1" data-recharts-item-id=3D"rech=
arts-pie-_r_a_" class=3D"recharts-sector" d=3D"M 253.8688,44.3201
    A 90,90,0,
    0,0,
    259.1885,213.5951
  L 271.5492,175.5528
            A 50,50,0,
            0,1,
            268.5938,81.5112 Z"></path></g></g><g class=3D"recharts-layer r=
echarts-pie-sector" tabindex=3D"-1"><g class=3D"recharts-layer recharts-sha=
pe"><path cx=3D"287" cy=3D"128" fill=3D"#a78bfa" stroke=3D"#fff" name=3D"in=
ternal" tabindex=3D"-1" data-recharts-item-index=3D"2" data-recharts-item-i=
d=3D"recharts-pie-_r_a_" class=3D"recharts-sector" d=3D"M 259.1885,213.5951
    A 90,90,0,
    0,0,
    377,128
  L 337,128
            A 50,50,0,
            0,1,
            271.5492,175.5528 Z"></path></g></g></g><g class=3D"recharts-la=
yer recharts-pie-labels"></g></g></g><g tabindex=3D"-1" class=3D"recharts-z=
Index-layer_200"></g><g tabindex=3D"-1" class=3D"recharts-zIndex-layer_300"=
></g><g tabindex=3D"-1" class=3D"recharts-zIndex-layer_400"></g><g tabindex=
=3D"-1" class=3D"recharts-zIndex-layer_500"></g><g tabindex=3D"-1" class=3D=
"recharts-zIndex-layer_600"></g><g tabindex=3D"-1" class=3D"recharts-zIndex=
-layer_1000"></g><g tabindex=3D"-1" class=3D"recharts-zIndex-layer_1100"></=
g><g tabindex=3D"-1" class=3D"recharts-zIndex-layer_1200"></g><g tabindex=
=3D"-1" class=3D"recharts-zIndex-layer_2000"><g class=3D"recharts-layer"><p=
ath cx=3D"287" cy=3D"128" fill=3D"none" stroke=3D"#f59e0b" name=3D"support"=
 class=3D"recharts-curve recharts-pie-label-line" d=3D"M337.588,53.563L348.=
829,37.021"></path><text cx=3D"287" cy=3D"128" stroke=3D"none" name=3D"supp=
ort" alignment-baseline=3D"middle" x=3D"348.82917156373435" y=3D"37.0211368=
2979821" class=3D"recharts-text recharts-pie-label-text" text-anchor=3D"sta=
rt" fill=3D"#f59e0b"><tspan x=3D"348.82917156373435" dy=3D"0em">31</tspan><=
/text></g><g class=3D"recharts-layer"><path cx=3D"287" cy=3D"128" fill=3D"n=
one" stroke=3D"#38bdf8" name=3D"external" class=3D"recharts-curve recharts-=
pie-label-line" d=3D"M197.044,130.827L177.054,131.455"></path><text cx=3D"2=
87" cy=3D"128" stroke=3D"none" name=3D"external" alignment-baseline=3D"midd=
le" x=3D"177.0542783597695" y=3D"131.45518349859412" class=3D"recharts-text=
 recharts-pie-label-text" text-anchor=3D"end" fill=3D"#38bdf8"><tspan x=3D"=
177.0542783597695" dy=3D"0em">39</tspan></text></g><g class=3D"recharts-lay=
er"><path cx=3D"287" cy=3D"128" fill=3D"none" stroke=3D"#a78bfa" name=3D"in=
ternal" class=3D"recharts-curve recharts-pie-label-line" d=3D"M339.901,200.=
812L351.656,216.992"></path><text cx=3D"287" cy=3D"128" stroke=3D"none" nam=
e=3D"internal" alignment-baseline=3D"middle" x=3D"351.65637775217203" y=3D"=
216.99186938124421" class=3D"recharts-text recharts-pie-label-text" text-an=
chor=3D"start" fill=3D"#a78bfa"><tspan x=3D"351.65637775217203" dy=3D"0em">=
30</tspan></text></g></g></svg></div></div></div></div><p class=3D"text-xs =
text-slate-500">Rules on title + attendee email domains.</p></section><sect=
ion class=3D"rounded-xl border border-slate-800 bg-slate-900/60 p-4 "><h2 c=
lass=3D"mb-3 text-sm font-semibold tracking-wide text-slate-300">What the n=
umbers mean</h2><ul class=3D"space-y-2 text-sm text-slate-300"><li class=3D=
"border-l-2 border-sky-700 pl-3">Support calls: customer-side sentiment ave=
rages -0.45 across 31 meetings (duration-weighted utterance polarity).</li>=
<li class=3D"border-l-2 border-sky-700 pl-3">External calls: customer-side =
sentiment averages 0.20 across 39 meetings (duration-weighted utterance pol=
arity).</li><li class=3D"border-l-2 border-sky-700 pl-3">Detect-tagged call=
s sit 0.47 below the rest of the corpus. That gap is the outage/reliability=
 plotline showing up in customer language, not just in engineering war room=
s.</li><li class=3D"border-l-2 border-sky-700 pl-3">Support is more negativ=
e than account-management calls. AM conversations can lag the ticket queue =
=E2=80=94 sales may still hear a calm QBR while support is already absorbin=
g an outage.</li><li class=3D"border-l-2 border-sky-700 pl-3">70 calls reco=
ver in the last third of the transcript; 1 deteriorate. Recovery is a coach=
ing cue (workaround landed). Deterioration is a process cue (no path to res=
olution).</li><li class=3D"border-l-2 border-sky-700 pl-3">Weakest customer=
-sentiment week: 2026-03-09 (support, n=3D7). Use that week as the incident=
 overlay when walking the panel through Detect/Identity spikes.</li></ul></=
section></div><section class=3D"rounded-xl border border-slate-800 bg-slate=
-900/60 p-4 "><h2 class=3D"mb-3 text-sm font-semibold tracking-wide text-sl=
ate-300">Voice-of-customer backlog (product)</h2><div class=3D"grid gap-3 m=
d:grid-cols-2"><div class=3D"rounded-lg border border-slate-800 p-3"><div c=
lass=3D"mb-1 flex items-center gap-2"><span class=3D"inline-flex rounded-fu=
ll px-2 py-0.5 text-xs font-medium bg-slate-800 text-slate-200">bug</span><=
span class=3D"text-sm text-slate-300">detect</span><span class=3D"ml-auto t=
ext-xs text-slate-500">39 calls</span></div><p class=3D"text-xs text-slate-=
400">39 transcripts cluster as detect defects. Product + eng should treat t=
his as a ranked reliability backlog, not isolated tickets.</p></div><div cl=
ass=3D"rounded-lg border border-slate-800 p-3"><div class=3D"mb-1 flex item=
s-center gap-2"><span class=3D"inline-flex rounded-full px-2 py-0.5 text-xs=
 font-medium bg-slate-800 text-slate-200">bug</span><span class=3D"text-sm =
text-slate-300">identity</span><span class=3D"ml-auto text-xs text-slate-50=
0">19 calls</span></div><p class=3D"text-xs text-slate-400">19 transcripts =
cluster as identity defects. Product + eng should treat this as a ranked re=
liability backlog, not isolated tickets.</p></div><div class=3D"rounded-lg =
border border-slate-800 p-3"><div class=3D"mb-1 flex items-center gap-2"><s=
pan class=3D"inline-flex rounded-full px-2 py-0.5 text-xs font-medium bg-sl=
ate-800 text-slate-200">process</span><span class=3D"text-sm text-slate-300=
">protect</span><span class=3D"ml-auto text-xs text-slate-500">5 calls</spa=
n></div><p class=3D"text-xs text-slate-400">5 process/comms gaps (status pa=
ge, docs, handoffs). Support leadership owns this more than engineering doe=
s.</p></div><div class=3D"rounded-lg border border-slate-800 p-3"><div clas=
s=3D"mb-1 flex items-center gap-2"><span class=3D"inline-flex rounded-full =
px-2 py-0.5 text-xs font-medium bg-slate-800 text-slate-200">feature_reques=
t</span><span class=3D"text-sm text-slate-300">comply</span><span class=3D"=
ml-auto text-xs text-slate-500">4 calls</span></div><p class=3D"text-xs tex=
t-slate-400">4 comply feature asks =E2=80=94 use as input to roadmap, not a=
s a dump of quotes.</p></div><div class=3D"rounded-lg border border-slate-8=
00 p-3"><div class=3D"mb-1 flex items-center gap-2"><span class=3D"inline-f=
lex rounded-full px-2 py-0.5 text-xs font-medium bg-slate-800 text-slate-20=
0">bug</span><span class=3D"text-sm text-slate-300">protect</span><span cla=
ss=3D"ml-auto text-xs text-slate-500">4 calls</span></div><p class=3D"text-=
xs text-slate-400">4 transcripts cluster as protect defects. Product + eng =
should treat this as a ranked reliability backlog, not isolated tickets.</p=
></div><div class=3D"rounded-lg border border-slate-800 p-3"><div class=3D"=
mb-1 flex items-center gap-2"><span class=3D"inline-flex rounded-full px-2 =
py-0.5 text-xs font-medium bg-slate-800 text-slate-200">feature_request</sp=
an><span class=3D"text-sm text-slate-300">identity</span><span class=3D"ml-=
auto text-xs text-slate-500">3 calls</span></div><p class=3D"text-xs text-s=
late-400">3 identity feature asks =E2=80=94 use as input to roadmap, not as=
 a dump of quotes.</p></div></div></section><section class=3D"rounded-xl bo=
rder border-slate-800 bg-slate-900/60 p-4 "><h2 class=3D"mb-3 text-sm font-=
semibold tracking-wide text-slate-300">Top risk accounts (sales + support)<=
/h2><div class=3D"overflow-x-auto"><table class=3D"w-full text-left text-sm=
"><thead class=3D"text-xs uppercase text-slate-500"><tr><th class=3D"py-2">=
Account</th><th>Score</th><th>Flags</th><th>Customer sentiment</th></tr></t=
head><tbody><tr class=3D"border-t border-slate-800"><td class=3D"py-2">Coas=
tal Living Co</td><td>1.00</td><td class=3D"space-x-1"><span class=3D"inlin=
e-flex rounded-full px-2 py-0.5 text-xs font-medium bg-rose-500/15 text-ros=
e-300">churn</span><span class=3D"inline-flex rounded-full px-2 py-0.5 text=
-xs font-medium bg-rose-500/15 text-rose-300">competitive</span><span class=
=3D"inline-flex rounded-full px-2 py-0.5 text-xs font-medium bg-rose-500/15=
 text-rose-300">escalation</span><span class=3D"inline-flex rounded-full px=
-2 py-0.5 text-xs font-medium bg-rose-500/15 text-rose-300">negative_custom=
er</span></td><td>-0.14</td></tr><tr class=3D"border-t border-slate-800"><t=
d class=3D"py-2">Vanta Health Systems</td><td>1.00</td><td class=3D"space-x=
-1"><span class=3D"inline-flex rounded-full px-2 py-0.5 text-xs font-medium=
 bg-rose-500/15 text-rose-300">churn</span><span class=3D"inline-flex round=
ed-full px-2 py-0.5 text-xs font-medium bg-rose-500/15 text-rose-300">compe=
titive</span><span class=3D"inline-flex rounded-full px-2 py-0.5 text-xs fo=
nt-medium bg-rose-500/15 text-rose-300">escalation</span><span class=3D"inl=
ine-flex rounded-full px-2 py-0.5 text-xs font-medium bg-rose-500/15 text-r=
ose-300">negative_customer</span></td><td>-0.35</td></tr><tr class=3D"borde=
r-t border-slate-800"><td class=3D"py-2">Blackridge Investments</td><td>1.0=
0</td><td class=3D"space-x-1"><span class=3D"inline-flex rounded-full px-2 =
py-0.5 text-xs font-medium bg-rose-500/15 text-rose-300">churn</span><span =
class=3D"inline-flex rounded-full px-2 py-0.5 text-xs font-medium bg-rose-5=
00/15 text-rose-300">competitive</span><span class=3D"inline-flex rounded-f=
ull px-2 py-0.5 text-xs font-medium bg-rose-500/15 text-rose-300">complianc=
e_pressure</span><span class=3D"inline-flex rounded-full px-2 py-0.5 text-x=
s font-medium bg-rose-500/15 text-rose-300">escalation</span><span class=3D=
"inline-flex rounded-full px-2 py-0.5 text-xs font-medium bg-rose-500/15 te=
xt-rose-300">negative_customer</span></td><td>0.04</td></tr><tr class=3D"bo=
rder-t border-slate-800"><td class=3D"py-2">Brightpath Commerce</td><td>1.0=
0</td><td class=3D"space-x-1"><span class=3D"inline-flex rounded-full px-2 =
py-0.5 text-xs font-medium bg-rose-500/15 text-rose-300">churn</span><span =
class=3D"inline-flex rounded-full px-2 py-0.5 text-xs font-medium bg-rose-5=
00/15 text-rose-300">competitive</span><span class=3D"inline-flex rounded-f=
ull px-2 py-0.5 text-xs font-medium bg-rose-500/15 text-rose-300">escalatio=
n</span><span class=3D"inline-flex rounded-full px-2 py-0.5 text-xs font-me=
dium bg-rose-500/15 text-rose-300">negative_customer</span></td><td>-0.01</=
td></tr><tr class=3D"border-t border-slate-800"><td class=3D"py-2">Nova Ret=
ail Group</td><td>1.00</td><td class=3D"space-x-1"><span class=3D"inline-fl=
ex rounded-full px-2 py-0.5 text-xs font-medium bg-rose-500/15 text-rose-30=
0">churn</span><span class=3D"inline-flex rounded-full px-2 py-0.5 text-xs =
font-medium bg-rose-500/15 text-rose-300">competitive</span><span class=3D"=
inline-flex rounded-full px-2 py-0.5 text-xs font-medium bg-rose-500/15 tex=
t-rose-300">escalation</span><span class=3D"inline-flex rounded-full px-2 p=
y-0.5 text-xs font-medium bg-rose-500/15 text-rose-300">negative_customer</=
span></td><td>-0.70</td></tr><tr class=3D"border-t border-slate-800"><td cl=
ass=3D"py-2">Meridian Capital</td><td>1.00</td><td class=3D"space-x-1"><spa=
n class=3D"inline-flex rounded-full px-2 py-0.5 text-xs font-medium bg-rose=
-500/15 text-rose-300">churn</span><span class=3D"inline-flex rounded-full =
px-2 py-0.5 text-xs font-medium bg-rose-500/15 text-rose-300">competitive</=
span><span class=3D"inline-flex rounded-full px-2 py-0.5 text-xs font-mediu=
m bg-rose-500/15 text-rose-300">escalation</span><span class=3D"inline-flex=
 rounded-full px-2 py-0.5 text-xs font-medium bg-rose-500/15 text-rose-300"=
>negative_customer</span></td><td>-0.37</td></tr><tr class=3D"border-t bord=
er-slate-800"><td class=3D"py-2">Cobalt Software</td><td>1.00</td><td class=
=3D"space-x-1"><span class=3D"inline-flex rounded-full px-2 py-0.5 text-xs =
font-medium bg-rose-500/15 text-rose-300">churn</span><span class=3D"inline=
-flex rounded-full px-2 py-0.5 text-xs font-medium bg-rose-500/15 text-rose=
-300">competitive</span><span class=3D"inline-flex rounded-full px-2 py-0.5=
 text-xs font-medium bg-rose-500/15 text-rose-300">escalation</span><span c=
lass=3D"inline-flex rounded-full px-2 py-0.5 text-xs font-medium bg-rose-50=
0/15 text-rose-300">negative_customer</span></td><td>-0.60</td></tr><tr cla=
ss=3D"border-t border-slate-800"><td class=3D"py-2">Trailhead Marketplace</=
td><td>1.00</td><td class=3D"space-x-1"><span class=3D"inline-flex rounded-=
full px-2 py-0.5 text-xs font-medium bg-rose-500/15 text-rose-300">churn</s=
pan><span class=3D"inline-flex rounded-full px-2 py-0.5 text-xs font-medium=
 bg-rose-500/15 text-rose-300">competitive</span><span class=3D"inline-flex=
 rounded-full px-2 py-0.5 text-xs font-medium bg-rose-500/15 text-rose-300"=
>escalation</span><span class=3D"inline-flex rounded-full px-2 py-0.5 text-=
xs font-medium bg-rose-500/15 text-rose-300">negative_customer</span></td><=
td>-0.16</td></tr></tbody></table></div></section></div></main></div></div>
   =20
 =20

<span id=3D"recharts_measurement_span" aria-hidden=3D"true" style=3D"positi=
on: absolute; top: -20000px; left: 0px; padding: 0px; margin: 0px; border-w=
idth: medium; border-style: none; border-color: currentcolor; border-image:=
 none; white-space: pre; font-size: 16px; letter-spacing: normal;">-1</span=
></body></html>
------MultipartBoundary--tv0D3G3Q9MpdjmvZlK8HE9TYlrIOjCcUGymQL3ENVp----
Content-Type: text/css
Content-Transfer-Encoding: quoted-printable
Content-Location: cid:css-72a03e4f-3563-4f4b-92a6-a60ff2d84ea2@mhtml.blink

@charset "utf-8";

@layer properties;

@layer theme, base, components, utilities;

@layer theme {
  :root, :host { --font-sans: -apple-system, BlinkMacSystemFont, "Segoe UI"=
, Roboto, "Helvetica Neue",
      "Noto Sans", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji"=
,
      "Segoe UI Symbol", "Noto Color Emoji"; --font-mono: ui-monospace, SFM=
ono-Regular, Menlo, Monaco, Consolas, "Liberation Mono",
      "Courier New", monospace; --color-amber-300: oklch(87.9% 0.169 91.605=
); --color-amber-400: oklch(82.8% 0.189 84.429); --color-amber-500: oklch(7=
6.9% 0.188 70.08); --color-amber-700: oklch(55.5% 0.163 48.998); --color-em=
erald-300: oklch(84.5% 0.143 164.978); --color-emerald-400: oklch(76.5% 0.1=
77 163.223); --color-emerald-500: oklch(69.6% 0.17 162.48); --color-sky-300=
: oklch(82.8% 0.111 230.318); --color-sky-400: oklch(74.6% 0.16 232.661); -=
-color-sky-500: oklch(68.5% 0.169 237.323); --color-sky-700: oklch(50% 0.13=
4 242.749); --color-violet-300: oklch(81.1% 0.111 293.571); --color-violet-=
400: oklch(70.2% 0.183 293.541); --color-violet-500: oklch(60.6% 0.25 292.7=
17); --color-rose-300: oklch(81% 0.117 11.638); --color-rose-500: oklch(64.=
5% 0.246 16.439); --color-slate-100: oklch(96.8% 0.007 247.896); --color-sl=
ate-200: oklch(92.9% 0.013 255.508); --color-slate-300: oklch(86.9% 0.022 2=
52.894); --color-slate-400: oklch(70.4% 0.04 256.788); --color-slate-500: o=
klch(55.4% 0.046 257.417); --color-slate-800: oklch(27.9% 0.041 260.031); -=
-color-slate-900: oklch(20.8% 0.042 265.755); --color-slate-950: oklch(12.9=
% 0.042 264.695); --color-white: #fff; --spacing: 0.25rem; --container-3xl:=
 48rem; --container-7xl: 80rem; --text-xs: 0.75rem; --text-xs--line-height:=
 calc(1 / 0.75); --text-sm: 0.875rem; --text-sm--line-height: calc(1.25 / 0=
.875); --text-xl: 1.25rem; --text-xl--line-height: calc(1.75 / 1.25); --tex=
t-2xl: 1.5rem; --text-2xl--line-height: calc(2 / 1.5); --font-weight-medium=
: 500; --font-weight-semibold: 600; --tracking-tight: -0.025em; --tracking-=
wide: 0.025em; --radius-md: 0.375rem; --radius-lg: 0.5rem; --radius-xl: 0.7=
5rem; --default-font-family: var(--font-sans); --default-mono-font-family: =
var(--font-mono); }
}

@layer base {
  *, ::after, ::before, ::backdrop, ::file-selector-button { box-sizing: bo=
rder-box; margin: 0px; padding: 0px; border: 0px solid; }
  html, :host { line-height: 1.5; text-size-adjust: 100%; tab-size: 4; font=
-family: var(--default-font-family, -apple-system, BlinkMacSystemFont, "Seg=
oe UI", Roboto, "Helvetica Neue", "Noto Sans", Arial, sans-serif, "Apple Co=
lor Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"); font-=
feature-settings: var(--default-font-feature-settings, normal); font-variat=
ion-settings: var(--default-font-variation-settings, normal); -webkit-tap-h=
ighlight-color: transparent; }
  hr { height: 0px; color: inherit; border-top-width: 1px; }
  abbr:where([title]) { text-decoration: underline dotted; }
  h1, h2, h3, h4, h5, h6 { font-size: inherit; font-weight: inherit; }
  a { color: inherit; text-decoration: inherit; }
  b, strong { font-weight: bolder; }
  code, kbd, samp, pre { font-family: var(--default-mono-font-family, ui-mo=
nospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Couri=
er New", monospace); font-feature-settings: var(--default-mono-font-feature=
-settings, normal); font-variation-settings: var(--default-mono-font-variat=
ion-settings, normal); font-size: 1em; }
  small { font-size: 80%; }
  sub, sup { font-size: 75%; line-height: 0; position: relative; vertical-a=
lign: baseline; }
  sub { bottom: -0.25em; }
  sup { top: -0.5em; }
  table { text-indent: 0px; border-color: inherit; border-collapse: collaps=
e; }
  progress { vertical-align: baseline; }
  summary { display: list-item; }
  ol, ul, menu { list-style: none; }
  img, svg, video, canvas, audio, iframe, embed, object { display: block; v=
ertical-align: middle; }
  img, video { max-width: 100%; height: auto; }
  button, input, select, optgroup, textarea, ::file-selector-button { font:=
 inherit; letter-spacing: inherit; color: inherit; border-radius: 0px; back=
ground-color: transparent; opacity: 1; }
  :where(select:is([multiple], [size])) optgroup { font-weight: bolder; }
  :where(select:is([multiple], [size])) optgroup option { padding-inline-st=
art: 20px; }
  ::file-selector-button { margin-inline-end: 4px; }
  ::placeholder { opacity: 1; }
  @supports (not (-webkit-appearance: -apple-pay-button)) or (contain-intri=
nsic-size: 1px) {
  ::placeholder {
  color: currentcolor;
  @supports (color: color-mix(in lab, red, red)) {
  color: color-mix(currentcolor, transparent);
}
}
}
  textarea { resize: vertical; }
  ::-webkit-search-decoration { appearance: none; }
  ::-webkit-date-and-time-value { min-height: 1lh; text-align: inherit; }
  ::-webkit-datetime-edit { display: inline-flex; }
  ::-webkit-datetime-edit-fields-wrapper { padding: 0px; }
  ::-webkit-datetime-edit, ::-webkit-datetime-edit-year-field, ::-webkit-da=
tetime-edit-month-field, ::-webkit-datetime-edit-day-field, ::-webkit-datet=
ime-edit-hour-field, ::-webkit-datetime-edit-minute-field, ::-webkit-dateti=
me-edit-second-field, ::-webkit-datetime-edit-millisecond-field, ::-webkit-=
datetime-edit-meridiem-field { padding-block: 0px; }
  ::-webkit-calendar-picker-indicator { line-height: 1; }
  button, input:where([type=3D"button"], [type=3D"reset"], [type=3D"submit"=
]), ::file-selector-button { appearance: button; }
  ::-webkit-inner-spin-button, ::-webkit-outer-spin-button { height: auto; =
}
  [hidden]:where(:not([hidden=3D"until-found"])) { display: none !important=
; }
}

@layer utilities {
  .sticky { position: sticky; }
  .top-0 { top: 0px; }
  .z-20 { z-index: 20; }
  .float-right { float: right; }
  .mx-auto { margin-inline: auto; }
  .mt-1 { margin-top: var(--spacing); }
  .mt-3 { margin-top: calc(var(--spacing) * 3); }
  .mr-1 { margin-right: var(--spacing); }
  .mb-1 { margin-bottom: var(--spacing); }
  .mb-2 { margin-bottom: calc(var(--spacing) * 2); }
  .mb-3 { margin-bottom: calc(var(--spacing) * 3); }
  .ml-1 { margin-left: var(--spacing); }
  .ml-auto { margin-left: auto; }
  .flex { display: flex; }
  .grid { display: grid; }
  .inline-block { display: inline-block; }
  .inline-flex { display: inline-flex; }
  .h-2 { height: calc(var(--spacing) * 2); }
  .h-64 { height: calc(var(--spacing) * 64); }
  .h-80 { height: calc(var(--spacing) * 80); }
  .h-\[640px\] { height: 640px; }
  .min-h-screen { min-height: 100vh; }
  .w-2 { width: calc(var(--spacing) * 2); }
  .w-full { width: 100%; }
  .max-w-3xl { max-width: var(--container-3xl); }
  .max-w-7xl { max-width: var(--container-7xl); }
  .transform { transform: var(--tw-rotate-x,) var(--tw-rotate-y,) var(--tw-=
rotate-z,) var(--tw-skew-x,) var(--tw-skew-y,); }
  .list-disc { list-style-type: disc; }
  .grid-cols-2 { grid-template-columns: repeat(2, minmax(0px, 1fr)); }
  .flex-wrap { flex-wrap: wrap; }
  .items-center { align-items: center; }
  .gap-1 { gap: var(--spacing); }
  .gap-2 { gap: calc(var(--spacing) * 2); }
  .gap-3 { gap: calc(var(--spacing) * 3); }
  .gap-4 { gap: calc(var(--spacing) * 4); }
  .gap-6 { gap: calc(var(--spacing) * 6); }
  :where(.space-y-1 > :not(:last-child)) { --tw-space-y-reverse: 0; margin-=
block-start: calc(var(--spacing) * var(--tw-space-y-reverse)); margin-block=
-end: calc(var(--spacing) * calc(1 - var(--tw-space-y-reverse))); }
  :where(.space-y-2 > :not(:last-child)) { --tw-space-y-reverse: 0; margin-=
block-start: calc(calc(var(--spacing) * 2) * var(--tw-space-y-reverse)); ma=
rgin-block-end: calc(calc(var(--spacing) * 2) * calc(1 - var(--tw-space-y-r=
everse))); }
  :where(.space-y-3 > :not(:last-child)) { --tw-space-y-reverse: 0; margin-=
block-start: calc(calc(var(--spacing) * 3) * var(--tw-space-y-reverse)); ma=
rgin-block-end: calc(calc(var(--spacing) * 3) * calc(1 - var(--tw-space-y-r=
everse))); }
  :where(.space-y-4 > :not(:last-child)) { --tw-space-y-reverse: 0; margin-=
block-start: calc(calc(var(--spacing) * 4) * var(--tw-space-y-reverse)); ma=
rgin-block-end: calc(calc(var(--spacing) * 4) * calc(1 - var(--tw-space-y-r=
everse))); }
  :where(.space-y-6 > :not(:last-child)) { --tw-space-y-reverse: 0; margin-=
block-start: calc(calc(var(--spacing) * 6) * var(--tw-space-y-reverse)); ma=
rgin-block-end: calc(calc(var(--spacing) * 6) * calc(1 - var(--tw-space-y-r=
everse))); }
  :where(.space-x-1 > :not(:last-child)) { --tw-space-x-reverse: 0; margin-=
inline-start: calc(var(--spacing) * var(--tw-space-x-reverse)); margin-inli=
ne-end: calc(var(--spacing) * calc(1 - var(--tw-space-x-reverse))); }
  .overflow-hidden { overflow: hidden; }
  .overflow-x-auto { overflow-x: auto; }
  .rounded { border-radius: 0.25rem; }
  .rounded-full { border-radius: calc(infinity * 1px); }
  .rounded-lg { border-radius: var(--radius-lg); }
  .rounded-md { border-radius: var(--radius-md); }
  .rounded-xl { border-radius: var(--radius-xl); }
  .border { border-style: var(--tw-border-style); border-width: 1px; }
  .border-t { border-top-style: var(--tw-border-style); border-top-width: 1=
px; }
  .border-b { border-bottom-style: var(--tw-border-style); border-bottom-wi=
dth: 1px; }
  .border-l-2 { border-left-style: var(--tw-border-style); border-left-widt=
h: 2px; }
  .border-amber-700 { border-color: var(--color-amber-700); }
  .border-sky-700 { border-color: var(--color-sky-700); }
  .border-slate-800 { border-color: var(--color-slate-800); }
  .bg-amber-400 { background-color: var(--color-amber-400); }
  .bg-amber-500\/15 {
  background-color: color-mix(in srgb, oklch(0.769 0.188 70.08) 15%, transp=
arent 85%);
  @supports (color: color-mix(in lab, red, red)) {
  background-color: color-mix(in oklab, var(--color-amber-500) 15%, transpa=
rent);
}
}
  .bg-emerald-400 { background-color: var(--color-emerald-400); }
  .bg-emerald-500\/15 {
  background-color: color-mix(in srgb, oklch(0.696 0.17 162.48) 15%, transp=
arent 85%);
  @supports (color: color-mix(in lab, red, red)) {
  background-color: color-mix(in oklab, var(--color-emerald-500) 15%, trans=
parent);
}
}
  .bg-rose-500\/15 {
  background-color: color-mix(in srgb, oklch(0.645 0.246 16.439) 15%, trans=
parent 85%);
  @supports (color: color-mix(in lab, red, red)) {
  background-color: color-mix(in oklab, var(--color-rose-500) 15%, transpar=
ent);
}
}
  .bg-sky-400 { background-color: var(--color-sky-400); }
  .bg-sky-500\/15 {
  background-color: color-mix(in srgb, oklch(0.685 0.169 237.323) 15%, tran=
sparent 85%);
  @supports (color: color-mix(in lab, red, red)) {
  background-color: color-mix(in oklab, var(--color-sky-500) 15%, transpare=
nt);
}
}
  .bg-slate-800 { background-color: var(--color-slate-800); }
  .bg-slate-900\/60 {
  background-color: color-mix(in srgb, oklch(0.208 0.042 265.755) 60%, tran=
sparent 40%);
  @supports (color: color-mix(in lab, red, red)) {
  background-color: color-mix(in oklab, var(--color-slate-900) 60%, transpa=
rent);
}
}
  .bg-slate-950 { background-color: var(--color-slate-950); }
  .bg-slate-950\/90 {
  background-color: color-mix(in srgb, oklch(0.129 0.042 264.695) 90%, tran=
sparent 10%);
  @supports (color: color-mix(in lab, red, red)) {
  background-color: color-mix(in oklab, var(--color-slate-950) 90%, transpa=
rent);
}
}
  .bg-violet-400 { background-color: var(--color-violet-400); }
  .bg-violet-500\/15 {
  background-color: color-mix(in srgb, oklch(0.606 0.25 292.717) 15%, trans=
parent 85%);
  @supports (color: color-mix(in lab, red, red)) {
  background-color: color-mix(in oklab, var(--color-violet-500) 15%, transp=
arent);
}
}
  .p-3 { padding: calc(var(--spacing) * 3); }
  .p-4 { padding: calc(var(--spacing) * 4); }
  .p-8 { padding: calc(var(--spacing) * 8); }
  .px-2 { padding-inline: calc(var(--spacing) * 2); }
  .px-3 { padding-inline: calc(var(--spacing) * 3); }
  .px-6 { padding-inline: calc(var(--spacing) * 6); }
  .py-0\.5 { padding-block: calc(var(--spacing) * 0.5); }
  .py-1 { padding-block: var(--spacing); }
  .py-1\.5 { padding-block: calc(var(--spacing) * 1.5); }
  .py-2 { padding-block: calc(var(--spacing) * 2); }
  .py-3 { padding-block: calc(var(--spacing) * 3); }
  .py-6 { padding-block: calc(var(--spacing) * 6); }
  .pl-3 { padding-left: calc(var(--spacing) * 3); }
  .pl-5 { padding-left: calc(var(--spacing) * 5); }
  .text-left { text-align: left; }
  .text-right { text-align: right; }
  .text-2xl { font-size: var(--text-2xl); line-height: var(--tw-leading, va=
r(--text-2xl--line-height)); }
  .text-sm { font-size: var(--text-sm); line-height: var(--tw-leading, var(=
--text-sm--line-height)); }
  .text-xl { font-size: var(--text-xl); line-height: var(--tw-leading, var(=
--text-xl--line-height)); }
  .text-xs { font-size: var(--text-xs); line-height: var(--tw-leading, var(=
--text-xs--line-height)); }
  .text-\[10px\] { font-size: 10px; }
  .font-medium { --tw-font-weight: var(--font-weight-medium); font-weight: =
var(--font-weight-medium); }
  .font-semibold { --tw-font-weight: var(--font-weight-semibold); font-weig=
ht: var(--font-weight-semibold); }
  .tracking-tight { --tw-tracking: var(--tracking-tight); letter-spacing: v=
ar(--tracking-tight); }
  .tracking-wide { --tw-tracking: var(--tracking-wide); letter-spacing: var=
(--tracking-wide); }
  .text-amber-300 { color: var(--color-amber-300); }
  .text-emerald-300 { color: var(--color-emerald-300); }
  .text-rose-300 { color: var(--color-rose-300); }
  .text-sky-300 { color: var(--color-sky-300); }
  .text-slate-100 { color: var(--color-slate-100); }
  .text-slate-200 { color: var(--color-slate-200); }
  .text-slate-300 { color: var(--color-slate-300); }
  .text-slate-400 { color: var(--color-slate-400); }
  .text-slate-500 { color: var(--color-slate-500); }
  .text-violet-300 { color: var(--color-violet-300); }
  .text-white { color: var(--color-white); }
  .capitalize { text-transform: capitalize; }
  .uppercase { text-transform: uppercase; }
  .italic { font-style: italic; }
  .filter { filter: var(--tw-blur,) var(--tw-brightness,) var(--tw-contrast=
,) var(--tw-grayscale,) var(--tw-hue-rotate,) var(--tw-invert,) var(--tw-sa=
turate,) var(--tw-sepia,) var(--tw-drop-shadow,); }
  .backdrop-blur { --tw-backdrop-blur: blur(8px); backdrop-filter: var(--tw=
-backdrop-blur,) var(--tw-backdrop-brightness,) var(--tw-backdrop-contrast,=
) var(--tw-backdrop-grayscale,) var(--tw-backdrop-hue-rotate,) var(--tw-bac=
kdrop-invert,) var(--tw-backdrop-opacity,) var(--tw-backdrop-saturate,) var=
(--tw-backdrop-sepia,); }
  @media (hover: hover) {
  .hover\:bg-slate-800\/60:hover { background-color: color-mix(in srgb, okl=
ch(0.279 0.041 260.031) 60%, transparent 40%); }
  @supports (color: color-mix(in lab, red, red)) {
  .hover\:bg-slate-800\/60:hover { background-color: color-mix(in oklab, va=
r(--color-slate-800) 60%, transparent); }
}
  .hover\:text-white:hover { color: var(--color-white); }
  .hover\:underline:hover { text-decoration-line: underline; }
}
  @media (width >=3D 48rem) {
  .md\:grid-cols-2 { grid-template-columns: repeat(2, minmax(0px, 1fr)); }
  .md\:grid-cols-3 { grid-template-columns: repeat(3, minmax(0px, 1fr)); }
  .md\:grid-cols-4 { grid-template-columns: repeat(4, minmax(0px, 1fr)); }
}
  @media (width >=3D 64rem) {
  .lg\:col-span-1 { grid-column: span 1 / span 1; }
  .lg\:col-span-2 { grid-column: span 2 / span 2; }
  .lg\:grid-cols-2 { grid-template-columns: repeat(2, minmax(0px, 1fr)); }
  .lg\:grid-cols-3 { grid-template-columns: repeat(3, minmax(0px, 1fr)); }
}
}

:root { color-scheme: dark; }

body { margin: 0px; min-height: 100vh; background: rgb(11, 18, 32); color: =
rgb(232, 238, 249); font-family: "IBM Plex Sans", "Segoe UI", system-ui, sa=
ns-serif; }

#root { min-height: 100vh; }

@property --tw-rotate-x { syntax: "*"; inherits: false; }

@property --tw-rotate-y { syntax: "*"; inherits: false; }

@property --tw-rotate-z { syntax: "*"; inherits: false; }

@property --tw-skew-x { syntax: "*"; inherits: false; }

@property --tw-skew-y { syntax: "*"; inherits: false; }

@property --tw-space-y-reverse { syntax: "*"; inherits: false; initial-valu=
e: 0; }

@property --tw-space-x-reverse { syntax: "*"; inherits: false; initial-valu=
e: 0; }

@property --tw-border-style { syntax: "*"; inherits: false; initial-value: =
solid; }

@property --tw-font-weight { syntax: "*"; inherits: false; }

@property --tw-tracking { syntax: "*"; inherits: false; }

@property --tw-blur { syntax: "*"; inherits: false; }

@property --tw-brightness { syntax: "*"; inherits: false; }

@property --tw-contrast { syntax: "*"; inherits: false; }

@property --tw-grayscale { syntax: "*"; inherits: false; }

@property --tw-hue-rotate { syntax: "*"; inherits: false; }

@property --tw-invert { syntax: "*"; inherits: false; }

@property --tw-opacity { syntax: "*"; inherits: false; }

@property --tw-saturate { syntax: "*"; inherits: false; }

@property --tw-sepia { syntax: "*"; inherits: false; }

@property --tw-drop-shadow { syntax: "*"; inherits: false; }

@property --tw-drop-shadow-color { syntax: "*"; inherits: false; }

@property --tw-drop-shadow-alpha { syntax: "<percentage>"; inherits: false;=
 initial-value: 100%; }

@property --tw-drop-shadow-size { syntax: "*"; inherits: false; }

@property --tw-backdrop-blur { syntax: "*"; inherits: false; }

@property --tw-backdrop-brightness { syntax: "*"; inherits: false; }

@property --tw-backdrop-contrast { syntax: "*"; inherits: false; }

@property --tw-backdrop-grayscale { syntax: "*"; inherits: false; }

@property --tw-backdrop-hue-rotate { syntax: "*"; inherits: false; }

@property --tw-backdrop-invert { syntax: "*"; inherits: false; }

@property --tw-backdrop-opacity { syntax: "*"; inherits: false; }

@property --tw-backdrop-saturate { syntax: "*"; inherits: false; }

@property --tw-backdrop-sepia { syntax: "*"; inherits: false; }

@layer properties {
  @supports ((-webkit-hyphens: none) and (not (margin-trim: inline))) or ((=
-moz-orient: inline) and (not (color:rgb(from red r g b)))) {
  *, ::before, ::after, ::backdrop { --tw-rotate-x: initial; --tw-rotate-y:=
 initial; --tw-rotate-z: initial; --tw-skew-x: initial; --tw-skew-y: initia=
l; --tw-space-y-reverse: 0; --tw-space-x-reverse: 0; --tw-border-style: sol=
id; --tw-font-weight: initial; --tw-tracking: initial; --tw-blur: initial; =
--tw-brightness: initial; --tw-contrast: initial; --tw-grayscale: initial; =
--tw-hue-rotate: initial; --tw-invert: initial; --tw-opacity: initial; --tw=
-saturate: initial; --tw-sepia: initial; --tw-drop-shadow: initial; --tw-dr=
op-shadow-color: initial; --tw-drop-shadow-alpha: 100%; --tw-drop-shadow-si=
ze: initial; --tw-backdrop-blur: initial; --tw-backdrop-brightness: initial=
; --tw-backdrop-contrast: initial; --tw-backdrop-grayscale: initial; --tw-b=
ackdrop-hue-rotate: initial; --tw-backdrop-invert: initial; --tw-backdrop-o=
pacity: initial; --tw-backdrop-saturate: initial; --tw-backdrop-sepia: init=
ial; }
}
}
------MultipartBoundary--tv0D3G3Q9MpdjmvZlK8HE9TYlrIOjCcUGymQL3ENVp----
Content-Type: text/css
Content-Transfer-Encoding: quoted-printable
Content-Location: cid:css-77189f43-36a0-49e8-9a6b-12ea2652d65b@mhtml.blink

@charset "utf-8";

.force-graph-container canvas { display: block; user-select: none; outline:=
 none; -webkit-tap-highlight-color: transparent; }

.force-graph-container .clickable { cursor: pointer; }

.force-graph-container .grabbable { cursor: -webkit-grab; }

.force-graph-container .grabbable:active { cursor: -webkit-grabbing; }
------MultipartBoundary--tv0D3G3Q9MpdjmvZlK8HE9TYlrIOjCcUGymQL3ENVp----
Content-Type: text/css
Content-Transfer-Encoding: quoted-printable
Content-Location: cid:css-6d267748-57dd-401f-acd0-e5504d5db0a2@mhtml.blink

@charset "utf-8";

.float-tooltip-kap { position: absolute; width: max-content; max-width: max=
(50%, 150px); padding: 3px 5px; border-radius: 3px; font: 12px sans-serif; =
color: rgb(238, 238, 238); background: rgba(0, 0, 0, 0.6); pointer-events: =
none; }
------MultipartBoundary--tv0D3G3Q9MpdjmvZlK8HE9TYlrIOjCcUGymQL3ENVp------
 Transcript Intelligence1.mhtml…]()

