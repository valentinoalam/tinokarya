import 'lenis/dist/lenis.css';
import "@/styles/globals.css";
import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from "next";
import { generateMetaData } from '@/lib/metadata';
import { inter, geist, merriweather, playfair, display, body } from "@/config/fonts";
import { Providers } from "./provider";
import Script from "next/script";
import Head from "next/head";
import ScrollAnimations from "@/components/Layout/ScrollAnimations";
import SmoothScroll from "@/components/Layout/SmoothScroll";
import Header from "@/components/Layout/header-local";
import Footer from "@/components/Layout/footer";

export const dynamicParams = false;

export async function generateMetadata(): Promise<Metadata> {
  return generateMetaData();
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: 'white', 
  colorScheme: "light dark",
  viewportFit: "cover",
  // interactiveWidget: 'resizes-visual',
}
/** Dijalankan sebelum render pertama supaya tema tersimpan langsung terpasang (tanpa kedip). */
const THEME_SCRIPT = `(function() {
        try {
          var theme = localStorage.getItem("theme");
          if (!theme) {
            theme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
          }
          document.documentElement.setAttribute("data-theme", theme);
        } catch (e) {
          document.documentElement.setAttribute("data-theme", "light");
        }
      })();                                                                                                                                                                                                                       `;

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" suppressHydrationWarning className={`${inter.variable} ${geist.variable} ${merriweather.variable} ${playfair.variable} ${display.variable} ${body.variable}`} >
      <Head>
        <Script
          id="theme-script"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: THEME_SCRIPT,
          }}
        />
      </Head>

      <body suppressHydrationWarning className="relative antialiased font-geist mx-2 text-md flex flex-col">
        <Providers>
          <SmoothScroll />
          <Header />
          {children}
          <Footer/>
          <ScrollAnimations />
        </Providers>
      </body>
      <Analytics />
    </html>
  );
}
