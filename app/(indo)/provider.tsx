'use client'

import { ScrollProvider } from "@/hooks/useScrollTracking";
export function Providers({ children }: { children: React.ReactNode }) {  
  return (
        <ScrollProvider >
        {children}
        </ScrollProvider>
  )
}