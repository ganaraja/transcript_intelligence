# Python libraries

Installed with **uv** from `src/backend/pyproject.toml`.

## Runtime (`uv sync`)

| Package | Why |
| --- | --- |
| fastapi | JSON API for the dashboard |
| uvicorn[standard] | ASGI server |
| pydantic | Meeting and insight schemas |
| pandas | Weekly buckets and trend tables |
| python-dotenv | Optional `OPENAI_API_KEY` |
| orjson | Fast JSON (available; stdlib json used for artifacts) |

Transitive: numpy, starlette, pydantic-core, python-dateutil, etc. Exact pins: `src/backend/uv.lock`.

## Optional extras

```bash
uv sync --extra llm
uv sync --extra embeddings
uv sync --extra notebook
```

| Extra | Packages | Why |
| --- | --- | --- |
| llm | openai | JSON theme refine when `OPENAI_API_KEY` is set |
| embeddings | sentence-transformers, scikit-learn | Unsupervised cluster audit (not required for the demo) |
| notebook | ipykernel | Run `notebooks/walkthrough.ipynb` in VS Code or Jupyter |
| test | pytest, httpx | Backend unit tests and FastAPI endpoint tests |
