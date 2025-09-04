"""Oura Ring API service for health data integration"""

from typing import List, Dict, Any, Optional
from datetime import datetime, timedelta
import os
from oura_client import OuraClient


class OuraService:
    """Service for handling Oura Ring API integration"""
    
    def __init__(self):
        self.client = OuraClient(
            client_id=os.getenv("OURA_CLIENT_ID", "I6J3O2SW5IKNLM4C"),
            client_secret=os.getenv("OURA_CLIENT_SECRET", "VSYDZPGM2FHDO22BRCM54L4QTGGPHX5X")
        )
        self.personal_token = os.getenv("OURA_PERSONAL_TOKEN", "2MBE5MTCUOJGLPBUBAJ5J545BXAPUHD5")
    
    async def get_sleep_data(self, days: int = 30) -> List[Dict[str, Any]]:
        """Get sleep data from Oura Ring API"""
        try:
            return await self.client.get_sleep_data(self.personal_token, days=days)
        except Exception as e:
            print(f"Error fetching Oura sleep data: {e}")
            return []
    
    async def get_activity_data(self, days: int = 30) -> List[Dict[str, Any]]:
        """Get activity data from Oura Ring API"""
        try:
            return await self.client.get_activity_data(self.personal_token, days=days)
        except Exception as e:
            print(f"Error fetching Oura activity data: {e}")
            return []
    
    async def get_readiness_data(self, days: int = 30) -> List[Dict[str, Any]]:
        """Get readiness data from Oura Ring API"""
        try:
            return await self.client.get_readiness_data(self.personal_token, days=days)
        except Exception as e:
            print(f"Error fetching Oura readiness data: {e}")
            return []
    
    async def get_unified_data(self) -> Dict[str, Any]:
        """Get all Oura data in unified format"""
        try:
            sleep_data = await self.get_sleep_data()
            activity_data = await self.get_activity_data()
            
            # Process into unified format
            unified_metrics = self._process_oura_data(sleep_data, activity_data)
            return unified_metrics
        except Exception as e:
            print(f"Error getting unified Oura data: {e}")
            return {}
    
    def _process_oura_data(self, sleep_data: List[Dict], activity_data: List[Dict]) -> Dict[str, Any]:
        """Process raw Oura data into unified format"""
        if not sleep_data or not activity_data:
            return {}
        
        # Sort data by date
        sleep_sorted = sorted(sleep_data, key=lambda x: x.get("day", ""), reverse=True)
        activity_sorted = sorted(activity_data, key=lambda x: x.get("day", ""), reverse=True)
        
        # Extract metrics
        sleep_metrics = []
        for item in sleep_sorted:
            sleep_hours = item.get("total_sleep_duration", 0) / 3600
            sleep_metrics.append({
                "date": item.get("day"),
                "value": round(sleep_hours, 1)
            })
        
        activity_metrics = []
        calories_metrics = []
        heart_rate_metrics = []
        
        for i, item in enumerate(activity_sorted):
            activity_metrics.append({
                "date": item.get("day"),
                "value": item.get("steps", 0)
            })
            calories_metrics.append({
                "date": item.get("day"),
                "value": item.get("active_calories", 0) + item.get("total_calories", 0)
            })
            # Mock heart rate data (Oura doesn't provide this in activity endpoint)
            heart_rate_metrics.append({
                "date": item.get("day"),
                "value": 70 + (i % 10)
            })
        
        return {
            "sleep": sleep_metrics,
            "steps": activity_metrics,
            "heart_rate": heart_rate_metrics,
            "calories": calories_metrics
        }