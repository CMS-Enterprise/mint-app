#!/usr/bin/env bash
#

set -eu -o pipefail

# Parent path magic to always set the correct relative paths when running this script
parent_path=$( cd "$(dirname "${BASH_SOURCE[0]}")" || exit ; pwd -P )
cd "$parent_path" || exit

# shellcheck disable=SC2012
migration_versions=$(ls -1 ../migrations/ | sed 's/__.*$//' | sort -V)
migration_versions_unique=$(echo "$migration_versions" | uniq)

count_of_migrations=$(echo "$migration_versions" | wc -l)
count_of_uniq_migrations=$(echo "$migration_versions_unique" | wc -l)

# If the number of migrations is not equal to the number of unique migrations,
# then there are duplicate migrations.
if [ "$count_of_migrations" -ne "$count_of_uniq_migrations" ]; then
  echo "Duplicate migrations detected. Please remove the duplicate migrations."
  echo "The following migrations are duplicated:"
  echo "$migration_versions" | uniq -d
  exit 1
fi