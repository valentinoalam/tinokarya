'use client'

import { ScrollProvider } from "@/hooks/useScrollTracking";
import { NextIntlClientProvider } from "next-intl";
export function Providers({ children, messages, locale, timeZone }: { children: React.ReactNode, messages: any, locale: any, timeZone: any }) {  
  return (
    
      <NextIntlClientProvider locale={locale} messages={messages} timeZone={timeZone}>
        <ScrollProvider >
        {children}
        </ScrollProvider>
      </NextIntlClientProvider>
  )
}