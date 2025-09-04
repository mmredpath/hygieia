"""
Hygieia Health API - Personal Health & Wellness Aggregator
A FastAPI backend that unifies health data from multiple sources and provides AI-powered insights.
"""

from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import RedirectResponse
from typing import Dict, Any

from services.oura_service import OuraService
from services.health_analyzer import HealthAnalyzer
from services.data_processor import DataProcessor

# Initialize FastAPI app
app = FastAPI(
    title="Hygieia Health API",
    description="Unified health data aggregation with AI-powered insights",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize services
oura_service = OuraService()
health_analyzer = HealthAnalyzer("demo_user")
data_processor = DataProcessor()

# In-memory storage for demo (replace with database in production)
access_token_store = {"token": None}
apple_health_data = {}

@app.get("/", tags=["Root"])
async def root():
    """Health check endpoint"""
    return {"message": "Hygieia Health API", "status": "healthy"}

# Authentication endpoints
@app.get("/auth/oura", tags=["Authentication"])
async def connect_oura():
    """Connect to Oura Ring via OAuth"""
    access_token_store["token"] = "demo_token_connected"
    return RedirectResponse(url="http://localhost:3000?connected=true")

@app.get("/health/oura/status", tags=["Authentication"])
async def get_oura_status():
    """Check Oura Ring connection status"""
    return {"connected": access_token_store["token"] is not None}

# Data ingestion endpoints
@app.post("/health/apple/upload", tags=["Data Ingestion"])
async def upload_apple_health(file: UploadFile = File(...)):
    """Upload and process Apple Health XML export"""
    if not file.filename or not file.filename.endswith('.xml'):
        raise HTTPException(status_code=400, detail="Please upload a valid XML file")
    
    try:
        content = await file.read()
        processed_data = data_processor.process_apple_health_xml(content)
        
        # Store processed data
        user_id = "apple_health_user"
        apple_health_data[user_id] = processed_data
        
        return {
            "message": "Apple Health data processed successfully",
            "data_points": len(processed_data.get('records', [])),
            "date_range": f"{processed_data.get('start_date')} to {processed_data.get('end_date')}",
            "metrics": list(processed_data.get('metrics', {}).keys())
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to process Apple Health data: {str(e)}")

@app.get("/health/apple/status", tags=["Data Ingestion"])
async def get_apple_health_status():
    """Check Apple Health data connection status"""
    user_id = "apple_health_user"
    has_data = user_id in apple_health_data
    
    if has_data:
        data = apple_health_data[user_id]
        return {
            "connected": True,
            "data_points": len(data.get('records', [])),
            "metrics": list(data.get('metrics', {}).keys()),
            "date_range": f"{data.get('start_date')} to {data.get('end_date')}"
        }
    
    return {"connected": False}



# Core health data endpoints
@app.get("/health/dashboard", tags=["Health Data"])
async def get_dashboard_data():
    """Get unified health dashboard data from all connected sources"""
    try:
        # Get data from all sources
        apple_data = data_processor.get_apple_health_data() if apple_health_data else None
        oura_data = await oura_service.get_unified_data() if access_token_store["token"] else None
        
        # Return empty data if no sources connected
        if not apple_data and not oura_data:
            return {
                "metrics": {},
                "source": "none"
            }
        
        # Merge data intelligently
        unified_data = data_processor.merge_health_data(apple_data, oura_data)
        
        return {
            "metrics": unified_data,
            "source": data_processor.determine_primary_source(apple_data, oura_data)
        }
    except Exception as e:
        return {
            "metrics": {},
            "source": "none"
        }

@app.get("/health/insights", tags=["AI Insights"])
async def get_health_insights():
    """Get AI-powered health insights, warnings, recommendations, and predictions"""
    try:
        if access_token_store["token"]:
            # Get real Oura data
            sleep_data = await oura_service.get_sleep_data(days=60)
            activity_data = await oura_service.get_activity_data(days=60)
            readiness_data = await oura_service.get_readiness_data(days=60)
            
            # Generate AI insights
            insights = health_analyzer.analyze_correlations(sleep_data, activity_data, readiness_data)
            warnings = health_analyzer.detect_anomalies(sleep_data, activity_data, readiness_data)
            recommendations = health_analyzer.generate_recommendations(sleep_data, activity_data, readiness_data)
            predictions = health_analyzer.generate_predictions(sleep_data, activity_data, readiness_data)
            
            return {
                "insights": insights,
                "warnings": warnings,
                "recommendations": recommendations,
                "predictions": predictions,
                "source": "oura"
            }
    except Exception as e:
        print(f"Error analyzing health data: {e}")
    
    # Return empty results if no data available
    return {
        "insights": [],
        "warnings": [],
        "recommendations": [],
        "predictions": [],
        "source": "none"
    }

@app.get("/health/story", tags=["AI Insights"])
async def get_health_story():
    """Generate cohesive health story connecting all metrics"""
    try:
        # Get unified health data
        dashboard_data = await get_dashboard_data()
        
        # Return empty story if no data
        if not dashboard_data["metrics"] or dashboard_data["source"] == "none":
            return {
                "story": {
                    "title": "No Health Data Available",
                    "narrative": "Connect your Oura Ring or upload Apple Health data to see your personalized health story.",
                    "key_connections": [],
                    "action_priority": "Connect a data source to get started"
                }
            }
        
        # Generate health story
        story = health_analyzer.generate_health_story(dashboard_data["metrics"])
        
        return {"story": story}
    except Exception as e:
        return {
            "story": {
                "title": "No Health Data Available",
                "narrative": "Connect your Oura Ring or upload Apple Health data to see your personalized health story.",
                "key_connections": [],
                "action_priority": "Connect a data source to get started"
            }
        }

@app.post("/health/ai/train", tags=["AI Training"])
async def train_ai_model():
    """Train AI model on user's health data"""
    try:
        dashboard_data = await get_dashboard_data()
        if not dashboard_data["metrics"] or dashboard_data["source"] == "none":
            return {"status": "no_data", "message": "No health data available for training"}
        
        result = health_analyzer.train_ml_models(dashboard_data["metrics"])
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Training failed: {str(e)}")

@app.post("/health/chat", tags=["AI Chat"])
async def chat_with_ai(request: ChatRequest):
    """Chat with AI using trained models"""
    try:
        response = health_analyzer.chat_with_ai(request.question)
        return response
    except Exception as e:
        return {
            "response": "I encountered an error. Please try again.",
            "confidence": 0.0,
            "model_based": False
        }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)