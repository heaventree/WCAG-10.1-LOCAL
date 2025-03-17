import { z } from 'zod'

// Environment Variable Schema
const envSchema = z.object({
  VITE_APP_NAME: z.string().default('WCAG Accessibility Platform'),
  VITE_ACCESSIBILITY_MODE: z.enum(['development', 'production', 'test']).default('development'),
  VITE_LOGGING_LEVEL: z.enum(['verbose', 'info', 'warn', 'error']).default('info'),
  VITE_EXTERNAL_TOOL_INTEGRATION: z.string().transform(val => val === 'true')
})

// Parse and validate environment variables
export const validateEnvironment = () => {
  try {
    return envSchema.parse(import.meta.env)
  } catch (error) {
    console.error('Invalid environment configuration:', error)
    throw new Error('Environment configuration is invalid')
  }
}

// Centralized environment configuration
export const environmentConfig = validateEnvironment()
