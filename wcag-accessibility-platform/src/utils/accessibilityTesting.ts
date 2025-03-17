import { AccessibilityIssue, AccessibilityTestConfig, AccessibilityTestResult, ErrorLog } from './types'
import { errorAnalytics } from './errorAnalytics'

class AccessibilityTestManager {
  private static instance: AccessibilityTestManager
  private testConfig: AccessibilityTestConfig = {
    wcagLevel: 'AA',
    testCategories: {
      colorContrast: true,
      keyboardNavigation: true,
      semanticStructure: true,
      ariaAttributes: true,
      focusManagement: true,
      performanceMetrics: true
    }
  }

  private constructor() {}

  public static getInstance(): AccessibilityTestManager {
    if (!AccessibilityTestManager.instance) {
      AccessibilityTestManager.instance = new AccessibilityTestManager()
    }
    return AccessibilityTestManager.instance
  }

  public setTestConfiguration(config: Partial<AccessibilityTestConfig>) {
    this.testConfig = {
      ...this.testConfig,
      ...config
    }
  }

  public performComprehensiveQATest(): AccessibilityTestResult {
    const issues: AccessibilityIssue[] = []

    // Color Contrast Test
    if (this.testConfig.testCategories.colorContrast) {
      const contrastIssues = this.testColorContrast()
      issues.push(...contrastIssues)
    }

    // Keyboard Navigation Test
    if (this.testConfig.testCategories.keyboardNavigation) {
      const navigationIssues = this.testKeyboardNavigation()
      issues.push(...navigationIssues)
    }

    // Semantic Structure Test
    if (this.testConfig.testCategories.semanticStructure) {
      const structureIssues = this.testSemanticStructure()
      issues.push(...structureIssues)
    }

    // ARIA Attributes Test
    if (this.testConfig.testCategories.ariaAttributes) {
      const ariaIssues = this.testAriaAttributes()
      issues.push(...ariaIssues)
    }

    // Focus Management Test
    if (this.testConfig.testCategories.focusManagement) {
      const focusIssues = this.testFocusManagement()
      issues.push(...focusIssues)
    }

    // Performance Metrics Test
    if (this.testConfig.testCategories.performanceMetrics) {
      const performanceIssues = this.testPerformanceMetrics()
      issues.push(...performanceIssues)
    }

    // Calculate overall accessibility score
    const overallScore = this.calculateAccessibilityScore(issues)

    // Log QA errors
    issues.forEach(issue => this.logQAError(issue))

    return {
      passed: issues.length === 0,
      issues,
      overallScore,
      testedAt: new Date()
    }
  }

  private testColorContrast(): AccessibilityIssue[] {
    const issues: AccessibilityIssue[] = []
    const elements = document.querySelectorAll('*')

    elements.forEach(element => {
      const computedStyle = window.getComputedStyle(element)
      const backgroundColor = computedStyle.backgroundColor
      const color = computedStyle.color

      // Simplified contrast check (would use more advanced algorithm in real-world)
      if (!this.checkColorContrast(backgroundColor, color)) {
        issues.push({
          id: `contrast-${Math.random().toString(36).substr(2, 9)}`,
          type: 'color-contrast',
          category: 'visual-accessibility',
          severity: 'high',
          message: 'Insufficient color contrast detected',
          affectedElements: [element.tagName],
          solution: 'Adjust background and text colors to meet WCAG contrast requirements'
        })
      }
    })

    return issues
  }

  private testKeyboardNavigation(): AccessibilityIssue[] {
    const issues: AccessibilityIssue[] = []
    const focusableElements = document.querySelectorAll('a, button, input, select, textarea, [tabindex]')

    focusableElements.forEach(element => {
      if (!element.getAttribute('tabindex')) {
        issues.push({
          id: `keyboard-nav-${Math.random().toString(36).substr(2, 9)}`,
          type: 'keyboard-navigation',
          category: 'interaction-accessibility',
          severity: 'medium',
          message: 'Element lacks proper keyboard navigation support',
          affectedElements: [element.tagName],
          solution: 'Add appropriate tabindex and ensure keyboard focusability'
        })
      }
    })

    return issues
  }

