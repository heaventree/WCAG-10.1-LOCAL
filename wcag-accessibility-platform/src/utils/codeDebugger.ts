import { ErrorLog, ErrorSeverity } from './types'

export class EnhancedCodeDebugger {
  private static instance: EnhancedCodeDebugger
  private errorLogs: ErrorLog[] = []

  private constructor() {}

  public static getInstance(): EnhancedCodeDebugger {
    if (!EnhancedCodeDebugger.instance) {
      EnhancedCodeDebugger.instance = new EnhancedCodeDebugger()
    }
    return EnhancedCodeDebugger.instance
  }

  public logError(message: string, severity: ErrorSeverity = 'medium'): void {
    const errorLog: ErrorLog = {
      message,
      severity,
      timestamp: new Date().toISOString()
    }
    this.errorLogs.push(errorLog)
    this.handleErrorBySeverity(errorLog)
  }

  private handleErrorBySeverity(errorLog: ErrorLog): void {
    switch (errorLog.severity) {
      case 'critical':
        console.error(`[CRITICAL] ${errorLog.message}`)
        // Potentially trigger emergency reporting
        break
      case 'high':
        console.warn(`[HIGH] ${errorLog.message}`)
        break
      case 'medium':
        console.log(`[MEDIUM] ${errorLog.message}`)
        break
      case 'low':
        console.info(`[LOW] ${errorLog.message}`)
        break
    }
  }

  public getErrorLogs(): ErrorLog[] {
    return [...this.errorLogs]
  }

  public clearErrorLogs(): void {
    this.errorLogs = []
  }
}

export const codeDebugger = EnhancedCodeDebugger.getInstance()
