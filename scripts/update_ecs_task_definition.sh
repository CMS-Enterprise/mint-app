#!/bin/bash

# Expected environment variables
# ECR_REGISTRY
# ECR_REPOSITORY
# NEW_IMAGE_TAG
# TASK_FAMILY

set -Eexuo pipefail

ECR_IMAGE="${ECR_REGISTRY}/${ECR_REPOSITORY}:${NEW_IMAGE_TAG}"
echo "Deploying ECS with image: $ECR_IMAGE"

TASK_DEFINITION=$(aws ecs describe-task-definition --task-definition "$TASK_FAMILY")

NEW_TASK_DEFINTIION=$(echo "$TASK_DEFINITION" | jq --arg IMAGE "$ECR_IMAGE" \
  '.taskDefinition
   | .containerDefinitions[0].image = $IMAGE
   | del(.taskDefinitionArn)
   | del(.revision)
   | del(.status)
   | del(.requiresAttributes)
   | del(.compatibilities)
   | del(.registeredAt)
   | del(.registeredBy)')

# Optional debug
echo "$NEW_TASK_DEFINTIION" | jq '.containerDefinitions[0].image'

NEW_TASK_INFO=$(aws ecs register-task-definition --cli-input-json "$NEW_TASK_DEFINTIION")
NEW_REVISION=$(echo "$NEW_TASK_INFO" | jq '.taskDefinition.revision')

echo "${NEW_REVISION}"
