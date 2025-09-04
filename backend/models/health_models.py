"""Pydantic models for health data structures"""

from pydantic import BaseModel
from typing import List
from datetime import datetime


class HealthMetric(BaseModel):
    """Base health metric model"""
    timestamp: datetime
    metric_type: str
    value: float
    source: str