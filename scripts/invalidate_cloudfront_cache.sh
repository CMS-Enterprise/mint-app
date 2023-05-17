#!/bin/bash

# Fail on any error
set -Eexuo pipefail

# Set DISTRIBUTION_ID to the ID of your CloudFront distribution
DISTRIBUTION_ID=$(aws cloudfront list-distributions --query "DistributionList.Items[].Id" --output text)

# Invalidate all objects in the distribution and capture the invalidation ID
INVALIDATION_ID=$(aws cloudfront create-invalidation --distribution-id "$DISTRIBUTION_ID" --paths "/*" --query "Invalidation.Id" --output text)

echo "CloudFront cache invalidation started for distribution $DISTRIBUTION_ID with invalidation ID $INVALIDATION_ID"

# Wait for invalidation to complete
echo "Waiting for invalidation $INVALIDATION_ID to complete..."
aws cloudfront wait invalidation-completed --distribution-id "$DISTRIBUTION_ID" --id "$INVALIDATION_ID"

echo "CloudFront cache invalidation complete for distribution $DISTRIBUTION_ID with invalidation ID $INVALIDATION_ID"
