import {
  BookOpen,
  DollarSign,
  HelpCircle,
  Mail,
  Gift,
  Workflow,
} from "lucide-react"
import { NavItem } from "./navigationMenu"

export const defaultNavData: NavItem[] = [
  // {
  //   type: "dropdown",
  //   label: "Design Tools",
  //   icon: Palette,
  //   children: [
  //     {
  //       label: "Brand Identity Generator",
  //       href: "/brand-identity-gen",
  //       description: "Create comprehensive brand identity packages",
  //       icon: Briefcase,
  //     },
  //     {
  //       label: "Color Picker",
  //       href: "/color-picker",
  //       description: "Advanced color selection and palette tools",
  //       icon: Palette,
  //     },
  //     {
  //       label: "Design Generator",
  //       href: "/design-generator",
  //       description: "AI-powered design creation tools",
  //       icon: PenTool,
  //     },
  //     {
  //       label: "Style Generator",
  //       href: "/style-generator",
  //       description: "Generate consistent design styles",
  //       icon: Settings,
  //     },
  //     {
  //       label: "Stylescape Generator",
  //       href: "/stylescape-generator",
  //       description: "Create visual style guides and mood boards",
  //       icon: Layout,
  //     },
  //   ],
  // },
  // {
  //   type: "dropdown",
  //   label: "Web Development",
  //   icon: Code,
  //   children: [
  //     {
  //       label: "Landing Page Designer",
  //       href: "/landing-page-designer",
  //       description: "Build high-converting landing pages",
  //       icon: Layout,
  //     },
  //     {
  //       label: "Web Builder",
  //       href: "/web-builder",
  //       description: "Complete website building platform",
  //       icon: Globe,
  //     },
  //     {
  //       label: "Templates",
  //       href: "/templates",
  //       description: "Pre-built website and page templates",
  //       icon: FileText,
  //     },
  //     {
  //       label: "Contact Form Builder",
  //       href: "/contact-form-builder",
  //       description: "Create custom contact forms",
  //       icon: Mail,
  //     },
  //     {
  //       label: "Form Builder",
  //       href: "/form",
  //       description: "Advanced form creation tools",
  //       icon: FileText,
  //     },
  //   ],
  // },
  // {
  //   type: "dropdown",
  //   label: "Business Tools",
  //   icon: Briefcase,
  //   children: [
  //     {
  //       label: "SEO Analyzer",
  //       href: "/seo-analyzer",
  //       description: "Analyze and optimize your SEO performance",
  //       icon: Search,
  //     },
  //     {
  //       label: "CV Builder",
  //       href: "/cv",
  //       description: "Professional resume and CV creator",
  //       icon: FileText,
  //     },
  //     {
  //       label: "Pricing Calculator",
  //       href: "/pricing",
  //       description: "Create pricing tables and calculators",
  //       icon: DollarSign,
  //     },
  //     {
  //       label: "Dashboard",
  //       href: "/dashboard",
  //       description: "Analytics and project management",
  //       icon: Layout,
  //     },
  //   ],
  // },
  // {
  //   type: "featured",
  //   label: "Business Location",
  //   href: "/business-location",
  //   description: "Find and analyze optimal business locations",
  //   icon: Map,
  //   image: "/images/business-location-cover.jpeg", // You'll need to add this image
  // },
  // {
  //   type: "dropdown",
  //   label: "Launch Tools",
  //   icon: Zap,
  //   children: [
  //     {
  //       label: "Rocket Launcher",
  //       href: "/rocket",
  //       description: "Launch your project with our guidance",
  //       icon: Zap,
  //     },
  //     {
  //       label: "Rocket Pro",
  //       href: "/rocket2",
  //       description: "Advanced project launch and scaling tools",
  //       icon: Star,
  //     },
  //   ],
  // },
  {
    label: "About",
    href: "/about",
    description: "Learn more about our company and mission",
    icon: HelpCircle,
  },
]

export interface NavPageItem {
  label: string;
  href: string;
  description: string;
  icon: string; // Diubah ke string untuk menampung emoticon
}

