interface PersonalInfo {
  fullName: string
  title: string
  email: string
  phone: string
  linkedin: string
  github: string
  portfolio: string
  location: string
}

interface Experience {
  id: string
  title: string
  company: string
  location: string
  startDate: string
  endDate: string
  current: boolean
  responsibilities: string[]
}

interface Education {
  id: string
  degree: string
  institution: string
  location: string
  startDate: string
  endDate: string
  specialization?: string
}

interface Skill {
  id: string
  category: string
  name: string
  description: string
  technologies: string[]
}

interface Certificate {
  id: string
  title: string
  issuer: string
  date: string
}

interface CVData {
  personalInfo: PersonalInfo
  careerObjective: string
  experience: Experience[]
  education: Education[]
  skills: Skill[]
  certificates: Certificate[]
}

export function exportToHTML(data: CVData): string {
  const formatDate = (dateString: string) => {
    if (!dateString) return ""
    const date = new Date(dateString + "-01")
    return date.toLocaleDateString("en-US", { month: "short", year: "numeric" })
  }

  const escapeHtml = (text: string) => {
    const div = document.createElement("div")
    div.textContent = text
    return div.innerHTML
  }

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CV - ${escapeHtml(data.personalInfo.fullName || "Professional Resume")}</title>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
            min-height: 100vh;
            padding: 20px;
        }

        .cv-container {
            max-width: 1000px;
            margin: 0 auto;
            background: white;
            border-radius: 20px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
            overflow: hidden;
            animation: slideUp 0.8s ease-out;
        }

        @keyframes slideUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        .header {
            background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
            color: white;
            padding: 40px;
            text-align: center;
            position: relative;
            overflow: hidden;
        }

        .header::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(147, 51, 234, 0.1) 100%);
        }

        .profile-img {
            width: 120px;
            height: 120px;
            border-radius: 50%;
            border: 4px solid rgba(255,255,255,0.2);
            margin: 0 auto 20px;
            background: rgba(255,255,255,0.1);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 48px;
            color: rgba(255,255,255,0.8);
            position: relative;
            z-index: 1;
            backdrop-filter: blur(10px);
        }

        .header h1 {
            font-size: 2.5em;
            margin-bottom: 10px;
            position: relative;
            z-index: 1;
            font-weight: 700;
        }

        .header .subtitle {
            font-size: 1.3em;
            opacity: 0.9;
            position: relative;
            z-index: 1;
            margin-bottom: 20px;
            font-weight: 300;
        }

        .contact-info {
            display: flex;
            justify-content: center;
            gap: 30px;
            margin-top: 20px;
            flex-wrap: wrap;
            position: relative;
            z-index: 1;
        }

        .contact-item {
            display: flex;
            align-items: center;
            gap: 8px;
            color: rgba(255,255,255,0.9);
            text-decoration: none;
            transition: all 0.3s ease;
            font-size: 0.9em;
        }

        .contact-item:hover {
            color: white;
            transform: translateY(-2px);
        }

        .section {
            padding: 40px;
        }

        .section-title {
            font-size: 2em;
            color: #1e293b;
            margin-bottom: 30px;
            position: relative;
            font-weight: 700;
        }

        .section-title::after {
            content: '';
            position: absolute;
            bottom: -8px;
            left: 0;
            width: 60px;
            height: 4px;
            background: linear-gradient(135deg, #3b82f6, #8b5cf6);
            border-radius: 2px;
        }

        .career-objective {
            background: linear-gradient(135deg, #f8fafc 0%, #e0f2fe 100%);
            border-radius: 15px;
            padding: 30px;
            margin-bottom: 30px;
            border-left: 5px solid #3b82f6;
            position: relative;
            overflow: hidden;
        }

        .career-objective::before {
            content: '';
            position: absolute;
            top: -20px;
            right: -20px;
            width: 80px;
            height: 80px;
            background: linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(139, 92, 246, 0.1));
            border-radius: 50%;
        }

        .career-objective p {
            position: relative;
            z-index: 1;
            font-size: 1.1em;
            line-height: 1.7;
            color: #334155;
        }

        .experience-item, .education-item {
            background: white;
            border: 1px solid #e2e8f0;
            border-radius: 15px;
            padding: 30px;
            margin-bottom: 25px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.05);
            transition: all 0.3s ease;
            position: relative;
            overflow: hidden;
        }

        .experience-item::before, .education-item::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 5px;
            height: 100%;
            background: linear-gradient(135deg, #10b981, #06b6d4);
        }

        .experience-item:hover, .education-item:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(0,0,0,0.1);
        }

        .item-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 20px;
            flex-wrap: wrap;
            gap: 15px;
        }

        .item-title {
            flex: 1;
        }

        .item-title h3 {
            font-size: 1.4em;
            color: #1e293b;
            margin-bottom: 5px;
            font-weight: 600;
        }

        .item-company {
            font-size: 1.1em;
            color: #3b82f6;
            font-weight: 500;
            margin-bottom: 8px;
        }

        .item-location {
            color: #64748b;
            display: flex;
            align-items: center;
            gap: 5px;
            font-size: 0.95em;
        }

        .item-date {
            background: #f1f5f9;
            padding: 8px 16px;
            border-radius: 20px;
            font-size: 0.9em;
            color: #475569;
            white-space: nowrap;
            display: flex;
            align-items: center;
            gap: 5px;
        }

        .responsibilities {
            margin-top: 20px;
        }

        .responsibilities h4 {
            color: #374151;
            margin-bottom: 15px;
            font-weight: 600;
        }

        .responsibilities ul {
            list-style: none;
            padding: 0;
        }

        .responsibilities li {
            display: flex;
            align-items: flex-start;
            gap: 12px;
            margin-bottom: 12px;
            color: #4b5563;
            line-height: 1.6;
        }

        .responsibilities li::before {
            content: '';
            width: 8px;
            height: 8px;
            background: #3b82f6;
            border-radius: 50%;
            margin-top: 8px;
            flex-shrink: 0;
        }

        .skills-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 25px;
            margin-top: 30px;
        }

        .skill-card {
            background: white;
            border: 1px solid #e2e8f0;
            border-radius: 15px;
            padding: 25px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.05);
            transition: all 0.3s ease;
            position: relative;
            overflow: hidden;
        }

        .skill-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 5px;
            height: 100%;
            background: linear-gradient(135deg, #f59e0b, #ef4444);
        }

        .skill-card:hover {
            transform: translateY(-3px);
            box-shadow: 0 12px 25px rgba(0,0,0,0.1);
        }

        .skill-header {
            display: flex;
            align-items: flex-start;
            gap: 12px;
            margin-bottom: 15px;
        }

        .skill-icon {
            width: 12px;
            height: 12px;
            background: linear-gradient(135deg, #f59e0b, #ef4444);
            border-radius: 50%;
            margin-top: 6px;
            flex-shrink: 0;
        }

        .skill-title {
            flex: 1;
        }

        .skill-title h3 {
            font-size: 1.2em;
            color: #1e293b;
            margin-bottom: 5px;
            font-weight: 600;
        }

        .skill-category {
            font-size: 0.9em;
            color: #f59e0b;
            font-weight: 500;
        }

        .skill-description {
            color: #4b5563;
            margin-bottom: 20px;
            line-height: 1.6;
        }

        .tech-tags {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
        }

        .tech-tag {
            background: linear-gradient(135deg, #fef3c7, #fed7aa);
            color: #92400e;
            padding: 4px 12px;
            border-radius: 12px;
            font-size: 0.8em;
            font-weight: 500;
            border: 1px solid #f3e8ff;
        }

        .certificates-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: 20px;
            margin-top: 30px;
        }

        .certificate-card {
            background: linear-gradient(135deg, #eef2ff 0%, #e0e7ff 100%);
            border: 1px solid #c7d2fe;
            border-radius: 15px;
            padding: 25px;
            text-align: center;
            transition: all 0.3s ease;
            position: relative;
            overflow: hidden;
        }

        .certificate-card:hover {
            transform: translateY(-3px);
            box-shadow: 0 12px 25px rgba(0,0,0,0.1);
        }

        .certificate-icon {
            width: 50px;
            height: 50px;
            background: linear-gradient(135deg, #6366f1, #3b82f6);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 15px;
            position: relative;
        }

        .certificate-icon::after {
            content: '';
            width: 24px;
            height: 24px;
            background: white;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .certificate-title {
            font-weight: 600;
            color: #1e293b;
            margin-bottom: 8px;
            font-size: 1.1em;
        }

        .certificate-issuer {
            color: #6366f1;
            font-weight: 500;
            margin-bottom: 8px;
        }

        .certificate-date {
            color: #64748b;
            font-size: 0.9em;
        }

        @media (max-width: 768px) {
            body {
                padding: 10px;
            }
            
            .header {
                padding: 30px 20px;
            }
            
            .header h1 {
                font-size: 2em;
            }
            
            .contact-info {
                gap: 15px;
                font-size: 0.8em;
            }
            
            .section {
                padding: 30px 20px;
            }
            
            .skills-grid {
                grid-template-columns: 1fr;
            }
            
            .certificates-grid {
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            }

            .item-header {
                flex-direction: column;
                align-items: flex-start;
            }

            .item-date {
                align-self: flex-start;
            }
        }

        @media print {
            body {
                background: white;
                padding: 0;
            }
            
            .cv-container {
                box-shadow: none;
                border-radius: 0;
            }
            
            .section {
                padding: 20px;
            }
            
            .experience-item, .education-item, .skill-card, .certificate-card {
                break-inside: avoid;
                page-break-inside: avoid;
            }
        }
    </style>
</head>
<body>
    <div class="cv-container">
        <!-- Header Section -->
        <header class="header">
            <div class="profile-img">
                <i class="fas fa-user"></i>
            </div>
            ${data.personalInfo.fullName ? `<h1>${escapeHtml(data.personalInfo.fullName)}</h1>` : ""}
            ${data.personalInfo.title ? `<p class="subtitle">${escapeHtml(data.personalInfo.title)}</p>` : ""}
            <div class="contact-info">
                ${
                  data.personalInfo.email
                    ? `
                <div class="contact-item">
                    <i class="fas fa-envelope"></i>
                    <span>${escapeHtml(data.personalInfo.email)}</span>
                </div>`
                    : ""
                }
                ${
                  data.personalInfo.phone
                    ? `
                <div class="contact-item">
                    <i class="fas fa-phone"></i>
                    <span>${escapeHtml(data.personalInfo.phone)}</span>
                </div>`
                    : ""
                }
                ${
                  data.personalInfo.location
                    ? `
                <div class="contact-item">
                    <i class="fas fa-map-marker-alt"></i>
                    <span>${escapeHtml(data.personalInfo.location)}</span>
                </div>`
                    : ""
                }
                ${
                  data.personalInfo.linkedin
                    ? `
                <div class="contact-item">
                    <i class="fab fa-linkedin"></i>
                    <span>${escapeHtml(data.personalInfo.linkedin)}</span>
                </div>`
                    : ""
                }
                ${
                  data.personalInfo.github
                    ? `
                <div class="contact-item">
                    <i class="fab fa-github"></i>
                    <span>${escapeHtml(data.personalInfo.github)}</span>
                </div>`
                    : ""
                }
                ${
                  data.personalInfo.portfolio
                    ? `
                <div class="contact-item">
                    <i class="fas fa-globe"></i>
                    <span>${escapeHtml(data.personalInfo.portfolio)}</span>
                </div>`
                    : ""
                }
            </div>
        </header>

        <div class="content">
            ${
              data.careerObjective
                ? `
            <!-- Career Objective -->
            <section class="section">
                <h2 class="section-title">Career Objective</h2>
                <div class="career-objective">
                    <p>${escapeHtml(data.careerObjective)}</p>
                </div>
            </section>`
                : ""
            }

            ${
              data.experience.length > 0
                ? `
            <!-- Experience -->
            <section class="section">
                <h2 class="section-title">Professional Experience</h2>
                ${data.experience
                  .map(
                    (exp) => `
                <div class="experience-item">
                    <div class="item-header">
                        <div class="item-title">
                            <h3>${escapeHtml(exp.title)}</h3>
                            <div class="item-company">${escapeHtml(exp.company)}</div>
                            ${exp.location ? `<div class="item-location"><i class="fas fa-map-marker-alt"></i> ${escapeHtml(exp.location)}</div>` : ""}
                        </div>
                        <div class="item-date">
                            <i class="fas fa-calendar"></i>
                            <span>${formatDate(exp.startDate)} - ${exp.current ? "Present" : formatDate(exp.endDate)}</span>
                        </div>
                    </div>
                    ${
                      exp.responsibilities.length > 0
                        ? `
                    <div class="responsibilities">
                        <h4>Key Responsibilities:</h4>
                        <ul>
                            ${exp.responsibilities.map((resp) => `<li>${escapeHtml(resp)}</li>`).join("")}
                        </ul>
                    </div>`
                        : ""
                    }
                </div>`,
                  )
                  .join("")}
            </section>`
                : ""
            }

            ${
              data.education.length > 0
                ? `
            <!-- Education -->
            <section class="section">
                <h2 class="section-title">Education</h2>
                ${data.education
                  .map(
                    (edu) => `
                <div class="education-item">
                    <div class="item-header">
                        <div class="item-title">
                            <h3>${escapeHtml(edu.degree)}</h3>
                            <div class="item-company">${escapeHtml(edu.institution)}</div>
                            ${edu.location ? `<div class="item-location"><i class="fas fa-map-marker-alt"></i> ${escapeHtml(edu.location)}</div>` : ""}
                            ${edu.specialization ? `<div class="item-location"><strong>Specialization:</strong> ${escapeHtml(edu.specialization)}</div>` : ""}
                        </div>
                        <div class="item-date">
                            <i class="fas fa-calendar"></i>
                            <span>${formatDate(edu.startDate)} - ${formatDate(edu.endDate)}</span>
                        </div>
                    </div>
                </div>`,
                  )
                  .join("")}
            </section>`
                : ""
            }

            ${
              data.skills.length > 0
                ? `
            <!-- Skills -->
            <section class="section">
                <h2 class="section-title">Skills & Competencies</h2>
                <div class="skills-grid">
                    ${data.skills
                      .map(
                        (skill) => `
                    <div class="skill-card">
                        <div class="skill-header">
                            <div class="skill-icon"></div>
                            <div class="skill-title">
                                <h3>${escapeHtml(skill.name)}</h3>
                                ${skill.category ? `<div class="skill-category">${escapeHtml(skill.category)}</div>` : ""}
                            </div>
                        </div>
                        ${skill.description ? `<div class="skill-description">${escapeHtml(skill.description)}</div>` : ""}
                        ${
                          skill.technologies.length > 0
                            ? `
                        <div class="tech-tags">
                            ${skill.technologies.map((tech) => `<span class="tech-tag">${escapeHtml(tech)}</span>`).join("")}
                        </div>`
                            : ""
                        }
                    </div>`,
                      )
                      .join("")}
                </div>
            </section>`
                : ""
            }

            ${
              data.certificates.length > 0
                ? `
            <!-- Certificates -->
            <section class="section">
                <h2 class="section-title">Certifications</h2>
                <div class="certificates-grid">
                    ${data.certificates
                      .map(
                        (cert) => `
                    <div class="certificate-card">
                        <div class="certificate-icon"></div>
                        <div class="certificate-title">${escapeHtml(cert.title)}</div>
                        <div class="certificate-issuer">${escapeHtml(cert.issuer)}</div>
                        ${cert.date ? `<div class="certificate-date">${formatDate(cert.date)}</div>` : ""}
                    </div>`,
                      )
                      .join("")}
                </div>
            </section>`
                : ""
            }
        </div>
    </div>
</body>
</html>`
}

export function downloadHTML(data: CVData) {
  const htmlContent = exportToHTML(data)
  const blob = new Blob([htmlContent], { type: "text/html" })
  const url = URL.createObjectURL(blob)

  const link = document.createElement("a")
  link.href = url
  link.download = `${data.personalInfo.fullName || "CV"}_Resume.html`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)

  URL.revokeObjectURL(url)
}
