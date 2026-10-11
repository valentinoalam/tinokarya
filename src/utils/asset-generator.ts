interface AssetGeneratorData {
  projectName: string
  colors: {
    primary: string
    secondary: string
    accent: string
    textPrimary: string
    textSecondary: string
  }
  typography: {
    headingFont: string
    bodyFont: string
  }
}

// Generate SVG logo template
export function generateLogoTemplate(data: AssetGeneratorData, variant: "horizontal" | "vertical" | "icon"): string {
  const { projectName, colors } = data
  const companyName = projectName.slice(0, 20) || "Your Company"

  if (variant === "horizontal") {
    return `<svg width="200" height="60" viewBox="0 0 200 60" xmlns="http://www.w3.org/2000/svg">
  <!-- Background -->
  <rect width="200" height="60" fill="${colors.primary}" rx="4"/>
  
  <!-- Icon -->
  <circle cx="25" cy="30" r="15" fill="${colors.accent}"/>
  <circle cx="25" cy="30" r="8" fill="${colors.primary}"/>
  
  <!-- Company Name -->
  <text x="50" y="35" font-family="${data.typography.headingFont}, sans-serif" font-size="18" font-weight="600" fill="${colors.textPrimary}">${companyName}</text>
  
  <!-- Tagline placeholder -->
  <text x="50" y="48" font-family="${data.typography.bodyFont}, sans-serif" font-size="10" fill="${colors.textSecondary}">Your tagline here</text>
</svg>`
  }

  if (variant === "vertical") {
    return `<svg width="120" height="120" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
  <!-- Background -->
  <rect width="120" height="120" fill="${colors.primary}" rx="8"/>
  
  <!-- Icon -->
  <circle cx="60" cy="40" r="20" fill="${colors.accent}"/>
  <circle cx="60" cy="40" r="12" fill="${colors.primary}"/>
  
  <!-- Company Name -->
  <text x="60" y="75" font-family="${data.typography.headingFont}, sans-serif" font-size="14" font-weight="600" fill="${colors.textPrimary}" text-anchor="middle">${companyName}</text>
  
  <!-- Tagline placeholder -->
  <text x="60" y="90" font-family="${data.typography.bodyFont}, sans-serif" font-size="8" fill="${colors.textSecondary}" text-anchor="middle">Your tagline here</text>
</svg>`
  }

  // Icon variant
  return `<svg width="80" height="80" viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
  <!-- Background -->
  <rect width="80" height="80" fill="${colors.accent}" rx="16"/>
  
  <!-- Icon -->
  <circle cx="40" cy="40" r="25" fill="${colors.primary}"/>
  <circle cx="40" cy="40" r="15" fill="${colors.accent}"/>
  
  <!-- Initial -->
  <text x="40" y="48" font-family="${data.typography.headingFont}, sans-serif" font-size="24" font-weight="700" fill="${colors.primary}" text-anchor="middle">${companyName.charAt(0)}</text>
</svg>`
}

// Generate business card template
export function generateBusinessCardTemplate(data: AssetGeneratorData): string {
  const { projectName, colors } = data
  const companyName = projectName.slice(0, 25) || "Your Company"

  return `<svg width="350" height="200" viewBox="0 0 350 200" xmlns="http://www.w3.org/2000/svg">
  <!-- Card Background -->
  <rect width="350" height="200" fill="${colors.primary}" rx="8"/>
  
  <!-- Accent Strip -->
  <rect width="350" height="8" fill="${colors.accent}"/>
  
  <!-- Logo Area -->
  <circle cx="40" cy="50" r="20" fill="${colors.accent}"/>
  <circle cx="40" cy="50" r="12" fill="${colors.primary}"/>
  <text x="40" y="56" font-family="${data.typography.headingFont}, sans-serif" font-size="16" font-weight="700" fill="${colors.accent}" text-anchor="middle">${companyName.charAt(0)}</text>
  
  <!-- Company Name -->
  <text x="75" y="45" font-family="${data.typography.headingFont}, sans-serif" font-size="18" font-weight="600" fill="${colors.textPrimary}">${companyName}</text>
  <text x="75" y="60" font-family="${data.typography.bodyFont}, sans-serif" font-size="12" fill="${colors.textSecondary}">Your tagline here</text>
  
  <!-- Contact Info -->
  <text x="30" y="120" font-family="${data.typography.bodyFont}, sans-serif" font-size="11" font-weight="600" fill="${colors.textPrimary}">John Doe</text>
  <text x="30" y="135" font-family="${data.typography.bodyFont}, sans-serif" font-size="10" fill="${colors.textSecondary}">CEO & Founder</text>
  
  <text x="30" y="155" font-family="${data.typography.bodyFont}, sans-serif" font-size="9" fill="${colors.textSecondary}">john@${companyName.toLowerCase().replace(/\s+/g, "")}.com</text>
  <text x="30" y="170" font-family="${data.typography.bodyFont}, sans-serif" font-size="9" fill="${colors.textSecondary}">+1 (555) 123-4567</text>
  <text x="30" y="185" font-family="${data.typography.bodyFont}, sans-serif" font-size="9" fill="${colors.textSecondary}">www.${companyName.toLowerCase().replace(/\s+/g, "")}.com</text>
</svg>`
}

