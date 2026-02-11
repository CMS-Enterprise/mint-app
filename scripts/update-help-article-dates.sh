#!/usr/bin/env bash
set -euo pipefail

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
