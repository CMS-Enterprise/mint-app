#!/bin/bash
# Creates a snapshot of the app database for the given environment

# Fail on any error
# set -Eexuo pipefail
set -Exuo pipefail

# Define variables
env="$APP_ENV"
db_instance=mint-db-$env
db_snapshot=$db_instance-$(date '+%Y-%m-%d-%H-%M-%S')
tags=("Key=Environment,Value=$env" "Key=Tool,Value=$(basename "$0")")
manual_retention_count=10

# Get the manual snapshots for the DB sorted by creation time
snapshots=$(aws rds describe-db-snapshots \
            --db-instance-identifier "$db_instance" \
            --snapshot-type manual \
            --query 'sort_by(DBSnapshots, &SnapshotCreateTime)[].DBSnapshotIdentifier' \
            --no-paginate | jq -r '.[]')
# Count how many snapshots exist
snapshot_count=$(echo "$snapshots" | wc -l)
# Calculate the number of snapshots to delete
snapshots_to_delete=$((snapshot_count - manual_retention_count))

# Only delete if we have more than our threshold
if [[ $snapshots_to_delete -gt 0 ]]; then
  # Delete the oldest snapshots until we're under our threshold
  for snapshot in $(echo "$snapshots" | head -n $snapshots_to_delete); do
      echo "Deleting snapshot: $snapshot"
      aws rds delete-db-snapshot --no-cli-pager --db-snapshot-identifier "$snapshot" --no-paginate
  done
fi

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
