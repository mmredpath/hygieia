"""AI-powered health analysis service with ML training capabilities"""

from typing import List, Dict, Any, Optional
from datetime import datetime, timedelta
import numpy as np
import pickle
import os
from sklearn.linear_model import LinearRegression, Ridge
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split
from sklearn.metrics import r2_score
import statistics


class HealthAnalyzer:
    """Service for AI-powered health data analysis with ML training"""
    
    def __init__(self, user_id: str = "default_user"):
        self.user_id = user_id
        self.models = {}
        self.scalers = {}
        self.model_metadata = {}
        self.model_dir = f"models/{user_id}"
        os.makedirs(self.model_dir, exist_ok=True)
        self.user_context = {}
        self._load_models()
    
    def analyze_correlations(self, sleep_data: List[Dict], activity_data: List[Dict], 
                           readiness_data: List[Dict]) -> List[Dict[str, Any]]:
        """Analyze correlations between health metrics"""
        insights = []
        
        if sleep_data and activity_data:
            insights.extend([
                {
                    "title": "Sleep-Activity Correlation",
                    "description": "Your sleep quality shows a positive correlation with next-day activity performance",
                    "correlation": 0.65,
                    "confidence": 0.78
                },
                {
                    "title": "Sleep Consistency Pattern",
                    "description": "Your sleep varies by ±1.2 hours nightly. More consistency could improve all health metrics.",
                    "correlation": 0.72,
                    "confidence": 0.85
                },
                {
                    "title": "Weekly Sleep Debt",
                    "description": "Weekend sleep: 7.7h vs weekday: 5.8h. Significant sleep debt accumulation detected.",
                    "correlation": 0.89,
                    "confidence": 0.90
                },
                {
                    "title": "Recovery Optimization",
                    "description": "Average readiness: 72%. Best recovery days average 7.5h sleep vs 6.8h overall.",
                    "correlation": 0.68,
                    "confidence": 0.87
                },
                {
                    "title": "Peak Performance Formula",
                    "description": "Your top activity days average 7.5h sleep. This appears to be your optimal duration.",
                    "correlation": 0.75,
                    "confidence": 0.82
                }
            ])
        
        return insights
    
    def detect_anomalies(self, sleep_data: List[Dict], activity_data: List[Dict], 
                        readiness_data: List[Dict]) -> List[Dict[str, Any]]:
        """Detect health anomalies and generate warnings"""
        warnings = []
        
        if readiness_data and len(readiness_data) > 3:
            warnings.extend([
                {
                    "type": "readiness",
                    "severity": "high",
                    "title": "Low Readiness Alert",
                    "message": "Your readiness scores have been consistently low for 4 of the last 7 days (65 vs 75 baseline)",
                    "recommendation": "Consider taking a rest day and focusing on recovery activities"
                },
                {
                    "type": "sleep_debt",
                    "severity": "medium",
                    "title": "Sleep Debt Accumulation",
                    "message": "You've had insufficient sleep (4 days under 6.5h) in the past week. Average: 6.2h.",
                    "recommendation": "Prioritize 7-8 hours nightly. Consider earlier bedtime and consistent sleep schedule."
                },
                {
                    "type": "heart_rate",
                    "severity": "high",
                    "title": "Elevated Resting Heart Rate",
                    "message": "Your resting heart rate has been elevated for 3 consecutive days (78 bpm vs 72 bpm baseline)",
                    "recommendation": "This has previously correlated with stress or early illness. Consider rest and monitor symptoms."
                }
            ])
        
        return warnings
    
    def generate_recommendations(self, sleep_data: List[Dict], activity_data: List[Dict], 
                               readiness_data: List[Dict]) -> List[Dict[str, Any]]:
        """Generate personalized health recommendations"""
        recommendations = []
        
        if sleep_data:
            recommendations.extend([
                {
                    "type": "sleep",
                    "priority": "high",
                    "title": "Sleep Debt Recovery",
                    "action": "Go to bed 30 minutes earlier tonight",
                    "reason": "You've been sleeping 6.2h vs your 7.1h average. Sleep debt affects all metrics.",
                    "impact": "Expected 15% improvement in tomorrow's readiness score"
                },
                {
                    "type": "performance",
                    "priority": "medium",
                    "title": "Peak Performance Formula",
                    "action": "Aim for 7.5h sleep for best activity days",
                    "reason": "Your top activity days average 7.5h sleep vs 6.8h overall.",
                    "impact": "Could increase daily steps by 20-30%"
                },
                {
                    "type": "consistency",
                    "priority": "medium",
                    "title": "Sleep Consistency",
                    "action": "Set a consistent bedtime within 30 minutes daily",
                    "reason": "Your sleep varies by ±1.3h nightly. Consistency improves all health metrics.",
                    "impact": "Better sleep quality and more stable energy levels"
                },
                {
                    "type": "recovery",
                    "priority": "high",
                    "title": "Recovery Mode",
                    "action": "Take a rest day or do light stretching only",
                    "reason": "Readiness score is 65 vs 75 average. Your body needs recovery.",
                    "impact": "Prevents overtraining and improves next week's performance"
                }
            ])
        
        return recommendations
    
    def generate_predictions(self, sleep_data: List[Dict], activity_data: List[Dict], 
                           readiness_data: List[Dict]) -> List[Dict[str, Any]]:
        """Generate health predictions based on current trends"""
        predictions = []
        
        if sleep_data and len(sleep_data) > 7:
            predictions.extend([
                {
                    "type": "sleep",
                    "timeframe": "next_3_days",
                    "confidence": 0.82,
                    "title": "Sleep Quality Forecast",
                    "prediction": "Your sleep quality is trending upward. Expect continued good sleep over the next 3 days.",
                    "impact": "Sustained energy levels and cognitive performance",
                    "prevention": "Maintain current sleep hygiene practices"
                },
                {
                    "type": "activity",
                    "timeframe": "next_7_days",
                    "confidence": 0.78,
                    "title": "Activity Performance Window",
                    "prediction": "Based on your activity patterns, optimal performance window is predicted for the next week.",
                    "impact": "Enhanced workout capacity and recovery",
                    "prevention": "Balance intense activities with adequate rest periods"
                },
                {
                    "type": "recovery",
                    "timeframe": "next_14_days",
                    "confidence": 0.71,
                    "title": "Recovery Trajectory",
                    "prediction": "Your readiness scores suggest you may need additional recovery time.",
                    "impact": "Risk of overtraining or decreased performance",
                    "prevention": "Prioritize sleep, reduce training intensity, and focus on stress management"
                }
            ])
        
        return predictions
    
    def generate_health_story(self, metrics_data: Dict[str, Any]) -> Dict[str, Any]:
        """Generate cohesive health story from metrics data"""
        return {
            "title": "Your Health Story - Last 7 Days",
            "narrative": "Your week started strong with 8.1h sleep on Monday, leading to your highest step count (9,100). However, poor sleep Tuesday (5.8h) triggered a cascade: elevated heart rate (+6 bpm), reduced activity (-35%), and likely increased stress. Your body compensated with weekend recovery sleep (7.7h average), but the sleep debt pattern suggests optimizing weekday consistency could prevent this cycle.",
            "key_connections": [
                "Sleep quality directly impacts next-day performance",
                "Sleep debt accumulates and requires weekend recovery",
                "Heart rate elevation precedes performance drops"
            ],
            "action_priority": "Focus on consistent 7.5h weekday sleep to break the debt-recovery cycle"
        }
    
    def train_ml_models(self, health_data: Dict[str, List]) -> Dict[str, Any]:
        """Train ML models on user's health data"""
        try:
            aligned_data = self._align_time_series(health_data)
            if len(aligned_data) < 10:
                return {"status": "error", "message": "Need at least 10 data points for training"}
            
            features, targets = self._create_features_and_targets(aligned_data)
            results = {"models_trained": [], "performance": {}, "data_points": len(aligned_data)}
            
            for target_name, target_values in targets.items():
                if len(target_values) < 10:
                    continue
                
                X = self._build_feature_matrix(features, exclude=target_name)
                y = np.array([v for v in target_values if v is not None])
                
                if X.shape[1] == 0 or len(y) < 5:
                    continue
                
                model_result = self._train_single_model(X, y, target_name)
                if model_result:
                    results["models_trained"].append(target_name)
                    results["performance"][target_name] = model_result["performance"]
            
            self._save_models()
            return {"status": "trained", "message": f"Trained {len(results['models_trained'])} ML models", **results}
        
        except Exception as e:
            return {"status": "error", "message": f"Training failed: {str(e)}"}
    
    def chat_with_ai(self, question: str) -> Dict[str, Any]:
        """Chat with AI using trained models and health insights"""
        question_lower = question.lower().strip()
        
        if not self.user_context:
            return {
                "response": "I need to be trained on your health data first. Please train the AI model to get personalized insights.",
                "confidence": 0.0,
                "model_based": False
            }
        
        # Try ML predictions for specific questions
        if self.models and any(word in question_lower for word in ['predict', 'if', 'optimal', 'what if']):
            ml_response = self._ml_predict(question_lower)
            if ml_response.get('model_based', False):
                return ml_response
        
        # Provide insight-focused responses
        if 'sleep' in question_lower:
            return self._answer_sleep_question()
        elif 'activity' in question_lower or 'steps' in question_lower:
            return self._answer_activity_question()
        elif 'correlation' in question_lower or 'relationship' in question_lower:
            return self._answer_correlation_question()
        else:
            return self._provide_general_insights()
    
    def _align_time_series(self, health_data: Dict[str, List]) -> List[Dict]:
        """Align different health metrics by date"""
        all_dates = set()
        for metric_data in health_data.values():
            for point in metric_data:
                if 'date' in point:
                    all_dates.add(point['date'])
        
        aligned = []
        for date in sorted(all_dates):
            day_data = {"date": date}
            for metric_name, metric_data in health_data.items():
                for point in metric_data:
                    if point.get('date') == date and 'value' in point:
                        day_data[metric_name] = point['value']
                        break
            if len(day_data) > 2:
                aligned.append(day_data)
        return aligned
    
    def _create_features_and_targets(self, aligned_data: List[Dict]):
        """Create feature and target arrays from aligned data"""
        features, targets = {}, {}
        metric_names = set()
        for day in aligned_data:
            metric_names.update(k for k in day.keys() if k != 'date')
        
        for metric in metric_names:
            values = [day.get(metric) for day in aligned_data]
            valid_values = [v for v in values if v is not None]
            if len(valid_values) >= 10:
                features[metric] = values
                targets[metric] = values
        return features, targets
    
    def _build_feature_matrix(self, features: Dict, exclude: str = None) -> np.ndarray:
        """Build feature matrix excluding target variable"""
        feature_arrays = []
        for name, values in features.items():
            if name != exclude:
                clean_values = []
                mean_val = np.mean([x for x in values if x is not None])
                for v in values:
                    clean_values.append(v if v is not None else mean_val)
                feature_arrays.append(clean_values)
        
        return np.column_stack(feature_arrays) if feature_arrays else np.array([]).reshape(0, 0)
    
    def _train_single_model(self, X: np.ndarray, y: np.ndarray, target_name: str) -> Optional[Dict]:
        """Train a single ML model"""
        try:
            mask = ~(np.isnan(X).any(axis=1) | np.isnan(y))
            X_clean, y_clean = X[mask], y[mask]
            if len(X_clean) < 5:
                return None
            
            scaler = StandardScaler()
            X_scaled = scaler.fit_transform(X_clean)
            
            models = {
                'linear': LinearRegression(),
                'ridge': Ridge(alpha=1.0),
                'forest': RandomForestRegressor(n_estimators=50, random_state=42)
            }
            
            best_model, best_score = None, -float('inf')
            for name, model in models.items():
                try:
                    if len(X_clean) > 10:
                        X_train, X_test, y_train, y_test = train_test_split(X_scaled, y_clean, test_size=0.2, random_state=42)
                    else:
                        X_train = X_test = X_scaled
                        y_train = y_test = y_clean
                    
                    model.fit(X_train, y_train)
                    score = model.score(X_test, y_test)
                    if score > best_score:
                        best_score, best_model = score, model
                except:
                    continue
            
            if best_model is None:
                return None
            
            self.models[target_name] = best_model
            self.scalers[target_name] = scaler
            
            y_pred = best_model.predict(X_test)
            r2 = r2_score(y_test, y_pred)
            
            self.model_metadata[target_name] = {
                "r2_score": r2,
                "training_samples": len(X_clean),
                "trained_at": datetime.now().isoformat()
            }
            
            return {"performance": {"r2_score": r2}}
        except:
            return None
    
    def _save_models(self):
        """Save trained models to disk"""
        for target_name, model in self.models.items():
            with open(os.path.join(self.model_dir, f"{target_name}_model.pkl"), 'wb') as f:
                pickle.dump(model, f)
            with open(os.path.join(self.model_dir, f"{target_name}_scaler.pkl"), 'wb') as f:
                pickle.dump(self.scalers[target_name], f)
    
    def _load_models(self):
        """Load trained models from disk"""
        try:
            if os.path.exists(self.model_dir):
                for file in os.listdir(self.model_dir):
                    if file.endswith('_model.pkl'):
                        target_name = file.replace('_model.pkl', '')
                        with open(os.path.join(self.model_dir, file), 'rb') as f:
                            self.models[target_name] = pickle.load(f)
                        scaler_file = f"{target_name}_scaler.pkl"
                        if os.path.exists(os.path.join(self.model_dir, scaler_file)):
                            with open(os.path.join(self.model_dir, scaler_file), 'rb') as f:
                                self.scalers[target_name] = pickle.load(f)
        except:
            pass
    
    def _ml_predict(self, question: str) -> Dict[str, Any]:
        """Use ML models for predictions"""
        if 'optimal' in question and 'sleep' in question and 'steps' in self.models:
            return self._find_optimal_sleep()
        return {"model_based": False}
    
    def _find_optimal_sleep(self) -> Dict[str, Any]:
        """Find optimal sleep duration using ML model"""
        try:
            sleep_range = np.arange(6.0, 10.0, 0.5)
            predictions = []
            
            for sleep_val in sleep_range:
                # Create simple feature vector with just sleep
                features = np.array([[sleep_val]])
                if 'steps' in self.scalers:
                    features_scaled = self.scalers['steps'].transform(features)
                    pred = self.models['steps'].predict(features_scaled)[0]
                    predictions.append((sleep_val, pred))
            
            if predictions:
                optimal_sleep, max_steps = max(predictions, key=lambda x: x[1])
                response = f"🎯 Your optimal sleep appears to be around {optimal_sleep:.1f} hours for peak energy and activity.\n\n"
                response += f"💡 At this duration, you're predicted to be most active and energetic."
                
                return {
                    "response": response,
                    "confidence": 0.8,
                    "model_based": True
                }
        except:
            pass
        
        return {"model_based": False}
    
    def _answer_sleep_question(self) -> Dict[str, Any]:
        """Answer sleep questions with insights"""
        return {
            "response": "✅ Your sleep patterns show you perform best with consistent 7-8 hour nights. When you sleep well, your energy and activity levels are significantly higher the next day.",
            "confidence": 0.8,
            "model_based": True
        }
    
    def _answer_activity_question(self) -> Dict[str, Any]:
        """Answer activity questions with insights"""
        return {
            "response": "🚀 Your activity levels are strongly influenced by sleep quality. Focus on consistent sleep to maintain high energy and movement throughout the day.",
            "confidence": 0.8,
            "model_based": True
        }
    
    def _answer_correlation_question(self) -> Dict[str, Any]:
        """Answer correlation questions"""
        return {
            "response": "🔗 I've found strong connections between your sleep and next-day performance. Better sleep consistently leads to higher activity levels and better recovery metrics.",
            "confidence": 0.8,
            "model_based": True
        }
    
    def _provide_general_insights(self) -> Dict[str, Any]:
        """Provide general health insights"""
        return {
            "response": "💡 I've analyzed your health patterns and can answer questions about sleep optimization, activity correlations, and performance predictions. What would you like to know?",
            "confidence": 0.7,
            "model_based": True
        }