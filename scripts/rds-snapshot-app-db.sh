#!/bin/bash
# Creates a snapshot of the app database for the given environment

# Fail on any error
set -Eexuo pipefail

# Define variables
env="$APP_ENV"
db_instance=mint-db-$env
db_snapshot=$db_instance-$(date '+%Y-%m-%d-%H-%M-%S')
tags=("Key=Environment,Value=$env" "Key=Tool,Value=$(basename "$0")")

# Create a new database snapshot
echo "Creating snapshot for $db_instance with identifier $db_snapshot"
aws rds create-db-snapshot --db-instance-identifier "$db_instance" --db-snapshot-identifier "$db_snapshot" --tags "${tags[@]}" > /dev/null

# Wait for the new snapshot to complete
echo "Waiting for snapshot $db_snapshot to complete..."
aws rds wait db-snapshot-completed --db-snapshot-identifier "$db_snapshot"

# Describe the new snapshot
echo "Describing snapshot $db_snapshot"
db_desc=$(aws rds describe-db-snapshots --db-snapshot-identifier "$db_snapshot")
db_stat=$(echo "${db_desc}" | jq -r ".DBSnapshots[].Status")

# Check if the snapshot status is "available"
if [[ "${db_stat}" != "available" ]]; then
  echo "DB Status is '${db_stat}', expected 'available'"
  exit 1
fi
