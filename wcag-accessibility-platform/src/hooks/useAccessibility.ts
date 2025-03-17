import { useState, useCallback } from 'react'

export function useAccessibility() {
  const [accessibilitySettings, setAccessibilitySettings] = useState({
    contrast: 'normal',
    fontSize: 'medium',
    reducedMotion: false
  })

  const toggleContrast = useCallback(() => {
    setAccessibilitySettings(prev => ({
      ...prev,
      contrast: prev.contrast === 'normal' ? 'high-contrast' : 'normal'
    }))
  }, [])

  const adjustFontSize = useCallback((size: 'small' | 'medium' | 'large') => {
    setAccessibilitySettings(prev => ({
      ...prev,
      fontSize: size
    }))
  }, [])

  const toggleReducedMotion = useCallback(() => {
    setAccessibilitySettings(prev => ({
      ...prev,
      reducedMotion: !prev.reducedMotion
    }))
  }, [])

  return {
    accessibilitySettings,
    toggleContrast,
    adjustFontSize,
    toggleReducedMotion
  }
}
