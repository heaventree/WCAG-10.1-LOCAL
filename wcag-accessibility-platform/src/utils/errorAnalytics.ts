import { AccessibilityIssue, ErrorLog } from './types'

class ErrorAnalytics {
  private static instance: ErrorAnalytics
  private errorLogs: ErrorLog[] = []
  private errorTrends: Record<string, number> = {}
  private MAX_ERROR_HISTORY = 100

  private constructor() {
    this.initErrorTracking()
  }

  public static getInstance(): ErrorAnalytics {
    if (!ErrorAnalytics.instance) {
      ErrorAnalytics.instance = new ErrorAnalytics()
    }
    return ErrorAnalytics.instance
  }

  private initErrorTracking() {
    // Global error event listeners
    window.addEventListener('error', this.handleGlobalError.bind(this))
    window.addEventListener('unhandledrejection', this.handleUnhandledRejection.bind(this))
  }

  private handleGlobalError(event: ErrorEvent) {
    const errorLog: ErrorLog = {
      id: `global-error-${Date.now()}`,
      type: 'global',
      severity: 'critical',
      message: event.message,
      stack: event.error?.stack,
      timestamp: new Date(),
      context: {
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno
      }
    }
    this.logError(errorLog)
  }

  private handleUnhandledRejection(event: PromiseRejectionEvent) {
    const errorLog: ErrorLog = {
      id: `promise-rejection-${Date.now()}`,
      type: 'promise-rejection',
      severity: 'high',
      message: event.reason?.message || 'Unhandled Promise Rejection',
      stack: event.reason?.stack,
      timestamp: new Date(),
      context: {
        reason: event.reason
      }
    }
    this.logError(errorLog)
  }

  public logError(error: ErrorLog | AccessibilityIssue) {
    // Normalize error log
    const normalizedError: ErrorLog = {
      id: error.id || `error-${Date.now()}`,
      type: error.type || 'unknown',
      severity: error.severity || 'medium',
      message: error.message,
      timestamp: error.timestamp || new Date(),
      context: error.context || {},
      stack: 'stack' in error ? error.stack : undefined
    }

    // Maintain error history
    if (this.errorLogs.length >= this.MAX_ERROR_HISTORY) {
      this.errorLogs.shift()
    }
    this.errorLogs.push(normalizedError)

    // Track error trends
    this.trackErrorTrend(normalizedError)

    // Console logging for development
    this.consoleLog(normalizedError)

    return normalizedError
  }

  private trackErrorTrend(error: ErrorLog) {
    const trendKey = `${error.type}-${error.severity}`
    this.errorTrends[trendKey] = (this.errorTrends[trendKey] || 0) + 1

    // Analyze trends and potentially trigger alerts
    this.analyzeErrorTrends()
  }

  public analyzeErrorTrends() {
    const criticalThreshold = 5
    const highThreshold = 10

    Object.entries(this.errorTrends).forEach(([trend, count]) => {
      if (count >= criticalThreshold) {
        console.warn(`Error Trend Alert: ${trend} has occurred ${count} times`)
        
        // Potential integration with external monitoring
        this.reportErrorTrend(trend, count)
      }
    })
  }

  private reportErrorTrend(trend: string, count: number) {
    // Placeholder for external error reporting 
    // Could integrate with services like Sentry, LogRocket, etc.
    try {
      // Example of potential external reporting
      window.dispatchEvent(new CustomEvent('error-trend-alert', {
        detail: { trend, count }
      }))
    } catch (reportError) {
      console.error('Error reporting failed', reportError)
    }
  }

  private consoleLog(error: ErrorLog) {
    switch (error.severity) {
      case 'critical':
        console.error(`[CRITICAL] ${error.message}`, error)
        break
      case 'high':
        console.warn(`[HIGH] ${error.message}`, error)
        break
      case 'medium':
        console.info(`[MEDIUM] ${error.message}`, error)
        break
      default:
        console.log(`[LOW] ${error.message}`, error)
    }
  }

  public getErrorLogs(): ErrorLog[] {
    return [...this.errorLogs]
  }

  public clearErrorLogs() {
    this.errorLogs = []
    this.errorTrends = {}
  }

  public generateErrorReport(): {
    totalErrors: number,
    errorTrends: Record<string, number>,
    recentErrors: ErrorLog[]
  } {
    return {
      totalErrors: this.errorLogs.length,
      errorTrends: {...this.errorTrends},
      recentErrors: this.errorLogs.slice(-10) // Last 10 errors
    }
  }
}

export const errorAnalytics = ErrorAnalytics.getInstance()
