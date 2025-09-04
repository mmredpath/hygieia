# 🏗️ Hygieia Architecture Documentation

## System Overview

Hygieia is a full-stack health data aggregation platform that unifies disparate health data sources using AI-powered correlation analysis to provide actionable insights.

## Architecture Diagram

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Data Sources  │    │   Hygieia API   │    │   Frontend UI   │
│                 │    │                 │    │                 │
│ • Oura Ring API │◄──►│ • FastAPI       │◄──►│ • Next.js       │
│ • Apple Health  │    │ • Data Unifier  │    │ • TypeScript    │
│ • Nutrition Log │    │ • AI Engine     │    │ • Tailwind CSS  │
│                 │    │ • Correlation   │    │ • 8 UI Layouts  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                              │
                              ▼
                       ┌─────────────────┐
                       │   PostgreSQL    │
                       │   Database      │
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
- **ML/AI**: Scikit-learn
- **API Integration**: Oura Ring API v2
- **File Processing**: XML parsing for Apple Health

### Database
- **Primary**: PostgreSQL
- **ORM**: SQLAlchemy
- **Migrations**: Alembic

### DevOps
- **Containerization**: Docker Compose
- **Development**: Hot reload for both frontend/backend
- **Environment**: Poetry (Python), npm (Node.js)

## Data Flow

### 1. Data Ingestion
```
Oura Ring API → FastAPI → Data Processor → Unified Format
Apple Health XML → Parser → Data Processor → Unified Format  
Nutrition Input → API → Data Processor → Unified Format
```

### 2. AI Processing Pipeline
```
Raw Health Data → Correlation Engine → Pattern Detection → Insight Generation
                                   → Anomaly Detection → Warning Generation
                                   → Trend Analysis → Prediction Generation
                                   → Optimization → Recommendation Generation
```

### 3. Data Presentation
```
Processed Insights → API Endpoints → Frontend Components → 8 UI Layouts
Health Story → Narrative Generator → Dashboard Display
Real-time Data → WebSocket (future) → Live Updates
```

## Core Components

### Data Unification Engine
- **Smart Source Prioritization**: Oura for sleep, Apple Health for steps
- **Temporal Alignment**: Synchronizes data across different time zones
- **Gap Filling**: Interpolates missing data points intelligently
- **Conflict Resolution**: Handles overlapping data from multiple sources

### AI Correlation Engine
- **Pattern Recognition**: Discovers non-obvious health correlations
- **Statistical Analysis**: Calculates correlation coefficients with confidence intervals
- **Temporal Analysis**: Identifies lagged effects (sleep affecting next-day performance)
- **Baseline Learning**: Establishes personal health baselines for anomaly detection

### Insight Generation System
- **Correlation Insights**: Sleep-activity, recovery-performance relationships
- **Anomaly Warnings**: Elevated heart rate, sleep debt accumulation
- **Predictive Forecasts**: 3-day, 7-day, 14-day health predictions
- **Actionable Recommendations**: Specific actions with quantified expected outcomes

### Health Story Generator
- **Narrative Construction**: Creates cohesive weekly health stories
- **Causal Chain Analysis**: Identifies cause-effect relationships
- **Contextual Insights**: Explains why patterns occurred
- **Action Prioritization**: Highlights most impactful interventions

## API Architecture

### RESTful Endpoints
```
GET  /health/dashboard     # Unified health metrics
GET  /health/insights      # AI-generated insights
GET  /health/story         # Cohesive health narrative
GET  /health/correlations  # Advanced correlation analysis
POST /health/apple/upload  # Apple Health XML processing
GET  /auth/oura           # Oura Ring OAuth integration
```

### Data Models
```python
HealthMetric: timestamp, metric_type, value, source
HealthInsight: title, description, correlation, confidence
HealthWarning: type, severity, message, recommendation
HealthPrediction: type, timeframe, confidence, prediction, impact
```

## Security & Privacy

### Data Protection
- **Local Processing**: Health data processed locally, not stored in cloud
- **Encrypted Storage**: All sensitive data encrypted at rest
- **Secure APIs**: OAuth 2.0 for third-party integrations
- **Privacy First**: Minimal data retention, user-controlled deletion

### Authentication
- **OAuth Integration**: Secure Oura Ring API access
- **Session Management**: Secure token storage and rotation
- **API Security**: Rate limiting and input validation

## Scalability Considerations

### Performance Optimization
- **Efficient Data Processing**: Pandas vectorization for large datasets
- **Caching Strategy**: Redis for frequently accessed insights
- **Lazy Loading**: Progressive data loading in frontend
- **Database Indexing**: Optimized queries for time-series data

### Future Enhancements
- **Real-time Processing**: WebSocket integration for live updates
- **Machine Learning**: Advanced ML models for personalized insights
- **Multi-user Support**: User authentication and data isolation
- **Mobile Apps**: React Native for iOS/Android

## Development Workflow

### Local Development
```bash
./dev start  # Starts all services with hot reload
```

### Testing Strategy
- **Unit Tests**: Backend API endpoints and data processing
- **Integration Tests**: End-to-end data flow validation
- **UI Tests**: Frontend component and user interaction testing
- **Performance Tests**: Load testing for data processing pipelines

### Deployment
- **Containerization**: Docker containers for consistent environments
- **CI/CD Pipeline**: Automated testing and deployment
- **Environment Management**: Separate dev/staging/production configs
- **Monitoring**: Health checks and performance monitoring

## Innovation Highlights

### Technical Innovations
1. **Smart Data Merging**: Intelligent source prioritization per metric type
2. **Health Story Generation**: Unique narrative approach to health data
3. **Multi-layout UI**: 8 different visualization approaches
4. **Real-time AI Insights**: Live correlation discovery and anomaly detection

### AI/ML Innovations
1. **Correlation Discovery**: Finds non-obvious health relationships
2. **Predictive Health Modeling**: Multi-timeframe health forecasting
3. **Personalized Baselines**: Individual health pattern learning
4. **Contextual Anomaly Detection**: Historical pattern-aware alerts

This architecture enables Hygieia to transform fragmented health data into actionable intelligence, directly addressing the hackathon's core challenge of health data unification with AI-powered insights.