  private testSemanticStructure(): AccessibilityIssue[] {
    const issues: AccessibilityIssue[] = []
    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6')
    
    let lastHeadingLevel = 0
    headings.forEach(heading => {
      const currentLevel = parseInt(heading.tagName.charAt(1))
      
      if (currentLevel > lastHeadingLevel + 1) {
        issues.push({
          id: `semantic-structure-${Math.random().toString(36).substr(2, 9)}`,
          type: 'heading-hierarchy',
          category: 'semantic-structure',
          severity: 'medium',
          message: 'Improper heading hierarchy detected',
          affectedElements: [heading.tagName],
          solution: 'Ensure headings follow a logical, sequential order'
        })
      }
      
      lastHeadingLevel = currentLevel
    })

    return issues
  }

  private testAriaAttributes(): AccessibilityIssue[] {
    const issues: AccessibilityIssue[] = []
    const elements = document.querySelectorAll('*')

    elements.forEach(element => {
      const requiredAriaAttributes = ['role', 'aria-label', 'aria-describedby']
      
      requiredAriaAttributes.forEach(attr => {
        if (!element.getAttribute(attr)) {
          issues.push({
            id: `aria-${Math.random().toString(36).substr(2, 9)}`,
            type: 'missing-aria-attribute',
            category: 'semantic-accessibility',
            severity: 'medium',
            message: `Missing important ARIA attribute: ${attr}`,
            affectedElements: [element.tagName],
            solution: `Add ${attr} attribute to improve screen reader compatibility`
          })
        }
      })
    })

    return issues
  }

  private testFocusManagement(): AccessibilityIssue[] {
    const issues: AccessibilityIssue[] = []
    const focusableElements = document.querySelectorAll('a, button, input, select, textarea, [tabindex]')

    focusableElements.forEach(element => {
      if (!element.getAttribute('aria-describedby')) {
        issues.push({
          id: `focus-management-${Math.random().toString(36).substr(2, 9)}`,
          type: 'focus-description',
          category: 'interaction-accessibility',
          severity: 'low',
          message: 'Element lacks focus description',
          affectedElements: [element.tagName],
          solution: 'Add aria-describedby to provide context for screen readers'
        })
      }
    })

    return issues
  }

  private testPerformanceMetrics(): AccessibilityIssue[] {
    const issues: AccessibilityIssue[] = []
    
    // Check for long-running scripts or heavy DOM manipulations
    const performanceEntries = performance.getEntriesByType('measure')
    
    performanceEntries.forEach(entry => {
      if (entry.duration > 100) { // More than 100ms considered performance issue
        issues.push({
          id: `performance-${Math.random().toString(36).substr(2, 9)}`,
          type: 'performance-bottleneck',
          category: 'performance-accessibility',
          severity: 'medium',
          message: `Performance bottleneck detected: ${entry.name}`,
          solution: 'Optimize rendering and reduce complex DOM manipulations'
        })
      }
    })

    return issues
  }

  private checkColorContrast(bg: string, fg: string): boolean {
    // Simplified contrast check (would use more advanced algorithm in real-world)
    return true // Placeholder for actual contrast calculation
  }

  private calculateAccessibilityScore(issues: AccessibilityIssue[]): number {
    const severityWeights = {
      'low': 0.25,
      'medium': 0.5,
      'high': 0.75,
      'critical': 1
    }

    const totalWeight = issues.reduce((acc, issue) => {
      return acc + (severityWeights[issue.severity] || 0)
    }, 0)

    // Calculate score (0-100)
    return Math.max(0, 100 - (totalWeight * 10))
  }

  public logQAError(issue: AccessibilityIssue) {
    // Convert accessibility issue to error log for comprehensive tracking
    const errorLog: ErrorLog = {
      id: issue.id,
      type: issue.type,
      severity: issue.severity,
      message: issue.message,
      timestamp: issue.timestamp || new Date(),
      context: {
        category: issue.category,
        affectedElements: issue.affectedElements,
        solution: issue.solution
      }
    }

    // Log to error analytics
    errorAnalytics.logError(errorLog)
  }
}

export const accessibilityTestManager = AccessibilityTestManager.getInstance()
