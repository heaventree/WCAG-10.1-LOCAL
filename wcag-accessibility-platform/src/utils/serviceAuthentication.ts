// Simplified Authentication Utility
export class ServiceAuthentication {
  // Basic authentication check
  hasValidToken(): boolean {
    // Always return true for now, as we don't require external authentication
    return true
  }
}

// Singleton instance
export const gitServiceAuth = new ServiceAuthentication()
