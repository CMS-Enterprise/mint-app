#!/usr/bin/env bash
set -euo pipefail

# Intended to run only locally. In CI we skip so we don't rewrite every article's date to CI's "today".
if [ -n "${CI:-}" ] || [ -n "${GITHUB_ACTIONS:-}" ]; then
  exit 0
fi

[ $# -eq 0 ] && exit 0

TODAY=$(date +%Y-%m-%d)

for file in "$@"; do
  [ -f "$file" ] || continue
  temp_file="${file}.tmp"
  if grep -q "lastUpdatedDate:" "$file"; then
    awk -v today="$TODAY" '{ gsub(/lastUpdatedDate: '\''[^'\'']*'\''/, "lastUpdatedDate: '\''" today "'\''"); print }' "$file" > "$temp_file"
  else
    awk -v today="$TODAY" '
      /^const [a-zA-Z0-9]+ = \{$/ && !done { print; print "  lastUpdatedDate: '\''" today "'\''","; done=1; next }
      { print }
    ' "$file" > "$temp_file"
  fi
  mv "$temp_file" "$file"
done
