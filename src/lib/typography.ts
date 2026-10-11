// Golden ratio is approximately 1.618
const GOLDEN_RATIO = 1.618

/**
 * Calculate font sizes based on the golden ratio
 * @param baseSize The base font size in pixels
 * @param count The number of sizes to generate
 * @returns An array of font sizes in pixels
 */
export function calculateGoldenRatioSizes(baseSize: number, count: number): number[] {
  const sizes: number[] = []

  // Generate sizes larger than the base size
  let currentSize = baseSize
  for (let i = 0; i < Math.floor(count / 2); i++) {
    sizes.unshift(Math.round(currentSize * 10) / 10)
    currentSize *= GOLDEN_RATIO
  }

  // Generate sizes smaller than the base size
  currentSize = baseSize / GOLDEN_RATIO
  for (let i = 0; i < Math.ceil(count / 2); i++) {
    sizes.push(Math.round(currentSize * 10) / 10)
    currentSize /= GOLDEN_RATIO
  }

  // Sort from largest to smallest
  return sizes.sort((a, b) => b - a)
}

/**
 * Get a subset of font sizes for typical usage
 * @param sizes The full array of font sizes
 * @returns An array with 4 selected sizes
 */
export function getTypographyScale(sizes: number[]): number[] {
  // Select a subset of sizes for typical usage (h1, h2, body, small)
  if (sizes.length >= 8) {
    return [sizes[0], sizes[2], sizes[5], sizes[7]]
  }
  return sizes
}
