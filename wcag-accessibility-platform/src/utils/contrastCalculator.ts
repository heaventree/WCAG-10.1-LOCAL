// Advanced Color Contrast Calculation
export class ColorContrastCalculator {
  // Convert RGB to relative luminance
  private static getLuminance(r: number, g: number, b: number): number {
    const a = [r, g, b].map(v => {
      v /= 255
      return v <= 0.03928 
        ? v / 12.92 
        : Math.pow((v + 0.055) / 1.055, 2.4)
    })
    return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722
  }

  // Parse color string to RGB
  private static parseColor(color: string): { r: number, g: number, b: number } {
    // Remove spaces and convert to lowercase
    color = color.replace(/\s/g, '').toLowerCase()

    // Handle hex colors
    if (color.startsWith('#')) {
      const hex = color.slice(1)
      const bigint = parseInt(hex, 16)
      return {
        r: (bigint >> 16) & 255,
        g: (bigint >> 8) & 255,
        b: bigint & 255
      }
    }

    // Handle rgb() and rgba() formats
    if (color.startsWith('rgb')) {
      const matches = color.match(/rgba?\((\d+),(\d+),(\d+)(?:,(\d+(?:\.\d+)?))?\)/)
      if (matches) {
        return {
          r: parseInt(matches[1], 10),
          g: parseInt(matches[2], 10),
          b: parseInt(matches[3], 10)
        }
      }
    }

    // Fallback for named colors (basic implementation)
    const colorMap: { [key: string]: { r: number, g: number, b: number } } = {
      'white': { r: 255, g: 255, b: 255 },
      'black': { r: 0, g: 0, b: 0 },
      'red': { r: 255, g: 0, b: 0 },
      'green': { r: 0, g: 255, b: 0 },
      'blue': { r: 0, g: 0, b: 255 }
      // Add more colors as needed
    }

    return colorMap[color] || { r: 0, g: 0, b: 0 }
  }

  // Calculate contrast ratio
  static calculateContrastRatio(foreground: string, background: string): number {
    try {
      const fg = this.parseColor(foreground)
      const bg = this.parseColor(background)

      const fgLuminance = this.getLuminance(fg.r, fg.g, fg.b)
      const bgLuminance = this.getLuminance(bg.r, bg.g, bg.b)

      const lighter = Math.max(fgLuminance, bgLuminance)
      const darker = Math.min(fgLuminance, bgLuminance)

      return (lighter + 0.05) / (darker + 0.05)
    } catch (error) {
      console.error('Contrast calculation error:', error)
      return 1 // Minimum contrast ratio
    }
  }

  // Determine WCAG compliance level
  static getContrastLevel(ratio: number): 'AAA' | 'AA' | 'Fail' {
    if (ratio >= 7) return 'AAA'
    if (ratio >= 4.5) return 'AA'
    return 'Fail'
  }

  // Suggest color modifications
  static suggestColorImprovement(foreground: string, background: string): { 
    suggestedForeground?: string, 
    suggestedBackground?: string 
  } {
    const currentRatio = this.calculateContrastRatio(foreground, background)
    
    // If already compliant, return empty suggestions
    if (currentRatio >= 4.5) return {}

    // Simple color adjustment strategies
    const adjustColor = (color: string, increase: boolean): string => {
      const parsed = this.parseColor(color)
      const adjusted = {
        r: Math.max(0, Math.min(255, parsed.r + (increase ? 20 : -20))),
        g: Math.max(0, Math.min(255, parsed.g + (increase ? 20 : -20))),
        b: Math.max(0, Math.min(255, parsed.b + (increase ? 20 : -20)))
      }
      return `rgb(${adjusted.r},${adjusted.g},${adjusted.b})`
    }

    // Try lightening or darkening colors
    const lightenedFg = adjustColor(foreground, true)
    const darkenedBg = adjustColor(background, false)

    // Check if adjustments improve contrast
    const lightenedRatio = this.calculateContrastRatio(lightenedFg, background)
    const darkenedRatio = this.calculateContrastRatio(foreground, darkenedBg)

    if (lightenedRatio >= 4.5) {
      return { suggestedForeground: lightenedFg }
    }

    if (darkenedRatio >= 4.5) {
      return { suggestedBackground: darkenedBg }
    }

    return {}
  }
}
