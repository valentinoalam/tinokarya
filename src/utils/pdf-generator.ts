/* eslint-disable @typescript-eslint/no-explicit-any */
import jsPDF from "jspdf"

interface BrandGuidelinesData {
  projectName: string
  projectDescription: string
  primaryGoal: string
  industry: string
  targetAudience: string
  headingFont: string
  bodyFont: string
  fontJustification: string
  accessibilityScore: any
  colors: {
    primary: string
    secondary: string
    accent: string
    textPrimary: string
    textSecondary: string
    reasoning: string
  }
  spacing: {
    scale: Array<{ name: string; value: string; use: string }>
  }
  cta: {
    strategy: string
    primaryText: string
    secondaryText: string
  }
  trust: {
    elements: string[]
    placement: string
  }
}

export function generateBrandGuidelinesPDF(data: BrandGuidelinesData): void {
  const pdf = new jsPDF("p", "mm", "a4")
  const pageWidth = pdf.internal.pageSize.getWidth()
  const pageHeight = pdf.internal.pageSize.getHeight()
  const margin = 20
  const contentWidth = pageWidth - margin * 2

  let currentY = margin

  // Helper functions
  const addPage = () => {
    pdf.addPage()
    currentY = margin
  }

  const checkPageBreak = (requiredHeight: number) => {
    if (currentY + requiredHeight > pageHeight - margin) {
      addPage()
    }
  }

  const addTitle = (text: string, fontSize = 24) => {
    checkPageBreak(15)
    pdf.setFontSize(fontSize)
    pdf.setFont("helvetica", "bold")
    pdf.text(text, margin, currentY)
    currentY += fontSize * 0.6
  }

  const addSubtitle = (text: string, fontSize = 16) => {
    checkPageBreak(10)
    pdf.setFontSize(fontSize)
    pdf.setFont("helvetica", "bold")
    pdf.text(text, margin, currentY)
    currentY += fontSize * 0.6
  }

  const addText = (text: string, fontSize = 11, style: "normal" | "bold" = "normal") => {
    checkPageBreak(8)
    pdf.setFontSize(fontSize)
    pdf.setFont("helvetica", style)

    // Handle text wrapping
    const lines = pdf.splitTextToSize(text, contentWidth)
    pdf.text(lines, margin, currentY)
    currentY += lines.length * fontSize * 0.4
  }

  const addColorSwatch = (color: string, name: string, x: number, y: number) => {
    // Convert hex to RGB
    const hex = color.replace("#", "")
    const r = Number.parseInt(hex.substr(0, 2), 16)
    const g = Number.parseInt(hex.substr(2, 2), 16)
    const b = Number.parseInt(hex.substr(4, 2), 16)

    // Draw color swatch
    pdf.setFillColor(r, g, b)
    pdf.rect(x, y, 20, 15, "F")

    // Add border
    pdf.setDrawColor(200, 200, 200)
    pdf.rect(x, y, 20, 15, "S")

    // Add color name and hex
    pdf.setFontSize(9)
    pdf.setFont("helvetica", "bold")
    pdf.text(name, x + 25, y + 6)
    pdf.setFont("helvetica", "normal")
    pdf.text(color, x + 25, y + 12)
  }

  const addSpacing = (height: number) => {
    currentY += height
  }

  // Cover Page
  pdf.setFillColor(240, 240, 240)
  pdf.rect(0, 0, pageWidth, pageHeight, "F")

  currentY = pageHeight / 3
  addTitle("Brand Guidelines", 32)
  addSpacing(10)
  addTitle(data.projectName, 24)
  addSpacing(5)
  addText(`Generated on ${new Date().toLocaleDateString()}`, 12)

  // Add decorative elements
  pdf.setDrawColor(100, 100, 100)
  pdf.setLineWidth(0.5)
  pdf.line(margin, currentY + 20, pageWidth - margin, currentY + 20)

  // Table of Contents
  addPage()
  addTitle("Table of Contents", 20)
  addSpacing(10)

  const tocItems = [
    "Project Overview",
    "Typography System",
    "Color Palette",
    "Layout & Spacing",
    "Conversion Strategy",
    "Trust & Social Proof",
    "Implementation Guidelines",
    "Accessibility Standards",
  ]

  tocItems.forEach((item, index) => {
    addText(`${index + 1}. ${item}`, 12)
    addSpacing(2)
  })

  // Project Overview
  addPage()
  addTitle("1. Project Overview", 20)
  addSpacing(10)

  addSubtitle("Project Description")
  addText(data.projectDescription)
  addSpacing(8)

  addSubtitle("Primary Goal")
  addText(data.primaryGoal)
  addSpacing(8)

  if (data.industry) {
    addSubtitle("Industry")
    addText(data.industry)
    addSpacing(8)
  }

  if (data.targetAudience) {
    addSubtitle("Target Audience")
    addText(data.targetAudience)
    addSpacing(8)
  }

  // Typography System
  addPage()
  addTitle("2. Typography System", 20)
  addSpacing(10)

  addSubtitle("Font Pairing")
  addText(`Heading Font: ${data.headingFont}`, 12, "bold")
  addText(`Body Font: ${data.bodyFont}`, 12, "bold")
  addSpacing(8)

  addSubtitle("Justification")
  addText(data.fontJustification)
  addSpacing(8)

  addSubtitle("Accessibility Rating")
  addText(
    `Overall Score: ${data.accessibilityScore.overall}/10 (${data.accessibilityScore.overall >= 8 ? "Excellent" : data.accessibilityScore.overall >= 6 ? "Good" : "Needs Improvement"})`,
  )
  addText(`Readability: ${data.accessibilityScore.readability}/10`)
  addText(`Legibility: ${data.accessibilityScore.legibility}/10`)
  addText(`Dyslexia-Friendly: ${data.accessibilityScore.dyslexiaFriendly}/10`)
  addText(`Low Vision Support: ${data.accessibilityScore.lowVision}/10`)
  addSpacing(8)

  if (data.accessibilityScore.strengths.length > 0) {
    addSubtitle("Accessibility Strengths")
    data.accessibilityScore.strengths.forEach((strength: string) => {
      addText(`• ${strength}`)
    })
    addSpacing(8)
  }

  addSubtitle("Type Scale")
  const typeScale = [
    { element: "H1", size: "3.5rem (56px)" },
    { element: "H2", size: "2.8rem (45px)" },
    { element: "H3", size: "2.25rem (36px)" },
    { element: "H4", size: "1.8rem (29px)" },
    { element: "H5", size: "1.44rem (23px)" },
    { element: "H6", size: "1.15rem (18px)" },
    { element: "Paragraph", size: "1rem (16px)" },
  ]

  typeScale.forEach((scale) => {
    addText(`${scale.element}: ${scale.size}`)
  })
  addSpacing(8)

  addSubtitle("Typography Guidelines")
  addText("Headings (H1-H4):")
  addText("• Letter spacing: -1.5%")
  addText("• Line height: 1.2 (120%)")
  addText("• Font weight: 600-700")
  addSpacing(5)

  addText("Body/Paragraph Text:")
  addText("• Letter spacing: Default")
  addText("• Line height: 1.5 (150%)")
  addText("• Font weight: 400-500")

  // Color Palette
  addPage()
  addTitle("3. Color Palette", 20)
  addSpacing(10)

  addSubtitle("Color Strategy (60-30-10 Rule)")
  addText(data.colors.reasoning)
  addSpacing(15)

  addSubtitle("Core Colors")
  addSpacing(5)

  // Primary Color
  addColorSwatch(data.colors.primary, "Primary (60%)", margin, currentY)
  currentY += 20
  addText("Used for: Main backgrounds, primary surfaces")
  addSpacing(8)

  // Secondary Color
  addColorSwatch(data.colors.secondary, "Secondary (30%)", margin, currentY)
  currentY += 20
  addText("Used for: Supporting elements, cards, sections")
  addSpacing(8)

  // Accent Color
  addColorSwatch(data.colors.accent, "Accent (10%)", margin, currentY)
  currentY += 20
  addText("Used for: CTAs, links, interactive elements")
  addSpacing(15)

  addSubtitle("Text Colors")
  addSpacing(5)

  addColorSwatch(data.colors.textPrimary, "Primary Text", margin, currentY)
  currentY += 20
  addText("Used for: Headlines, primary content")
  addSpacing(8)

  addColorSwatch(data.colors.textSecondary, "Secondary Text", margin, currentY)
  currentY += 20
  addText("Used for: Supporting text, captions, metadata")
  addSpacing(15)

  addSubtitle("Contrast Compliance")
  addText("All color combinations meet WCAG AA standards:")
  addText("• 4.5:1 contrast ratio for normal text")
  addText("• 3:1 contrast ratio for large text (18px+ or 14px+ bold)")
  addText("• Enhanced contrast for better accessibility")

  // Layout & Spacing
  addPage()
  addTitle("4. Layout & Spacing", 20)
  addSpacing(10)

  addSubtitle("Grid System")
  addText("Desktop: 12 columns with 24px gutters")
  addText("Tablet: 8 columns with 20px gutters")
  addText("Mobile: 4 columns with 16px gutters")
  addSpacing(8)

  addSubtitle("Spacing System (8pt Grid)")
  addText("All spacing values must be multiples of 8px for consistency:")
  addSpacing(5)

  data.spacing.scale.forEach((space) => {
    addText(`${space.value} - ${space.name}: ${space.use}`)
  })
  addSpacing(8)

  addSubtitle("Responsive Breakpoints")
  addText("Mobile: 320px - 767px")
  addText("Tablet: 768px - 1023px")
  addText("Desktop: 1024px and above")
  addSpacing(8)

  addSubtitle("Layout Principles")
  addText("• Maintain consistent spacing throughout the design")
  addText("• Use the 8pt grid system for all measurements")
  addText("• Ensure adequate white space for readability")
  addText("• Follow responsive design best practices")

  // Conversion Strategy
  addPage()
  addTitle("5. Conversion Strategy", 20)
  addSpacing(10)

  addSubtitle("Primary Goal")
  addText(data.primaryGoal, 12, "bold")
  addSpacing(8)

  addSubtitle("CTA Strategy")
  addText(data.cta.strategy)
  addSpacing(8)

  addSubtitle("CTA Design Specifications")
  addText("Primary CTA:")
  addText(`• Text: "${data.cta.primaryText}"`)
  addText(`• Background: ${data.colors.accent}`)
  addText("• Text color: White")
  addText("• Padding: 16px 32px")
  addText("• Border radius: 8px")
  addText("• Font weight: 600")
  addSpacing(5)

  addText("Secondary CTA:")
  addText(`• Text: "${data.cta.secondaryText}"`)
  addText(`• Border: 2px solid ${data.colors.accent}`)
  addText(`• Text color: ${data.colors.accent}`)
  addText("• Background: Transparent")
  addText("• Padding: 14px 30px")
  addText("• Border radius: 8px")
  addSpacing(8)

  addSubtitle("CTA Placement Rules")
  addText("1. Hero section (immediately visible)")
  addText("2. Main navigation")
  addText("3. Every 2-3 vertical scrolls")
  addText("4. Before testimonials/social proof sections")
  addText("5. Footer area")

  // Trust & Social Proof
  addPage()
  addTitle("6. Trust & Social Proof", 20)
  addSpacing(10)

  addSubtitle("Recommended Elements")
  data.trust.elements.forEach((element) => {
    addText(`• ${element}`)
  })
  addSpacing(8)

  addSubtitle("Strategic Placement")
  addText(data.trust.placement)
  addSpacing(8)

  addSubtitle("Implementation Guidelines")
  addText("• Place trust elements near key decision points")
  addText("• Use subtle styling to support, not compete with CTAs")
  addText("• Ensure all testimonials and reviews are authentic")
  addText("• Update social proof regularly to maintain relevance")
  addText("• Consider mobile placement and readability")

  // Implementation Guidelines
  addPage()
  addTitle("7. Implementation Guidelines", 20)
  addSpacing(10)

  addSubtitle("CSS Implementation")
  addText("Font Imports (add to HTML head):")
  addText(
    `@import url('https://fonts.googleapis.com/css2?family=${data.headingFont.replace(" ", "+")}:wght@400;600;700&display=swap');`,
  )
  addText(
    `@import url('https://fonts.googleapis.com/css2?family=${data.bodyFont.replace(" ", "+")}:wght@400;500;600&display=swap');`,
  )
  addSpacing(8)

  addSubtitle("CSS Variables")
  addText(":root {")
  addText(`  --font-heading: '${data.headingFont}', sans-serif;`)
  addText(`  --font-body: '${data.bodyFont}', sans-serif;`)
  addText(`  --color-primary: ${data.colors.primary};`)
  addText(`  --color-secondary: ${data.colors.secondary};`)
  addText(`  --color-accent: ${data.colors.accent};`)
  addText(`  --color-text-primary: ${data.colors.textPrimary};`)
  addText(`  --color-text-secondary: ${data.colors.textSecondary};`)
  addText("}")
  addSpacing(8)

  addSubtitle("Quality Assurance Checklist")
  addText("□ All fonts load correctly across browsers")
  addText("□ Color contrast meets WCAG AA standards")
  addText("□ Spacing follows 8pt grid system")
  addText("□ CTAs are prominently placed and functional")
  addText("□ Typography hierarchy is clear and consistent")
  addText("□ Design is responsive across all devices")
  addText("□ Trust elements are authentic and up-to-date")

  // Accessibility Standards
  addPage()
  addTitle("8. Accessibility Standards", 20)
  addSpacing(10)

  addSubtitle("WCAG 2.1 AA Compliance")
  addText("This brand guide follows Web Content Accessibility Guidelines:")
  addSpacing(5)

  addText("Color & Contrast:")
  addText("• Minimum 4.5:1 contrast ratio for normal text")
  addText("• Minimum 3:1 contrast ratio for large text")
  addText("• Color is not the only means of conveying information")
  addSpacing(5)

  addText("Typography:")
  addText("• Minimum 16px font size for body text")
  addText("• Clear font choices with good character distinction")
  addText("• Adequate line spacing (1.5x minimum)")
  addText("• Proper heading hierarchy (H1-H6)")
  addSpacing(5)

  addText("Interactive Elements:")
  addText("• Minimum 44px touch target size")
  addText("• Clear focus indicators")
  addText("• Descriptive link and button text")
  addSpacing(8)

  addSubtitle("Testing Recommendations")
  addText("• Test with screen readers")
  addText("• Verify keyboard navigation")
  addText("• Check color contrast with tools")
  addText("• Test at 200% zoom level")
  addText("• Validate with accessibility checkers")

  // Footer
  addSpacing(20)
  pdf.setDrawColor(200, 200, 200)
  pdf.line(margin, currentY, pageWidth - margin, currentY)
  addSpacing(10)
  pdf.setFontSize(9)
  pdf.setFont("helvetica", "normal")
  pdf.text(`Generated by Pro Web Design Style Guide Generator • ${new Date().toLocaleDateString()}`, margin, currentY)

  // Save the PDF
  const fileName = `${data.projectName.replace(/[^a-zA-Z0-9]/g, "-")}-brand-guidelines.pdf`
  pdf.save(fileName)
}
