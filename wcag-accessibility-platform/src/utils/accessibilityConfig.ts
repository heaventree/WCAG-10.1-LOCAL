import { AccessibilityRuleSet, AccessibilityConfig, ErrorHandlingStrategy } from './types'

export class AccessibilityConfigManager {
  private static instance: AccessibilityConfigManager
  private config: AccessibilityConfig = {
    wcagLevel: 'AA',
    errorHandling: {
      mode: 'log',
      maxErrorsBeforeAlert: 5,
      autoHeal: false,
      reportingThreshold: 3
    },
    testingRules: {
      colorContrast: true,
      keyboardNavigation: true,
      semanticStructure: true,
      ariaAttributes: true,
      focusManagement: true
    },
    performanceThresholds: {
      renderTime: 100, // ms
      interactionDelay: 50 // ms
    }
  }

  private constructor() {
    this.loadConfigFromStorage()
  }

  public static getInstance(): AccessibilityConfigManager {
    if (!AccessibilityConfigManager.instance) {
      AccessibilityConfigManager.instance = new AccessibilityConfigManager()
    }
    return AccessibilityConfigManager.instance
  }

  private loadConfigFromStorage() {
    try {
      const storedConfig = localStorage.getItem('accessibilityConfig')
      if (storedConfig) {
        const parsedConfig = JSON.parse(storedConfig)
        this.config = { ...this.config, ...parsedConfig }
      }
    } catch (error) {
      console.error('Error loading accessibility config:', error)
    }
  }

  public updateConfig(newConfig: Partial<AccessibilityConfig>) {
    this.config = { ...this.config, ...newConfig }
    this.saveConfigToStorage()
  }

  private saveConfigToStorage() {
    try {
      localStorage.setItem('accessibilityConfig', JSON.stringify(this.config))
    } catch (error) {
      console.error('Error saving accessibility config:', error)
    }
  }

  public getConfig(): AccessibilityConfig {
    return { ...this.config }
  }

  public getTestingRules(): AccessibilityRuleSet {
    return this.config.testingRules
  }

  public getErrorHandlingStrategy(): ErrorHandlingStrategy {
    return this.config.errorHandling
  }

  public resetToDefaultConfig() {
    this.config = {
      wcagLevel: 'AA',
      errorHandling: {
        mode: 'log',
        maxErrorsBeforeAlert: 5,
        autoHeal: false,
        reportingThreshold: 3
      },
      testingRules: {
        colorContrast: true,
        keyboardNavigation: true,
        semanticStructure: true,
        ariaAttributes: true,
        focusManagement: true
      },
      performanceThresholds: {
        renderTime: 100,
        interactionDelay: 50
      }
    }
    this.saveConfigToStorage()
  }
}

export const accessibilityConfig = AccessibilityConfigManager.getInstance()
