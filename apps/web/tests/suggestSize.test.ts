import { describe, it, expect } from 'vitest'
import { suggestSize } from '@/apps/web/lib/suggestSize'

describe('suggestSize', () => {
  it('should suggest shoe size based on foot measurement', () => {
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

  it('should suggest clothing size based on chest measurement', () => {
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

  it('should fallback to body measurement when garment-specific sizing fails', () => {
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

  it('should handle sneakers with foot_mm measurement', () => {
    const request = {
      brand: 'adidas',
      category: 'shoes',
      measurements: {
        foot_mm: 280,
      },
      fitPreference: 'regular' as const,
    }

    const result = suggestSize(request)

    expect(result.size).toBe('10')
    expect(result.confidence).toBeGreaterThan(0.8)
    expect(result.measurements.foot_mm).toBe(280)
  })

  it('should throw error for unsupported brand', () => {
    const request = {
      brand: 'nonexistent',
      category: 'shoes',
      measurements: {
        foot_mm: 270,
      },
      fitPreference: 'regular' as const,
    }

    expect(() => suggestSize(request)).toThrow("Brand 'nonexistent' not found")
  })

  it('should throw error for unsupported category', () => {
    const request = {
      brand: 'nike',
      category: 'watches',
      measurements: {
        chest_cm: 96,
      },
      fitPreference: 'regular' as const,
    }

    expect(() => suggestSize(request)).toThrow("Category 'watches' not supported by nike")
  })
})
