#!/bin/bash

# Expected environment variables
# ECR_REGISTRY
# ECR_REPO
# NEW_IMAGE_TAG
# TASK_FAMILY
# AWS_REGION
# ECS_CLUSTER
# SERVICE_NAME

# fail on any error
set -eu 

# Construct full ECR Image path
ECR_IMAGE="${ECR_REGISTRY}/${ECR_REPO}:${NEW_IMAGE_TAG}"

# Get existing task definition
TASK_DEFINITION=$(aws ecs describe-task-definition --task-definition "$TASK_FAMILY" --region "$AWS_REGION")

# Transform existing task definition by performing the following actions:
# 1. Update the `containerDefinitions[0].image` to the new image we want to deploy
# 2. Remove fields from the task definition that are not compatibile with `register-task-definition`'s --cli-input-json
# Please https://github.com/aws/aws-cli/issues/3064#issuecomment-514214738
NEW_TASK_DEFINTIION=$(echo "$TASK_DEFINITION" | jq --arg IMAGE "$ECR_IMAGE" '.taskDefinition | .containerDefinitions[0].image = $IMAGE | del(.taskDefinitionArn) | del(.revision) | del(.status) | del(.requiresAttributes) | del(.compatibilities) | del(.registeredAt) | del(.registeredBy)')

# Register the new task, capture the output as JSON
NEW_TASK_INFO=$(aws ecs register-task-definition --region "$AWS_REGION" --cli-input-json "$NEW_TASK_DEFINTIION")

# Grab the new revision from the output
NEW_REVISION=$(echo "$NEW_TASK_INFO" | jq '.taskDefinition.revision')

# Update the service with the new revision
aws ecs update-service --cluster "${ECS_CLUSTER}" \
                       --service "${SERVICE_NAME}" \
                       --task-definition "${TASK_FAMILY}:${NEW_REVISION}"

# Run the healthcheck script 
./healthcheck.sh

# Grab the old revision from TASK_DEFINITION
OLD_REVISION=$(echo "$TASK_DEFINITION" | jq '.taskDefinition.revision')

# deregister the previous task definition
aws ecs deregister-task-definition --task-definition "${TASK_FAMILY}:${OLD_REVISION}"