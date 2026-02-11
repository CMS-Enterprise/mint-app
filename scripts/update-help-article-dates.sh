#!/usr/bin/env bash
set -euo pipefail

[ $# -eq 0 ] && exit 0

TODAY=$(date +%Y-%m-%d)

# Strip lastUpdatedDate line so we can compare "rest of content"
strip_date() {
  awk '!/lastUpdatedDate:/'
}

for file in "$@"; do
  [ -f "$file" ] || continue

  # Current: staged version or working tree
  current=$(git show ":$file" 2>/dev/null) || current=$(cat "$file")
  # Previous: last committed version (empty if new file)
  previous=$(git show "HEAD:$file" 2>/dev/null) || true

  # Only update if content (excluding lastUpdatedDate) changed or file is new
  content_changed=
  if [ -z "$previous" ]; then
    content_changed=1
  else
    tmp_cur=$(mktemp) tmp_prev=$(mktemp)
    echo "$current" | strip_date > "$tmp_cur"
    echo "$previous" | strip_date > "$tmp_prev"
    if ! diff -q "$tmp_cur" "$tmp_prev" >/dev/null 2>&1; then
      content_changed=1
    fi
    rm -f "$tmp_cur" "$tmp_prev"
  fi

  [ -n "${content_changed:-}" ] || continue

  # Only replace date or insert; never both (file has at most one lastUpdatedDate)
  has_date=
  echo "$current" | grep -q "lastUpdatedDate:" && has_date=1

  temp_file="${file}.tmp"
  echo "$current" | awk -v today="$TODAY" -v has_date="${has_date:-0}" '
    /lastUpdatedDate:/ {
      gsub(/lastUpdatedDate: \047[^\047]*\047/, "lastUpdatedDate: \047" today "\047")
      print
      next
    }
    /^const [a-zA-Z0-9]+ = \{$/ && !done && !has_date {
      print
      print "  lastUpdatedDate: \047" today "\047,"
      done = 1
      next
    }
    { print }
  ' > "$temp_file"
  mv "$temp_file" "$file"
done
