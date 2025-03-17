import { ErrorLog, AccessibilityIssue } from './types'
import { serviceAuthentication } from './serviceAuthentication'

export class ExternalToolIntegration {
  private static instance: ExternalToolIntegration
  private integrationServices: Map<string, any> = new Map()
  private availableTools: string[] = ['git', 'netlify', 'sentry', 'datadog', 'lighthouse']

  private constructor() {
    this.initializeIntegrations()
  }

  public static getInstance(): ExternalToolIntegration {
    if (!ExternalToolIntegration.instance) {
      ExternalToolIntegration.instance = new ExternalToolIntegration()
    }
    return ExternalToolIntegration.instance
  }

  private async initializeIntegrations() {
    try {
      await this.initializeGitIntegration()
      await this.initializeNetlifyIntegration()
      // Other existing integrations remain the same
    } catch (error) {
      console.error('Failed to initialize external integrations:', error)
    }
  }

  private async initializeGitIntegration() {
    try {
      await serviceAuthentication.authenticateGitService()
      this.registerService('git', {
        name: 'git',
        initialize: () => true
      })
    } catch (error) {
      console.warn('Git integration could not be initialized:', error)
    }
  }

  private async initializeNetlifyIntegration() {
    try {
      await serviceAuthentication.authenticateNetlifyService()
      this.registerService('netlify', {
        name: 'netlify',
        initialize: () => true
      })
    } catch (error) {
      console.warn('Netlify integration could not be initialized:', error)
    }
  }

  // Existing methods remain the same...
}

export const externalToolIntegration = ExternalToolIntegration.getInstance()
