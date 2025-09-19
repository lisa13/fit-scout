import { describe, it, expect } from 'vitest'
import { suggestSize } from "../src/suggestSize"

describe('suggestSize', () => {
  it('should suggest shoe size based on foot measurement (sneakers)', () => {
    const request = {
      brand: 'nike',
      category: 'shoes',
      measurements: {
        foot_mm: 270,
      },
      fitPreference: 'regular' as const,
    }

    const result = suggestSize(request)

    expect(result.size).toBe('9')
    expect(result.confidence).toBeGreaterThan(0.8)
    expect(result.rationale).toContain('Foot length 270mm')
    expect(result.measurements.foot_mm).toBe(270)
  })

  it('should suggest clothing size when chart allows garment-first approach', () => {
    const request = {
      brand: 'nike',
      category: 'clothing',
      measurements: {
        chest_cm: 96,
        waist_cm: 81,
      },
      fitPreference: 'regular' as const,
    }

    const result = suggestSize(request)

    expect(result.size).toBe('M')
    expect(result.confidence).toBeGreaterThan(0.7)
    expect(result.rationale).toContain('measurements and regular fit preference')
    expect(result.measurements.chest_cm).toBe(96)
  })

  it('should fallback to closest range when garment-specific sizing fails', () => {
    const request = {
      brand: 'nike',
      category: 'clothing',
      measurements: {
        chest_cm: 100,
      },
      fitPreference: 'loose' as const,
    }

    const result = suggestSize(request)

    expect(result.size).toBeDefined()
    expect(result.confidence).toBeGreaterThan(0.3)
    expect(result.rationale).toContain('Estimated size based on chest measurement')
  })
})

