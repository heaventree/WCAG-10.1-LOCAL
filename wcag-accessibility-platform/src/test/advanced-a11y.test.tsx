import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import App from '../App'
import { ColorContrastCalculator } from '../utils/contrastCalculator'
import { checkAccessibilityCompliance } from '../utils/accessibilityTesting'

describe('Advanced Accessibility Testing', () => {
  it('should meet WCAG AA compliance', async () => {
    const { container } = render(<App />)
    const complianceResults = await checkAccessibilityCompliance(container, 'AA')
    
    expect(complianceResults.passed).toBeTruthy()
  })

  it('should have proper color contrast for all interactive elements', () => {
    render(<App />)
    const elements = screen.getAllByRole(/heading|button|link|input/i)
    
    elements.forEach(element => {
      const computedStyle = window.getComputedStyle(element)
      const backgroundColor = computedStyle.backgroundColor
      const color = computedStyle.color
      
      // Use ColorContrastCalculator for precise contrast ratio
      const contrastRatio = ColorContrastCalculator.calculateContrastRatio(color, backgroundColor)
      const contrastLevel = ColorContrastCalculator.getContrastLevel(contrastRatio)
      
      // Ensure at least AA compliance
      expect(contrastLevel).not.toBe('Fail', 
        `Insufficient contrast for element: ${element.tagName} (Ratio: ${contrastRatio.toFixed(2)})`)
    })
  })

  it('should provide color improvement suggestions for low contrast elements', () => {
    render(<App />)
    const elements = screen.getAllByRole(/heading|button|link|input/i)
    
    elements.forEach(element => {
      const computedStyle = window.getComputedStyle(element)
      const backgroundColor = computedStyle.backgroundColor
      const color = computedStyle.color
      
      const contrastRatio = ColorContrastCalculator.calculateContrastRatio(color, backgroundColor)
      
      if (contrastRatio < 4.5) {
        const improvements = ColorContrastCalculator.suggestColorImprovement(color, backgroundColor)
        
        // Check if improvement suggestions are provided
        expect(improvements).toBeTruthy()
        
        if (improvements.suggestedForeground) {
          const improvedRatio = ColorContrastCalculator.calculateContrastRatio(
            improvements.suggestedForeground, 
            backgroundColor
          )
          expect(improvedRatio).toBeGreaterThanOrEqual(4.5)
        }
        
        if (improvements.suggestedBackground) {
          const improvedRatio = ColorContrastCalculator.calculateContrastRatio(
            color, 
            improvements.suggestedBackground
          )
          expect(improvedRatio).toBeGreaterThanOrEqual(4.5)
        }
      }
    })
  })

  it('should support keyboard navigation for all interactive elements', () => {
    render(<App />)
    const focusableElements = screen.getAllByRole(/button|link|input|select|textarea/i)
    
    focusableElements.forEach(element => {
      // Ensure elements are not programmatically unfocusable
      expect(element.getAttribute('tabindex')).not.toBe('-1')
      
      // Check for proper keyboard event handlers
      expect(element.onkeydown).toBeDefined()
      expect(element.onkeyup).toBeDefined()
    })
  })

  it('should handle responsive design accessibility', () => {
    // Simulate different viewport sizes
    const viewportSizes = [
      { width: 320, height: 568 },   // Small mobile
      { width: 768, height: 1024 },  // Tablet
      { width: 1024, height: 768 },  // Desktop
      { width: 1440, height: 900 }   // Large desktop
    ]

    viewportSizes.forEach(size => {
      // Set viewport size
      window.innerWidth = size.width
      window.innerHeight = size.height
      window.dispatchEvent(new Event('resize'))

      render(<App />)

      // Check for responsive elements
      const responsiveElements = screen.getAllByTestId(/responsive-element/i)
      
      responsiveElements.forEach(element => {
        const styles = window.getComputedStyle(element)
        
        // Basic responsive checks
        expect(parseInt(styles.width)).toBeGreaterThan(0)
        expect(parseInt(styles.height)).toBeGreaterThan(0)
        
        // Ensure text is readable
        expect(parseFloat(styles.fontSize)).toBeGreaterThanOrEqual(12)
      })
    })
  })
})
