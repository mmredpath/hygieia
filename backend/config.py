"""Configuration settings for Hygieia backend"""

import os
from typing import Dict, Any

# API Configuration
API_HOST = os.getenv("API_HOST", "0.0.0.0")
API_PORT = int(os.getenv("API_PORT", 8000))
DEBUG_MODE = os.getenv("DEBUG", "false").lower() == "true"

# CORS Settings
ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

# Health Data Processing
HEALTH_DATA_RETENTION_DAYS = 365
MIN_DATA_POINTS_FOR_ANALYSIS = 7
CORRELATION_SIGNIFICANCE_THRESHOLD = 0.3

# Oura Ring API
OURA_API_BASE_URL = "https://api.ouraring.com/v2"
OURA_SCOPES = ["daily", "heartrate", "workout", "tag"]

# File Upload Limits
MAX_UPLOAD_SIZE_MB = 50
ALLOWED_FILE_EXTENSIONS = [".xml"]

# Logging Configuration
LOG_LEVEL = os.getenv("LOG_LEVEL", "INFO")
LOG_FORMAT = "%(asctime)s - %(name)s - %(levelname)s - %(message)s"

# Health Metrics Configuration
SLEEP_OPTIMAL_RANGE = (7.0, 9.0)  # hours
HEART_RATE_ANOMALY_THRESHOLD = 2.0  # standard deviations
ACTIVITY_GOAL_STEPS = 10000

# AI Analysis Settings
PREDICTION_CONFIDENCE_THRESHOLD = 0.6
ANOMALY_DETECTION_WINDOW_DAYS = 7
BASELINE_CALCULATION_DAYS = 30