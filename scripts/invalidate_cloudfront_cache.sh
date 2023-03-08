#!/bin/bash

# Set DISTRIBUTION_ID to the ID of your CloudFront distribution
DISTRIBUTION_ID=$(aws cloudfront list-distributions --query "DistributionList.Items[].Id" --output text)

# Invalidate all objects in the distribution
aws cloudfront create-invalidation --distribution-id "$DISTRIBUTION_ID" --paths "/*"

echo "CloudFront cache invalidation started for distribution $DISTRIBUTION_ID"
