import "@/styles/globals.css";
import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { generateMetaData } from '@/lib/metadata';
import { hasLocale } from "next-intl";
import { getLocale, getMessages, getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { inter, geist, merriweather, playfair, display, body } from "@/config/fonts";
import { Providers } from "./providers";
import Script from "next/script";
import Head from "next/head";

export const dynamicParams = false;
export const generateStaticParams = () => routing.locales.map((locale) => ({ locale }));

export async function generateMetadata(): Promise<Metadata> {
  // const { locale } = await getLocale();
  // if (!hasLocale(routing.locales, locale)) return {};
  // const t = await getTranslations({ locale, namespace: "meta" });
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

export default async function LocaleLayout({ children }: { children: React.ReactNode }) {
  const locale = await getLocale();
  if (!hasLocale(routing.locales, locale)) notFound();
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning className={`${inter.variable} ${geist.variable} ${merriweather.variable} ${playfair.variable} ${display.variable} ${body.variable}`} >
      <Head>
        <Script
          id="theme-script"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: THEME_SCRIPT,
          }}
        />
      </Head>
      <Providers messages={messages} locale={locale}>
        {children}
      </Providers>
      <Analytics />
    </html>
  );
}
