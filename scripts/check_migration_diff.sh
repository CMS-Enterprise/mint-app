#!/usr/bin/env bash

set -eu -o pipefail

diff=$(git diff --name-status "origin/${BASE_REF}..origin/${HEAD_REF}" -- ./migrations)
printf 'Migration diff:\n%s\n' "${diff}"

diffNonAdds=$(echo "${diff}" | grep -Ev '^A' || true) # Look for lines that don't (-v) start with A, and always return exit code 0 with || true
printf 'Migration diff (non-adds):\n%s\n' "${diffNonAdds}"

if [ -n "${diffNonAdds}" ]; then
  echo "Migration files can only be added in migrations folder"
  exit 1
fi