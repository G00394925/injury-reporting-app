from enum import Enum

class HealthStatus(str, Enum):
    HEALTHY = "Healthy"
    INJURED = "Injured"
    RECOVERING = "Recovering"

    