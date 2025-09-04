# Hygieia - Personal Health & Wellness Aggregator

A full-stack application that unifies disparate health data streams to provide actionable, personalized insights.

## Hackathon Demo Recording

Screen recording: https://vimeo.com/1116001103?share=copy

Google meet recording (which I thought I lost): https://vimeo.com/1116001330?share=copy

## Hackathon Solution

**Problem**: Health-conscious individuals are drowning in fragmented data from multiple sources (wearables, apps, devices), making it impossible to see the bigger picture.

**Solution**: Hygieia intelligently unifies health data streams and uses AI to discover non-obvious correlations, providing a single holistic view with actionable insights.

## Key Features

- **Trainable AI Models**: Personal ML models learn from your unique health patterns
- **Multi-source Integration**: Oura Ring + Apple Health + Nutrition tracking
- **AI Correlation Discovery**: Finds patterns like "sleep affects activity by 30%"
- **Interactive AI Chat**: Ask questions and get personalized, data-driven answers
- **One-Click Training**: Train your personal AI model with a single button
- **Unified Health Story**: Cohesive narrative connecting all metrics
- **Proactive Anomaly Detection**: Alerts for elevated heart rate, sleep debt
- **Actionable Insights**: Specific recommendations with quantified impact

## Quick Start

```bash
# Clone and start
git clone <repo-url>
cd hygieia
./dev start
```

Visit: http://localhost:3000

## Architecture

- **Frontend**: Next.js + TypeScript + Tailwind CSS
- **Backend**: Python + FastAPI + SQLAlchemy  
- **Database**: PostgreSQL
- **AI/ML**: Scikit-learn (trainable models), Pandas, NumPy
- **APIs**: Oura Ring API, Apple HealthKit

## Project Structure

```
hygieia/
├── frontend/          # Next.js application
├── backend/           # FastAPI application
├── shared/            # Shared types and utilities
├── dev                # Development script
└── docker-compose.yml # Development environment
```

## Hackathon Success Metrics

### Actionable Insights
- "Go to bed 30 minutes earlier for 15% better readiness"
- "Your top activity days average 7.5h sleep - aim for this duration"
- "Heart rate elevated 3 days - previously correlated with stress/illness"

### Data Unification  
- **Real Oura Ring API integration** with personal access token
- **Apple Health XML parsing** for comprehensive data import
- **Smart data merging** prioritizing best source per metric type

### Holistic View
- **Health Story narrative** connecting sleep → activity → recovery patterns
- **8 different UI layouts** for personalized visualization preferences
- **Comprehensive dashboard** showing interconnected health metrics

### AI Application
- **Trainable ML models** that learn from your personal health data
- **Personalized predictions** for optimal sleep, activity, and recovery
- **Interactive AI chat** with data-driven, conversational responses
- **Correlation analysis** discovering relationships in your actual data
- **Anomaly detection** for proactive health alerts
- **Predictive insights** based on your individual patterns

## Development

```bash
# Backend
cd backend
poetry install
poetry run uvicorn main:app --reload

# Frontend  
cd frontend
npm install
npm run dev

# Database
docker-compose up postgres
```

## Competitive Advantages

1. **Real Data Integration** - Uses actual Oura Ring API, not mock data
2. **Health Story Narrative** - Unique cohesive storytelling approach
3. **Trainable Personal AI** - ML models trained on your data for personalized insights
4. **One-Click AI Training** - Accessible ML training for personalized health insights
5. **Quantified Actionability** - Specific recommendations with expected outcomes

## Data Sources

- **Real Oura Ring data** when connected
- **Apple Health XML upload** for comprehensive tracking
- **AI-generated insights** based on actual health patterns

## Demo Flow

1. **Connect Oura Ring** → Real sleep, activity, readiness data
2. **Upload Apple Health** → Comprehensive historical data  
3. **Train Personal AI** → One-click ML model training on your data
4. **Chat with AI** → Ask questions, get personalized insights
5. **View Health Story** → Cohesive narrative of health patterns
6. **Explore Predictions** → "What if I sleep 8 hours?" scenarios

Built for the Health Data Unification Hackathon
