import { routing } from "@/i18n/routing";
import { withBase } from "@/lib/base-path";

/** Menjadi /404.html pada hasil export. Tanpa i18n karena bahasa tidak diketahui di sini. */
export default function NotFound() {
  return (
    <html lang={routing.defaultLocale}>
      <body style={{ fontFamily: "system-ui, sans-serif", padding: "3rem 1.5rem", maxWidth: 560, margin: "0 auto" }}>
        <h1>404</h1>
        <p>
          Halaman tidak ditemukan. / Page not found.
        </p>
        <p>
          {routing.locales.map((l, i) => (
            <span key={l}>
              {i > 0 && " · "}
              <a href={withBase(`/${l}/`)}>{l.toUpperCase()}</a>
            </span>
          ))}
        </p>
      </body>
    </html>
  );
}
