import type { Brand, SizeChart } from '../../types/data'
import brands from '../../data/brands.json' assert { type: 'json' }
import sizeCharts from '../../data/sizeCharts.json' assert { type: 'json' }

export interface SizeRequest {
  brand: string
  category: string
  measurements: {
    chest_cm?: number
    waist_cm?: number
    shoulder_cm?: number
    inseam_cm?: number
    hip_cm?: number
    foot_mm?: number
  }
  fitPreference: 'slim' | 'regular' | 'loose'
}

export interface SizeSuggestion {
  size: string
  confidence: number
  rationale: string
  measurements: Record<string, number>
}

/**
 * Rule-based size suggestion algorithm
 * Prioritizes garment-specific sizing, falls back to body measurements
 */
export function suggestSize(request: SizeRequest): SizeSuggestion {
  const { brand, category, measurements, fitPreference } = request

  // Validate brand exists
  const brandData = brands.find((b) => b.id === brand)
  if (!brandData) {
    throw new Error(`Brand '${brand}' not found`)
  }

  // Validate category is supported by brand
  if (!brandData.categories.includes(category)) {
    throw new Error(`Category '${category}' not supported by ${brand}`)
  }

  // Get size chart for brand and category
  const brandSizeChart = (sizeCharts as any)[brand]
  if (!brandSizeChart || !brandSizeChart[category]) {
    throw new Error(`Size chart not available for ${brand} ${category}`)
  }

  const categorySizeChart = brandSizeChart[category]

  // Try garment-first approach
  const garmentSuggestion = tryGarmentFirstSizing(
    category,
    measurements,
    categorySizeChart,
    fitPreference
  )

  if (garmentSuggestion.confidence > 0.7) {
    return garmentSuggestion
  }

  // Fallback to body measurement approach
  return tryBodyMeasurementSizing(
    category,
    measurements,
    categorySizeChart,
    fitPreference
  )
}

function tryGarmentFirstSizing(
  category: string,
  measurements: SizeRequest['measurements'],
  sizeChart: any,
  fitPreference: string
): SizeSuggestion {
  let bestSize = ''
  let bestConfidence = 0
  let bestRationale = ''
  let bestMeasurements: Record<string, number> = {}

  if (category === 'shoes' && measurements.foot_mm) {
    // Shoe sizing based on foot length
    const sizes = Object.keys(sizeChart.US)
    let closestSize = ''
    let minDifference = Infinity

    for (const size of sizes) {
      const sizeData = sizeChart.US[size]
      const difference = Math.abs(sizeData.foot_mm - measurements.foot_mm)

      if (difference < minDifference) {
        minDifference = difference
        closestSize = size
        bestMeasurements = sizeData
      }
    }

    const confidence = Math.max(0.8, 1 - minDifference / 50) // Higher confidence for closer matches
    bestSize = closestSize
    bestConfidence = confidence
    bestRationale = `Foot length ${measurements.foot_mm}mm matches closest to US ${closestSize} (${bestMeasurements.foot_mm}mm)`
  } else if (category === 'clothing') {
    // Clothing sizing based on primary measurements
    const subCategories = Object.keys(sizeChart)

    for (const subCategory of subCategories) {
      const subChart = sizeChart[subCategory]
      const sizes = Object.keys(subChart)

      for (const size of sizes) {
        const sizeData = subChart[size]
        const confidence = calculateClothingConfidence(measurements, sizeData, fitPreference)

        if (confidence > bestConfidence) {
          bestSize = size
          bestConfidence = confidence
          bestMeasurements = sizeData
          bestRationale = `Best match for ${subCategory} based on measurements and ${fitPreference} fit preference`
        }
      }
    }
  }

  return {
    size: bestSize,
    confidence: bestConfidence,
    rationale: bestRationale,
    measurements: bestMeasurements,
  }
}

