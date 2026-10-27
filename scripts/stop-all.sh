#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
PID_FILE="$ROOT/.run-all.pid"
LEGACY_PID_FILE="${TMPDIR:-/tmp}/transcript-intelligence-$(printf '%s' "$ROOT" | cksum | awk '{print $1}').pid"

run_all_pids=()
for marker in "$PID_FILE" "$LEGACY_PID_FILE"; do
  if [[ -f "$marker" ]]; then
    read -r marker_pid < "$marker" || true
    marker_command="$(ps -p "${marker_pid:-}" -o command= 2>/dev/null || true)"
    if [[ -n "${marker_pid:-}" && "$marker_command" == *"run-all.sh"* ]]; then
      run_all_pids+=("$marker_pid")
    else
      rm -f "$marker"
    fi
  fi
done

while IFS= read -r process; do
  read -r candidate_pid command_line <<< "$process"
  if [[ "$command_line" == *"$ROOT/scripts/run-all.sh" ]]; then
    already_found=false
    for pid in "${run_all_pids[@]}"; do
      [[ "$pid" == "$candidate_pid" ]] && already_found=true
    done
    [[ "$already_found" == true ]] || run_all_pids+=("$candidate_pid")
  fi
done < <(ps -axo pid=,command=)

if [[ "${#run_all_pids[@]}" -eq 0 ]]; then
  echo "Transcript Intelligence is not running."
  exit 0
fi

DESCENDANTS=()

collect_descendants() {
  local parent_pid="$1"
  local child_pid
  for child_pid in $(pgrep -P "$parent_pid" 2>/dev/null || true); do
    DESCENDANTS+=("$child_pid")
    collect_descendants "$child_pid"
  done
}

for run_all_pid in "${run_all_pids[@]}"; do
  collect_descendants "$run_all_pid"
done

process_pids=("${DESCENDANTS[@]}" "${run_all_pids[@]}")
for pid in "${process_pids[@]}"; do
  kill -TERM "$pid" 2>/dev/null || true
done

for _ in {1..10}; do
  alive=0
  for pid in "${process_pids[@]}"; do
    process_state="$(ps -p "$pid" -o stat= 2>/dev/null || true)"
    if [[ -n "$process_state" && "$process_state" != Z* ]]; then
      alive=1
      break
    fi
  done
  [[ "$alive" -eq 0 ]] && break
  sleep 0.2
done

for pid in "${process_pids[@]}"; do
  process_state="$(ps -p "$pid" -o stat= 2>/dev/null || true)"
  if [[ -n "$process_state" && "$process_state" != Z* ]]; then
    kill -KILL "$pid" 2>/dev/null || true
  fi
done

rm -f "$PID_FILE" "$LEGACY_PID_FILE"

echo "Stopped Transcript Intelligence and its child processes."
