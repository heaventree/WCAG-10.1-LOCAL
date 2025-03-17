import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  
  return {
    plugins: [react()],
    define: {
      'import.meta.env.VITE_APP_NAME': JSON.stringify(env.VITE_APP_NAME || 'WCAG Accessibility Platform'),
      'import.meta.env.VITE_ACCESSIBILITY_MODE': JSON.stringify(env.VITE_ACCESSIBILITY_MODE || 'development')
    },
    resolve: {
      alias: {
        'react': 'react',
        'react-dom': 'react-dom'
      }
    },
    optimizeDeps: {
      include: ['react', 'react-dom', 'zod'],
      force: true
    }
  }
})
