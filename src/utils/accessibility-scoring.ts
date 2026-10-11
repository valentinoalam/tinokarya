export interface AccessibilityScore {
  overall: number // 1-10 scale
  readability: number // 1-10 scale
  legibility: number // 1-10 scale
  contrast: number // 1-10 scale
  dyslexiaFriendly: number // 1-10 scale
  lowVision: number // 1-10 scale
  notes: string[]
  strengths: string[]
  weaknesses: string[]
}

export interface FontAccessibility {
  name: string
  category: "serif" | "sans-serif" | "monospace" | "display" | "handwriting"
  xHeight: number // 1-10 scale
  characterDistinction: number // 1-10 scale
  letterSpacing: number // 1-10 scale (natural spacing)
  weight: number // 1-10 scale (availability of weights)
  readability: number // 1-10 scale
  accessibility: number // 1-10 scale
  notes: string[]
}

// Database of font accessibility ratings
export const fontAccessibilityData: Record<string, FontAccessibility> = {
  // Sans-serif fonts
  Inter: {
    name: "Inter",
    category: "sans-serif",
    xHeight: 9,
    characterDistinction: 9,
    letterSpacing: 8,
    weight: 10,
    readability: 9,
    accessibility: 9,
    notes: ["High x-height", "Clear character shapes", "Multiple weights", "Good for interfaces"],
  },
  "Source Sans Pro": {
    name: "Source Sans Pro",
    category: "sans-serif",
    xHeight: 8,
    characterDistinction: 8,
    letterSpacing: 7,
    weight: 9,
    readability: 8,
    accessibility: 8,
    notes: ["Humanist sans-serif", "Open counters", "Good for body text"],
  },
  Manrope: {
    name: "Manrope",
    category: "sans-serif",
    xHeight: 8,
    characterDistinction: 8,
    letterSpacing: 7,
    weight: 8,
    readability: 8,
    accessibility: 8,
    notes: ["Geometric sans-serif", "Modern look", "Good for interfaces"],
  },
  "DM Sans": {
    name: "DM Sans",
    category: "sans-serif",
    xHeight: 7,
    characterDistinction: 8,
    letterSpacing: 7,
    weight: 7,
    readability: 7,
    accessibility: 7,
    notes: ["Low-contrast design", "Good for digital interfaces"],
  },
  "IBM Plex Sans": {
    name: "IBM Plex Sans",
    category: "sans-serif",
    xHeight: 8,
    characterDistinction: 9,
    letterSpacing: 8,
    weight: 9,
    readability: 9,
    accessibility: 9,
    notes: ["Highly legible", "Distinct characters", "Good for technical content"],
  },
  Outfit: {
    name: "Outfit",
    category: "sans-serif",
    xHeight: 7,
    characterDistinction: 7,
    letterSpacing: 7,
    weight: 8,
    readability: 7,
    accessibility: 7,
    notes: ["Modern geometric sans", "Clean design", "Good for headings"],
  },
  "Work Sans": {
    name: "Work Sans",
    category: "sans-serif",
    xHeight: 8,
    characterDistinction: 8,
    letterSpacing: 7,
    weight: 9,
    readability: 8,
    accessibility: 8,
    notes: ["Optimized for screen reading", "Good for body text"],
  },
  Satoshi: {
    name: "Satoshi",
    category: "sans-serif",
    xHeight: 7,
    characterDistinction: 8,
    letterSpacing: 7,
    weight: 8,
    readability: 7,
    accessibility: 7,
    notes: ["Modern geometric sans", "Clean design", "Good for interfaces"],
  },
  "Untitled Sans": {
    name: "Untitled Sans",
    category: "sans-serif",
    xHeight: 8,
    characterDistinction: 8,
    letterSpacing: 7,
    weight: 7,
    readability: 8,
    accessibility: 8,
    notes: ["Neutral design", "Good for interfaces", "Clear letterforms"],
  },
  Switzer: {
    name: "Switzer",
    category: "sans-serif",
    xHeight: 7,
    characterDistinction: 7,
    letterSpacing: 7,
    weight: 8,
    readability: 7,
    accessibility: 7,
    notes: ["Modern grotesque", "Good for contemporary designs"],
  },
  "Geist Sans": {
    name: "Geist Sans",
    category: "sans-serif",
    xHeight: 8,
    characterDistinction: 8,
    letterSpacing: 8,
    weight: 8,
    readability: 8,
    accessibility: 8,
    notes: ["Modern sans-serif", "Good for interfaces", "Clear letterforms"],
  },
  "Open Sans": {
    name: "Open Sans",
    category: "sans-serif",
    xHeight: 9,
    characterDistinction: 9,
    letterSpacing: 8,
    weight: 9,
    readability: 9,
    accessibility: 9,
    notes: ["Optimized for web and mobile", "Very high readability", "Excellent for body text"],
  },
  Lato: {
    name: "Lato",
    category: "sans-serif",
    xHeight: 8,
    characterDistinction: 8,
    letterSpacing: 7,
    weight: 9,
    readability: 8,
    accessibility: 8,
    notes: ["Semi-rounded details", "Warm and friendly", "Good for body text"],
  },
  Nunito: {
    name: "Nunito",
    category: "sans-serif",
    xHeight: 7,
    characterDistinction: 7,
    letterSpacing: 7,
    weight: 9,
    readability: 7,
    accessibility: 7,
    notes: ["Rounded terminals", "Friendly appearance", "Good for children's content"],
  },
  Quicksand: {
    name: "Quicksand",
    category: "sans-serif",
    xHeight: 7,
    characterDistinction: 7,
    letterSpacing: 7,
    weight: 7,
    readability: 7,
    accessibility: 6,
    notes: ["Rounded geometric sans", "Friendly appearance", "Better for headings than body"],
  },
  "Nunito Sans": {
    name: "Nunito Sans",
    category: "sans-serif",
    xHeight: 8,
    characterDistinction: 8,
    letterSpacing: 7,
    weight: 9,
    readability: 8,
    accessibility: 8,
    notes: ["Well-balanced sans-serif", "Good for interfaces", "Clear letterforms"],
  },
  Comfortaa: {
    name: "Comfortaa",
    category: "sans-serif",
    xHeight: 7,
    characterDistinction: 7,
    letterSpacing: 6,
    weight: 6,
    readability: 6,
    accessibility: 6,
    notes: ["Rounded geometric sans", "Decorative", "Better for headings than body"],
  },
  "Plus Jakarta Sans": {
    name: "Plus Jakarta Sans",
    category: "sans-serif",
    xHeight: 8,
    characterDistinction: 8,
    letterSpacing: 7,
    weight: 8,
    readability: 8,
    accessibility: 8,
    notes: ["Modern humanist sans", "Good for interfaces", "Clear letterforms"],
  },
  "System UI": {
    name: "System UI",
    category: "sans-serif",
    xHeight: 8,
    characterDistinction: 8,
    letterSpacing: 8,
    weight: 8,
    readability: 8,
    accessibility: 8,
    notes: ["Native system font", "Optimized for each platform", "Excellent performance"],
  },
  Roboto: {
    name: "Roboto",
    category: "sans-serif",
    xHeight: 8,
    characterDistinction: 8,
    letterSpacing: 7,
    weight: 9,
    readability: 8,
    accessibility: 8,
    notes: ["Android system font", "Good for interfaces", "Clear letterforms"],
  },
  Montserrat: {
    name: "Montserrat",
    category: "sans-serif",
    xHeight: 7,
    characterDistinction: 7,
    letterSpacing: 6,
    weight: 9,
    readability: 7,
    accessibility: 7,
    notes: ["Geometric sans", "Urban inspiration", "Better for headings than body"],
  },
  Oswald: {
    name: "Oswald",
    category: "sans-serif",
    xHeight: 7,
    characterDistinction: 7,
    letterSpacing: 6,
    weight: 7,
    readability: 7,
    accessibility: 6,
    notes: ["Condensed sans", "Space-efficient", "Better for headings than body"],
  },
  "PT Sans": {
    name: "PT Sans",
    category: "sans-serif",
    xHeight: 8,
    characterDistinction: 8,
    letterSpacing: 7,
    weight: 7,
    readability: 8,
    accessibility: 8,
    notes: ["Humanist sans", "Good for interfaces", "Clear letterforms"],
  },

  // Display and decorative fonts
  "Clash Display": {
    name: "Clash Display",
    category: "display",
    xHeight: 6,
    characterDistinction: 7,
    letterSpacing: 6,
    weight: 7,
    readability: 6,
    accessibility: 6,
    notes: ["Modern display font", "Distinctive character", "Better for headings"],
  },
  "Cabinet Grotesk": {
    name: "Cabinet Grotesk",
    category: "display",
    xHeight: 6,
    characterDistinction: 6,
    letterSpacing: 6,
    weight: 7,
    readability: 6,
    accessibility: 5,
    notes: ["Distinctive display font", "Unique character", "Better for headings"],
  },
  "General Sans": {
    name: "General Sans",
    category: "sans-serif",
    xHeight: 7,
    characterDistinction: 7,
    letterSpacing: 7,
    weight: 8,
    readability: 7,
    accessibility: 7,
    notes: ["Modern geometric sans", "Good for interfaces", "Clear letterforms"],
  },
  "Space Grotesk": {
    name: "Space Grotesk",
    category: "sans-serif",
    xHeight: 7,
    characterDistinction: 7,
    letterSpacing: 7,
    weight: 7,
    readability: 7,
    accessibility: 7,
    notes: ["Distinctive geometric sans", "Technical feel", "Good for headings"],
  },
  Aeonik: {
    name: "Aeonik",
    category: "sans-serif",
    xHeight: 7,
    characterDistinction: 7,
    letterSpacing: 7,
    weight: 8,
    readability: 7,
    accessibility: 7,
    notes: ["Modern grotesque", "Good for interfaces", "Clear letterforms"],
  },
  Geist: {
    name: "Geist",
    category: "sans-serif",
    xHeight: 8,
    characterDistinction: 8,
    letterSpacing: 8,
    weight: 8,
    readability: 8,
    accessibility: 8,
    notes: ["Modern sans-serif", "Good for interfaces", "Clear letterforms"],
  },
  Chillax: {
    name: "Chillax",
    category: "display",
    xHeight: 6,
    characterDistinction: 6,
    letterSpacing: 6,
    weight: 7,
    readability: 6,
    accessibility: 5,
    notes: ["Playful display font", "Distinctive character", "Better for headings"],
  },
  Epilogue: {
    name: "Epilogue",
    category: "sans-serif",
    xHeight: 7,
    characterDistinction: 7,
    letterSpacing: 7,
    weight: 8,
    readability: 7,
    accessibility: 7,
    notes: ["Modern sans-serif", "Good for interfaces", "Clear letterforms"],
  },
  Zodiak: {
    name: "Zodiak",
    category: "serif",
    xHeight: 6,
    characterDistinction: 7,
    letterSpacing: 6,
    weight: 7,
    readability: 6,
    accessibility: 6,
    notes: ["Distinctive serif", "Artistic character", "Better for headings"],
  },
  Sentient: {
    name: "Sentient",
    category: "serif",
    xHeight: 7,
    characterDistinction: 7,
    letterSpacing: 7,
    weight: 7,
    readability: 7,
    accessibility: 7,
    notes: ["Modern serif", "Good for body text", "Clear letterforms"],
  },

  // Serif fonts
  "Crimson Text": {
    name: "Crimson Text",
    category: "serif",
    xHeight: 7,
    characterDistinction: 8,
    letterSpacing: 7,
    weight: 7,
    readability: 8,
    accessibility: 7,
    notes: ["Old-style serif", "Good for body text", "Literary feel"],
  },
  "Playfair Display": {
    name: "Playfair Display",
    category: "serif",
    xHeight: 6,
    characterDistinction: 7,
    letterSpacing: 6,
    weight: 8,
    readability: 7,
    accessibility: 6,
    notes: ["High-contrast serif", "Elegant", "Better for headings than body"],
  },
  "Cormorant Garamond": {
    name: "Cormorant Garamond",
    category: "serif",
    xHeight: 6,
    characterDistinction: 7,
    letterSpacing: 6,
    weight: 7,
    readability: 6,
    accessibility: 6,
    notes: ["High-contrast serif", "Elegant", "Better for headings than body"],
  },
  Ogg: {
    name: "Ogg",
    category: "serif",
    xHeight: 6,
    characterDistinction: 6,
    letterSpacing: 6,
    weight: 6,
    readability: 6,
    accessibility: 5,
    notes: ["Fashion-inspired serif", "Distinctive", "Better for headings"],
  },
  Canela: {
    name: "Canela",
    category: "serif",
    xHeight: 6,
    characterDistinction: 7,
    letterSpacing: 6,
    weight: 7,
    readability: 6,
    accessibility: 6,
    notes: ["Elegant serif", "Luxury feel", "Better for headings"],
  },
  Graphik: {
    name: "Graphik",
    category: "sans-serif",
    xHeight: 8,
    characterDistinction: 8,
    letterSpacing: 7,
    weight: 9,
    readability: 8,
    accessibility: 8,
    notes: ["Modern sans-serif", "Good for interfaces", "Clear letterforms"],
  },
  Fraunces: {
    name: "Fraunces",
    category: "serif",
    xHeight: 7,
    characterDistinction: 7,
    letterSpacing: 6,
    weight: 8,
    readability: 7,
    accessibility: 7,
    notes: ["Variable serif", "Distinctive", "Good for headings"],
  },
  "Source Serif Pro": {
    name: "Source Serif Pro",
    category: "serif",
    xHeight: 7,
    characterDistinction: 8,
    letterSpacing: 7,
    weight: 8,
    readability: 8,
    accessibility: 7,
    notes: ["Transitional serif", "Good for body text", "Clear letterforms"],
  },
  Merriweather: {
    name: "Merriweather",
    category: "serif",
    xHeight: 8,
    characterDistinction: 8,
    letterSpacing: 7,
    weight: 8,
    readability: 8,
    accessibility: 8,
    notes: ["Screen-optimized serif", "Good for body text", "High legibility"],
  },
  "Libre Baskerville": {
    name: "Libre Baskerville",
    category: "serif",
    xHeight: 7,
    characterDistinction: 8,
    letterSpacing: 7,
    weight: 7,
    readability: 8,
    accessibility: 7,
    notes: ["Web-optimized Baskerville", "Good for body text", "Traditional feel"],
  },
  "Zilla Slab": {
    name: "Zilla Slab",
    category: "serif",
    xHeight: 7,
    characterDistinction: 8,
    letterSpacing: 7,
    weight: 8,
    readability: 7,
    accessibility: 7,
    notes: ["Slab serif", "Friendly character", "Good for headings and short text"],
  },
  Bitter: {
    name: "Bitter",
    category: "serif",
    xHeight: 7,
    characterDistinction: 8,
    letterSpacing: 7,
    weight: 8,
    readability: 8,
    accessibility: 7,
    notes: ["Slab serif", "Good for body text", "Clear letterforms"],
  },
  "Roboto Slab": {
    name: "Roboto Slab",
    category: "serif",
    xHeight: 7,
    characterDistinction: 8,
    letterSpacing: 7,
    weight: 8,
    readability: 8,
    accessibility: 7,
    notes: ["Slab serif", "Good for headings", "Clear letterforms"],
  },
  "PT Serif": {
    name: "PT Serif",
    category: "serif",
    xHeight: 7,
    characterDistinction: 8,
    letterSpacing: 7,
    weight: 7,
    readability: 8,
    accessibility: 7,
    notes: ["Transitional serif", "Good for body text", "Clear letterforms"],
  },

  // Monospace fonts
  "JetBrains Mono": {
    name: "JetBrains Mono",
    category: "monospace",
    xHeight: 8,
    characterDistinction: 9,
    letterSpacing: 8,
    weight: 8,
    readability: 8,
    accessibility: 8,
    notes: ["Coding font", "High legibility", "Clear character distinction"],
  },
  "Fira Code": {
    name: "Fira Code",
    category: "monospace",
    xHeight: 8,
    characterDistinction: 9,
    letterSpacing: 8,
    weight: 7,
    readability: 8,
    accessibility: 8,
    notes: ["Coding font", "Ligatures", "Good for technical content"],
  },
  "Space Mono": {
    name: "Space Mono",
    category: "monospace",
    xHeight: 7,
    characterDistinction: 8,
    letterSpacing: 7,
    weight: 6,
    readability: 7,
    accessibility: 7,
    notes: ["Distinctive monospace", "Technical feel", "Better for headings than body"],
  },
  "Courier Prime": {
    name: "Courier Prime",
    category: "monospace",
    xHeight: 7,
    characterDistinction: 8,
    letterSpacing: 7,
    weight: 6,
    readability: 7,
    accessibility: 7,
    notes: ["Classic monospace", "Good for code snippets", "Clear letterforms"],
  },
}

