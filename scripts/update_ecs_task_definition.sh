#!/bin/bash

# fail on any error
set -eu 

# get task definition information and save to json file
aws ecs describe-task-definition --task-definition ${TASK_DEFINITION_NAME} --region ${REGION} > old-task-definition.json

# update the image and save the task definition to a new json file
jq '.taskDefinition.containerDefinitions[0].image |= "'"$NEW_ECR_IMAGE"'"' old-task-definition.json > new-task-definition.json

# extract the container definition and save to a json file
jq -r '.taskDefinition.containerDefinitions' new-task-definition.json > container-definition.json

# register a new task definition
aws ecs register-task-definition \
--family jupiter-task-definition \
--container-definitions=file://container-definition.json \
--execution-role-arn ${EXECUTION_ROLE_ARN} \
--network-mode awsvpc \
--requires-compatibilities "FARGATE" \
--runtime-platform cpuArchitecture=ARM64,operatingSystemFamily=LINUX \
--memory 4096 --region us-east-1 \
--cpu 2048 \
--tags  key=image,value=${ECR_REPO_URI} key=image-tag,value=${NEW_IMAGE_TAG}

# update the ecs service with the new task definition
aws ecs update-service --cluster ${CLUSTER_ARN} --service ${ECS_SERVICE_NAME} --task-definition ${NEW_TASK_DEFINITION}

# deregister the previous task definition
aws ecs deregister-task-definition --task-definition ${OLD_TASK_DEFINITION}
