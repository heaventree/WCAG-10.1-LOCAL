import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { axe } from 'axe-core'
import App from '../App'

describe('App Accessibility', () => {
  it('should not have any accessibility violations', async () => {
    const { container } = render(<App />)
    const results = await axe(container)
    
    expect(results.violations).toEqual([])
  })

  it('should have proper semantic structure', () => {
    const { container } = render(<App />)
    
    // Check for main landmark
    const mainElement = container.querySelector('main')
    expect(mainElement).toBeTruthy()
    
    // Check for heading hierarchy
    const headings = container.querySelectorAll('h1, h2, h3')
    expect(headings.length).toBeGreaterThan(0)
  })

  it('should have keyboard navigable elements', () => {
    const { container } = render(<App />)
    
    // Check for focusable elements
    const focusableElements = container.querySelectorAll('a, button, input, [tabindex]')
    expect(focusableElements.length).toBeGreaterThan(0)
  })
})
