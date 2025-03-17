// Expanded type definitions for error handling and accessibility

export interface ErrorLog {
  id: string
  type: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  message: string
  timestamp: Date
  context?: Record<string, any>
  stack?: string
}

export interface AccessibilityIssue {
  id: string
  type: string
  category: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  message: string
  solution?: string
  affectedElements?: string[]
  timestamp?: Date
}

export interface AccessibilityTestConfig {
  wcagLevel: 'A' | 'AA' | 'AAA'
  testCategories: AccessibilityRuleSet
}

export interface AccessibilityRuleSet {
  colorContrast: boolean
  keyboardNavigation: boolean
  semanticStructure: boolean
  ariaAttributes: boolean
  focusManagement: boolean
  performanceMetrics?: boolean
}

export interface AccessibilityTestResult {
  passed: boolean
  issues: AccessibilityIssue[]
  overallScore: number
  testedAt: Date
}
