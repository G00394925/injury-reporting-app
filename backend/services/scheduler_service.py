from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.triggers.cron import CronTrigger
from services.database_service import DatabaseService
from services.notification_service import NotificationService
import logging
from datetime import date

logger = logging.getLogger(__name__)


class SchedulerService:
    def __init__(self):
        self.scheduler = BackgroundScheduler()
        self.db_service = DatabaseService()

    def start(self):
        """Start the scheduler"""
        if not self.scheduler.running:
            self.scheduler.start()
            self.schedule_daily_reminders()
            logger.info("Scheduler started")

    def stop(self):
        """Stop the scheduler"""
        if self.scheduler.running:
            self.scheduler.shutdown()
            logger.info("Scheduler stopped")

    def schedule_daily_reminders(self, hour: int = 18, minute: int = 0):
        """
        Schedule a notification to be sent to athletes who have not submitted a report
        for the day at the specified time.

        Args:
            hour (int): Hour of the day to send notification
            minute (int): Minute of the hour to send notification
        """
        trigger = CronTrigger(hour=hour, minute=minute)
        self.scheduler.add_job(
            func=self._send_daily_reminders,
            trigger=trigger,
            id="daily_report_reminders",
            name="Send daily report reminders",
            replace_existing=True
        )
        logger.info(f"Daily reminders scheduled for {hour:02d}:{minute:02d}")

    def _send_daily_reminders(self):
        """Send the notifications to all relative athletes at scheduled time."""
        try:
            logger.info("Running daily reminder job...")

            athletes_response = self.db_service.fetch(
                "athletes",
                select="*, users(push_token)"
            )

            if not athletes_response or not athletes_response.data:
                logger.error(f"No athletes response or missing data.")
                return

            athletes_data = athletes_response.data
            logger.info(f"Processing {len(athletes_data)} athletes")

            sent = 0

            for athlete in athletes_data:
                # Check if report is due
                if athlete.get("report_due"):
                    push_token = athlete.get("users", {}).get("push_token")

                    if push_token and NotificationService.send_daily_reminder(push_token):
                        sent += 1
                        logger.info(
                            f"Notification sent to athlete {athlete.get('id')}")
                    else:
                        logger.warning(
                            f"Notification was NOT sent to athlete {athlete.get('id')}")

            logger.info(f"Reminders sent: {sent}")
        except Exception as e:
            logger.error(f"Error sending reminders: {e}")
