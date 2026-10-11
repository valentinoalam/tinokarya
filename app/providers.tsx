'use client'

import dynamic from "next/dynamic";
import { ScrollProvider } from "@/hooks/useScrollTracking";
import styles from '@/styles/index.module.css';
import 'lenis/dist/lenis.css'
import { cn } from '@/lib/utils';
import { useQuoteStore } from '@/store/quote-store';
import ScrollAnimations from "@/components/Layout/ScrollAnimations";
import SmoothScroll from "@/components/Layout/SmoothScroll";

const Header = dynamic(() => import("@/components/Layout/navbar"));
const Footer = dynamic(() => import("@/components/Layout/footer"),{ ssr: false });
export function Providers({ children }: { children: React.ReactNode }) {
  const { dialogOpen } = useQuoteStore()
  return (
    <body suppressHydrationWarning
      className={cn("relative antialiased font-playfair mx-2 text-md flex flex-col",
        dialogOpen ? `h-screen ${styles.pageWithDialog}` : '')}
    >
      <ScrollProvider >
        <SmoothScroll />
        <Header />

        {children}
        <Footer/>
        <ScrollAnimations />
      </ScrollProvider>
    </body>
  )
}