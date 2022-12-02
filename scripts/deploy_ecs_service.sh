#!/bin/bash

# Expected environment variables
# NEW_IMAGE_TAG
# TASK_FAMILY
# ECS_CLUSTER
# SERVICE_NAME
# APP_ENV
# TASK_REVISION

# fail on any error
set -Eeuo pipefail

# Update the service with the new revision
aws ecs update-service --cluster "${ECS_CLUSTER}" \
                       --service "${SERVICE_NAME}" \
                       --task-definition "${TASK_FAMILY}:${TASK_REVISION}" \
                       --no-cli-pager

# Run the healthcheck script 
./scripts/healthcheck "$NEW_IMAGE_TAG"
