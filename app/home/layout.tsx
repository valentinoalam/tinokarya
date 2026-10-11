import { generateMetaData } from "@/lib/metadata";
import { BackgroundColorProvider } from "@/hooks/useBgColor";
import { Providers } from "./provider";
import Loading from "./loading";
import { Suspense } from "react";
export async function generateMetadata() {
  return generateMetaData();
}

export default function LandingPageLayout({
    children,
  }: {
    children: React.ReactNode;
  }) {
    
    return (
      <>
        <Providers>
          <BackgroundColorProvider selector="main">
            <Suspense fallback =<Loading/> />
              {children}
          </BackgroundColorProvider>
        </Providers>
      </>
  );
  }