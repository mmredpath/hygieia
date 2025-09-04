'use client'

import { useState, useEffect } from 'react'
import { Brain, TrendingUp, AlertTriangle, ArrowLeft, Target, Lightbulb, Zap, Palette } from 'lucide-react'
import Link from 'next/link'

interface Insight {
  title: string
  description: string
  correlation: number
  confidence: number
}

interface Warning {
  type: string
  severity: string
  title: string
  message: string
  recommendation: string
}

interface Recommendation {
  type: string
  priority: string
  title: string
  action: string
  reason: string
  impact: string
}

interface Prediction {
  type: string
  timeframe: string
  confidence: number
  title: string
  prediction: string
  impact: string
  prevention: string
}

export default function InsightsPage() {
  const [insights, setInsights] = useState<Insight[]>([])
  const [warnings, setWarnings] = useState<Warning[]>([])
  const [recommendations, setRecommendations] = useState<Recommendation[]>([])
  const [predictions, setPredictions] = useState<Prediction[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('insights')
  const [uiStyle, setUiStyle] = useState('default')

  useEffect(() => {
    fetch('http://localhost:8000/health/insights')
      .then(res => res.json())
      .then(data => {
        setInsights(data.insights || [])
        setWarnings(data.warnings || [])
        setRecommendations(data.recommendations || [])
        setPredictions(data.predictions || [])
        setLoading(false)
      })
      .catch(err => {
        console.error('Error fetching insights:', err)
        setLoading(false)
      })
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-24 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <Link href="/" className="mr-4 p-2 hover:bg-gray-200 rounded-lg transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">🤖 AI Health Intelligence</h1>
          </div>
          
          {/* UI Style Selector */}
          <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-lg shadow border">
            <Palette className="w-5 h-5 text-blue-500" />
            <span className="text-sm font-medium text-gray-700">Style:</span>
            <select 
              value={uiStyle} 
              onChange={(e) => setUiStyle(e.target.value)}
              className="px-3 py-1 border rounded text-sm bg-gray-50 font-medium"
            >
              <option value="default">Default</option>
              <option value="compact">Compact</option>
              <option value="cards">Card Grid</option>
              <option value="minimal">Minimal</option>
              <option value="sidebar">Sidebar</option>
              <option value="grid">Grid View</option>
              <option value="timeline">Timeline</option>
              <option value="split">Split Screen</option>
            </select>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-gray-200 p-1 rounded-lg mb-6">
          <button
            onClick={() => setActiveTab('insights')}
            className={`flex-1 flex items-center justify-center px-4 py-2 rounded-md transition-colors ${
              activeTab === 'insights' ? 'bg-white text-blue-600 shadow' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Brain className="w-4 h-4 mr-2" />
            Insights ({insights.length})
          </button>
          <button
            onClick={() => setActiveTab('recommendations')}
            className={`flex-1 flex items-center justify-center px-4 py-2 rounded-md transition-colors ${
              activeTab === 'recommendations' ? 'bg-white text-green-600 shadow' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Target className="w-4 h-4 mr-2" />
            Recommendations ({recommendations.length})
          </button>
          <button
            onClick={() => setActiveTab('predictions')}
            className={`flex-1 flex items-center justify-center px-4 py-2 rounded-md transition-colors ${
              activeTab === 'predictions' ? 'bg-white text-purple-600 shadow' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Zap className="w-4 h-4 mr-2" />
            Predictions ({predictions.length})
          </button>
          <button
            onClick={() => setActiveTab('warnings')}
            className={`flex-1 flex items-center justify-center px-4 py-2 rounded-md transition-colors ${
              activeTab === 'warnings' ? 'bg-white text-red-600 shadow' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <AlertTriangle className="w-4 h-4 mr-2" />
            Warnings ({warnings.length})
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'insights' && renderInsights()}

        {activeTab === 'recommendations' && renderRecommendations()}

        {activeTab === 'predictions' && renderPredictions()}

        {activeTab === 'warnings' && (
          <div>
            <div className="flex items-center mb-4">
              <AlertTriangle className="w-6 h-6 text-red-500 mr-2" />
              <h2 className="text-xl font-semibold text-gray-900">Health Alerts</h2>
            </div>
            {warnings.length > 0 ? (
              <div className="space-y-4">
                {warnings.map((warning, i) => (
                  <div key={i} className={`p-4 rounded-lg border-l-4 ${
                    warning.severity === 'high' ? 'bg-red-50 border-red-500' : 'bg-yellow-50 border-yellow-500'
                  }`}>
                    <h3 className="font-semibold text-gray-900 mb-2">{warning.title}</h3>
                    <p className="text-gray-700 mb-2">{warning.message}</p>
                    <p className="text-sm text-gray-600 italic">
                      💡 Recommendation: {warning.recommendation}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow p-6 text-center">
                <AlertTriangle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No health alerts</p>
                <p className="text-sm text-gray-400 mt-2">Your health metrics are within normal ranges</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )

  function renderInsights() {
    const header = (
      <div className="flex items-center mb-4">
        <Brain className="w-6 h-6 text-blue-500 mr-2" />
        <h2 className="text-xl font-semibold text-gray-900">Pattern Analysis</h2>
      </div>
    )

    if (insights.length === 0) {
      return (
        <div>
          {header}
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <Brain className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">Analyzing your health patterns...</p>
            <p className="text-sm text-gray-400 mt-2">Connect more data sources for deeper insights</p>
          </div>
        </div>
      )
    }

    switch (uiStyle) {
      case 'compact':
        return (
          <div>
            {header}
            <div className="space-y-2">
              {insights.map((insight, i) => (
                <div key={i} className="bg-white border rounded p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-gray-900">{insight.title}</h3>
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      {(insight.confidence * 100).toFixed(0)}%
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{insight.description}</p>
                </div>
              ))}
            </div>
          </div>
        )
      
      case 'cards':
        return (
          <div>
            {header}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {insights.map((insight, i) => (
                <div key={i} className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl p-6 border border-blue-200">
                  <div className="flex items-center mb-3">
                    <Brain className="w-5 h-5 text-blue-600 mr-2" />
                    <h3 className="font-semibold text-gray-900">{insight.title}</h3>
                  </div>
                  <p className="text-gray-700 text-sm mb-3">{insight.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-blue-700">Correlation: {insight.correlation.toFixed(2)}</span>
                    <span className="text-xs bg-blue-200 text-blue-800 px-2 py-1 rounded-full">
                      {(insight.confidence * 100).toFixed(0)}% confidence
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
      
      case 'minimal':
        return (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Insights</h2>
            <div className="space-y-6">
              {insights.map((insight, i) => (
                <div key={i} className="border-l-4 border-blue-500 pl-4">
                  <h3 className="text-lg font-medium text-gray-900 mb-1">{insight.title}</h3>
                  <p className="text-gray-600">{insight.description}</p>
                  <div className="mt-2 text-sm text-gray-500">
                    Confidence: {(insight.confidence * 100).toFixed(0)}% • Correlation: {insight.correlation.toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
      
      case 'sidebar':
        return (
          <div className="flex gap-6">
            <div className="w-80 bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Summary</h3>
              <div className="space-y-3">
                <div className="text-sm">
                  <span className="text-gray-600">Total:</span>
                  <span className="font-medium text-gray-900 ml-2">{insights.length}</span>
                </div>
              </div>
            </div>
            <div className="flex-1 space-y-4">
              {insights.map((insight, i) => (
                <div key={i} className="bg-white rounded-lg shadow p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">{insight.title}</h3>
                  <p className="text-gray-700 text-sm">{insight.description}</p>
                </div>
              ))}
            </div>
          </div>
        )
      
      case 'grid':
        return (
          <div>
            {header}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {insights.map((insight, i) => (
                <div key={i} className="bg-white rounded-lg shadow-lg p-6">
                  <h3 className="font-semibold text-gray-900 mb-2">{insight.title}</h3>
                  <p className="text-gray-600 text-sm">{insight.description}</p>
                </div>
              ))}
            </div>
          </div>
        )
      
      case 'timeline':
        return (
          <div>
            {header}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="space-y-6">
                {insights.map((insight, i) => (
                  <div key={i} className="flex">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold mr-4">
                      {i + 1}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{insight.title}</h3>
                      <p className="text-gray-700">{insight.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )
      
      case 'split':
        return (
          <div>
            {header}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">High Confidence</h3>
                {insights.filter(i => i.confidence > 0.7).map((insight, i) => (
                  <div key={i} className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900">{insight.title}</h4>
                    <p className="text-gray-700 text-sm">{insight.description}</p>
                  </div>
                ))}
              </div>
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Moderate Confidence</h3>
                {insights.filter(i => i.confidence <= 0.7).map((insight, i) => (
                  <div key={i} className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900">{insight.title}</h4>
                    <p className="text-gray-700 text-sm">{insight.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )
      
      default:
        return (
          <div>
            {header}
            <div className="space-y-4">
              {insights.map((insight, i) => (
                <div key={i} className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-lg font-semibold text-gray-900">{insight.title}</h3>
                    <div className="flex items-center">
                      <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                      <span className="text-sm text-gray-600">
                        {(insight.confidence * 100).toFixed(0)}% confidence
                      </span>
                    </div>
                  </div>
                  <p className="text-gray-700 mb-3">{insight.description}</p>
                  <div className="flex items-center">
                    <div className="flex-1 bg-gray-200 rounded-full h-2 mr-3">
                      <div 
                        className={`h-2 rounded-full ${
                          Math.abs(insight.correlation) > 0.7 ? 'bg-green-500' :
                          Math.abs(insight.correlation) > 0.4 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${Math.abs(insight.correlation) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-600">
                      Correlation: {insight.correlation.toFixed(2)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
    }
  }

  function renderRecommendations() {
    const header = (
      <div className="flex items-center mb-4">
        <Target className="w-6 h-6 text-green-500 mr-2" />
        <h2 className="text-xl font-semibold text-gray-900">Smart Recommendations</h2>
      </div>
    )

    if (recommendations.length === 0) {
      return (
        <div>
          {header}
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No recommendations available</p>
            <p className="text-sm text-gray-400 mt-2">Keep tracking your health data for personalized suggestions</p>
          </div>
        </div>
      )
    }

    switch (uiStyle) {
      case 'compact':
        return (
          <div>
            {header}
            <div className="space-y-2">
              {recommendations.map((rec, i) => (
                <div key={i} className={`border-l-4 p-3 bg-white rounded ${
                  rec.priority === 'high' ? 'border-red-500' : 
                  rec.priority === 'medium' ? 'border-yellow-500' : 'border-green-500'
                }`}>
                  <div className="flex justify-between items-start">
                    <h3 className="font-medium text-gray-900">{rec.title}</h3>
                    <span className={`text-xs px-2 py-1 rounded ${
                      rec.priority === 'high' ? 'bg-red-100 text-red-800' :
                      rec.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                    }`}>
                      {rec.priority}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{rec.action}</p>
                </div>
              ))}
            </div>
          </div>
        )
      
      case 'cards':
        return (
          <div>
            {header}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {recommendations.map((rec, i) => (
                <div key={i} className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-xl p-6 border border-green-200">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-semibold text-gray-900">{rec.title}</h3>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      rec.priority === 'high' ? 'bg-red-200 text-red-800' :
                      rec.priority === 'medium' ? 'bg-yellow-200 text-yellow-800' : 'bg-green-200 text-green-800'
                    }`}>
                      {rec.priority}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 mb-2 font-medium">{rec.action}</p>
                  <p className="text-xs text-green-700">{rec.impact}</p>
                </div>
              ))}
            </div>
          </div>
        )
      
      default:
        return (
          <div>
            {header}
            <div className="space-y-4">
              {recommendations.map((rec, i) => (
                <div key={i} className={`bg-white rounded-lg shadow p-6 border-l-4 ${
                  rec.priority === 'high' ? 'border-red-500' : 
                  rec.priority === 'medium' ? 'border-yellow-500' : 'border-green-500'
                }`}>
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-lg font-semibold text-gray-900">{rec.title}</h3>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      rec.priority === 'high' ? 'bg-red-100 text-red-800' :
                      rec.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                    }`}>
                      {rec.priority} priority
                    </span>
                  </div>
                  <div className="mb-4">
                    <div className="flex items-start mb-2">
                      <Lightbulb className="w-4 h-4 text-blue-500 mr-2 mt-0.5" />
                      <div>
                        <p className="font-medium text-gray-900">Action: {rec.action}</p>
                      </div>
                    </div>
                    <p className="text-gray-700 mb-2">{rec.reason}</p>
                    <p className="text-sm text-green-700 bg-green-50 p-2 rounded">
                      💪 Expected Impact: {rec.impact}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
    }
  }

  function renderPredictions() {
    const header = (
      <div className="flex items-center mb-4">
        <Zap className="w-6 h-6 text-purple-500 mr-2" />
        <h2 className="text-xl font-semibold text-gray-900">Health Predictions</h2>
      </div>
    )

    if (predictions.length === 0) {
      return (
        <div>
          {header}
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <Zap className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No predictions available</p>
            <p className="text-sm text-gray-400 mt-2">Need more historical data to generate accurate predictions</p>
          </div>
        </div>
      )
    }

    switch (uiStyle) {
      case 'compact':
        return (
          <div>
            {header}
            <div className="space-y-2">
              {predictions.map((pred, i) => (
                <div key={i} className="bg-white border border-purple-200 rounded p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium text-gray-900">{pred.title}</h3>
                    <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">
                      {pred.timeframe.replace('_', ' ')}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{pred.prediction}</p>
                </div>
              ))}
            </div>
          </div>
        )
      
      case 'cards':
        return (
          <div>
            {header}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {predictions.map((pred, i) => (
                <div key={i} className="bg-gradient-to-br from-purple-50 to-violet-100 rounded-xl p-6 border border-purple-200">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-semibold text-gray-900">{pred.title}</h3>
                    <span className="text-xs bg-purple-200 text-purple-800 px-2 py-1 rounded-full">
                      {(pred.confidence * 100).toFixed(0)}%
                    </span>
                  </div>
                  <p className="text-sm text-purple-800 mb-2">{pred.prediction}</p>
                  <p className="text-xs text-purple-600">{pred.prevention}</p>
                </div>
              ))}
            </div>
          </div>
        )
      
      default:
        return (
          <div>
            {header}
            <div className="space-y-4">
              {predictions.map((pred, i) => (
                <div key={i} className="bg-white rounded-lg shadow p-6 border-l-4 border-purple-500">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-lg font-semibold text-gray-900">{pred.title}</h3>
                    <div className="flex items-center space-x-2">
                      <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs font-medium">
                        {pred.timeframe.replace('_', ' ')}
                      </span>
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium">
                        {(pred.confidence * 100).toFixed(0)}% confidence
                      </span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="bg-purple-50 p-3 rounded">
                      <p className="font-medium text-purple-900 mb-1">🔮 Prediction:</p>
                      <p className="text-purple-800">{pred.prediction}</p>
                    </div>
                    <div className="bg-orange-50 p-3 rounded">
                      <p className="font-medium text-orange-900 mb-1">⚠️ Expected Impact:</p>
                      <p className="text-orange-800">{pred.impact}</p>
                    </div>
                    <div className="bg-green-50 p-3 rounded">
                      <p className="font-medium text-green-900 mb-1">🛡️ Prevention:</p>
                      <p className="text-green-800">{pred.prevention}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
    }
  }
}