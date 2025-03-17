import React, { useState, useEffect } from 'react'
import { accessibilityTestManager } from '../utils/accessibilityTesting'
import { AccessibilityTestResult } from '../utils/types'

export const AccessibilityReport: React.FC = () => {
  const [testResults, setTestResults] = useState<AccessibilityTestResult[]>([])
  const [selectedResult, setSelectedResult] = useState<AccessibilityTestResult | null>(null)

  useEffect(() => {
    // Load test history
    const history = accessibilityTestManager.getTestHistory()
    setTestResults(history)
  }, [])

  const runAccessibilityTest = async () => {
    try {
      const result = await accessibilityTestManager.runTests()
      setTestResults(prev => [...prev, result])
      setSelectedResult(result)
    } catch (error) {
      console.error('Accessibility test failed:', error)
    }
  }

  const renderIssuesList = (issues: AccessibilityTestResult['issues']) => {
    return issues.map((issue, index) => (
      <li 
        key={index} 
        className={`p-2 rounded mb-2 ${
          issue.severity === 'critical' ? 'bg-red-100 border-red-500' :
          issue.severity === 'high' ? 'bg-orange-100 border-orange-500' :
          issue.severity === 'medium' ? 'bg-yellow-100 border-yellow-500' :
          'bg-green-100 border-green-500'
        }`}
      >
        <div className="flex justify-between">
          <span className="font-bold">{issue.category.toUpperCase()}</span>
          <span className={`font-semibold ${
            issue.severity === 'critical' ? 'text-red-600' :
            issue.severity === 'high' ? 'text-orange-600' :
            issue.severity === 'medium' ? 'text-yellow-600' :
            'text-green-600'
          }`}>
            {issue.severity.toUpperCase()}
          </span>
        </div>
        <p className="mt-1">{issue.message}</p>
        {issue.solution && (
          <p className="text-sm text-gray-600 mt-1">
            <strong>Solution:</strong> {issue.solution}
          </p>
        )}
      </li>
    ))
  }

  return (
    <div className="accessibility-report p-6 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Accessibility Testing Report</h2>
        <button 
          onClick={runAccessibilityTest}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Run Accessibility Test
        </button>
      </div>

      {selectedResult && (
        <div className="current-test-result mb-6">
          <div className={`overall-score p-4 rounded ${
            selectedResult.passed ? 'bg-green-100' : 'bg-red-100'
          }`}>
            <h3 className="text-xl font-semibold mb-2">
              Overall Accessibility Score: {selectedResult.overallScore.toFixed(2)}%
            </h3>
            <p className={`font-bold ${
              selectedResult.passed ? 'text-green-700' : 'text-red-700'
            }`}>
              Test Result: {selectedResult.passed ? 'PASSED' : 'FAILED'}
            </p>
          </div>

          <div className="issues-list mt-4">
            <h4 className="text-lg font-semibold mb-2">
              Detected Issues ({selectedResult.issues.length})
            </h4>
            {selectedResult.issues.length > 0 ? (
              <ul className="space-y-2">
                {renderIssuesList(selectedResult.issues)}
              </ul>
            ) : (
              <p className="text-green-600">No accessibility issues detected!</p>
            )}
          </div>
        </div>
      )}

      <div className="test-history mt-6">
        <h3 className="text-xl font-semibold mb-4">Test History</h3>
        {testResults.length === 0 ? (
          <p className="text-gray-500">No previous tests found</p>
        ) : (
          <ul className="space-y-2">
            {testResults.map((result, index) => (
              <li 
                key={index} 
                onClick={() => setSelectedResult(result)}
                className="p-3 bg-gray-100 rounded cursor-pointer hover:bg-gray-200 transition"
              >
                <div className="flex justify-between">
                  <span>{result.testedAt.toLocaleString()}</span>
                  <span className={
                    result.passed ? 'text-green-600' : 'text-red-600'
                  }>
                    {result.overallScore.toFixed(2)}%
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