function tryBodyMeasurementSizing(
  category: string,
  measurements: SizeRequest['measurements'],
  sizeChart: any,
  fitPreference: string
): SizeSuggestion {
  // Fallback logic using available measurements
  let bestSize = ''
  let bestConfidence = 0
  let bestRationale = ''
  let bestMeasurements: Record<string, number> = {}

  if (category === 'clothing') {
    const subCategories = Object.keys(sizeChart)

    for (const subCategory of subCategories) {
      const subChart = sizeChart[subCategory]
      const sizes = Object.keys(subChart)

      // Use available measurements to estimate size
      if (measurements.chest_cm) {
        const chestBasedSize = estimateSizeByChest(measurements.chest_cm, subChart, fitPreference)
        if (chestBasedSize.confidence > bestConfidence) {
          bestSize = chestBasedSize.size
          bestConfidence = chestBasedSize.confidence
          bestMeasurements = chestBasedSize.measurements
          bestRationale = `Estimated size based on chest measurement (${measurements.chest_cm}cm)`
        }
      } else if (measurements.waist_cm) {
        const waistBasedSize = estimateSizeByWaist(measurements.waist_cm, subChart, fitPreference)
        if (waistBasedSize.confidence > bestConfidence) {
          bestSize = waistBasedSize.size
          bestConfidence = waistBasedSize.confidence
          bestMeasurements = waistBasedSize.measurements
          bestRationale = `Estimated size based on waist measurement (${measurements.waist_cm}cm)`
        }
      }
    }
  }

  return {
    size: bestSize || 'M', // Default fallback
    confidence: Math.max(bestConfidence, 0.3),
    rationale: bestRationale || 'Default size recommendation due to insufficient measurements',
    measurements: bestMeasurements,
  }
}

function calculateClothingConfidence(
  measurements: SizeRequest['measurements'],
  sizeData: any,
  fitPreference: string
): number {
  let matches = 0
  let totalChecks = 0

  if (measurements.chest_cm && sizeData.chest_cm) {
    totalChecks++
    const difference = Math.abs(measurements.chest_cm - sizeData.chest_cm)
    if (difference <= 5) matches++
  }

  if (measurements.waist_cm && sizeData.waist_cm) {
    totalChecks++
    const difference = Math.abs(measurements.waist_cm - sizeData.waist_cm)
    if (difference <= 5) matches++
  }

  if (measurements.shoulder_cm && sizeData.shoulder_cm) {
    totalChecks++
    const difference = Math.abs(measurements.shoulder_cm - sizeData.shoulder_cm)
    if (difference <= 3) matches++
  }

  // Adjust confidence based on fit preference
  let confidence = totalChecks > 0 ? matches / totalChecks : 0.5

  if (fitPreference === 'slim') {
    confidence *= 0.9 // Slightly lower confidence for slim fit
  } else if (fitPreference === 'loose') {
    confidence *= 0.85 // Lower confidence for loose fit
  }

  return confidence
}

function estimateSizeByChest(
  chestCm: number,
  sizeChart: any,
  fitPreference: string
): { size: string; confidence: number; measurements: Record<string, number> } {
  const sizes = Object.keys(sizeChart)
  let bestSize = 'M'
  let bestConfidence = 0
  let bestMeasurements: Record<string, number> = {}

  for (const size of sizes) {
    const sizeData = sizeChart[size]
    if (sizeData.chest_cm) {
      const difference = Math.abs(chestCm - sizeData.chest_cm)
      const confidence = Math.max(0.6, 1 - difference / 20)

      if (confidence > bestConfidence) {
        bestSize = size
        bestConfidence = confidence
        bestMeasurements = sizeData
      }
    }
  }

  return { size: bestSize, confidence: bestConfidence, measurements: bestMeasurements }
}

function estimateSizeByWaist(
  waistCm: number,
  sizeChart: any,
  fitPreference: string
): { size: string; confidence: number; measurements: Record<string, number> } {
  const sizes = Object.keys(sizeChart)
  let bestSize = 'M'
  let bestConfidence = 0
  let bestMeasurements: Record<string, number> = {}

  for (const size of sizes) {
    const sizeData = sizeChart[size]
    if (sizeData.waist_cm) {
      const difference = Math.abs(waistCm - sizeData.waist_cm)
      const confidence = Math.max(0.6, 1 - difference / 20)

      if (confidence > bestConfidence) {
        bestSize = size
        bestConfidence = confidence
        bestMeasurements = sizeData
      }
    }
  }

  return { size: bestSize, confidence: bestConfidence, measurements: bestMeasurements }
}
