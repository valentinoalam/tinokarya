// Memastikan semua bahasa punya kunci pesan yang sama dengan bahasa acuan (id).
import { readFileSync, readdirSync } from "node:fs";

const dir = new URL("../messages/", import.meta.url);
const flat = (o, p = "") =>
  Object.entries(o).flatMap(([k, v]) =>
    v && typeof v === "object" && !Array.isArray(v) ? flat(v, `${p}${k}.`) : [`${p}${k}${Array.isArray(v) ? `[${v.length}]` : ""}`]
  );

const load = (f) => new Set(flat(JSON.parse(readFileSync(new URL(f, dir), "utf8"))));
const base = load("id.json");
let bad = false;

for (const f of readdirSync(dir).filter((f) => f.endsWith(".json") && f !== "id.json")) {
  const other = load(f);
  const missing = [...base].filter((k) => !other.has(k));
  const extra = [...other].filter((k) => !base.has(k));
  if (missing.length || extra.length) {
    bad = true;
    console.error(`✗ ${f}\n  kurang: ${missing.join(", ") || "-"}\n  berlebih: ${extra.join(", ") || "-"}`);
  } else console.log(`✓ ${f} sama dengan id.json`);
}
process.exit(bad ? 1 : 0);
