"""Data processing service for health data unification"""

from typing import Dict, Any, Optional, List
from datetime import datetime, timedelta
import xml.etree.ElementTree as ET


class DataProcessor:
    """Service for processing and unifying health data from multiple sources"""
    
    def __init__(self):
        pass
    
    def process_apple_health_xml(self, xml_content: bytes) -> Dict[str, Any]:
        """Process Apple Health XML export"""
        try:
            root = ET.fromstring(xml_content)
            records = []
            metrics = {}
            
            # Parse health records
            for record in root.findall('.//Record'):
                record_type = record.get('type', '')
                value = record.get('value', '')
                start_date = record.get('startDate', '')
                
                # Focus on key metrics
                if any(metric in record_type for metric in ['StepCount', 'SleepAnalysis', 'HeartRate', 'ActiveEnergyBurned']):
                    try:
                        date_obj = datetime.fromisoformat(start_date.replace('Z', '+00:00'))
                        date_str = date_obj.strftime('%Y-%m-%d')
                        
                        # Categorize metrics
                        if 'StepCount' in record_type:
                            metric_key = 'steps'
                            metric_value = float(value)
                        elif 'SleepAnalysis' in record_type:
                            metric_key = 'sleep'
                            end_date = record.get('endDate', start_date)
                            start_dt = datetime.fromisoformat(start_date.replace('Z', '+00:00'))
                            end_dt = datetime.fromisoformat(end_date.replace('Z', '+00:00'))
                            metric_value = (end_dt - start_dt).total_seconds() / 3600
                        elif 'HeartRate' in record_type:
                            metric_key = 'heart_rate'
                            metric_value = float(value)
                        elif 'ActiveEnergyBurned' in record_type:
                            metric_key = 'calories'
                            metric_value = float(value)
                        else:
                            continue
                        
                        records.append({
                            'type': metric_key,
                            'value': metric_value,
                            'date': date_str,
                            'datetime': date_obj
                        })
                        
                        if metric_key not in metrics:
                            metrics[metric_key] = []
                        metrics[metric_key].append({
                            'date': date_str,
                            'value': metric_value
                        })
                        
                    except (ValueError, TypeError):
                        continue
            
            # Calculate date range
            dates = [r['datetime'] for r in records]
            start_date = min(dates).strftime('%Y-%m-%d') if dates else None
            end_date = max(dates).strftime('%Y-%m-%d') if dates else None
            
            return {
                'records': records,
                'metrics': metrics,
                'start_date': start_date,
                'end_date': end_date
            }
        except Exception as e:
            raise Exception(f"Failed to process Apple Health XML: {str(e)}")
    
    def get_apple_health_data(self) -> Optional[Dict[str, Any]]:
        """Get processed Apple Health data"""
        # This would retrieve from storage in production
        return None
    
    def merge_health_data(self, apple_data: Optional[Dict], oura_data: Optional[Dict]) -> Dict[str, Any]:
        """Intelligently merge health data from multiple sources"""
        if oura_data and apple_data:
            return self._smart_merge(apple_data, oura_data)
        elif oura_data:
            return oura_data
        elif apple_data:
            return apple_data
        else:
            return {}
    
    def _smart_merge(self, apple_data: Dict, oura_data: Dict) -> Dict[str, Any]:
        """Smart data merging with source prioritization"""
        merged = {}
        
        # Create date-indexed dictionaries
        apple_by_date = {}
        oura_by_date = {}
        
        for metric_type, data_points in apple_data.items():
            apple_by_date[metric_type] = {item['date']: item['value'] for item in data_points}
        
        for metric_type, data_points in oura_data.items():
            oura_by_date[metric_type] = {item['date']: item['value'] for item in data_points}
        
        # Merge with intelligent prioritization per metric
        for metric_type in ['sleep', 'steps', 'heart_rate', 'calories']:
            merged[metric_type] = []
            
            metric_dates = set()
            if metric_type in apple_by_date:
                metric_dates.update(apple_by_date[metric_type].keys())
            if metric_type in oura_by_date:
                metric_dates.update(oura_by_date[metric_type].keys())
            
            for date in sorted(metric_dates, reverse=True):
                value = None
                
                # Smart prioritization per metric
                if metric_type == 'sleep':
                    # Oura Ring provides superior sleep tracking
                    value = oura_by_date.get(metric_type, {}).get(date)
                elif metric_type == 'steps':
                    # Apple Health has comprehensive step tracking
                    value = apple_by_date.get(metric_type, {}).get(date) or oura_by_date.get(metric_type, {}).get(date)
                elif metric_type == 'heart_rate':
                    # Oura Ring has more accurate HR monitoring
                    value = oura_by_date.get(metric_type, {}).get(date) or apple_by_date.get(metric_type, {}).get(date)
                elif metric_type == 'calories':
                    # Apple Health has better calorie tracking
                    value = apple_by_date.get(metric_type, {}).get(date) or oura_by_date.get(metric_type, {}).get(date)
                
                if value is not None:
                    merged[metric_type].append({'date': date, 'value': value})
        
        return merged
    
    def determine_primary_source(self, apple_data: Optional[Dict], oura_data: Optional[Dict]) -> str:
        """Determine the primary data source"""
        if apple_data and oura_data:
            return "merged"
        elif oura_data:
            return "oura"
        elif apple_data:
            return "apple_health"
        else:
            return "none"
    
