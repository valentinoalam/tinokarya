"use client";

import { useEffect, useMemo, useState } from "react";
import { Check, Minus, Plus, Zap, MessageCircle, ClipboardList, Sparkles } from "lucide-react";
import { HelpCenter, ScopeDialog } from "./knowledge";
import { QuoteWizard, Tip, InfoTip, TIPS, UmkmToggle, UMKM_RATE } from "./wizard";

/* ---------- Konfigurasi ---------- */
const WA_NUMBER = "6281234567890"; // ganti dengan nomor WhatsApp Anda
const EXPRESS_RATE = 0.3;

type Pkg = {
  id: string;
  name: string;
  tagline: string;
  min: number;
  max: number;
  open?: boolean; // harga "+"
  tech: string;
  duration?: string;
  features?: string[];
  specs?: [string, string][];
  popular?: boolean;
};
type Addon = {
  id: string;
  name: string;
  desc?: string;
  min: number;
  max: number;
  perUnit?: string; // mis. "bahasa"
};

const LANDING: Pkg[] = [
  {
    id: "starter",
    name: "Starter",
    tagline: "UMKM, personal branding, atau validasi ide bisnis dengan performa tinggi.",
    min: 2_000_000,
    max: 3_500_000,
    tech: "Next.js + Tailwind CSS + Lucide Icons",
    duration: "4–6 hari kerja",
    features: [
      "Hingga 5–6 seksi (Hero, About, Services, Testimonial, CTA, FAQ)",
      "Loading super cepat & skor Lighthouse tinggi",
      "SEO-friendly (SSR / SSG)",
      "Responsif & modern",
      "Tombol WhatsApp & form kontak (API / Webhook)",
      "Animasi dasar: fade-in, hover, smooth scroll",
    ],
  },
  {
    id: "interactive",
    name: "Interactive",
    tagline: "Startup, produk SaaS, agency, dan brand yang mengutamakan visual dinamis.",
    min: 4_000_000,
    max: 7_500_000,
    tech: "Next.js + Tailwind CSS + Framer Motion / GSAP",
    duration: "7–12 hari kerja",
    popular: true,
    features: [
      "Semua fitur Starter",
      "Desain UI/UX custom (prototipe Figma)",
      "Animasi scroll-triggered yang presisi",
      "SVG morphing & komponen interaktif",
      "Integrasi CRM / email marketing (Resend, Mailchimp, ConvertKit)",
      "Zero layout shift & FPS tinggi",
    ],
  },
  {
    id: "immersive",
    name: "Premium 3D",
    tagline: "Peluncuran produk flagship, brand korporat, dan pengalaman web kelas dunia.",
    min: 8_500_000,
    max: 20_000_000,
    open: true,
    tech: "Next.js + React Three Fiber + GSAP ScrollTrigger",
    duration: "14–25 hari kerja",
    features: [
      "Semua fitur Interactive",
      "Model 3D interaktif & WebGL canvas",
      "Interactive storytelling saat di-scroll",
      "Custom cursor, audio, & advanced shaders",
      "Setup analytics & conversion tracking",
      "Priority support & maintenance 1 bulan",
    ],
  },
];

