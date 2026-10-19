import {
  DollarSign,
  HelpCircle,
} from "lucide-react"
import { NavItem } from "./navigationMenu"

export const defaultNavData: NavItem[] = [
  {
    label: "Price",
    href: "/price",
    description: "Create pricing tables and calculators",
    icon: DollarSign,
    intl: true
  },
  {
    label: "About",
    href: "/about",
    description: "Learn more about our company and mission",
    icon: HelpCircle,
    intl: false
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
    href: "#karya", // Mengarah ke komponen <StudyCaseSection />
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
  {
    label: "Company",
    children: [{ label: "About", href: "/about" }],
  },
]

export const mobileNavigation = flattenDefaultNavForMobile()

export function flattenDefaultNavForMobile() {
  const links: Array<{ label: string; href: string }> = []
  for (const item of defaultNavData as Array<{ type?: string; label: string; href: string; children?: Array<{ label: string; href: string }> }>) {
    links.push({ label: item.label, href: item.href })
  }
  return links
}
