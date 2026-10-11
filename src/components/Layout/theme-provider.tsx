'use client';

import { type ThemeProviderProps, ThemeProvider } from 'next-themes';

export function ThemeProviderWrapper({
  children, ...props
}: ThemeProviderProps) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" {...props} enableSystem>
      {children}
    </ThemeProvider>
  );
}