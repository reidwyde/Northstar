"""Email notification lambda using AWS SES."""

import json
import boto3
from typing import Dict, Any
import logging

logger = logging.getLogger()
logger.setLevel(logging.INFO)

def lambda_handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    """
    AWS Lambda handler for sending email notifications via SES.
    
    Environment variables required:
    - EMAIL_ADDRESS: Target email address
    - FROM_EMAIL: Verified sender email in SES
    """
    try:
        # Initialize SES client
        ses = boto3.client('ses')
        
        # Get email addresses from environment
        import os
        to_email = os.environ.get('EMAIL_ADDRESS')
        from_email = os.environ.get('FROM_EMAIL')
        
        if not to_email or not from_email:
            return {
                'statusCode': 400,
                'body': json.dumps({'error': 'EMAIL_ADDRESS and FROM_EMAIL required'})
            }
        
        # Read notification message
        try:
            with open('notification.txt', 'r') as f:
                message = f.read().strip()
        except FileNotFoundError:
            message = "Your Northstar update is ready!"
        
        # Send email
        response = ses.send_email(
            Source=from_email,
            Destination={'ToAddresses': [to_email]},
            Message={
                'Subject': {'Data': 'Northstar Update'},
                'Body': {'Text': {'Data': message}}
            }
        )
        
        logger.info(f"Email sent successfully. MessageId: {response['MessageId']}")
        
        return {
            'statusCode': 200,
            'body': json.dumps({
                'message': 'Email sent successfully',
                'messageId': response['MessageId']
            })
        }
        
    except Exception as e:
        logger.error(f"Error sending email: {str(e)}")
        return {
            'statusCode': 500,
            'body': json.dumps({'error': str(e)})
        }