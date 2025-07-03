import json
import os
from pathlib import Path
import boto3
from typing import Dict, Any, Optional
import jwt
import time
import requests


class APNSClient:
    def __init__(self, key_id: str, team_id: str, bundle_id: str, private_key: str):
        self.key_id = key_id
        self.team_id = team_id
        self.bundle_id = bundle_id
        self.private_key = private_key
        self.apns_url = "https://api.push.apple.com"
    
    def create_jwt_token(self) -> str:
        """Create JWT token for APNS authentication"""
        headers = {
            "alg": "ES256",
            "kid": self.key_id
        }
        
        payload = {
            "iss": self.team_id,
            "iat": int(time.time())
        }
        
        token = jwt.encode(payload, self.private_key, algorithm="ES256", headers=headers)
        return token
    
    def send_notification(self, device_token: str, message: str, title: str = "Northstar") -> bool:
        """Send push notification to iOS device"""
        try:
            jwt_token = self.create_jwt_token()
            
            headers = {
                "authorization": f"bearer {jwt_token}",
                "apns-topic": self.bundle_id,
                "content-type": "application/json"
            }
            
            payload = {
                "aps": {
                    "alert": {
                        "title": title,
                        "body": message
                    },
                    "sound": "default"
                }
            }
            
            url = f"{self.apns_url}/3/device/{device_token}"
            response = requests.post(url, headers=headers, json=payload)
            
            return response.status_code == 200
        except Exception as e:
            print(f"Error sending push notification: {e}")
            return False


def get_notification_message() -> str:
    """Read notification message from notification.txt file"""
    try:
        # For Lambda container, file is in LAMBDA_TASK_ROOT
        task_root = os.environ.get('LAMBDA_TASK_ROOT', '.')
        notification_file = Path(task_root) / "notification.txt"
        
        if notification_file.exists():
            return notification_file.read_text().strip()
        else:
            return "Default notification message"
    except Exception as e:
        print(f"Error reading notification file: {e}")
        return "Default notification message"


def lambda_handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    """AWS Lambda handler for push notifications"""
    try:
        # Get environment variables
        key_id = os.environ.get('APNS_KEY_ID')
        team_id = os.environ.get('APNS_TEAM_ID')
        bundle_id = os.environ.get('APNS_BUNDLE_ID')
        private_key = os.environ.get('APNS_PRIVATE_KEY')
        device_token = os.environ.get('DEVICE_TOKEN')
        
        if not all([key_id, team_id, bundle_id, private_key, device_token]):
            return {
                'statusCode': 400,
                'body': json.dumps({
                    'error': 'Missing required environment variables'
                })
            }
        
        # Get notification message
        message = get_notification_message()
        
        # Initialize APNS client
        apns_client = APNSClient(key_id, team_id, bundle_id, private_key)
        
        # Send notification
        success = apns_client.send_notification(device_token, message)
        
        if success:
            return {
                'statusCode': 200,
                'body': json.dumps({
                    'message': 'Push notification sent successfully',
                    'notification_body': message
                })
            }
        else:
            return {
                'statusCode': 500,
                'body': json.dumps({
                    'error': 'Failed to send push notification'
                })
            }
    
    except Exception as e:
        return {
            'statusCode': 500,
            'body': json.dumps({
                'error': f'Internal server error: {str(e)}'
            })
        }