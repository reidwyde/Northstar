#!/bin/bash

# List ECR repositories
# Usage: ./list_ecr_repos.sh [aws-region]

AWS_REGION=${1:-us-east-2}

# Check if AWS_PROFILE is set
if [ -z "$AWS_PROFILE" ]; then
    echo "ERROR: AWS_PROFILE environment variable is not set"
    echo "Please set it with: export AWS_PROFILE=your-profile-name"
    exit 1
fi

echo "Using AWS Profile: $AWS_PROFILE"
echo "Listing ECR repositories in region: $AWS_REGION"
echo "================================================"

aws ecr describe-repositories --profile $AWS_PROFILE --region $AWS_REGION --query 'repositories[].repositoryName' --output table