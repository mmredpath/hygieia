# Hygieia - Personal Health & Wellness Aggregator

A full-stack application that unifies disparate health data streams to provide actionable, personalized insights.

## Hackathon Solution

**Problem**: Health-conscious individuals are drowning in fragmented data from multiple sources (wearables, apps, devices), making it impossible to see the bigger picture.

**Solution**: Hygieia intelligently unifies health data streams and uses AI to discover non-obvious correlations, providing a single holistic view with actionable insights.

## Key Features

- **Multi-source Integration**: Oura Ring + Apple Health + Nutrition tracking
- **AI Correlation Discovery**: Finds patterns like "sleep affects sugar cravings by 30%"
- **Unified Health Story**: Cohesive narrative connecting all metrics
- **Proactive Anomaly Detection**: Alerts for elevated heart rate, sleep debt
- **Actionable Insights**: Specific recommendations with quantified impact
- **Interactive AI Chat**: Ask questions about your health patterns
- **8 UI Layouts**: Multiple visualization approaches

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
- **AI/ML**: Pandas, Scikit-learn, NumPy
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
- **Correlation analysis** discovering sleep-nutrition relationships
- **Anomaly detection** for proactive health alerts  
- **Predictive insights** with 3-day, 7-day, 14-day forecasts
- **Interactive AI chat** for personalized health questions

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
3. **Comprehensive AI** - 4 AI feature types: insights, warnings, recommendations, predictions
4. **Multiple UI Layouts** - 8 visualization approaches for different user needs
5. **Quantified Actionability** - Specific recommendations with expected outcomes

## Data Sources

- **Real Oura Ring data** when connected
- **Apple Health XML upload** for comprehensive tracking
- **AI-generated insights** based on actual health patterns

## Demo Flow

1. **Connect Oura Ring** → Real sleep, activity, readiness data
2. **Upload Apple Health** → Comprehensive historical data  
3. **View Health Story** → Cohesive narrative of health patterns
4. **Explore AI Insights** → Correlation discoveries and predictions
5. **Try Different UI Layouts** → 8 visualization approaches
6. **Ask AI Questions** → Interactive health pattern analysis

Built for the Health Data Unification Hackathon