// Generate letterhead template
export function generateLetterheadTemplate(data: AssetGeneratorData): string {
  const { projectName, colors } = data
  const companyName = projectName.slice(0, 25) || "Your Company"

  return `<svg width="600" height="800" viewBox="0 0 600 800" xmlns="http://www.w3.org/2000/svg">
  <!-- Background -->
  <rect width="600" height="800" fill="${colors.primary}"/>
  
  <!-- Header -->
  <rect width="600" height="120" fill="${colors.secondary}"/>
  
  <!-- Logo -->
  <circle cx="60" cy="60" r="25" fill="${colors.accent}"/>
  <circle cx="60" cy="60" r="15" fill="${colors.secondary}"/>
  <text x="60" y="68" font-family="${data.typography.headingFont}, sans-serif" font-size="20" font-weight="700" fill="${colors.accent}" text-anchor="middle">${companyName.charAt(0)}</text>
  
  <!-- Company Info -->
  <text x="110" y="50" font-family="${data.typography.headingFont}, sans-serif" font-size="24" font-weight="600" fill="${colors.textPrimary}">${companyName}</text>
  <text x="110" y="70" font-family="${data.typography.bodyFont}, sans-serif" font-size="12" fill="${colors.textSecondary}">Your tagline here</text>
  
  <!-- Contact Info -->
  <text x="110" y="90" font-family="${data.typography.bodyFont}, sans-serif" font-size="10" fill="${colors.textSecondary}">123 Business St, City, State 12345 | phone@company.com | (555) 123-4567</text>
  
  <!-- Content Area -->
  <rect x="60" y="180" width="480" height="2" fill="${colors.accent}"/>
  
  <!-- Sample Content -->
  <text x="60" y="220" font-family="${data.typography.bodyFont}, sans-serif" font-size="12" fill="${colors.textPrimary}">Date: [Date]</text>
  
  <text x="60" y="260" font-family="${data.typography.bodyFont}, sans-serif" font-size="12" fill="${colors.textPrimary}">Dear [Recipient],</text>
  
  <text x="60" y="300" font-family="${data.typography.bodyFont}, sans-serif" font-size="12" fill="${colors.textPrimary}">This is your professional letterhead template. Replace this text with your</text>
  <text x="60" y="320" font-family="${data.typography.bodyFont}, sans-serif" font-size="12" fill="${colors.textPrimary}">actual letter content. The design follows your brand guidelines and</text>
  <text x="60" y="340" font-family="${data.typography.bodyFont}, sans-serif" font-size="12" fill="${colors.textPrimary}">maintains consistency with your visual identity.</text>
  
  <text x="60" y="380" font-family="${data.typography.bodyFont}, sans-serif" font-size="12" fill="${colors.textPrimary}">Best regards,</text>
  
  <text x="60" y="420" font-family="${data.typography.bodyFont}, sans-serif" font-size="12" fill="${colors.textPrimary}">[Your Name]</text>
  <text x="60" y="440" font-family="${data.typography.bodyFont}, sans-serif" font-size="12" fill="${colors.textSecondary}">[Your Title]</text>
  
  <!-- Footer -->
  <rect x="0" y="750" width="600" height="50" fill="${colors.secondary}"/>
  <text x="300" y="775" font-family="${data.typography.bodyFont}, sans-serif" font-size="10" fill="${colors.textSecondary}" text-anchor="middle">www.${companyName.toLowerCase().replace(/\s+/g, "")}.com</text>
</svg>`
}

