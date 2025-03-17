import React, { useState } from 'react'

interface AccessibilityControlsProps {
  onContrastChange?: (mode: 'normal' | 'high-contrast') => void
  onFontSizeChange?: (size: 'small' | 'medium' | 'large') => void
}

export const AccessibilityControls: React.FC<AccessibilityControlsProps> = ({
  onContrastChange,
  onFontSizeChange
}) => {
  const [contrastMode, setContrastMode] = useState<'normal' | 'high-contrast'>('normal')
  const [fontSize, setFontSize] = useState<'small' | 'medium' | 'large'>('medium')

  const handleContrastToggle = () => {
    const newMode = contrastMode === 'normal' ? 'high-contrast' : 'normal'
    setContrastMode(newMode)
    onContrastChange?.(newMode)
  }

  const handleFontSizeChange = () => {
    const sizes: Array<'small' | 'medium' | 'large'> = ['small', 'medium', 'large']
    const currentIndex = sizes.indexOf(fontSize)
    const newSize = sizes[(currentIndex + 1) % sizes.length]
    setFontSize(newSize)
    onFontSizeChange?.(newSize)
  }

  return (
    <div 
      role="toolbar" 
      aria-label="Accessibility Controls"
      className="accessibility-controls"
    >
      <button 
        onClick={handleContrastToggle}
        aria-pressed={contrastMode === 'high-contrast'}
        className="contrast-toggle"
      >
        {contrastMode === 'normal' ? 'High Contrast' : 'Normal Contrast'}
      </button>
      
      <button 
        onClick={handleFontSizeChange}
        className="font-size-toggle"
      >
        Font Size: {fontSize}
      </button>
    </div>
  )
}
