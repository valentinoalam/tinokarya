'use client'
// import { Navbar } from "@/components/Layout/navbar";
import { Toaster } from "@/components/ui/toaster";
import Scripts from "@/components/Layout/scripts";
import Head from "next/head";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>{/* Google Tag Manager (noscript) */}
      <Head>
        <Scripts />
        <noscript><iframe src={`https://www.googletagmanager.com/ns.html?id=${process.env.NEXT_PUBLIC_GTM_ID}`}
        height="0" width="0" style={{ display:'none', visibility:'hidden' }}></iframe></noscript>
        {/* End Google Tag Manager (noscript) */}

        {/* Meta Pixel (noscript) */}
        <noscript>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img height="1" width="1" style={{ display:'none' }} alt='meta pixel'
        src={`https://www.facebook.com/tr?id=${process.env.FACEBOOK_USER_ID}&ev=PageView&noscript=1`}
        /></noscript>
        {/* Pinterest Conversion Tag base code (noscript) */}
        <noscript>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img height="1" width="1" style={{ display:'none' }} alt="" 
            src={`https://ct.pinterest.com/v3/?event=init&tid=${process.env.NEXT_PUBLIC_PINTEREST_TAG_ID}&pd[em]=<hashed_email_address>&noscript=1`} />
        </noscript>
      </Head>
      <div id="fb-root"></div>
      {children}
          
      {/* WAVE Accessibility Tool */}
      {/* <div id="wave_widget"></div>  */}
      <Toaster />
    </>
  )
}