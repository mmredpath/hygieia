'use client'

import { useState, useEffect } from 'react'
import { Activity, Heart, Moon, Zap, Upload, ChevronLeft, ChevronRight, Sun, Palette, Brain } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import Link from 'next/link'

interface HealthData {
  metrics: {
    sleep: Array<{ date: string; value: number }>
    steps: Array<{ date: string; value: number }>
    heart_rate: Array<{ date: string; value: number }>
    calories: Array<{ date: string; value: number }>
  }
}

interface Insight {
  title: string
  description: string
  correlation: number
  confidence: number
}

export default function Dashboard() {
  const [healthData, setHealthData] = useState<HealthData | null>(null)
  const [insights, setInsights] = useState<Insight[]>([])
  const [ouraConnected, setOuraConnected] = useState(false)
  const [dataSource, setDataSource] = useState<string>('mock')
  const [currentDayIndex, setCurrentDayIndex] = useState(0) // Start with latest day (index 0 = most recent)
  const [darkMode, setDarkMode] = useState(false)
  const [uiStyle, setUiStyle] = useState('default')
  const [healthStory, setHealthStory] = useState(null)
  const [chatMessages, setChatMessages] = useState<Array<{type: 'user' | 'ai', message: string, confidence?: number}>>([])
  const [chatInput, setChatInput] = useState('')
  const [isLoadingChat, setIsLoadingChat] = useState(false)
  const [isTrainingAI, setIsTrainingAI] = useState(false)
  const [aiTrained, setAiTrained] = useState(false)

  useEffect(() => {
    // Check if connected via URL parameter
    const urlParams = new URLSearchParams(window.location.search)
    if (urlParams.get('connected') === 'true') {
      setOuraConnected(true)
      // Remove the parameter from URL
      window.history.replaceState({}, document.title, window.location.pathname)
    }

    // Check Oura connection status
    fetch('http://localhost:8000/health/oura/status')
      .then(res => res.json())
      .then(data => setOuraConnected(data.connected))
      .catch(console.error)

    // Fetch dashboard data
    fetch('http://localhost:8000/health/dashboard')
      .then(res => res.json())
      .then(data => {
        setHealthData(data)
        setDataSource(data.source || 'mock')
        // Reset to most recent day when new data loads
        setCurrentDayIndex(0)
      })
      .catch(console.error)

    // Fetch insights
    fetch('http://localhost:8000/health/insights')
      .then(res => res.json())
      .then(data => setInsights(data.insights || []))
      .catch(console.error)

    // Fetch health story
    fetch('http://localhost:8000/health/story')
      .then(res => res.json())
      .then(data => setHealthStory(data.story))
      .catch(console.error)
  }, [])

  const connectOura = () => {
    window.location.href = 'http://localhost:8000/auth/oura'
  }

  const sendChatMessage = async (message: string) => {
    if (!message.trim() || isLoadingChat) return
    
    setChatMessages(prev => [...prev, { type: 'user', message }])
    setChatInput('')
    setIsLoadingChat(true)
    
    try {
      const response = await fetch('http://localhost:8000/health/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: message })
      })
      
      const data = await response.json()
      
      setChatMessages(prev => [...prev, { 
        type: 'ai', 
        message: data.response, 
        confidence: data.confidence 
      }])
    } catch (error) {
      setChatMessages(prev => [...prev, { 
        type: 'ai', 
        message: 'Sorry, I had trouble processing your question. Please try again.' 
      }])
    } finally {
      setIsLoadingChat(false)
    }
  }

  const handleQuestionClick = (question: string) => {
    sendChatMessage(question)
  }

  const quickTrainAI = async () => {
    setIsTrainingAI(true)
    
    try {
      const response = await fetch('http://localhost:8000/health/ai/train', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      })
      
      const result = await response.json()
      
      if (result.status === 'trained') {
        setAiTrained(true)
        setChatMessages(prev => [...prev, {
          type: 'ai',
          message: `AI model trained successfully! I analyzed ${result.data_points} data points and created ${result.ml_models_trained || result.models_trained?.length || 0} ML models. You can now ask me questions about your health patterns.`
        }])
      } else {
        setChatMessages(prev => [...prev, {
          type: 'ai',
          message: result.message || 'Training failed. Please ensure you have health data connected.'
        }])
      }
    } catch (error) {
      setChatMessages(prev => [...prev, {
        type: 'ai',
        message: 'Failed to train AI model. Please try again.'
      }])
    } finally {
      setIsTrainingAI(false)
    }
  }

  if (!healthData) return <div className="p-8">Loading...</div>

  // Check if we have any actual data
  const hasData = healthData.metrics && Object.keys(healthData.metrics).length > 0 && 
    healthData.metrics.sleep && healthData.metrics.sleep.length > 0

  return (
    <div className={`min-h-screen p-6 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-4">
            <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Health Dashboard</h1>
            
            {/* Day Navigation */}
            <div className={`flex items-center space-x-2 rounded-lg shadow px-4 py-2 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <button
                onClick={() => setCurrentDayIndex(Math.min((healthData?.metrics?.sleep?.length || 1) - 1, currentDayIndex + 1))}
                disabled={!healthData || !healthData.metrics?.sleep || currentDayIndex >= (healthData.metrics.sleep.length - 1)}
                className={`p-1 rounded disabled:opacity-50 disabled:cursor-not-allowed ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                title="Previous day"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              
              <span className={`text-sm font-medium min-w-[100px] text-center ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {healthData?.metrics?.sleep?.[currentDayIndex]?.date 
                  ? new Date(healthData.metrics.sleep[currentDayIndex].date).toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric' 
                    })
                  : 'Today'
                }
              </span>
              
              <button
                onClick={() => setCurrentDayIndex(Math.max(0, currentDayIndex - 1))}
                disabled={currentDayIndex === 0}
                className={`p-1 rounded disabled:opacity-50 disabled:cursor-not-allowed ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                title="Next day"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* UI Style Selector */}
            <div className={`flex items-center space-x-2 px-4 py-2 rounded-lg shadow border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
              <Palette className="w-5 h-5 text-blue-500" />
              <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Style:</span>
              <select 
                value={uiStyle} 
                onChange={(e) => setUiStyle(e.target.value)}
                className={`px-3 py-1 border rounded text-sm font-medium ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-300 text-gray-900'}`}
              >
                <option value="default">Default</option>
                <option value="compact">Compact</option>
                <option value="cards">Large Cards</option>
                <option value="minimal">Minimal</option>
                <option value="sidebar">Sidebar</option>
                <option value="grid">Grid View</option>
                <option value="timeline">Timeline</option>
                <option value="split">Split Screen</option>
              </select>
            </div>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2 rounded-lg transition-colors ${darkMode ? 'bg-gray-800 text-yellow-400 hover:bg-gray-700' : 'bg-white text-gray-600 hover:bg-gray-100'} shadow`}
              title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <div className={`px-3 py-1 rounded-full text-sm ${
              dataSource === 'oura' ? 'bg-green-100 text-green-800' : 
              dataSource === 'apple_health' ? 'bg-blue-100 text-blue-800' : 
              dataSource === 'merged' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'
            }`}>
              {dataSource === 'oura' ? '🔗 Oura Data' : 
               dataSource === 'apple_health' ? '🍎 Apple Health' : 
               dataSource === 'merged' ? '🔄 Multi-Source' : '⚪ No Data'}
            </div>
            <div className="flex gap-3">
              <button
                onClick={connectOura}
                className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                  ouraConnected 
                    ? 'bg-green-600 text-white hover:bg-green-700' 
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                <Activity className="w-4 h-4" />
                {ouraConnected ? 'Oura Connected' : 'Connect Oura Ring'}
              </button>
              <Link 
                href="/upload"
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
              >
                <Upload className="w-4 h-4" />
                Upload Apple Health
              </Link>
            </div>
          </div>
        </div>
        
        {/* Empty State or Data */}
        {!hasData ? (
          <div className={`text-center py-16 ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow mb-8`}>
            <div className="max-w-md mx-auto">
              <div className="mb-6">
                <Activity className={`w-16 h-16 mx-auto ${darkMode ? 'text-gray-600' : 'text-gray-400'}`} />
              </div>
              <h3 className={`text-xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                No Health Data Connected
              </h3>
              <p className={`mb-8 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Connect your Oura Ring or upload Apple Health data to see your personalized health insights and AI-powered analysis.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={connectOura}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Activity className="w-5 h-5" />
                  Connect Oura Ring
                </button>
                <Link 
                  href="/upload"
                  className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Upload className="w-5 h-5" />
                  Upload Apple Health
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Metrics Cards */}
            {renderMetricsCards()}

            {/* Charts */}
            {renderCharts()}
          </>
        )}

        {/* Health Story */}
        {hasData && healthStory && (
          <div className={`rounded-lg shadow p-6 mb-8 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <h2 className={`text-xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>📖 {healthStory.title}</h2>
            <p className={`text-base mb-4 leading-relaxed ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              {healthStory.narrative}
            </p>
            {healthStory.key_connections && healthStory.key_connections.length > 0 && (
              <div className="mb-4">
                <h3 className={`text-sm font-semibold mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Key Connections:</h3>
                <ul className="space-y-1">
                  {healthStory.key_connections.map((connection, i) => (
                    <li key={i} className={`text-sm flex items-start ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      <span className="text-blue-500 mr-2">•</span>
                      {connection}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <div className={`p-3 rounded-lg ${darkMode ? 'bg-blue-900/30 border border-blue-700' : 'bg-blue-50 border border-blue-200'}`}>
              <p className={`text-sm font-medium ${darkMode ? 'text-blue-300' : 'text-blue-800'}`}>
                🎯 Action Priority: {healthStory.action_priority}
              </p>
            </div>
          </div>
        )}

        {/* AI Insights */}
        {hasData && (
          <div className={`rounded-lg shadow p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="flex items-center justify-between mb-4">
              <h2 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>🤖 AI-Powered Insights</h2>
              <Link href="/insights" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm">
                View All Insights
              </Link>
            </div>
            {insights.length > 0 ? (
              <div className="space-y-4">
                {insights.map((insight, i) => (
                  <div key={i} className="border-l-4 border-blue-500 pl-4">
                    <h3 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{insight.title}</h3>
                    <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>{insight.description}</p>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Confidence: {(insight.confidence * 100).toFixed(0)}%</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className={darkMode ? 'text-gray-400' : 'text-gray-500'}>Analyzing your health patterns...</p>
            )}
          </div>
        )}

        {/* AI Chat */}
        <div className={`rounded-lg shadow p-6 mt-8 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="flex items-center justify-between mb-4">
            <h2 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>💬 Ask Your Health AI</h2>
            <div className="flex gap-2">
              {!aiTrained && hasData && (
                <button
                  onClick={quickTrainAI}
                  disabled={isTrainingAI}
                  className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors text-sm flex items-center gap-2 disabled:opacity-50"
                >
                  <Brain className="w-4 h-4" />
                  {isTrainingAI ? 'Training...' : 'Quick Train'}
                </button>
              )}
              <Link 
                href="/ai-trainer"
                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors text-sm flex items-center gap-2"
              >
                <Brain className="w-4 h-4" />
                AI Trainer
              </Link>
            </div>
          </div>
          
          {/* Chat Messages */}
          {chatMessages.length > 0 && (
            <div className={`max-h-64 overflow-y-auto mb-4 p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
              {chatMessages.map((msg, i) => (
                <div key={i} className={`mb-3 ${msg.type === 'user' ? 'text-right' : 'text-left'}`}>
                  <div className={`inline-block max-w-xs lg:max-w-md px-3 py-2 rounded-lg ${
                    msg.type === 'user' 
                      ? 'bg-blue-600 text-white' 
                      : darkMode ? 'bg-gray-600 text-gray-100' : 'bg-white text-gray-900'
                  }`}>
                    <p className="text-sm whitespace-pre-wrap">{msg.message}</p>
                    {msg.confidence && (
                      <p className="text-xs opacity-75 mt-1">Confidence: {(msg.confidence * 100).toFixed(0)}%</p>
                    )}
                  </div>
                </div>
              ))}
              {isLoadingChat && (
                <div className="text-left">
                  <div className={`inline-block px-3 py-2 rounded-lg ${darkMode ? 'bg-gray-600' : 'bg-white'}`}>
                    <p className="text-sm">AI is thinking...</p>
                  </div>
                </div>
              )}
            </div>
          )}
          
          <div className="space-y-4">
            <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
              <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'} mb-2`}>Try asking:</p>
              <div className="flex flex-wrap gap-2">
                {[
                  "How does my sleep affect my activity?",
                  "What's my optimal sleep duration?",
                  "Why was my heart rate elevated?",
                  "Should I take a rest day?"
                ].map((question, i) => (
                  <button
                    key={i}
                    onClick={() => handleQuestionClick(question)}
                    disabled={isLoadingChat}
                    className={`px-3 py-1 rounded-full text-xs transition-colors disabled:opacity-50 ${
                      darkMode 
                        ? 'bg-gray-600 text-gray-300 hover:bg-gray-500' 
                        : 'bg-white text-gray-700 hover:bg-gray-100'
                    } border`}
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendChatMessage(chatInput)}
                placeholder="Ask about your health patterns..."
                disabled={isLoadingChat}
                className={`flex-1 px-4 py-2 rounded-lg border disabled:opacity-50 ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                }`}
              />
              <button 
                onClick={() => sendChatMessage(chatInput)}
                disabled={isLoadingChat || !chatInput.trim()}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoadingChat ? 'Asking...' : 'Ask AI'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  function renderMetricsCards() {
    const metrics = [
      { title: "Sleep", value: `${healthData?.metrics?.sleep?.[currentDayIndex]?.value || 0}h`, icon: <Moon className="w-6 h-6" />, color: "bg-health-sleep" },
      { title: "Steps", value: (healthData?.metrics?.steps?.[currentDayIndex]?.value || 0).toLocaleString(), icon: <Activity className="w-6 h-6" />, color: "bg-health-activity" },
      { title: "Heart Rate", value: `${healthData?.metrics?.heart_rate?.[currentDayIndex]?.value || 0} bpm`, icon: <Heart className="w-6 h-6" />, color: "bg-health-heart" },
      { title: "Calories", value: (healthData?.metrics?.calories?.[currentDayIndex]?.value || 0).toLocaleString(), icon: <Zap className="w-6 h-6" />, color: "bg-health-nutrition" }
    ]

    switch (uiStyle) {
      case 'compact':
        return (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
            {metrics.map((metric, i) => (
              <div key={i} className={`rounded-lg border p-4 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                <div className="flex items-center justify-between">
                  <div className={`${metric.color} text-white p-2 rounded`}>
                    {metric.icon}
                  </div>
                </div>
                <p className={`text-xs mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{metric.title}</p>
                <p className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{metric.value}</p>
              </div>
            ))}
          </div>
        )
      
      case 'cards':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {metrics.map((metric, i) => (
              <div key={i} className={`rounded-xl shadow-lg p-8 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                <div className="flex items-center justify-between mb-4">
                  <div className={`${metric.color} text-white p-4 rounded-xl`}>
                    {metric.icon}
                  </div>
                  <div className="text-right">
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{metric.title}</p>
                    <p className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{metric.value}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      
      case 'minimal':
        return (
          <div className="mb-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {metrics.map((metric, i) => (
                <div key={i} className="text-center">
                  <div className={`${metric.color} text-white p-3 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2`}>
                    {metric.icon}
                  </div>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{metric.title}</p>
                  <p className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{metric.value}</p>
                </div>
              ))}
            </div>
          </div>
        )
      
      case 'sidebar':
        return (
          <div className="flex gap-6 mb-8">
            <div className={`w-80 space-y-4 ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow p-6`}>
              <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Today's Metrics</h3>
              {metrics.map((metric, i) => (
                <div key={i} className="flex items-center space-x-3">
                  <div className={`${metric.color} text-white p-2 rounded`}>
                    {metric.icon}
                  </div>
                  <div className="flex-1">
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{metric.title}</p>
                    <p className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{metric.value}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex-1 space-y-6">
              <ChartCard title="Sleep Patterns" data={healthData.metrics.sleep} color="#8b5cf6" darkMode={darkMode} />
              <ChartCard title="Daily Activity" data={healthData.metrics.steps} color="#10b981" darkMode={darkMode} />
            </div>
          </div>
        )
      
      case 'grid':
        return (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {metrics.map((metric, i) => (
              <div key={i} className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-6 text-center transform hover:scale-105 transition-transform`}>
                <div className={`${metric.color} text-white p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4`}>
                  {metric.icon}
                </div>
                <h3 className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-2`}>{metric.title}</h3>
                <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{metric.value}</p>
                <div className={`mt-3 h-2 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded-full`}>
                  <div className={`h-2 ${metric.color} rounded-full`} style={{width: '75%'}}></div>
                </div>
              </div>
            ))}
          </div>
        )
      
      case 'timeline':
        return (
          <div className="mb-8">
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow p-6`}>
              <h3 className={`text-lg font-semibold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Health Timeline - Today</h3>
              <div className="space-y-6">
                {metrics.map((metric, i) => (
                  <div key={i} className="flex items-center">
                    <div className={`${metric.color} text-white p-3 rounded-full mr-4`}>
                      {metric.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-center">
                        <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{metric.title}</span>
                        <span className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{metric.value}</span>
                      </div>
                      <div className={`mt-2 h-2 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded-full`}>
                        <div className={`h-2 ${metric.color} rounded-full`} style={{width: `${60 + i * 10}%`}}></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )
      
      case 'split':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow p-6`}>
              <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Physical Health</h3>
              <div className="space-y-4">
                {metrics.slice(0, 2).map((metric, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className={`${metric.color} text-white p-2 rounded mr-3`}>
                        {metric.icon}
                      </div>
                      <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{metric.title}</span>
                    </div>
                    <span className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{metric.value}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow p-6`}>
              <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Activity & Energy</h3>
              <div className="space-y-4">
                {metrics.slice(2, 4).map((metric, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className={`${metric.color} text-white p-2 rounded mr-3`}>
                        {metric.icon}
                      </div>
                      <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{metric.title}</span>
                    </div>
                    <span className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{metric.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )
      
      default:
        return (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {metrics.map((metric, i) => (
              <MetricCard 
                key={i}
                title={metric.title}
                value={metric.value}
                icon={metric.icon}
                color={metric.color}
                darkMode={darkMode}
              />
            ))}
          </div>
        )
    }
  }

  function renderCharts() {
    switch (uiStyle) {
      case 'compact':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
            <ChartCard title="Sleep Patterns" data={healthData.metrics.sleep} color="#8b5cf6" darkMode={darkMode} compact />
            <ChartCard title="Daily Activity" data={healthData.metrics.steps} color="#10b981" darkMode={darkMode} compact />
          </div>
        )
      
      case 'cards':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <ChartCard title="Sleep Patterns" data={healthData.metrics.sleep} color="#8b5cf6" darkMode={darkMode} large />
            <ChartCard title="Daily Activity" data={healthData.metrics.steps} color="#10b981" darkMode={darkMode} large />
          </div>
        )
      
      case 'minimal':
        return (
          <div className="mb-8">
            <div className={`rounded-lg p-4 ${darkMode ? 'bg-gray-800' : 'bg-white'} border-l-4 border-blue-500`}>
              <h3 className={`text-lg font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Recent Trends</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Avg Sleep: </span>
                  <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {healthData?.metrics?.sleep ? (healthData.metrics.sleep.slice(-7).reduce((sum, item) => sum + item.value, 0) / 7).toFixed(1) : '0'}h
                  </span>
                </div>
                <div>
                  <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Avg Steps: </span>
                  <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {healthData?.metrics?.steps ? Math.round(healthData.metrics.steps.slice(-7).reduce((sum, item) => sum + item.value, 0) / 7).toLocaleString() : '0'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )
      
      case 'sidebar':
        return null // Charts are integrated into sidebar layout
      
      case 'grid':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <ChartCard title="Sleep Patterns" data={healthData.metrics.sleep} color="#8b5cf6" darkMode={darkMode} />
            <ChartCard title="Daily Activity" data={healthData.metrics.steps} color="#10b981" darkMode={darkMode} />
          </div>
        )
      
      case 'timeline':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <ChartCard title="Sleep Patterns" data={healthData.metrics.sleep} color="#8b5cf6" darkMode={darkMode} />
            <ChartCard title="Daily Activity" data={healthData.metrics.steps} color="#10b981" darkMode={darkMode} />
          </div>
        )
      
      case 'split':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <ChartCard title="Sleep Quality" data={healthData.metrics.sleep} color="#8b5cf6" darkMode={darkMode} />
            <ChartCard title="Activity Level" data={healthData.metrics.steps} color="#10b981" darkMode={darkMode} />
          </div>
        )
      
      default:
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <ChartCard title="Sleep Patterns" data={healthData.metrics.sleep} color="#8b5cf6" darkMode={darkMode} />
            <ChartCard title="Daily Activity" data={healthData.metrics.steps} color="#10b981" darkMode={darkMode} />
          </div>
        )
    }
  }
}

function MetricCard({ title, value, icon, color, darkMode }: any) {
  return (
    <div className={`rounded-lg shadow p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
      <div className="flex items-center">
        <div className={`${color} text-white p-3 rounded-lg mr-4`}>
          {icon}
        </div>
        <div>
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{title}</p>
          <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{value}</p>
        </div>
      </div>
    </div>
  )
}

function ChartCard({ title, data, color, darkMode, compact, large }: any) {
  const height = compact ? 150 : large ? 300 : 200
  
  return (
    <div className={`rounded-lg shadow p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'} ${large ? 'shadow-xl' : ''} overflow-hidden min-w-0`}>
      <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>{title}</h3>
      <div className="w-full" style={{ minWidth: 0 }}>
        <ResponsiveContainer width="100%" height={height}>
          <LineChart data={data} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#374151' : '#e5e7eb'} />
            <XAxis 
              dataKey="date" 
              tickFormatter={(date) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} 
              tick={{ fill: darkMode ? '#9ca3af' : '#6b7280', fontSize: 11 }}
              interval="preserveStartEnd"
            />
            <YAxis tick={{ fill: darkMode ? '#9ca3af' : '#6b7280', fontSize: 11 }} width={40} />
            <Tooltip 
              contentStyle={{
                backgroundColor: darkMode ? '#1f2937' : '#ffffff',
                border: `1px solid ${darkMode ? '#374151' : '#e5e7eb'}`,
                color: darkMode ? '#ffffff' : '#000000'
              }}
            />
            <Line type="monotone" dataKey="value" stroke={color} strokeWidth={large ? 3 : 2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}