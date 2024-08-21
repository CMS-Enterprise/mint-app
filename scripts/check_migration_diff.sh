#!/usr/bin/env bash

set -eu -o pipefail

diff=$(git diff --name-status "origin/${GITHUB_BASE_REF}..${GITHUB_HEAD_REF}" -- ./migrations)
printf "Migration diff:\n%s", "${diff}"

diffNonAdds=$(echo "${diff}" | grep -E '^A\s')
printf "Migration nonAdds diff:\n%s", "${diffNonAdds}"

if [ -n "${diffNonAdds}" ]; then
  echo "Migration files can only be added in migrations folder"
  exit 1
fi