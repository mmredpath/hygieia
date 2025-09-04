'use client'

import { useState } from 'react'
import { Upload, FileText, CheckCircle, AlertCircle, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function UploadPage() {
  const [uploading, setUploading] = useState(false)
  const [uploadResult, setUploadResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (!file.name.endsWith('.xml')) {
      setError('Please select an XML file from Apple Health export')
      return
    }

    setUploading(true)
    setError(null)
    setUploadResult(null)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('http://localhost:8000/health/apple/upload', {
        method: 'POST',
        body: formData,
      })

      const result = await response.json()

      if (response.ok) {
        setUploadResult(result)
      } else {
        setError(result.error || 'Upload failed')
      }
    } catch (err) {
      setError('Network error. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-8">
          <Link href="/" className="text-gray-500 hover:text-gray-700">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Upload Apple Health Data</h1>
            <p className="text-gray-600">Import your health data from iPhone Health app</p>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 rounded-lg p-6 mb-8">
          <h2 className="text-lg font-semibold text-blue-900 mb-4">📱 How to Export from iPhone:</h2>
          <ol className="space-y-2 text-blue-800">
            <li><strong>1.</strong> Open Health app on iPhone</li>
            <li><strong>2.</strong> Tap your profile picture (top right)</li>
            <li><strong>3.</strong> Tap "Export All Health Data"</li>
            <li><strong>4.</strong> Share the ZIP file to your computer</li>
            <li><strong>5.</strong> Extract and upload the <code>export.xml</code> file below</li>
          </ol>
        </div>

        {/* Upload Area */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="text-center">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 hover:border-blue-400 transition-colors">
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              
              <label htmlFor="file-upload" className="cursor-pointer">
                <span className="text-lg font-medium text-gray-900">
                  {uploading ? 'Uploading...' : 'Choose Apple Health XML file'}
                </span>
                <p className="text-gray-500 mt-2">
                  Select the export.xml file from your Apple Health export
                </p>
                <input
                  id="file-upload"
                  type="file"
                  accept=".xml"
                  onChange={handleFileUpload}
                  disabled={uploading}
                  className="hidden"
                />
              </label>

              {uploading && (
                <div className="mt-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                </div>
              )}
            </div>
          </div>

          {/* Success Result */}
          {uploadResult && (
            <div className="mt-6 bg-green-50 rounded-lg p-6">
              <div className="flex items-center space-x-3 mb-4">
                <CheckCircle className="w-6 h-6 text-green-600" />
                <h3 className="text-lg font-semibold text-green-900">Upload Successful!</h3>
              </div>
              
              <div className="space-y-2 text-green-800">
                <p><strong>Data Points:</strong> {uploadResult.data_points?.toLocaleString()}</p>
                <p><strong>Date Range:</strong> {uploadResult.date_range}</p>
                <p><strong>Metrics Found:</strong> {uploadResult.metrics?.join(', ')}</p>
              </div>

              <div className="mt-6 flex space-x-4">
                <Link 
                  href="/" 
                  className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
                >
                  View Dashboard
                </Link>
                <Link 
                  href="/insights" 
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  View Insights
                </Link>
              </div>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="mt-6 bg-red-50 rounded-lg p-6">
              <div className="flex items-center space-x-3">
                <AlertCircle className="w-6 h-6 text-red-600" />
                <div>
                  <h3 className="text-lg font-semibold text-red-900">Upload Failed</h3>
                  <p className="text-red-800">{error}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="mt-8 bg-gray-100 rounded-lg p-6">
          <div className="flex items-start space-x-3">
            <FileText className="w-6 h-6 text-gray-600 mt-1" />
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Privacy & Security</h4>
              <p className="text-gray-700 text-sm leading-relaxed">
                Your health data is processed locally and not stored permanently. 
                The XML file contains your personal health information - only upload files you trust. 
                Data is used only for generating insights and is not shared with third parties.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}