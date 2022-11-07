#!/usr/bin/env bash
set -x

# Builds the backend image and pushes it to ECR
#
# Required environment variables:
# - ECR_REGISTRY
# - ECR_REPOSITORY

# Grab the current git hash - used as the image tag
git_hash=$(git rev-parse HEAD)

# Log in to ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin "$ECR_REGISTRY"

# Build the image
APPLICATION_DATETIME="$(gdate --rfc-3339='seconds' --utc)"
APPLICATION_TS="$(gdate --date="$APPLICATION_DATETIME" '+%s')"
docker image build --platform=linux/amd64 --quiet --build-arg ARG_APPLICATION_VERSION="$git_hash" --build-arg ARG_APPLICATION_DATETIME="$APPLICATION_DATETIME" --build-arg ARG_APPLICATION_TS="$APPLICATION_TS" --no-cache --tag "$ECR_REGISTRY/$ECR_REPOSITORY:$git_hash" .
docker image push "$ECR_REGISTRY/$ECR_REPOSITORY:$git_hash"
