import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["id", "en"],
  defaultLocale: "id",
  // Mode export tidak punya middleware, jadi setiap bahasa wajib punya prefix URL sendiri.
  localePrefix: "always",
});

export type Locale = (typeof routing.locales)[number];

export const localeNames: Record<Locale, string> = { id: "ID", en: "EN" };
