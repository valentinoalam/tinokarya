import "@/styles/globals.css";
import { Analytics } from '@vercel/analytics/next'
import type { Viewport } from "next";
import { generateMetaData } from '@/lib/metadata';
import { Providers } from "./providers";
import { Bricolage_Grotesque, Figtree, Geist, Inter, Merriweather, Playfair_Display  } from "next/font/google";
import { cn } from "@/lib/utils";

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});
const merriweather = Merriweather({
  subsets: ['latin'],
  weight: ['300', '400', '700'], // Pilih weight yang dibutuhkan
  display: 'swap',
  variable: '--font-merriweather',
});
const playfair = Playfair_Display({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-playfair',
});


const geist = Geist({subsets:['latin'],variable:'--font-sans'});
const display = Bricolage_Grotesque({
  subsets: ["latin"],
  axes: ["opsz"],
  variable: "--font-display",
  display: "swap",
});

const body = Figtree({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export async function generateMetadata() {
  return generateMetaData();
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: 'white', 
  viewportFit: "cover",
  // interactiveWidget: 'resizes-visual',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Organization schema that applies to the whole site
  // const organizationSchema = createOrganizationSchema({
  //   name: "TinoKarya",
  //   url: "https://tinokarya.com",
  //   logo: "https://tinokarya.com/logo.png",
  //   sameAs: [
  //     "https://twitter.com/tonyfranky",
  //     "https://facebook.com/yourcompany",
  //     "https://linkedin.com/company/yourcompany",
  //   ],
  //   contactPoint: {
  //     telephone: "+1-555-555-5555",
  //     contactType: "customer service",
  //   },
  // })

  // // Website schema
  // const websiteSchema = createWebsiteSchema({
  //   name: "Karya Tino",
  //   url: "https://tinokarya.com",
  //   searchUrl: "https://tinokarya.com/search",
  // })
  
  return (
    <html lang="en" suppressHydrationWarning className={cn("font-sans", `${inter.variable} ${geist.variable} ${merriweather.variable} ${playfair.variable} ${display.variable} ${body.variable}`)}>
      <Providers>{children}</Providers>
      <Analytics />
    </html>
  );
}
