#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT/src/frontend"
if ! command -v npm >/dev/null 2>&1; then
  echo "npm is required."
  exit 1
fi
if [[ ! -d node_modules ]]; then
  npm install
fi
echo "UI: http://127.0.0.1:5173"
npm run dev -- --host 127.0.0.1 --port 5173
