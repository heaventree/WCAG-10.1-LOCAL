import React, { useState, useEffect } from 'react'
import { errorAnalytics } from '../utils/errorAnalytics'
import { ErrorLog } from '../utils/types'

export const ErrorMonitor: React.FC = () => {
  const [errorLogs, setErrorLogs] = useState<ErrorLog[]>([])
  const [errorReport, setErrorReport] = useState<{
    totalErrors: number,
    errorTrends: Record<string, number>
  }>({
    totalErrors: 0,
    errorTrends: {}
  })

  useEffect(() => {
    // Initial error log fetch
    const initialLogs = errorAnalytics.getErrorLogs()
    setErrorLogs(initialLogs)

    // Generate initial error report
    const report = errorAnalytics.generateErrorReport()
    setErrorReport({
      totalErrors: report.totalErrors,
      errorTrends: report.errorTrends
    })

    // Listen for custom error trend alerts
    const handleErrorTrendAlert = (event: CustomEvent) => {
      console.warn('Error Trend Detected:', event.detail)
    }

    window.addEventListener('error-trend-alert', 
      handleErrorTrendAlert as EventListener
    )

    // Periodic error report refresh
    const reportInterval = setInterval(() => {
      const updatedReport = errorAnalytics.generateErrorReport()
      setErrorReport({
        totalErrors: updatedReport.totalErrors,
        errorTrends: updatedReport.errorTrends
      })
    }, 60000) // Every minute

    return () => {
      clearInterval(reportInterval)
      window.removeEventListener('error-trend-alert', 
        handleErrorTrendAlert as EventListener
      )
    }
  }, [])

  const clearErrorLogs = () => {
    errorAnalytics.clearErrorLogs()
    setErrorLogs([])
    setErrorReport({
      totalErrors: 0,
      errorTrends: {}
    })
  }

  const renderErrorTrends = () => {
    return Object.entries(errorReport.errorTrends).map(([trend, count]) => (
      <div 
        key={trend} 
        className={`p-2 rounded mb-2 ${
          count > 10 ? 'bg-red-100' : 
          count > 5 ? 'bg-orange-100' : 
          'bg-yellow-100'
        }`}
      >
        <span className="font-bold">{trend}</span>
        <span className="ml-2 text-gray-600">Occurrences: {count}</span>
      </div>
    ))
  }

  return (
    <div className="error-monitor p-6 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Error Monitoring Dashboard</h2>
        <button 
          onClick={clearErrorLogs}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Clear Logs
        </button>
      </div>

      <div className="error-summary mb-6">
        <h3 className="text-xl font-semibold">Error Summary</h3>
        <div className="grid grid-cols-2 gap-4 mt-2">
          <div className="bg-gray-100 p-4 rounded">
            <span className="block text-gray-600">Total Errors</span>
            <span className="text-2xl font-bold">{errorReport.totalErrors}</span>
          </div>
          <div className="bg-gray-100 p-4 rounded">
            <span className="block text-gray-600">Error Trends</span>
            {renderErrorTrends()}
          </div>
        </div>
      </div>

      <div className="error-logs">
        <h3 className="text-xl font-semibold mb-4">Recent Error Logs</h3>
        {errorLogs.length === 0 ? (
          <p className="text-gray-500">No error logs found</p>
        ) : (
          <ul className="space-y-2">
            {errorLogs.map((log, index) => (
              <li 
                key={index} 
                className={`p-3 rounded ${
                  log.severity === 'critical' ? 'bg-red-100 border-red-500' :
                  log.severity === 'high' ? 'bg-orange-100 border-orange-500' :
                  log.severity === 'medium' ? 'bg-yellow-100 border-yellow-500' :
                  'bg-green-100 border-green-500'
                }`}
              >
                <div className="flex justify-between">
                  <span className="font-bold">{log.type.toUpperCase()}</span>
                  <span className={`font-semibold ${
                    log.severity === 'critical' ? 'text-red-600' :
                    log.severity === 'high' ? 'text-orange-600' :
                    log.severity === 'medium' ? 'text-yellow-600' :
                    'text-green-600'
                  }`}>
                    {log.severity.toUpperCase()}
                  </span>
                </div>
                <p className="mt-1">{log.message}</p>
                <div className="text-sm text-gray-600 mt-1">
                  <span>{log.timestamp.toLocaleString()}</span>
                  {log.context && (
                    <pre className="mt-1 text-xs bg-gray-50 p-1 rounded">
                      {JSON.stringify(log.context, null, 2)}
                    </pre>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
