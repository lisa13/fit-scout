import { SizeSuggestInput, SizeSuggestOutput } from '@fit-scout/types'
import { getBrands, getSizeCharts } from '@fit-scout/db'

/**
 * Rule-based size suggestion algorithm
 * Prioritizes garment-specific sizing, falls back to body measurements
 */
export function suggestSize(input: SizeSuggestInput): SizeSuggestOutput {
  const { brand, category, fitPref, measurements } = input

  // Validate brand exists
  const brands = getBrands()
  const brandData = brands.find((b) => b.id === brand)
  if (!brandData) {
    throw new Error(`Brand '${brand}' not found`)
  }

  // Validate category is supported by brand
  if (!brandData.categories.includes(category)) {
    throw new Error(`Category '${category}' not supported by ${brand}`)
  }

  // Get size chart for brand and category
  const sizeCharts = getSizeCharts()
  const brandSizeChart = sizeCharts[brand]
  if (!brandSizeChart || !brandSizeChart[category]) {
    throw new Error(`Size chart not available for ${brand} ${category}`)
  }

  const categorySizeChart = brandSizeChart[category]

  // Try garment-first approach
  const garmentSuggestion = tryGarmentFirstSizing(
    category,
    measurements,
    categorySizeChart,
    fitPref
  )

  if (garmentSuggestion.confidence > 0.7) {
    return {
      sizeLabel: garmentSuggestion.size,
      confidence: garmentSuggestion.confidence,
      rationale: garmentSuggestion.rationale,
      alternates: generateAlternates(garmentSuggestion.size, categorySizeChart),
    }
  }

  // Fallback to body measurement approach
  const fallbackSuggestion = tryBodyMeasurementSizing(
    category,
    measurements,
    categorySizeChart,
    fitPref
  )

  return {
    sizeLabel: fallbackSuggestion.size,
    confidence: fallbackSuggestion.confidence,
    rationale: fallbackSuggestion.rationale,
    alternates: generateAlternates(fallbackSuggestion.size, categorySizeChart),
  }
}

function tryGarmentFirstSizing(
  category: string,
  measurements: SizeSuggestInput['measurements'],
  sizeChart: any,
  fitPref: string
): { size: string; confidence: number; rationale: string } {
  let bestSize = ''
  let bestConfidence = 0
  let bestRationale = ''

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
      }
    }

    const confidence = Math.max(0.8, 1 - minDifference / 50) // Higher confidence for closer matches
    bestSize = closestSize
    bestConfidence = confidence
    bestRationale = `Foot length ${measurements.foot_mm}mm matches closest to US ${closestSize}`
  } else if (category === 'clothing') {
    // Clothing sizing based on primary measurements
    const subCategories = Object.keys(sizeChart)
    
    for (const subCategory of subCategories) {
      const subChart = sizeChart[subCategory]
      const sizes = Object.keys(subChart)
      
      for (const size of sizes) {
        const sizeData = subChart[size]
        const confidence = calculateClothingConfidence(measurements, sizeData, fitPref)
        
        if (confidence > bestConfidence) {
          bestSize = size
          bestConfidence = confidence
          bestRationale = `Best match for ${subCategory} based on measurements and ${fitPref} fit preference`
        }
      }
    }
  }

  return {
    size: bestSize,
    confidence: bestConfidence,
    rationale: bestRationale,
  }
}

function tryBodyMeasurementSizing(
  category: string,
  measurements: SizeSuggestInput['measurements'],
  sizeChart: any,
  fitPref: string
): { size: string; confidence: number; rationale: string } {
  // Fallback logic using available measurements
  let bestSize = ''
  let bestConfidence = 0
  let bestRationale = ''

  if (category === 'clothing') {
    const subCategories = Object.keys(sizeChart)
    
    for (const subCategory of subCategories) {
      const subChart = sizeChart[subCategory]
      const sizes = Object.keys(subChart)
      
      // Use available measurements to estimate size
      if (measurements.chest_cm) {
        const chestBasedSize = estimateSizeByChest(measurements.chest_cm, subChart, fitPref)
        if (chestBasedSize.confidence > bestConfidence) {
          bestSize = chestBasedSize.size
          bestConfidence = chestBasedSize.confidence
          bestRationale = `Estimated size based on chest measurement (${measurements.chest_cm}cm)`
        }
      } else if (measurements.waist_cm) {
        const waistBasedSize = estimateSizeByWaist(measurements.waist_cm, subChart, fitPref)
        if (waistBasedSize.confidence > bestConfidence) {
          bestSize = waistBasedSize.size
          bestConfidence = waistBasedSize.confidence
          bestRationale = `Estimated size based on waist measurement (${measurements.waist_cm}cm)`
        }
      }
    }
  }

  return {
    size: bestSize || 'M', // Default fallback
    confidence: Math.max(bestConfidence, 0.3),
    rationale: bestRationale || 'Default size recommendation due to insufficient measurements',
  }
}

function calculateClothingConfidence(
  measurements: SizeSuggestInput['measurements'],
  sizeData: any,
  fitPref: string
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
  
  if (fitPref === 'slim') {
    confidence *= 0.9 // Slightly lower confidence for slim fit
  } else if (fitPref === 'loose') {
    confidence *= 0.85 // Lower confidence for loose fit
  }

  return confidence
}

function estimateSizeByChest(
  chestCm: number,
  sizeChart: any,
  fitPref: string
): { size: string; confidence: number } {
  const sizes = Object.keys(sizeChart)
  let bestSize = 'M'
  let bestConfidence = 0

  for (const size of sizes) {
    const sizeData = sizeChart[size]
    if (sizeData.chest_cm) {
      const difference = Math.abs(chestCm - sizeData.chest_cm)
      const confidence = Math.max(0.6, 1 - difference / 20)
      
      if (confidence > bestConfidence) {
        bestSize = size
        bestConfidence = confidence
      }
    }
  }

  return { size: bestSize, confidence: bestConfidence }
}

function estimateSizeByWaist(
  waistCm: number,
  sizeChart: any,
  fitPref: string
): { size: string; confidence: number } {
  const sizes = Object.keys(sizeChart)
  let bestSize = 'M'
  let bestConfidence = 0

  for (const size of sizes) {
    const sizeData = sizeChart[size]
    if (sizeData.waist_cm) {
      const difference = Math.abs(waistCm - sizeData.waist_cm)
      const confidence = Math.max(0.6, 1 - difference / 20)
      
      if (confidence > bestConfidence) {
        bestSize = size
        bestConfidence = confidence
      }
    }
  }

  return { size: bestSize, confidence: bestConfidence }
}

function generateAlternates(size: string, sizeChart: any): string[] {
  const sizes = Object.keys(sizeChart)
  const currentIndex = sizes.indexOf(size)
  const alternates: string[] = []
  
  // Add one size up and down if available
  if (currentIndex > 0) {
    alternates.push(sizes[currentIndex - 1])
  }
  if (currentIndex < sizes.length - 1) {
    alternates.push(sizes[currentIndex + 1])
  }
  
  return alternates
}
