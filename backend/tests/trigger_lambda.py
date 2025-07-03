#!/usr/bin/env python3
"""Script to trigger the SMS notification lambda via HTTP request."""

import boto3
import json

def trigger_lambda():
    """Trigger the lambda function directly using AWS SDK."""
    function_name = "northstar-push-notifications"
    
    try:
        print("Triggering SMS notification lambda...")
        
        # Use boto3 to invoke lambda directly
        lambda_client = boto3.client('lambda', region_name='us-east-2')
        
        response = lambda_client.invoke(
            FunctionName=function_name,
            InvocationType='RequestResponse',
            Payload=json.dumps({})
        )
        
        # Read the response
        payload = json.loads(response['Payload'].read().decode('utf-8'))
        
        print(f"Status Code: {response['StatusCode']}")
        print(f"Response: {json.dumps(payload, indent=2)}")
        
        if response['StatusCode'] == 200:
            print("✅ SMS notification sent successfully!")
        else:
            print(f"❌ Failed to send SMS notification. Status: {response['StatusCode']}")
            
    except Exception as e:
        print(f"❌ Error invoking lambda: {e}")

if __name__ == "__main__":
    trigger_lambda()