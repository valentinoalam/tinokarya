import { routing } from "@/i18n/routing";
import { BASE_PATH, withBase } from "@/lib/base-path";

/**
 * "/" pada hosting statis: tidak ada middleware, jadi pengalihan dilakukan di klien
 * berdasarkan bahasa browser, dengan meta refresh sebagai cadangan bila JS mati.
 */
// const detect = `(function(){var ok=${JSON.stringify(routing.locales)};var l=((navigator.languages&&navigator.languages[0])||navigator.language||"").slice(0,2).toLowerCase();var targetLocale=ok.indexOf(l)>-1?l:${JSON.stringify(routing.defaultLocale)};var base=${JSON.stringify(BASE_PATH)};location.replace(base+"/"+targetLocale+"/")})()`;
const detect = `(function(){var base=${JSON.stringify(BASE_PATH)};var defaultLoc=${JSON.stringify(routing.defaultLocale)};location.replace(base+"/"+defaultLoc+"/")})()`;
export default function RootRedirect() {
  const fallback = withBase(`/${routing.defaultLocale}/`);
  
  return (
    <html lang={routing.defaultLocale}>
      <head>
        <meta charSet="utf-8" />
        <title>Paket Dasar Digitalisasi UMKM</title>
        <meta name="robots" content="noindex" />
        <meta httpEquiv="refresh" content={`1;url=${fallback}`} />
        <script dangerouslySetInnerHTML={{ __html: detect }} />
      </head>
      <body style={{ fontFamily: "system-ui, sans-serif", padding: "3rem 1.5rem", textAlign: "center" }}>
        <p>Mengarahkan bahasa...</p>
        <p style={{ marginTop: "1rem", fontSize: "0.9rem", color: "#666" }}>
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