const STORE: Pkg[] = [
  {
    id: "s-starter",
    name: "Starter Store",
    tagline: "Toko kecil yang ingin mulai jualan online dengan cepat.",
    min: 4_500_000,
    max: 7_500_000,
    tech: "Next.js + Headless Engine / API",
    specs: [
      ["Jumlah produk", "Hingga 50"],
      ["Pembayaran", "Transfer manual / checkout WhatsApp"],
      ["Ongkir", "Flat rate / opsi manual"],
      ["Stok & order", "Dashboard admin sederhana"],
      ["Diskon", "Kode kupon sederhana"],
      ["Akun pelanggan", "—"],
      ["Laporan", "Export Excel / ringkasan dasar"],
      ["Support", "1 bulan"],
    ],
  },
  {
    id: "s-pro",
    name: "Pro E-Commerce",
    tagline: "Bisnis berkembang yang butuh pembayaran dan ongkir otomatis.",
    min: 8_000_000,
    max: 15_000_000,
    tech: "Next.js + Custom E-commerce Core",
    popular: true,
    specs: [
      ["Jumlah produk", "Hingga 500"],
      ["Pembayaran", "Payment gateway (Midtrans / Xendit)"],
      ["Ongkir", "Cek ongkir otomatis (RajaOngkir API)"],
      ["Stok & order", "Manajemen order & kontrol inventori penuh"],
      ["Diskon", "Kupon lanjutan, flash sale, bundle"],
      ["Akun pelanggan", "Login, wishlist, riwayat order"],
      ["Laporan", "Dashboard analytics & laporan pendapatan"],
      ["Support", "3 bulan maintenance & training"],
    ],
  },
  {
    id: "s-flagship",
    name: "Flagship Store",
    tagline: "Skala besar dengan banyak gudang, kanal pembayaran, dan sistem internal.",
    min: 16_000_000,
    max: 35_000_000,
    open: true,
    tech: "Next.js Custom Monorepo / Microservices",
    specs: [
      ["Jumlah produk", "Unlimited"],
      ["Pembayaran", "Multi gateway + e-wallet + PayLater"],
      ["Ongkir", "Pilih kurir otomatis & tracking real-time"],
      ["Stok & order", "Sinkron inventori multi-gudang & integrasi ERP"],
      ["Diskon", "Aturan promo otomatis, poin loyalitas bertingkat"],
      ["Akun pelanggan", "SSO (Google / Apple), alamat tersimpan, area member"],
      ["Laporan", "Pelaporan lanjutan & export analytics custom"],
      ["Support", "6 bulan priority support & SLA server"],
    ],
  },
];

const ADDONS: Record<"landing" | "store", Addon[]> = {
  landing: [
    { id: "3d", name: "Aset 3D / Lottie custom", min: 750_000, max: 2_500_000 },
    { id: "i18n", name: "Multi-bahasa (IND / ENG)", min: 250_000, max: 250_000 },
    { id: "form", name: "Formulir interaktif", min: 200_000, max: 200_000 },
    { id: "cms", name: "Headless CMS", desc: "Sanity, Strapi, atau WordPress", min: 1_000_000, max: 2_500_000 },
  ],
  store: [
    {
      id: "n8n",
      name: "Automation (n8n / Webhook)",
      desc: "Notifikasi order ke WhatsApp, Telegram, atau Google Sheets",
      min: 750_000,
      max: 2_500_000,
    },
    { id: "i18n", name: "Multi-bahasa", min: 1_500_000, max: 3_000_000, perUnit: "bahasa tambahan" },
    {
      id: "seo",
      name: "SEO copywriting & konten",
      desc: "Riset kata kunci, konten profil & produk",
      min: 1_000_000,
      max: 3_000_000,
    },
  ],
};

const idr = (n: number) =>
  "Rp " + Math.round(n).toLocaleString("id-ID");
const range = (a: number, b: number, open?: boolean) =>
  a === b ? idr(a) : `${idr(a)} – ${idr(b)}${open ? "+" : ""}`;

