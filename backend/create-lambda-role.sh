#!/bin/bash

# Create Lambda execution role with proper permissions

AWS_REGION="us-east-2"
ROLE_NAME="lambda-execution-role"
POLICY_NAME="lambda-execution-policy"

echo "Creating Lambda execution role..."

# Create the role
aws iam create-role \
  --role-name $ROLE_NAME \
  --assume-role-policy-document file://lambda-trust-policy.json \
  --region $AWS_REGION

# Attach the custom policy
aws iam put-role-policy \
  --role-name $ROLE_NAME \
  --policy-name $POLICY_NAME \
  --policy-document file://lambda-execution-role-policy.json \
  --region $AWS_REGION

echo "Role created: arn:aws:iam::$(aws sts get-caller-identity --query Account --output text):role/$ROLE_NAME"
echo "You can now use this role ARN in your Lambda functions."