import requests
import logging
from typing import List, Dict, Optional
from datetime import datetime

logger = logging.getLogger(__name__)

EXPO_API_URL = "https://exp.host/--/api/v2/push/send"


class NotificationService:
    """
    Allows for the creation and sending of push notifications to a given expo push token.
    Tokens are sent to the expo push notifications api -> https://exp.host/--/api/v2/push/send,
    which is subsequently sent to a user's device.
    """

    @staticmethod
    def send_notification(
            push_token: str,
            title: str,
            body: str,
            data: Optional[Dict] = None,
            channel_id: str = "default"
    ) -> bool:
        """
        Send a single push notification to a device.

        Args:
                push_token (str): The user's expo push token to send the notification to.
                title (str): Notification title.
                body (str): Notification body.
                data (dict): Optional custom data/metadata.
                channel_id (str): Android notification channel id.

        Returns:
                True if successful, False otherwise.
        """
        # Validate token
        if not push_token or not push_token.startswith("ExponentPushToken"):
            logger.warning(f"Invalid token format: {push_token}")
            return False

        payload = {
            "to": push_token,
            "sound": "default",
            "title": title,
            "body": body,
            "channelId": channel_id,
            "data": data or {}
        }

        try:
            response = requests.post(EXPO_API_URL, json=payload, timeout=30)
            response.raise_for_status()
            logger.info(f"Notification sent to {push_token[:20]}...")
            return True
        except requests.exceptions.RequestException as e:
            logger.error(f"Fauled to send notification: {e}")
            return False

    @staticmethod
    def send_batch_notifications(push_tokens: List[str], title: str, body: str, data: Optional[Dict] = None) -> Dict[str, int]:
        """
        Send mutliple notifications to multiple devices.

        Args:
                push_tokens (List [str]): The expo push tokens to send notifications to.
                title (str): Notification title.
                body (str): Notification body.
                data (dict): Optional data/metadata

        Returns: 
                Dictionary with success/failure counts.

        """
        results = {"sent": 0, "failed": 0}
        for token in push_tokens:
            if NotificationService.send_notification(token, title, body, data):
                results["sent"] += 1
            else:
                results["failed"] += 1
        return results

    @staticmethod
    def send_daily_reminder(push_token: str) -> bool:
        """Send a daily report submission reminder."""
        title = "Submission Due"
        body = (
            "It's time to submit your daily health report"
        )
        data = {
            "timestamp": datetime.now().isoformat()
        }

        return NotificationService.send_notification(push_token, title, body, data)
