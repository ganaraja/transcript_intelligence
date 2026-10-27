#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
PID_FILE="${TMPDIR:-/tmp}/transcript-intelligence-$(printf '%s' "$ROOT" | cksum | awk '{print $1}').pid"

if [[ ! -f "$PID_FILE" ]]; then
  echo "Transcript Intelligence is not running."
  exit 0
fi

read -r run_all_pid < "$PID_FILE" || true
if [[ -z "${run_all_pid:-}" ]] || ! kill -0 "$run_all_pid" 2>/dev/null; then
  rm -f "$PID_FILE"
  echo "Removed stale run marker; no launcher is running."
  exit 0
fi

command_line="$(ps -p "$run_all_pid" -o command= 2>/dev/null || true)"
if [[ "$command_line" != *"run-all.sh"* ]]; then
  echo "Refusing to stop PID $run_all_pid: it is not the run-all.sh launcher."
  exit 1
fi

kill -TERM "$run_all_pid"
for _ in {1..50}; do
  if ! kill -0 "$run_all_pid" 2>/dev/null; then
    echo "Stopped Transcript Intelligence."
    exit 0
  fi
  sleep 0.2
done

echo "The launcher (PID $run_all_pid) did not stop in time." >&2
exit 1
