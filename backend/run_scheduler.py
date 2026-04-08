# This script runs the scheduler service in production environments.

from services.scheduler_service import SchedulerService
import time
import atexit
import logging

logging.basicConfig(
	level=logging.INFO, 
	format='%(asctime)s - %(levelname)s - %(message)s',
	datefmt='%Y-%m-%d %H:%M:%S'
)
logger = logging.getLogger(__name__)

if __name__ == "__main__":
	logger.info("Starting scheduler service")
	scheduler_service = SchedulerService()
	scheduler_service.start()

	# Graceful shutdown
	atexit.register(scheduler_service.stop)

	# Keep script running
	try:
		while True:
			time.sleep(60)
	except (KeyboardInterrupt, SystemExit):
		logger.info("Scheduler stopping")