export const landingPageData: NavPageItem[] = [
  {
    label: "Tentang Kami",
    href: "#about", // Mengarah ke komponen <About />
    description: "Mengenal lebih dekat siapa kami dan visi layanan kami",
    icon: "🌱",
  },
  {
    label: "Masalah Usaha",
    href: "#pain", // Mengarah ke komponen <Pain />
    description: "Tantangan dan kendala digital yang sering dihadapi bisnis saat ini",
    icon: "🧩",
  },
  {
    label: "Keunggulan",
    href: "#manfaat", // Mengarah ke komponen <Benefits />
    description: "Manfaat dan alasan kenapa kamu harus memilih jasa kami",
    icon: "✨",
  },
  {
    label: "AlKisah kami",
    href: "#cerita", // Mengarah ke <InteractiveBook />, <Story />, & <BranchStorySection />
    description: "Jelajahi alur cerita interaktif dan pengalaman klien kami",
    icon: "📖",
  },
  {
    label: "Perbandingan",
    href: "#compare", // Mengarah ke komponen <Compare />
    description: "Lihat bedanya hasil kerja kami dibanding solusi lainnya",
    icon: "⚖️",
  },
  {
    label: "Studi Kasus",
    href: "#study-case", // Mengarah ke komponen <StudyCaseSection />
    description: "Kisah sukses nyata dari hasil pembuatan website & landing page",
    icon: "💡",
  },
  {
    label: "Paket Harga",
    href: "#paket", // Mengarah ke komponen <Packages />
    description: "Pilihan paket layanan transparan sesuai kebutuhan bisnismu",
    icon: "🏷️",
  },
  {
    label: "FAQ",
    href: "#faq", // Mengarah ke komponen <Faq />
    description: "Pertanyaan yang sering diajukan seputar layanan kami",
    icon: "❓",
  },
  {
    label: "Kontak Kami",
    href: "#kontak", // Mengarah ke komponen <Cta />
    description: "Mulai proyekmu sekarang atau konsultasi gratis bersama kami",
    icon: "💌",
  },
];

export const footerNavigation = [
  // {
  //   label: "Design Tools",
  //   children: [
  //     { label: "Brand Identity Generator", href: "/brand-identity-gen" },
  //     { label: "Color Picker", href: "/color-picker" },
  //     { label: "Design Generator", href: "/design-generator" },
  //     { label: "Style Generator", href: "/style-generator" },
  //     { label: "Stylescape Generator", href: "/stylescape-generator" },
  //   ],
  // },
  // {
  //   label: "Web Development",
  //   children: [
  //     { label: "Landing Page Designer", href: "/landing-page-designer" },
  //     { label: "Web Builder", href: "/web-builder" },
  //     { label: "Templates", href: "/templates" },
  //     { label: "Contact Form Builder", href: "/contact-form-builder" },
  //     { label: "Form Builder", href: "/form" },
  //   ],
  // },
  // {
  //   label: "Business Tools",
  //   children: [
  //     { label: "SEO Analyzer", href: "/seo-analyzer" },
  //     { label: "CV Builder", href: "/cv" },
  //     { label: "Dashboard", href: "/dashboard" },
  //   ],
  // },
  // {
  //   label: "Featured",
  //   children: [{ label: "Business Location", href: "/business-location" }],
  // },
  {
    label: "Company",
    children: [{ label: "About", href: "/about" }],
  },
]

export const mobileNavigation = flattenDefaultNavForMobile()

export function flattenDefaultNavForMobile() {
  const links: Array<{ label: string; href: string }> = []
  for (const item of defaultNavData as Array<{ type?: string; label: string; href?: string; children?: Array<{ label: string; href: string }> }>) {
    if (item.type === "dropdown" && Array.isArray(item.children)) {
      for (const child of item.children) {
        links.push({ label: child.label, href: child.href })
      }
    } else if (item.type === "featured") {
      if (item.href) links.push({ label: item.label, href: item.href })
    } else if (item.href) {
      links.push({ label: item.label, href: item.href })
    }
  }
  return links
}