// Calculate accessibility score for a font pairing
export function calculateAccessibilityScore(headingFont: string, bodyFont: string): AccessibilityScore {
  const heading = fontAccessibilityData[headingFont] || {
    name: headingFont,
    category: "sans-serif" as const,
    xHeight: 7,
    characterDistinction: 7,
    letterSpacing: 7,
    weight: 7,
    readability: 7,
    accessibility: 7,
    notes: ["Font data not available"],
  }

  const body = fontAccessibilityData[bodyFont] || {
    name: bodyFont,
    category: "sans-serif" as const,
    xHeight: 7,
    characterDistinction: 7,
    letterSpacing: 7,
    weight: 7,
    readability: 7,
    accessibility: 7,
    notes: ["Font data not available"],
  }

  // Body text readability is weighted more heavily than heading readability
  const readability = Math.round((body.readability * 0.7 + heading.readability * 0.3) * 10) / 10

  // Legibility considers character distinction and x-height
  const legibility = Math.round(((body.characterDistinction + body.xHeight) / 2) * 10) / 10

  // Contrast between heading and body (difference in style creates hierarchy)
  const styleContrast = heading.category !== body.category ? 8 : 6

  // Dyslexia-friendly score
  // Sans-serif fonts with good letter spacing and character distinction are better for dyslexic readers
  const dyslexiaFriendly =
    Math.round((((body.category === "sans-serif" ? 9 : 6) + body.letterSpacing + body.characterDistinction) / 3) * 10) /
    10

  // Low vision score
  // Considers x-height, character distinction, and weight options
  const lowVision = Math.round(((body.xHeight + body.characterDistinction + body.weight) / 3) * 10) / 10

  // Overall score weighted by importance for accessibility
  const overall =
    Math.round(
      (readability * 0.3 + legibility * 0.3 + styleContrast * 0.1 + dyslexiaFriendly * 0.15 + lowVision * 0.15) * 10,
    ) / 10

  // Generate strengths
  const strengths: string[] = []
  if (body.readability >= 8) strengths.push("High body text readability")
  if (body.xHeight >= 8) strengths.push("Good x-height for readability")
  if (body.characterDistinction >= 8) strengths.push("Clear character distinction")
  if (body.letterSpacing >= 8) strengths.push("Optimal letter spacing")
  if (body.weight >= 8) strengths.push("Multiple weight options for contrast")
  if (heading.category !== body.category) strengths.push("Good style contrast between heading and body")
  if (dyslexiaFriendly >= 8) strengths.push("Dyslexia-friendly characteristics")
  if (lowVision >= 8) strengths.push("Good for users with low vision")

  // Generate weaknesses
  const weaknesses: string[] = []
  if (body.readability < 7) weaknesses.push("Lower body text readability")
  if (body.xHeight < 7) weaknesses.push("Lower x-height may reduce readability")
  if (body.characterDistinction < 7) weaknesses.push("Characters may be less distinct")
  if (body.letterSpacing < 7) weaknesses.push("Tighter letter spacing may reduce readability")
  if (body.weight < 7) weaknesses.push("Limited weight options")
  if (heading.category === body.category && heading.name !== body.name)
    weaknesses.push("Similar styles may reduce hierarchy")
  if (dyslexiaFriendly < 7) weaknesses.push("May be challenging for dyslexic readers")
  if (lowVision < 7) weaknesses.push("May be difficult for users with low vision")

  // Generate notes
  const notes: string[] = []
  notes.push(
    `Body font (${body.name}) has ${body.readability >= 8 ? "excellent" : body.readability >= 7 ? "good" : "moderate"} readability.`,
  )

  if (body.category === "sans-serif") {
    notes.push("Sans-serif fonts are generally more accessible for screen reading.")
  } else if (body.category === "serif") {
    notes.push("Serif fonts can aid readability in long-form content but may be less accessible at small sizes.")
  }

  if (heading.category === "display" || heading.name.includes("Display")) {
    notes.push("Display fonts should be used at larger sizes (18px+) for better accessibility.")
  }

  return {
    overall,
    readability,
    legibility,
    contrast: styleContrast,
    dyslexiaFriendly,
    lowVision,
    notes,
    strengths,
    weaknesses,
  }
}

// Get accessibility rating text
export function getAccessibilityRating(score: number): string {
  if (score >= 9) return "Excellent"
  if (score >= 8) return "Very Good"
  if (score >= 7) return "Good"
  if (score >= 6) return "Fair"
  if (score >= 5) return "Moderate"
  return "Poor"
}

// Get accessibility color class
export function getAccessibilityColorClass(score: number): string {
  if (score >= 9) return "text-green-600"
  if (score >= 8) return "text-emerald-600"
  if (score >= 7) return "text-blue-600"
  if (score >= 6) return "text-amber-600"
  if (score >= 5) return "text-orange-600"
  return "text-red-600"
}

// Get accessibility badge color
export function getAccessibilityBadgeColor(score: number): string {
  if (score >= 9) return "bg-green-100 text-green-800"
  if (score >= 8) return "bg-emerald-100 text-emerald-800"
  if (score >= 7) return "bg-blue-100 text-blue-800"
  if (score >= 6) return "bg-amber-100 text-amber-800"
  if (score >= 5) return "bg-orange-100 text-orange-800"
  return "bg-red-100 text-red-800"
}
