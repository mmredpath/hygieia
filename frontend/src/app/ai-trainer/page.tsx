'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Brain, MessageCircle, Zap, CheckCircle, AlertCircle, Loader } from 'lucide-react';

interface TrainingStatus {
  status: string;
  progress: number;
  error?: string;
}

interface ModelInfo {
  model_id: string;
  trained_at: string;
  training_samples: number;
  status: string;
  capabilities: string[];
}

interface ChatMessage {
  type: 'user' | 'ai';
  message: string;
  timestamp: string;
}

export default function AITrainerPage() {
  const [trainingStatus, setTrainingStatus] = useState<TrainingStatus | null>(null);
  const [modelInfo, setModelInfo] = useState<ModelInfo | null>(null);
  const [isTraining, setIsTraining] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [isAsking, setIsAsking] = useState(false);
  
  const userId = 'demo_user'; // In real app, get from auth

  useEffect(() => {
    checkExistingModel();
  }, []);

  const checkExistingModel = async () => {
    // Skip model check for now since we don't have a model info endpoint
    // The training will show if models exist
  };

  const startTraining = async () => {
    setIsTraining(true);
    setTrainingStatus({ status: 'starting', progress: 0 });

    try {
      const response = await fetch('http://localhost:8000/health/ai/train', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });

      const result = await response.json();
      
      if (result.status === 'trained') {
        setTrainingStatus({ status: 'completed', progress: 100 });
        setModelInfo({
          model_id: 'demo_model',
          trained_at: new Date().toISOString(),
          training_samples: result.data_points || 0,
          status: 'ready',
          capabilities: result.models_trained || []
        });
      } else {
        setTrainingStatus({ status: 'failed', progress: 0, error: result.message });
      }
    } catch (error) {
      setTrainingStatus({ status: 'failed', progress: 0, error: 'Training failed' });
    } finally {
      setIsTraining(false);
    }
  };

  const askQuestion = async () => {
    if (!currentQuestion.trim() || !modelInfo) return;

    const userMessage: ChatMessage = {
      type: 'user',
      message: currentQuestion,
      timestamp: new Date().toLocaleTimeString()
    };

    setChatMessages(prev => [...prev, userMessage]);
    setIsAsking(true);
    setCurrentQuestion('');

    try {
      const response = await fetch('http://localhost:8000/health/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: currentQuestion })
      });

      const data = await response.json();
      
      const aiMessage: ChatMessage = {
        type: 'ai',
        message: data.response || 'Sorry, I couldn\'t process that question.',
        timestamp: new Date().toLocaleTimeString()
      };

      setChatMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      const errorMessage: ChatMessage = {
        type: 'ai',
        message: 'Sorry, there was an error processing your question.',
        timestamp: new Date().toLocaleTimeString()
      };
      setChatMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsAsking(false);
    }
  };

  const sampleQuestions = [
    "Does getting more sleep help my activity levels?",
    "What's my optimal sleep for recovery?",
    "Should I go to bed earlier?",
    "How does my sleep affect my performance?"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/" className="p-2 hover:bg-white/50 rounded-lg transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Brain className="w-8 h-8 text-purple-600" />
              Personal Health AI
            </h1>
            <p className="text-gray-600 mt-1">Train your own AI on your health data</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Training Section */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-500" />
              AI Training
            </h2>

            {!modelInfo && !isTraining && (
              <div className="text-center py-8">
                <Brain className="w-16 h-16 text-purple-600 mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Train Your Personal AI</h3>
                <p className="text-gray-600 mb-6">
                  Create a personalized AI that understands your unique health patterns
                </p>
                <button
                  onClick={startTraining}
                  className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2 mx-auto"
                >
                  <Brain className="w-5 h-5" />
                  Start Training
                </button>
              </div>
            )}

            {isTraining && trainingStatus && (
              <div className="py-8">
                <div className="text-center mb-6">
                  <Loader className="w-12 h-12 text-purple-600 mx-auto mb-4 animate-spin" />
                  <h3 className="text-lg font-medium mb-2">Training Your AI...</h3>
                  <p className="text-gray-600 capitalize">{trainingStatus.status.replace('_', ' ')}</p>
                </div>
                
                <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
                  <div 
                    className="bg-purple-600 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${trainingStatus.progress}%` }}
                  ></div>
                </div>
                <p className="text-center text-sm text-gray-600">{trainingStatus.progress}% Complete</p>
              </div>
            )}

            {modelInfo && (
              <div className="py-4">
                <div className="flex items-center gap-2 mb-4">
                  <CheckCircle className="w-6 h-6 text-green-500" />
                  <h3 className="text-lg font-medium">AI Model Ready!</h3>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Training Samples:</span>
                      <span className="font-medium ml-2">{modelInfo.training_samples}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Trained:</span>
                      <span className="font-medium ml-2">
                        {new Date(modelInfo.trained_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <h4 className="font-medium mb-2">Capabilities:</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {(modelInfo.capabilities || []).map((capability, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        {capability}
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  onClick={startTraining}
                  className="w-full bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                >
                  Retrain with Latest Data
                </button>
              </div>
            )}
          </div>

          {/* Chat Section */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-blue-500" />
              Ask Your AI
            </h2>

            {!modelInfo ? (
              <div className="text-center py-8 text-gray-500">
                <AlertCircle className="w-12 h-12 mx-auto mb-4" />
                <p>Train your AI first to start asking questions</p>
              </div>
            ) : (
              <>
                {/* Chat Messages */}
                <div className="h-64 overflow-y-auto mb-4 border rounded-lg p-4 bg-gray-50">
                  {chatMessages.length === 0 ? (
                    <div className="text-center text-gray-500 py-8">
                      <MessageCircle className="w-8 h-8 mx-auto mb-2" />
                      <p>Start a conversation with your AI!</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {chatMessages.map((msg, index) => (
                        <div key={index} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                          <div className={`max-w-xs px-4 py-2 rounded-lg ${
                            msg.type === 'user' 
                              ? 'bg-purple-600 text-white' 
                              : 'bg-white border shadow-sm'
                          }`}>
                            <p className="text-sm">{msg.message}</p>
                            <p className={`text-xs mt-1 ${msg.type === 'user' ? 'text-purple-200' : 'text-gray-500'}`}>
                              {msg.timestamp}
                            </p>
                          </div>
                        </div>
                      ))}
                      {isAsking && (
                        <div className="flex justify-start">
                          <div className="bg-white border shadow-sm px-4 py-2 rounded-lg">
                            <div className="flex items-center gap-2">
                              <Loader className="w-4 h-4 animate-spin" />
                              <span className="text-sm text-gray-600">Thinking...</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Sample Questions */}
                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-2">Try asking:</p>
                  <div className="flex flex-wrap gap-2">
                    {sampleQuestions.map((question, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentQuestion(question)}
                        className="text-xs bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-full transition-colors"
                      >
                        {question}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Input */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={currentQuestion}
                    onChange={(e) => setCurrentQuestion(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && askQuestion()}
                    placeholder="Ask about your health patterns..."
                    className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    disabled={isAsking}
                  />
                  <button
                    onClick={askQuestion}
                    disabled={!currentQuestion.trim() || isAsking}
                    className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Ask
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Info Section */}
        <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold mb-4">How It Works</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-purple-600 font-bold">1</span>
              </div>
              <h4 className="font-medium mb-2">Analyze Your Data</h4>
              <p className="text-sm text-gray-600">We analyze 90 days of your Oura health data to find patterns</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-purple-600 font-bold">2</span>
              </div>
              <h4 className="font-medium mb-2">Generate Training Data</h4>
              <p className="text-sm text-gray-600">Create personalized Q&As based on your unique health correlations</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-purple-600 font-bold">3</span>
              </div>
              <h4 className="font-medium mb-2">Train Your AI</h4>
              <p className="text-sm text-gray-600">Create a model that understands your personal health patterns</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}