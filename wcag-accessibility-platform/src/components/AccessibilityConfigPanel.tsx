import React, { useState, useEffect } from 'react'
import { accessibilityTestManager } from '../utils/accessibilityTesting'
import { AccessibilityTestConfig } from '../utils/types'

export const AccessibilityConfigPanel: React.FC = () => {
  const [config, setConfig] = useState<AccessibilityTestConfig>({
    wcagLevel: 'AA',
    testCategories: {
      colorContrast: true,
      keyboardNavigation: true,
      semanticStructure: true,
      ariaAttributes: true,
      focusManagement: true,
      performanceMetrics: true
    }
  })

  const handleConfigChange = (category: keyof AccessibilityTestConfig['testCategories']) => {
    const updatedConfig = {
      ...config,
      testCategories: {
        ...config.testCategories,
        [category]: !config.testCategories[category]
      }
    }
    
    setConfig(updatedConfig)
    accessibilityTestManager.setTestConfiguration(updatedConfig)
  }

  const handleWCAGLevelChange = (level: AccessibilityTestConfig['wcagLevel']) => {
    const updatedConfig = {
      ...config,
      wcagLevel: level
    }
    
    setConfig(updatedConfig)
    accessibilityTestManager.setTestConfiguration(updatedConfig)
  }

  const runComprehensiveTest = () => {
    const testResult = accessibilityTestManager.performComprehensiveQATest()
    console.log('Accessibility Test Result:', testResult)
  }

  return (
    <div className="accessibility-config-panel p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Accessibility Configuration</h2>
      
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">WCAG Compliance Level</h3>
        <div className="flex space-x-2">
          {(['A', 'AA', 'AAA'] as const).map(level => (
            <button
              key={level}
              onClick={() => handleWCAGLevelChange(level)}
              className={`px-4 py-2 rounded ${
                config.wcagLevel === level 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-200 text-gray-700'
              }`}
            >
              {level}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">Test Categories</h3>
        <div className="grid grid-cols-2 gap-2">
          {Object.entries(config.testCategories).map(([category, enabled]) => (
            <label 
              key={category} 
              className="flex items-center space-x-2 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={enabled}
                onChange={() => handleConfigChange(category as keyof AccessibilityTestConfig['testCategories'])}
                className="form-checkbox"
              />
              <span>{category.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="mt-6">
        <button
          onClick={runComprehensiveTest}
          className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600 transition-colors"
        >
          Run Comprehensive Accessibility Test
        </button>
      </div>
    </div>
  )
}
