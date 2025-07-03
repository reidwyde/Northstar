#!/bin/bash

# ECR and Lambda deployment script
# Usage: ./deploy.sh <aws-region> <ecr-repo-name> <lambda-function-name>

set -e

AWS_REGION="us-east-2"
ECR_REPO_NAME="northstar/push-notifications"
LAMBDA_FUNCTION_NAME="northstar-push-notifications"
AWS_PROFILE="northstar-admin"

echo "Deploying to region: $AWS_REGION"
echo "ECR Repository: $ECR_REPO_NAME"
echo "Lambda Function: $LAMBDA_FUNCTION_NAME"

# Get AWS account ID
AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
ECR_URI="$AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$ECR_REPO_NAME"

echo "Copying todo.txt to notification.txt..."
cp ~/Desktop/todo.txt ./notification.txt || echo "Warning: ~/Desktop/todo.txt not found, using existing notification.txt"

echo "Building Docker image..."
docker build -t $ECR_REPO_NAME .

echo "Tagging image for ECR..."
docker tag $ECR_REPO_NAME:latest $ECR_URI:latest

echo "Logging in to ECR..."
aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $ECR_URI

echo "Pushing image to ECR..."
docker push $ECR_URI:latest

echo "Deployment complete!"
echo "ECR Image URI: $ECR_URI:latest"
echo ""
echo "To create/update Lambda function, run:"
echo "aws lambda create-function \\"
echo "  --function-name $LAMBDA_FUNCTION_NAME \\"
echo "  --package-type Image \\"
echo "  --code ImageUri=$ECR_URI:latest \\"
echo "  --role arn:aws:iam::$AWS_ACCOUNT_ID:role/lambda-execution-role \\"
echo "  --timeout 30 \\"
echo "  --memory-size 512 \\"
echo "  --region $AWS_REGION"