/* ---------- Halaman ---------- */
export default function PricingPage() {
  const [kind, setKind] = useState<"landing" | "store">("landing");
  const [isMounted, setIsMounted] = useState(false)
  const [sel, setSel] = useState<Record<"landing" | "store", string>>({
    landing: "interactive",
    store: "s-pro",
  });
  const [qty, setQty] = useState<Record<string, number>>({});
  const [express, setExpress] = useState(false);
  const [complexity, setComplexity] = useState(50); // 0–100 untuk titik estimasi
  const [scopeOpen, setScopeOpen] = useState(false);
  const [wizardOpen, setWizardOpen] = useState(false);
  const [umkm, setUmkm] = useState(false);

  const packages = kind === "landing" ? LANDING : STORE;
  
  const pkg = packages.find((p) => p.id === sel[kind])!;
  const addons = ADDONS[kind];
  const key = (id: string) => `${kind}:${id}`;

  const calc = useMemo(() => {
    let min = pkg.min;
    let max = pkg.max;
    const lines: { name: string; text: string }[] = [];
    for (const a of addons) {
      const q = qty[key(a.id)] ?? 0;
      if (!q) continue;
      min += a.min * q;
      max += a.max * q;
      lines.push({ name: q > 1 ? `${a.name} ×${q}` : a.name, text: range(a.min * q, a.max * q) });
    }
    const useExpress = kind === "landing" && express;
    if (useExpress) {
      min *= 1 + EXPRESS_RATE;
      max *= 1 + EXPRESS_RATE;
    }
    const estGross = min + ((max - min) * complexity) / 100;
    if (umkm) {
      min *= 1 - UMKM_RATE;
      max *= 1 - UMKM_RATE;
    }
    const est = min + ((max - min) * complexity) / 100;
    return { min, max, est, estGross, lines, useExpress };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pkg, qty, express, complexity, kind, umkm]);
 
  const waText = encodeURIComponent(
    [
      `Halo, saya tertarik dengan paket *${pkg.name}*.`,
      calc.lines.length ? `Add-on: ${calc.lines.map((l) => l.name).join(", ")}` : "",
      calc.useExpress ? "Express delivery: ya" : "",
      umkm ? "Diskon UMKM 50%: ya (siap kirim dokumen usaha)" : "",
      `Estimasi: ${range(calc.min, calc.max, pkg.open)}`,
    ]
      .filter(Boolean)
      .join("\n")
  );

  const setQ = (id: string, v: number) =>
    setQty((s) => ({ ...s, [key(id)]: Math.max(0, Math.min(5, v)) }));

  useEffect(() => {
    setIsMounted(true)
    // Jika Anda mengambil nilai dari localStorage atau URL, lakukan di sini:
    // const savedKind = localStorage.getItem("selected-kind")
    // if (savedKind) setKind(savedKind)
  }, [])

  // Mencegah perbedaan render awal dengan merender struktur dasar atau null saat SSR
  if (!isMounted) {
    return null; // atau return skeleton/fallback statis
  }

  return (
    <main
      className="min-h-screen h-max bg-[#F2F5F8] text-[#14202B] antialiased"
    >
      <div className="mx-auto h-max max-w-6xl px-5 py-14 sm:py-20">
        {/* Header */}
        <header className="max-w-2xl">
          <h1
            className="text-4xl font-bold leading-[1.05] tracking-tight sm:text-6xl"
          >
            Website Next.js yang cepat, dengan harga yang bisa Anda hitung sendiri.
          </h1>
          <p className="mt-5 max-w-xl text-lg text-[#4A5968]">
            Pilih jenis proyek, paket, dan tambahan. Estimasi total beserta DP langsung diperbarui di samping.
          </p>
          <button
            onClick={() => setWizardOpen(true)}
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-5 py-3 font-semibold text-white transition hover:bg-emerald-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2F5BFF]"
          >
            <Sparkles className="h-5 w-5" aria-hidden /> Belum yakin? Hitung estimasi lewat wizard
          </button>

        </header>

        {/* Tabs */}
        <div role="tablist" aria-label="Jenis proyek" className="mt-10 inline-flex rounded-full bg-white p-1 shadow-sm ring-1 ring-[#14202B]/10">
          {(
            [
              ["landing", "Landing page"],
              ["store", "Toko online"],
            ] as const
          ).map(([k, label]) => (
            <button
              key={k}
              role="tab"
              aria-selected={kind === k}
              onClick={() => setKind(k)}
              className={`rounded-full px-5 py-2 text-sm font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2F5BFF] ${
                kind === k ? "bg-[#14202B] text-white" : "text-[#4A5968] hover:text-[#14202B]"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
          {/* Kolom kiri */}
          <div className="space-y-12">
            {/* Paket */}
            <section aria-labelledby="paket">
              <h2 id="paket" className="sr-only">Pilih paket</h2>
              <div role="radiogroup" className="grid gap-4 md:grid-cols-3">
                {packages.map((p) => {
                  const on = p.id === pkg.id;
                  return (
                    <Tip key={p.id} text={TIPS[p.id]} block>
                    <button
                      role="radio"
                      aria-checked={on}
                      onClick={() => setSel((s) => ({ ...s, [kind]: p.id }))}
                      className={`relative flex h-full w-full flex-col rounded-2xl p-5 text-left transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2F5BFF] ${
                        on
                          ? "bg-[#14202B] text-white shadow-xl"
                          : "bg-white ring-1 ring-[#14202B]/10 hover:ring-[#2F5BFF]/50"
                      }`}
                    >
                      {p.popular && (
                        <span className="absolute -top-3 right-4 rounded-full bg-[#2F5BFF] px-3 py-1 text-xs font-semibold text-white">
                          Paling dipilih
                        </span>
                      )}
                      <span className="text-xl font-bold" style={{ fontFamily: "var(--font-display)" }}>
                        {p.name}
                      </span>
                      <span className={`mt-2 text-sm ${on ? "text-white/70" : "text-[#4A5968]"}`}>{p.tagline}</span>
                      <span className="mt-5 text-lg font-bold leading-snug">{range(p.min, p.max, p.open)}</span>
                      <span className={`mt-1 text-xs ${on ? "text-white/60" : "text-[#4A5968]"}`}>
                        {p.duration ?? p.tech}
                      </span>
                    </button>
                    </Tip>
                  );
                })}
              </div>
 
              {/* Detail paket terpilih */}
              <div className="mt-6 rounded-2xl bg-white p-6 ring-1 ring-[#14202B]/10">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="text-lg font-bold" style={{ fontFamily: "var(--font-display)" }}>
                    Yang Anda dapat di {pkg.name}
                  </h3>
                  <span className="text-sm text-[#4A5968]">{pkg.tech}</span>
                </div>
                {pkg.features && (
                  <ul className="mt-4 grid gap-x-6 gap-y-3 sm:grid-cols-2">
                    {pkg.features.map((f) => (
                      <li key={f} className="flex gap-2 text-sm">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#1FA37F]" aria-hidden />
                        {f}
                      </li>
                    ))}
                  </ul>
                )}
                {pkg.specs && (
                  <dl className="mt-4 divide-y divide-[#14202B]/10 text-sm">
                    {pkg.specs.map(([k, v]) => (
                      <div key={k} className="grid grid-cols-[130px_1fr] gap-3 py-2.5">
                        <dt className="flex items-center gap-1 text-[#4A5968]">{k}<InfoTip text={TIPS[`spec:${k}`]} align="left" /></dt>
                        <dd className="font-medium">{v}</dd>
                      </div>
                    ))}
                  </dl>
                )}
              </div>
            </section>
 
            {/* Perbandingan toko online */}
            {kind === "store" && (
              <section aria-labelledby="banding">
                <h2 id="banding" className="text-2xl font-bold" style={{ fontFamily: "var(--font-display)" }}>
                  Bandingkan paket toko online
                </h2>
                <div className="mt-4 overflow-x-auto rounded-2xl bg-white ring-1 ring-[#14202B]/10">
                  <table className="w-full min-w-160 text-left text-sm">
                    <thead>
                      <tr className="border-b border-[#14202B]/10">
                        <th className="p-4 font-medium text-[#4A5968]">Fitur</th>
                        {STORE.map((p) => (
                          <th key={p.id} className={`p-4 font-bold ${p.id === pkg.id ? "bg-[#2F5BFF]/10" : ""}`}>
                            {p.name}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {STORE[0].specs!.map(([label], i) => (
                        <tr key={label} className="border-b border-[#14202B]/5 last:border-0">
                          <th scope="row" className="p-4 font-medium text-[#4A5968]">{label}</th>
                          {STORE.map((p) => (
                            <td key={p.id} className={`p-4 ${p.id === pkg.id ? "bg-[#2F5BFF]/10" : ""}`}>
                              {p.specs![i][1]}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            )}
 
            {/* Add-ons */}
            <section aria-labelledby="addon">
              <h2 id="addon" className="text-2xl font-bold" style={{ fontFamily: "var(--font-display)" }}>
                Tambahan opsional
              </h2>
              <ul className="mt-4 space-y-3">
                {addons.map((a) => {
                  const q = qty[key(a.id)] ?? 0;
                  const on = q > 0;
                  return (
                    <li
                      key={a.id}
                      className={`flex flex-wrap items-center gap-4 rounded-xl bg-white p-4 ring-1 transition ${
                        on ? "ring-2 ring-[#2F5BFF]" : "ring-[#14202B]/10"
                      }`}
                    >
                      <label className="flex min-w-0 flex-1 cursor-pointer items-start gap-3">
                        <input
                          type="checkbox"
                          checked={on}
                          onChange={() => setQ(a.id, on ? 0 : 1)}
                          className="mt-1 h-4 w-4 accent-[#2F5BFF]"
                        />
                        <span>
                          <span className="flex items-center gap-1.5 font-semibold">{a.name}<InfoTip text={TIPS[key(a.id)]} /></span>
                          {a.desc && <span className="block text-sm text-[#4A5968]">{a.desc}</span>}
                        </span>
                      </label>
                      {a.perUnit && on && (
                        <div className="flex items-center gap-2" aria-label={`Jumlah ${a.perUnit}`}>
                          <button
                            onClick={() => setQ(a.id, q - 1)}
                            className="rounded-full p-1.5 ring-1 ring-[#14202B]/20 hover:bg-[#14202B]/5"
                            aria-label="Kurangi"
                          >
                            <Minus className="h-3.5 w-3.5" />
                          </button>
                          <span className="w-5 text-center text-sm font-semibold tabular-nums">{q}</span>
                          <button
                            onClick={() => setQ(a.id, q + 1)}
                            className="rounded-full p-1.5 ring-1 ring-[#14202B]/20 hover:bg-[#14202B]/5"
                            aria-label="Tambah"
                          >
                            <Plus className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      )}
                      <span className="text-sm font-semibold tabular-nums">
                        {range(a.min, a.max)}
                        {a.perUnit && <span className="font-normal text-[#4A5968]"> / {a.perUnit}</span>}
                      </span>
                    </li>
                  );
                })}
 
                {kind === "landing" && (
                  <li
                    className={`flex flex-wrap items-center gap-4 rounded-xl bg-white p-4 ring-1 transition ${
                      express ? "ring-2 ring-[#E8A317]" : "ring-[#14202B]/10"
                    }`}
                  >
                    <label className="flex min-w-0 flex-1 cursor-pointer items-start gap-3">
                      <input
                        type="checkbox"
                        checked={express}
                        onChange={() => setExpress((v) => !v)}
                        className="mt-1 h-4 w-4 accent-[#E8A317]"
                      />
                      <span>
                        <span className="flex items-center gap-1.5 font-semibold">
                          <Zap className="h-4 w-4 text-[#E8A317]" aria-hidden /> Express delivery <InfoTip text={TIPS["landing:express"]} />
                        </span>
                        <span className="block text-sm text-[#4A5968]">Pengerjaan 2× lebih cepat</span>
                      </span>
                    </label>
                    <span className="text-sm font-semibold">+30% dari total</span>
                  </li>
                )}
              </ul>
            </section>
 
            {/* Ketentuan */}
            <section aria-labelledby="ketentuan" className="rounded-2xl bg-[#14202B] p-6 text-white sm:p-8">
              <h2 id="ketentuan" className="text-2xl font-bold" style={{ fontFamily: "var(--font-display)" }}>
                Cara pembayaran dan alur kerja
              </h2>
              <dl className="mt-5 grid gap-6 text-sm sm:grid-cols-3">
                <div>
                  <dt className="font-semibold">DP 50%</dt>
                  <dd className="mt-1 text-white/70">Dibayar di awal sebelum proyek dimulai.</dd>
                </div>
                <div>
                  <dt className="font-semibold">Pelunasan 50%</dt>
                  <dd className="mt-1 text-white/70">Setelah proyek selesai diuji dan siap go-live.</dd>
                </div>
                <div>
                  <dt className="font-semibold">Revisi</dt>
                  <dd className="mt-1 text-white/70">2× revisi mayor dan revisi minor tanpa batas selama pengerjaan.</dd>
                </div>
              </dl>
            </section>
          </div>
 
          {/* Kolom kanan: estimator */}
          <aside className="lg:sticky lg:top-6 lg:self-start" aria-label="Estimasi biaya">
            <div className="rounded-2xl bg-white p-6 shadow-xl ring-1 ring-[#14202B]/10">
              <p className="text-sm text-[#4A5968]">Estimasi total · {pkg.name}</p>
              <p
                className="mt-1 text-3xl font-bold tabular-nums"
                style={{ fontFamily: "var(--font-display)" }}
                aria-live="polite"
              >
                {idr(calc.est)}
              </p>
              <p className="mt-1 text-sm text-[#4A5968]">
                Kisaran {range(calc.min, calc.max, pkg.open)}
                {umkm && <span className="ml-2 line-through">{idr(calc.estGross)}</span>}
              </p>
 
              <div className="mt-5">
                <label htmlFor="cx" className="flex justify-between text-sm font-medium">
                  <span className="flex items-center gap-1">Kompleksitas proyek<InfoTip text={TIPS.complexity} align="left" /></span>
                  <span className="text-[#4A5968]">
                    {complexity < 34 ? "Sederhana" : complexity < 67 ? "Menengah" : "Kompleks"}
                  </span>
                </label>
                <input
                  id="cx"
                  type="range"
                  min={0}
                  max={100}
                  value={complexity}
                  onChange={(e) => setComplexity(+e.target.value)}
                  className="mt-2 w-full accent-[#2F5BFF]"
                />
              </div>
 
              <div className="mt-5">
                <UmkmToggle checked={umkm} onChange={setUmkm} />
              </div>
 
              <ul className="mt-5 space-y-2 border-t border-[#14202B]/10 pt-4 text-sm">
                <li className="flex justify-between gap-3">
                  <span>{pkg.name}</span>
                  <span className="tabular-nums">{range(pkg.min, pkg.max, pkg.open)}</span>
                </li>
                {calc.lines.map((l) => (
                  <li key={l.name} className="flex justify-between gap-3">
                    <span>{l.name}</span>
                    <span className="tabular-nums">{l.text}</span>
                  </li>
                ))}
                {calc.useExpress && (
                  <li className="flex justify-between gap-3 text-[#B5790A]">
                    <span>Express delivery</span>
                    <span>+30%</span>
                  </li>
                )}
                {umkm && (
                  <li className="flex justify-between gap-3 text-[#157A5E]">
                    <span>Diskon UMKM</span>
                    <span>−50%</span>
                  </li>
                )}
              </ul>
 
              <div className="mt-5 grid grid-cols-2 gap-3 rounded-xl bg-[#F2F5F8] p-4 text-sm">
                <div>
                  <p className="flex items-center gap-1 text-[#4A5968]">DP 50% <InfoTip text={TIPS.dp} align="left" /></p>
                  <p className="font-bold tabular-nums">{idr(calc.est / 2)}</p>
                </div>
                <div>
                  <p className="flex items-center gap-1 text-[#4A5968]">Pelunasan <InfoTip text={TIPS.pelunasan} align="right" /></p>
                  <p className="font-bold tabular-nums">{idr(calc.est / 2)}</p>
                </div>
              </div>
 
              <a
                href={`https://wa.me/${WA_NUMBER}?text=${waText}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-[#2F5BFF] px-5 py-3 font-semibold text-white transition hover:bg-[#2548CC] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2F5BFF]"
              >
                <MessageCircle className="h-5 w-5" aria-hidden /> Kirim estimasi lewat WhatsApp
              </a>
              <button
                onClick={() => setScopeOpen(true)}
                className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl px-5 py-3 font-semibold ring-1 ring-[#14202B]/20 transition hover:bg-[#14202B]/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2F5BFF]"
              >
                <ClipboardList className="h-5 w-5" aria-hidden /> Lihat ruang lingkup proyek
              </button>
              <p className="mt-3 text-xs text-[#4A5968]">
                Angka final ditentukan setelah diskusi kebutuhan. Estimasi ini belum termasuk biaya pihak ketiga seperti domain dan hosting.
              </p>
            </div>
          </aside>
        </div>
 
        <HelpCenter />
      </div>
 
      <QuoteWizard
        open={wizardOpen}
        onClose={() => setWizardOpen(false)}
        landing={LANDING}
        store={STORE}
        addons={ADDONS}
        onApply={(kd, pkgId, q, ex, cx, um) => {
          setUmkm(um);
          setKind(kd);
          setSel((v) => ({ ...v, [kd]: pkgId }));
          setQty(q);
          setExpress(ex);
          setComplexity(cx);
        }}
      />
      <ScopeDialog open={scopeOpen} onClose={() => setScopeOpen(false)} pkgId={pkg.id} pkgName={pkg.name} />
    </main>
  );
}