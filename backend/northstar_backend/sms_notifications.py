"""SMS notification alternative using AWS SNS."""

import json
import boto3
from typing import Dict, Any
import logging

logger = logging.getLogger()
logger.setLevel(logging.INFO)

def lambda_handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    """
    AWS Lambda handler for sending SMS notifications via SNS.
    
    Environment variables required:
    - PHONE_NUMBER: Target phone number (e.g. +1234567890)
    """
    try:
        # Initialize SNS client
        sns = boto3.client('sns')
        
        # Get phone number from environment
        import os
        #phone_number = os.environ.get('PHONE_NUMBER')
        phone_number = "+12148704733"
        
        if not phone_number:
            return {
                'statusCode': 400,
                'body': json.dumps({'error': 'PHONE_NUMBER environment variable required'})
            }
        
        # Read notification message
        try:
            with open('notification.txt', 'r') as f:
                message = f.read().strip()
        except FileNotFoundError:
            message = "Your Northstar update is ready!"
        
        # Send SMS
        response = sns.publish(
            PhoneNumber=phone_number,
            Message=message,
            Subject='Northstar Update'
        )

        logger.info(f"response: {response}")
        
        logger.info(f"SMS sent successfully. MessageId: {response['MessageId']}")
        
        return {
            'statusCode': 200,
            'body': json.dumps({
                'message': 'SMS sent successfully',
                'messageId': response['MessageId']
            })
        }
        
    except Exception as e:
        logger.error(f"Error sending SMS: {str(e)}")
        return {
            'statusCode': 500,
            'body': json.dumps({'error': str(e)})
        }
