#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT/src/backend"
if ! command -v uv >/dev/null 2>&1; then
  echo "uv is required. Install: https://docs.astral.sh/uv/"
  exit 1
fi
uv sync
if [[ ! -f "$ROOT/data/processed/meetings.json" ]]; then
  echo "Processed data missing — running pipeline first."
  "$ROOT/scripts/process-data.sh"
fi
echo "API: http://127.0.0.1:8000"
echo "Docs: http://127.0.0.1:8000/docs"
uv run uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
