# 🏗️ Hygieia Architecture & Technical Design

## System Overview

Hygieia is a full-stack health data aggregation platform that unifies disparate health data sources using trainable ML models and AI-powered analysis to provide actionable insights.

## Architecture Diagram

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Data Sources  │    │   Hygieia API   │    │   Frontend UI   │
│                 │    │                 │    │                 │
│ • Oura Ring API │◄──►│ • FastAPI       │◄──►│ • Next.js       │
│ • Apple Health  │    │ • ML Trainer    │    │ • TypeScript    │
│ • Nutrition Log │    │ • AI Chat       │    │ • Tailwind CSS  │
│                 │    │ • Correlation   │    │ • AI Trainer UI │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                              │
                              ▼
                       ┌─────────────────┐
                       │ ML Models +     │
                       │ PostgreSQL DB   │
                       └─────────────────┘
```

## Tech Stack

### Frontend
- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Icons**: Lucide React
- **State Management**: React Hooks

### Backend  
- **Framework**: FastAPI (Python)
- **Data Processing**: Pandas, NumPy
- **ML/AI**: Scikit-learn (Linear Regression, Ridge, Random Forest)
- **Model Persistence**: Pickle for trained models
- **API Integration**: Oura Ring API v2
- **File Processing**: XML parsing for Apple Health

### Database & ML
- **Primary**: PostgreSQL
- **ORM**: SQLAlchemy
- **ML Models**: Stored as pickle files per user
- **Training Data**: Time-aligned health metrics

## Core Innovation: Trainable ML Models

### ML Training Pipeline
```
Raw Health Data → Time Alignment → Feature Engineering → Model Training → Persistence
     ↓                ↓                    ↓                 ↓             ↓
Multi-source → Synchronized → Feature Matrix → Best Model → Saved Models
   Data         Time Series    (X, y pairs)    Selection    (per user)
```

### Model Architecture
- **Input Features**: Sleep, steps, heart rate, calories (time-aligned)
- **Target Variables**: Each metric can be predicted from others
- **Model Types**: Linear Regression, Ridge Regression, Random Forest
- **Selection**: Automatic best model selection based on R² score
- **Personalization**: Individual models trained per user

### AI Chat System
```
User Question → Intent Analysis → ML Prediction → Insight Generation → Response
     ↓              ↓                ↓               ↓                ↓
"Optimal sleep" → Sleep Query → Model Inference → Health Insight → Actionable Advice
```

## Data Flow

### 1. Data Ingestion & Training
```
Oura Ring API → Data Processor → Time Alignment → ML Training → Model Storage
Apple Health XML → Parser → Feature Engineering → Cross-validation → Persistence
```

### 2. AI Prediction Pipeline
```
User Question → Trained Models → Predictions → Insight Engine → Human-friendly Response
Current Data → Feature Vector → ML Inference → Pattern Analysis → Actionable Advice
```

### 3. Interactive Experience
```
Dashboard → Quick Train Button → Model Training → AI Chat Enabled → Personalized Insights
AI Trainer Page → Full Training UI → Model Performance → Chat Interface → Data-driven Responses
```

## Key Technical Decisions

### 1. Trainable ML Models vs Static Rules
**Challenge**: Provide personalized insights based on individual health patterns
**Solution**: Train regression models on user's actual data
```python
# Smart model training per user
for target_metric in ['sleep', 'steps', 'heart_rate']:
    X = create_feature_matrix(exclude=target_metric)
    y = target_values
    model = train_best_model(X, y)  # Linear/Ridge/Forest
    save_model(user_id, target_metric, model)
