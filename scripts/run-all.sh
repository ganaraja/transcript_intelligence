#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
PID_FILE="$ROOT/.run-all.pid"

if [[ -f "$PID_FILE" ]]; then
  read -r existing_pid < "$PID_FILE" || true
  if [[ -n "${existing_pid:-}" ]] && kill -0 "$existing_pid" 2>/dev/null; then
    existing_command="$(ps -p "$existing_pid" -o command= 2>/dev/null || true)"
    if [[ "$existing_command" == *"run-all.sh"* ]]; then
      echo "Transcript Intelligence is already running (PID $existing_pid)."
      exit 1
    fi
  fi
  rm -f "$PID_FILE"
fi

printf '%s\n' "$$" > "$PID_FILE"

DESCENDANTS=()

collect_descendants() {
  local parent_pid="$1"
  local child_pid
  for child_pid in $(pgrep -P "$parent_pid" 2>/dev/null || true); do
    DESCENDANTS+=("$child_pid")
    collect_descendants "$child_pid"
  done
}

cleanup() {
  trap - EXIT INT TERM
  collect_descendants "$$"
  for child_pid in "${DESCENDANTS[@]}"; do
    kill -TERM "$child_pid" 2>/dev/null || true
  done
  sleep 1
  for child_pid in "${DESCENDANTS[@]}"; do
    if kill -0 "$child_pid" 2>/dev/null; then
      kill -KILL "$child_pid" 2>/dev/null || true
    fi
  done
  if [[ -f "$PID_FILE" ]] && [[ "$(cat "$PID_FILE")" == "$$" ]]; then
    rm -f "$PID_FILE"
  fi
}
trap cleanup EXIT
trap 'exit 130' INT
trap 'exit 143' TERM

if [[ ! -f "$ROOT/data/processed/meetings.json" ]]; then
  "$ROOT/scripts/process-data.sh"
fi

"$ROOT/scripts/run-backend.sh" &
sleep 2
"$ROOT/scripts/run-frontend.sh"
