#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
if [[ ! -f "$ROOT/data/processed/meetings.json" ]]; then
  "$ROOT/scripts/process-data.sh"
fi

cleanup() {
  if [[ -n "${BACKEND_PID:-}" ]] && kill -0 "$BACKEND_PID" 2>/dev/null; then
    kill "$BACKEND_PID" || true
  fi
}
trap cleanup EXIT

"$ROOT/scripts/run-backend.sh" &
BACKEND_PID=$!
sleep 2
"$ROOT/scripts/run-frontend.sh"
