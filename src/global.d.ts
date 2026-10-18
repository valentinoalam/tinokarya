import type { routing } from "@/i18n/routing";
import type messages from "../messages/id.json";

// Membuat useTranslations() mengenali kunci pesan (autocomplete + error saat salah ketik).
declare module "next-intl" {
  interface AppConfig {
    Locale: (typeof routing.locales)[number];
    Messages: typeof messages;
  }
}
