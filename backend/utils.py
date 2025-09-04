"""Utility functions for health data processing"""

from datetime import datetime, timedelta
from typing import List, Dict, Any, Optional
import statistics


def calculate_sleep_debt(sleep_data: List[Dict]) -> float:
    """Calculate accumulated sleep debt over the past week"""
    if len(sleep_data) < 7:
        return 0.0
    
    recent_week = sleep_data[-7:]
    sleep_hours = [day.get('value', 0) for day in recent_week]
    
    # Assume 8 hours is optimal
    optimal_sleep = 8.0
    total_debt = sum(max(0, optimal_sleep - hours) for hours in sleep_hours)
    
    return total_debt


def detect_weekend_pattern(sleep_data: List[Dict]) -> Dict[str, float]:
    """Analyze weekday vs weekend sleep patterns"""
    weekday_sleep = []
    weekend_sleep = []
    
    for entry in sleep_data:
        try:
            date_obj = datetime.strptime(entry['date'], '%Y-%m-%d')
            sleep_hours = entry.get('value', 0)
            
            # Monday = 0, Sunday = 6
            if date_obj.weekday() < 5:  # Monday-Friday
                weekday_sleep.append(sleep_hours)
            else:  # Saturday-Sunday
                weekend_sleep.append(sleep_hours)
        except (ValueError, KeyError):
            continue
    
    return {
        'weekday_avg': statistics.mean(weekday_sleep) if weekday_sleep else 0,
        'weekend_avg': statistics.mean(weekend_sleep) if weekend_sleep else 0,
        'difference': (statistics.mean(weekend_sleep) - statistics.mean(weekday_sleep)) 
                     if weekday_sleep and weekend_sleep else 0
    }


def calculate_trend(values: List[float], days: int = 7) -> float:
    """Calculate trend over specified number of days"""
    if len(values) < days:
        return 0.0
    
    recent_values = values[-days:]
    
    # Simple linear trend calculation
    x_values = list(range(len(recent_values)))
    n = len(recent_values)
    
    if n < 2:
        return 0.0
    
    # Calculate slope of trend line
    sum_x = sum(x_values)
    sum_y = sum(recent_values)
    sum_xy = sum(x * y for x, y in zip(x_values, recent_values))
    sum_x2 = sum(x * x for x in x_values)
    
    denominator = n * sum_x2 - sum_x * sum_x
    if denominator == 0:
        return 0.0
    
    slope = (n * sum_xy - sum_x * sum_y) / denominator
    return slope


def is_anomaly(value: float, baseline: float, threshold_std: float = 2.0) -> bool:
    """Check if a value is an anomaly based on baseline and threshold"""
    return abs(value - baseline) > threshold_std


def format_duration(hours: float) -> str:
    """Format hours as human-readable duration"""
    if hours < 1:
        minutes = int(hours * 60)
        return f"{minutes}min"
    elif hours < 24:
        h = int(hours)
        m = int((hours - h) * 60)
        return f"{h}h {m}min" if m > 0 else f"{h}h"
    else:
        days = int(hours / 24)
        remaining_hours = int(hours % 24)
        return f"{days}d {remaining_hours}h"


def get_health_score_category(score: float) -> str:
    """Categorize health scores into human-readable ranges"""
    if score >= 85:
        return "Excellent"
    elif score >= 70:
        return "Good"
    elif score >= 55:
        return "Fair"
    elif score >= 40:
        return "Poor"
    else:
        return "Very Poor"


def validate_health_data(data: Dict[str, Any]) -> bool:
    """Validate health data structure and values"""
    required_fields = ['date', 'value']
    
    if not isinstance(data, dict):
        return False
    
    for field in required_fields:
        if field not in data:
            return False
    
    # Validate date format
    try:
        datetime.strptime(data['date'], '%Y-%m-%d')
    except ValueError:
        return False
    
    # Validate value is numeric
    try:
        float(data['value'])
    except (ValueError, TypeError):
        return False
    
    return True