'use client'

import { ScrollProvider } from "@/hooks/useScrollTracking";
import { NextIntlClientProvider } from "next-intl";
export function Providers({ children, messages, locale }: { children: React.ReactNode, messages: any, locale: any }) {  
  return (
    
      <NextIntlClientProvider locale={locale} messages={messages}>
        <ScrollProvider >
        {children}
        </ScrollProvider>
      </NextIntlClientProvider>
  )
}