```

### 2. Human-Friendly AI Responses
**Challenge**: Transform technical ML predictions into actionable insights
**Solution**: Insight-focused response generation
```python
# Instead of: "R² = 0.85, correlation = 0.67"
# Provide: "🎯 Your optimal sleep appears to be 7.5h for peak energy"
```

### 3. Real-Time Training Integration
**Challenge**: Make ML training accessible to end users
**Solution**: One-click training with progress feedback
- Quick train button on main dashboard
- Dedicated AI trainer page with full interface
- Real-time training status and model performance

## API Architecture

### Enhanced Endpoints
```
POST /health/ai/train       # Train ML models on user data
POST /health/chat          # Chat with trained AI models
GET  /health/dashboard     # Unified health metrics
GET  /health/insights      # AI-generated insights
GET  /health/story         # Cohesive health narrative
POST /health/apple/upload  # Apple Health XML processing
GET  /auth/oura           # Oura Ring OAuth integration
```

### ML Model Endpoints
```python
@app.post("/health/ai/train")
async def train_ai_model():
    # Train personalized ML models on user's health data
    result = health_analyzer.train_ml_models(user_health_data)
    return {"status": "trained", "models": result.models_trained}

@app.post("/health/chat") 
async def chat_with_ai(question: str):
    # Use trained models for personalized responses
    response = health_analyzer.chat_with_ai(question)
    return {"response": response.insight, "confidence": response.confidence}
```

## ML Model Details

### Training Process
1. **Data Alignment**: Synchronize metrics by date across sources
2. **Feature Engineering**: Create feature matrix excluding target variable
3. **Model Selection**: Train Linear, Ridge, Random Forest models
4. **Validation**: Use train/test split for performance evaluation
5. **Persistence**: Save best model + scaler for each target metric

### Prediction Capabilities
- **Optimal Sleep**: Find sleep duration that maximizes activity/recovery
- **Sleep Impact**: Predict activity changes from sleep modifications
- **Correlation Discovery**: Identify relationships in user's actual data
- **Trend Analysis**: Detect patterns and provide future insights

### Model Performance
- **Accuracy**: R² scores typically 0.7-0.9 for well-correlated metrics
- **Personalization**: Each user gets individual models trained on their data
- **Interpretability**: Focus on actionable insights rather than technical metrics

## Security & Privacy

### ML Model Security
- **Local Training**: Models trained and stored locally per user
- **Data Isolation**: Each user's models completely separate
- **No Cloud ML**: All ML processing happens on local infrastructure
- **Model Encryption**: Trained models stored securely

### Privacy-First ML
- **Minimal Data**: Only use data necessary for training
- **User Control**: Users can retrain or delete models anytime
- **Transparent Training**: Show exactly what data is used for training

## Innovation Highlights

### Technical Innovations
1. **Personal ML Models**: Individual regression models per user
2. **One-Click Training**: Accessible ML training for end users
3. **Insight-Focused AI**: Human-friendly responses over technical metrics
4. **Real-Time Training**: Live model training with progress feedback

### AI/ML Innovations
1. **Trainable Health AI**: Learn from user's actual patterns
2. **Multi-Model Selection**: Automatic best model selection
3. **Conversational Health Insights**: Chat interface for health questions
4. **Predictive Personalization**: ML-powered optimal value recommendations

### User Experience Innovations
1. **AI Trainer Interface**: Dedicated page for model training and chat
2. **Quick Train Integration**: One-click training from main dashboard
3. **Progressive Enhancement**: Works without training, better with training
4. **Confidence Scoring**: Show model confidence in predictions

## Development Workflow

### ML Development
```bash
# Test ML models locally
python test_ml_model.py

# Train models via API
curl -X POST http://localhost:8000/health/ai/train

# Chat with trained models
curl -X POST http://localhost:8000/health/chat \
  -d '{"question": "What is my optimal sleep duration?"}'
```

### Model Management
- **Training**: Automatic retraining when new data available
- **Versioning**: Models timestamped for version tracking
- **Performance**: Monitor R² scores and prediction accuracy
- **Debugging**: Test scripts for model validation

This architecture enables Hygieia to provide truly personalized health insights by training ML models on each user's unique health patterns, transforming the platform from a data aggregator into an intelligent health advisor.