// Generate social media templates
export function generateSocialMediaTemplate(
  data: AssetGeneratorData,
  platform: "instagram" | "facebook" | "twitter" | "linkedin",
): string {
  const { projectName, colors } = data
  const companyName = projectName.slice(0, 20) || "Your Company"

  const dimensions = {
    instagram: { width: 1080, height: 1080 },
    facebook: { width: 1200, height: 630 },
    twitter: { width: 1200, height: 675 },
    linkedin: { width: 1200, height: 627 },
  }

  const { width, height } = dimensions[platform]

  return `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
  <!-- Background -->
  <rect width="${width}" height="${height}" fill="${colors.primary}"/>
  
  <!-- Gradient Overlay -->
  <defs>
    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${colors.accent};stop-opacity:0.1" />
      <stop offset="100%" style="stop-color:${colors.accent};stop-opacity:0.3" />
    </linearGradient>
  </defs>
  <rect width="${width}" height="${height}" fill="url(#gradient)"/>
  
  <!-- Logo -->
  <circle cx="${width / 2}" cy="${height / 2 - 100}" r="80" fill="${colors.accent}"/>
  <circle cx="${width / 2}" cy="${height / 2 - 100}" r="50" fill="${colors.primary}"/>
  <text x="${width / 2}" y="${height / 2 - 80}" font-family="${data.typography.headingFont}, sans-serif" font-size="60" font-weight="700" fill="${colors.accent}" text-anchor="middle">${companyName.charAt(0)}</text>
  
  <!-- Company Name -->
  <text x="${width / 2}" y="${height / 2 + 20}" font-family="${data.typography.headingFont}, sans-serif" font-size="72" font-weight="600" fill="${colors.textPrimary}" text-anchor="middle">${companyName}</text>
  
  <!-- Tagline -->
  <text x="${width / 2}" y="${height / 2 + 80}" font-family="${data.typography.bodyFont}, sans-serif" font-size="36" fill="${colors.textSecondary}" text-anchor="middle">Your tagline here</text>
  
  <!-- Platform specific elements -->
  ${platform === "instagram" ? `<text x="${width / 2}" y="${height - 100}" font-family="${data.typography.bodyFont}, sans-serif" font-size="24" fill="${colors.textSecondary}" text-anchor="middle">#${companyName.toLowerCase().replace(/\s+/g, "")} #branding</text>` : ""}
</svg>`
}

// Generate presentation template
export function generatePresentationTemplate(data: AssetGeneratorData): string {
  const { projectName, colors } = data
  const companyName = projectName.slice(0, 25) || "Your Company"

  return `<svg width="1920" height="1080" viewBox="0 0 1920 1080" xmlns="http://www.w3.org/2000/svg">
  <!-- Background -->
  <rect width="1920" height="1080" fill="${colors.primary}"/>
  
  <!-- Header -->
  <rect width="1920" height="120" fill="${colors.secondary}"/>
  
  <!-- Logo -->
  <circle cx="100" cy="60" r="30" fill="${colors.accent}"/>
  <circle cx="100" cy="60" r="18" fill="${colors.secondary}"/>
  <text x="100" y="70" font-family="${data.typography.headingFont}, sans-serif" font-size="24" font-weight="700" fill="${colors.accent}" text-anchor="middle">${companyName.charAt(0)}</text>
  
  <!-- Company Name -->
  <text x="150" y="70" font-family="${data.typography.headingFont}, sans-serif" font-size="28" font-weight="600" fill="${colors.textPrimary}">${companyName}</text>
  
  <!-- Slide Title -->
  <text x="960" y="300" font-family="${data.typography.headingFont}, sans-serif" font-size="72" font-weight="600" fill="${colors.textPrimary}" text-anchor="middle">Slide Title</text>
  
  <!-- Content Area -->
  <rect x="200" y="400" width="1520" height="4" fill="${colors.accent}"/>
  
  <!-- Bullet Points -->
  <circle cx="250" cy="480" r="8" fill="${colors.accent}"/>
  <text x="280" y="490" font-family="${data.typography.bodyFont}, sans-serif" font-size="36" fill="${colors.textPrimary}">First key point or main message</text>
  
  <circle cx="250" cy="560" r="8" fill="${colors.accent}"/>
  <text x="280" y="570" font-family="${data.typography.bodyFont}, sans-serif" font-size="36" fill="${colors.textPrimary}">Second important point</text>
  
  <circle cx="250" cy="640" r="8" fill="${colors.accent}"/>
  <text x="280" y="650" font-family="${data.typography.bodyFont}, sans-serif" font-size="36" fill="${colors.textPrimary}">Third supporting detail</text>
  
  <!-- Footer -->
  <rect x="0" y="1000" width="1920" height="80" fill="${colors.secondary}"/>
  <text x="960" y="1045" font-family="${data.typography.bodyFont}, sans-serif" font-size="24" fill="${colors.textSecondary}" text-anchor="middle">www.${companyName.toLowerCase().replace(/\s+/g, "")}.com</text>
</svg>`
}

// Generate email signature template
export function generateEmailSignatureTemplate(data: AssetGeneratorData): string {
  const { projectName, colors } = data
  const companyName = projectName.slice(0, 25) || "Your Company"

  return `<svg width="500" height="150" viewBox="0 0 500 150" xmlns="http://www.w3.org/2000/svg">
  <!-- Background -->
  <rect width="500" height="150" fill="${colors.primary}"/>
  
  <!-- Separator Line -->
  <rect width="500" height="2" fill="${colors.accent}"/>
  
  <!-- Logo -->
  <circle cx="40" cy="50" r="20" fill="${colors.accent}"/>
  <circle cx="40" cy="50" r="12" fill="${colors.primary}"/>
  <text x="40" y="56" font-family="${data.typography.headingFont}, sans-serif" font-size="16" font-weight="700" fill="${colors.accent}" text-anchor="middle">${companyName.charAt(0)}</text>
  
  <!-- Name and Title -->
  <text x="80" y="35" font-family="${data.typography.headingFont}, sans-serif" font-size="16" font-weight="600" fill="${colors.textPrimary}">John Doe</text>
  <text x="80" y="50" font-family="${data.typography.bodyFont}, sans-serif" font-size="12" fill="${colors.textSecondary}">CEO & Founder</text>
  <text x="80" y="65" font-family="${data.typography.headingFont}, sans-serif" font-size="14" font-weight="500" fill="${colors.accent}">${companyName}</text>
  
  <!-- Contact Info -->
  <text x="80" y="85" font-family="${data.typography.bodyFont}, sans-serif" font-size="10" fill="${colors.textSecondary}">📧 john@${companyName.toLowerCase().replace(/\s+/g, "")}.com</text>
  <text x="80" y="100" font-family="${data.typography.bodyFont}, sans-serif" font-size="10" fill="${colors.textSecondary}">📱 +1 (555) 123-4567</text>
  <text x="80" y="115" font-family="${data.typography.bodyFont}, sans-serif" font-size="10" fill="${colors.textSecondary}">🌐 www.${companyName.toLowerCase().replace(/\s+/g, "")}.com</text>
  
  <!-- Social Icons Placeholder -->
  <circle cx="350" cy="90" r="12" fill="${colors.accent}" opacity="0.3"/>
  <circle cx="380" cy="90" r="12" fill="${colors.accent}" opacity="0.3"/>
  <circle cx="410" cy="90" r="12" fill="${colors.accent}" opacity="0.3"/>
</svg>`
}

// Generate favicon template
export function generateFaviconTemplate(data: AssetGeneratorData): string {
  const { projectName, colors } = data
  const companyName = projectName.slice(0, 25) || "Your Company"

  return `<svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
  <!-- Background -->
  <rect width="32" height="32" fill="${colors.accent}" rx="6"/>
  
  <!-- Icon -->
  <circle cx="16" cy="16" r="10" fill="${colors.primary}"/>
  <text x="16" y="20" font-family="${data.typography.headingFont}, sans-serif" font-size="12" font-weight="700" fill="${colors.accent}" text-anchor="middle">${companyName.charAt(0)}</text>
</svg>`
}

// Create downloadable file
export function createDownloadableFile(content: string, filename: string, type = "image/svg+xml"): void {
  const blob = new Blob([content], { type })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

// Generate CSS for web assets
export function generateWebAssetCSS(data: AssetGeneratorData): string {
  return `/* Brand Asset CSS - Generated from Style Guide */

/* Logo Styles */
.logo-horizontal {
  width: 200px;
  height: 60px;
}

.logo-vertical {
  width: 120px;
  height: 120px;
}

.logo-icon {
  width: 80px;
  height: 80px;
}

/* Brand Colors */
:root {
  --brand-primary: ${data.colors.primary};
  --brand-secondary: ${data.colors.secondary};
  --brand-accent: ${data.colors.accent};
  --brand-text-primary: ${data.colors.textPrimary};
  --brand-text-secondary: ${data.colors.textSecondary};
}

/* Typography */
.brand-heading {
  font-family: '${data.typography.headingFont}', sans-serif;
  font-weight: 600;
  color: var(--brand-text-primary);
}

.brand-body {
  font-family: '${data.typography.bodyFont}', sans-serif;
  color: var(--brand-text-primary);
}

/* Button Styles */
.btn-primary {
  background-color: var(--brand-accent);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-family: '${data.typography.bodyFont}', sans-serif;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.2s;
}

.btn-primary:hover {
  opacity: 0.9;
}

.btn-secondary {
  background-color: transparent;
  color: var(--brand-accent);
  border: 2px solid var(--brand-accent);
  padding: 10px 22px;
  border-radius: 8px;
  font-family: '${data.typography.bodyFont}', sans-serif;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-secondary:hover {
  background-color: var(--brand-accent);
  color: white;
}

/* Card Styles */
.brand-card {
  background-color: var(--brand-primary);
  border: 1px solid var(--brand-secondary);
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

/* Header Styles */
.brand-header {
  background-color: var(--brand-secondary);
  padding: 16px 24px;
  border-bottom: 2px solid var(--brand-accent);
}

/* Footer Styles */
.brand-footer {
  background-color: var(--brand-secondary);
  padding: 32px 24px;
  text-align: center;
  color: var(--brand-text-secondary);
}
`
}
