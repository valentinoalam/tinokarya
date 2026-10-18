import * as rootParams from 'next/root-params';
import { getRequestConfig } from "next-intl/server";
import { hasLocale } from 'next-intl';
import { routing } from './routing';
import { notFound } from 'next/navigation';

export default getRequestConfig(async () => {
  // Mengambil nilai dari segmen root [locale] secara otomatis
  const paramValue = await rootParams.locale(); 
  
  let locale;
  if (hasLocale(routing.locales, paramValue)) {
    locale = paramValue;
  } else {
    notFound(); // Validasi jika locale tidak dikenal
  }

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
     // The time zone can either be statically defined, read from the
    // user profile if you store such a setting, or based on dynamic
    // request information like the locale or a cookie.
    timeZone: 'Asia/Jakarta'
  };
});