import httpx
import os
from typing import Dict, List, Optional
from datetime import datetime, timedelta
from urllib.parse import urlencode

class OuraClient:
    def __init__(self, client_id: str, client_secret: str):
        self.client_id = client_id
        self.client_secret = client_secret
        self.base_url = "https://api.ouraring.com"
        self.auth_url = "https://cloud.ouraring.com/oauth/authorize"
        self.token_url = "https://api.ouraring.com/oauth/token"
        
    def get_auth_url(self, redirect_uri: str, state: str = "hackathon") -> str:
        """Generate OAuth2 authorization URL"""
        params = {
            "response_type": "code",
            "client_id": self.client_id,
            "redirect_uri": redirect_uri,
            "scope": "personal",
            "state": state
        }
        return f"{self.auth_url}?{urlencode(params)}"
    
    async def exchange_code_for_token(self, code: str, redirect_uri: str) -> Dict:
        """Exchange authorization code for access token"""
        async with httpx.AsyncClient() as client:
            response = await client.post(
                self.token_url,
                data={
                    "grant_type": "authorization_code",
                    "code": code,
                    "redirect_uri": redirect_uri,
                    "client_id": self.client_id,
                    "client_secret": self.client_secret,
                }
            )
            return response.json()
    
    async def get_sleep_data(self, access_token: str, days: int = 7) -> List[Dict]:
        """Fetch sleep data from Oura API"""
        end_date = datetime.now().date()
        start_date = end_date - timedelta(days=days)
        
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{self.base_url}/v2/usercollection/sleep",
                headers={"Authorization": f"Bearer {access_token}"},
                params={
                    "start_date": start_date.isoformat(),
                    "end_date": end_date.isoformat()
                }
            )
            return response.json().get("data", [])
    
    async def get_activity_data(self, access_token: str, days: int = 7) -> List[Dict]:
        """Fetch activity data from Oura API"""
        end_date = datetime.now().date()
        start_date = end_date - timedelta(days=days)
        
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{self.base_url}/v2/usercollection/daily_activity",
                headers={"Authorization": f"Bearer {access_token}"},
                params={
                    "start_date": start_date.isoformat(),
                    "end_date": end_date.isoformat()
                }
            )
            return response.json().get("data", [])
    
    async def get_readiness_data(self, access_token: str, days: int = 7) -> List[Dict]:
        """Fetch readiness data from Oura API"""
        end_date = datetime.now().date()
        start_date = end_date - timedelta(days=days)
        
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{self.base_url}/v2/usercollection/daily_readiness",
                headers={"Authorization": f"Bearer {access_token}"},
                params={
                    "start_date": start_date.isoformat(),
                    "end_date": end_date.isoformat()
                }
            )
            return response.json().get("data", [])