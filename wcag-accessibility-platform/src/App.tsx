import React, { useState } from 'react'
import { ErrorMonitor } from './components/ErrorMonitor'
import { AccessibilityConfigPanel } from './components/AccessibilityConfigPanel'
import { AccessibilityControls } from './components/AccessibilityControls'
import { AccessibilityReport } from './components/AccessibilityReport'

const App: React.FC = () => {
  const [showErrorMonitor, setShowErrorMonitor] = useState(false)
  const [showAccessibilityPanel, setShowAccessibilityPanel] = useState(false)
  const [showAccessibilityControls, setShowAccessibilityControls] = useState(false)
  const [showAccessibilityReport, setShowAccessibilityReport] = useState(false)

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold mb-6">WCAG Accessibility Platform</h1>
        
        <div className="flex space-x-4 mb-6">
          <button 
            onClick={() => setShowErrorMonitor(!showErrorMonitor)}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            {showErrorMonitor ? 'Hide' : 'Show'} Error Monitor
          </button>
          
          <button 
            onClick={() => setShowAccessibilityPanel(!showAccessibilityPanel)}
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            {showAccessibilityPanel ? 'Hide' : 'Show'} Accessibility Config
          </button>

          <button 
            onClick={() => setShowAccessibilityControls(!showAccessibilityControls)}
            className="bg-purple-500 text-white px-4 py-2 rounded"
          >
            {showAccessibilityControls ? 'Hide' : 'Show'} Accessibility Controls
          </button>

          <button 
            onClick={() => setShowAccessibilityReport(!showAccessibilityReport)}
            className="bg-red-500 text-white px-4 py-2 rounded"
          >
            {showAccessibilityReport ? 'Hide' : 'Show'} Accessibility Report
          </button>
        </div>

        {showErrorMonitor && <ErrorMonitor />}
        {showAccessibilityPanel && <AccessibilityConfigPanel />}
        {showAccessibilityControls && <AccessibilityControls />}
        {showAccessibilityReport && <AccessibilityReport />}
      </div>
    </div>
  )
}

export default App
