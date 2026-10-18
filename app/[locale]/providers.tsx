'use client'

import dynamic from "next/dynamic";
import { ScrollProvider } from "@/hooks/useScrollTracking";
import styles from '@/styles/index.module.css';
import 'lenis/dist/lenis.css'
import ScrollAnimations from "@/components/Layout/ScrollAnimations";
import SmoothScroll from "@/components/Layout/SmoothScroll";
import { NextIntlClientProvider } from "next-intl";
const Header = dynamic(() => import("@/components/Layout/navbar"));
const Footer = dynamic(() => import("@/components/Layout/footer"),{ ssr: false });
export function Providers({ children, messages, locale }: { children: React.ReactNode, messages: any, locale: any }) {  
  return (
    <body suppressHydrationWarning
      className="relative antialiased font-geist mx-2 text-md flex flex-col"
    >
      <ScrollProvider >
        <SmoothScroll />
        <NextIntlClientProvider locale={locale} messages={messages}>
          <Header />

          {children}
          <Footer/>
        </NextIntlClientProvider>
        <ScrollAnimations />
      </ScrollProvider>
    </body>
  )
}