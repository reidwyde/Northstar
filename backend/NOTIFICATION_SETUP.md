# SMS and Email Notification Setup Guide

## Prerequisites
- AWS CLI configured with appropriate permissions
- AWS account with SNS and SES services enabled

## SMS Notifications Setup

### 1. Enable SMS in AWS SNS
1. Open AWS SNS Console
2. Navigate to "Text messaging (SMS)" → "SMS preferences"
3. Set up SMS preferences:
   - Default message type: Promotional or Transactional
   - Default sender ID (optional)
   - Delivery status logging (recommended)

### 2. Configure Phone Number
1. Ensure your phone number is in E.164 format (e.g., +1234567890)
2. For production, consider registering dedicated phone numbers

### 3. Lambda Environment Variables
Set these environment variables in your Lambda function:
```
PHONE_NUMBER=+1234567890
```

### 4. IAM Permissions
Ensure your Lambda execution role has SNS publish permissions:
```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "sns:Publish"
            ],
            "Resource": "*"
        }
    ]
}
```

## Email Notifications Setup

### 1. Verify Email Addresses in SES
1. Open AWS SES Console
2. Navigate to "Verified identities"
3. Click "Create identity"
4. Verify both sender and recipient email addresses
5. For production, move out of SES sandbox mode

### 2. Lambda Environment Variables
Set these environment variables in your Lambda function:
```
EMAIL_ADDRESS=recipient@example.com
FROM_EMAIL=sender@example.com
```

### 3. IAM Permissions
Ensure your Lambda execution role has SES send permissions:
```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "ses:SendEmail",
                "ses:SendRawEmail"
            ],
            "Resource": "*"
        }
    ]
}
```

## Deployment Commands

### Deploy SMS Lambda
```bash
# Build and deploy SMS notifications
./deploy.sh
```

### Deploy Email Lambda
```bash
# Switch to email handler in Dockerfile
# Change CMD to: ["northstar_backend.email_lambda.lambda_handler"]
# Then run:
./deploy.sh
```

## Testing

### Test SMS
```bash
aws lambda invoke \
  --function-name northstar-push-notifications \
  --payload '{}' \
  response.json
```

### Test Email
```bash
aws lambda invoke \
  --function-name northstar-push-notifications \
  --payload '{}' \
  response.json
```

## Cost Considerations

### SMS Costs
- US: ~$0.00645 per SMS
- International rates vary significantly
- Check AWS SNS pricing page for current rates

### Email Costs
- First 62,000 emails per month: Free
- Additional emails: $0.10 per 1,000 emails

## Troubleshooting

### SMS Issues
- Verify phone number format (+1234567890)
- Check SNS service limits
- Review CloudWatch logs for errors

### Email Issues
- Ensure sender email is verified in SES
- Check if account is in SES sandbox mode
- Verify recipient email for sandbox accounts

### Lambda Issues
- Check environment variables are set
- Review IAM permissions
- Monitor CloudWatch logs for detailed errors

## Security Notes
- Never hardcode phone numbers or emails in code
- Use environment variables for sensitive data
- Regularly rotate AWS credentials
- Consider using AWS Secrets Manager for sensitive configuration