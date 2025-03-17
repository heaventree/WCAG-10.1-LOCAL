import React from 'react'
import { render, act } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { ErrorMonitor } from '../components/ErrorMonitor'
import { accessibilityTestManager } from '../utils/accessibilityTesting'
import { errorAnalytics } from '../utils/errorAnalytics'

describe('Advanced Error Detection and Logging Mechanism', () => {
  // Mock console methods to capture logs
  const originalConsoleError = console.error
  const originalConsoleWarn = console.warn
  const mockConsoleError = vi.fn()
  const mockConsoleWarn = vi.fn()

  beforeEach(() => {
    console.error = mockConsoleError
    console.warn = mockConsoleWarn
    
    // Reset error analytics and test manager
    vi.spyOn(errorAnalytics, 'logError')
    vi.spyOn(accessibilityTestManager, 'logQAError')
  })

  afterEach(() => {
    console.error = originalConsoleError
    console.warn = originalConsoleWarn
    vi.restoreAllMocks()
  })

  it('should capture and log complex global JavaScript errors', () => {
    render(<ErrorMonitor />)

    const errorScenarios = [
      new Error('Synchronous Error'),
      new TypeError('Type Mismatch Error'),
      new RangeError('Out of Bounds Error'),
      new URIError('Invalid URI Error')
    ]

    errorScenarios.forEach(testError => {
      act(() => {
        window.dispatchEvent(new ErrorEvent('error', { 
          error: testError,
          message: testError.message 
        }))
      })

      // Verify error logging for each scenario
      expect(errorAnalytics.logError).toHaveBeenCalled()
      expect(accessibilityTestManager.logQAError).toHaveBeenCalled()
      expect(mockConsoleError).toHaveBeenCalled()
    })
  })

  it('should handle multiple concurrent unhandled promise rejections', async () => {
    render(<ErrorMonitor />)

    const rejectionScenarios = [
      new Error('Network Request Failed'),
      new TypeError('Invalid Promise Resolution'),
      new RangeError('Calculation Overflow')
    ]

    const rejectionPromises = rejectionScenarios.map(reason => 
      new Promise((_, reject) => reject(reason))
    )

    await act(async () => {
      try {
        await Promise.allSettled(rejectionPromises)
      } catch {}  // Intentionally catch to prevent unhandled rejection

      // Simulate unhandled rejections
      rejectionScenarios.forEach(reason => {
        window.dispatchEvent(new PromiseRejectionEvent('unhandledrejection', { 
          reason 
        }))
      })
    })

    // Verify rejection handling
    expect(errorAnalytics.logError).toHaveBeenCalledTimes(rejectionScenarios.length)
    expect(accessibilityTestManager.logQAError).toHaveBeenCalledTimes(rejectionScenarios.length)
  })

  it('should perform comprehensive QA test with error simulation', async () => {
    const mockComprehensiveTest = vi.spyOn(accessibilityTestManager, 'performComprehensiveQATest')
    const mockErrorGeneration = vi.fn()

    // Simulate error-prone scenarios
    const errorScenarios = [
      () => { throw new Error('Synchronous Failure') },
      async () => { 
        return new Promise((_, reject) => {
          reject(new Error('Asynchronous Rejection'))
        }) 
      },
      () => { 
        const obj = null
        obj.someMethod() // Null reference error
      }
    ]

    render(<ErrorMonitor />)

    await act(async () => {
      for (const scenario of errorScenarios) {
        try {
          if (scenario.constructor.name === 'AsyncFunction') {
            await scenario()
          } else {
            scenario()
          }
        } catch (error) {
          mockErrorGeneration(error)
        }
      }

      // Wait for potential async operations
      await new Promise(resolve => setTimeout(resolve, 100))
    })

    // Verify comprehensive test execution and error handling
    expect(mockComprehensiveTest).toHaveBeenCalled()
    expect(mockErrorGeneration).toHaveBeenCalledTimes(errorScenarios.length)
    expect(errorAnalytics.logError).toHaveBeenCalledTimes(errorScenarios.length)
  })

  it('should log and analyze error trends', () => {
    const mockTrendAnalysis = vi.spyOn(errorAnalytics as any, 'analyzeErrorTrends')

    // Simulate multiple similar errors
    const similarErrors = Array(6).fill(null).map(() => 
      new Error('Repeated Error Type')
    )

    similarErrors.forEach(error => {
      errorAnalytics.logError({
        id: `error-${Math.random()}`,
        type: 'repeated-error',
        severity: 'medium',
        message: error.message,
        timestamp: new Date()
      })
    })

    // Verify trend analysis triggered
    expect(mockTrendAnalysis).toHaveBeenCalled()
    expect(mockConsoleWarn).toHaveBeenCalled()
  })
})
