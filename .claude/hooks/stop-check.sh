#!/usr/bin/env bash
input=$(cat)
grep -q '"stop_hook_active": *true' <<<"$input" && exit 0
cd "$CLAUDE_PROJECT_DIR" || exit 0
[ -z "$(git status --porcelain)" ] && exit 0
out=$(bun run lint 2>&1 && bun run check 2>&1) || {
  printf '%s\n' "$out" | tail -60 >&2
  exit 2
}
