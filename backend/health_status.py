from enum import Enum

class HealthStatus(str, Enum):
    GREEN = "Healthy"
    AMBER = "No competing"
    RED = "No training or competing"