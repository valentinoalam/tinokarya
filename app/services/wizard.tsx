"use client";

import { useMemo, useState, type ReactNode } from "react";
import { Check, Info, MessageCircle, RotateCcw, ArrowLeft, ArrowRight, Zap } from "lucide-react";
import { Dialog } from "./knowledge";

const WA_NUMBER = "6281234567890"; // samakan dengan page.tsx
const EXPRESS_RATE = 0.3;

/* ---------- Tooltip (muncul saat hover, fokus keyboard, atau tap) ---------- */
export function Tip({
  text,
  children,
  block,
  align = "center",
}: {
  text?: string;
  children: ReactNode;
  block?: boolean;
  align?: "left" | "center" | "right";
}) {
  if (!text) return <>{children}</>;
  const pos = block
    ? "left-0 right-0"
    : align === "left"
    ? "left-0"
    : align === "right"
    ? "right-0"
    : "left-1/2 -translate-x-1/2";
  return (
    <span className={`group relative ${block ? "block h-full" : "inline-flex"}`}>
      {children}
      <span
        role="tooltip"
        className={`pointer-events-none invisible absolute top-full z-30 mt-2 rounded-lg bg-[#14202B] px-3 py-2 text-left text-xs font-normal leading-relaxed text-white opacity-0 shadow-lg transition-opacity delay-150 group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100 motion-reduce:transition-none ${
          block ? "" : "w-60"
        } ${pos}`}
      >
        {text}
      </span>
    </span>
  );
}

export function InfoTip({ text, align = "center" }: { text?: string; align?: "left" | "center" | "right" }) {
  return (
    <Tip text={text} align={align}>
      <button
        type="button"
        aria-label="Lihat penjelasan"
        onClick={(e) => e.currentTarget.focus()}
        className="rounded-full text-[#4A5968] hover:text-[#2F5BFF] focus-visible:outline-2 focus-visible:outline-[#2F5BFF]"
      >
        <Info className="h-3.5 w-3.5" aria-hidden />
      </button>
    </Tip>
  );
}

export const TIPS: Record<string, string> = {
  starter: "Satu halaman dengan 5–6 seksi. Paling hemat untuk mulai tampil online atau menguji ide bisnis.",
  interactive: "Desain custom dari Figma plus animasi yang bergerak mengikuti scroll. Cocok bila tampilan menjadi pembeda brand Anda.",
  immersive: "Pengalaman visual penuh dengan objek 3D yang bisa dijelajahi. Harga mengikuti kerumitan model dan interaksinya.",
  "s-starter": "Toko ringkas dengan konfirmasi pembayaran manual atau via WhatsApp. Cocok untuk mulai berjualan dengan katalog kecil.",
  "s-pro": "Pembayaran dan ongkir otomatis, akun pelanggan, serta laporan penjualan. Umum dipilih bisnis yang sudah punya pembeli rutin.",
  "s-flagship": "Untuk operasi besar: banyak gudang, banyak metode bayar, dan terhubung ke sistem internal seperti ERP.",
  "landing:3d": "Objek 3D atau animasi Lottie yang dibuat khusus. Perlu bila Anda belum punya modelnya.",
  "landing:i18n": "Seluruh teks tersedia dalam bahasa Indonesia dan Inggris, dengan tombol pengalih bahasa.",
  "landing:form": "Formulir lebih dari sekadar kontak, misalnya multi-langkah, kuis, atau kalkulator sederhana.",
  "landing:cms": "Panel untuk mengubah teks dan gambar sendiri tanpa menyentuh kode.",
  "landing:express": "Pengerjaan dipercepat dua kali lipat dengan prioritas jadwal. Biayanya 30% dari total proyek.",
  "store:n8n": "Setiap order atau lead baru dikirim sebagai notifikasi ke WhatsApp admin, Telegram, atau dicatat di Google Sheets.",
  "store:i18n": "Penerjemahan dan penyiapan seluruh halaman untuk satu bahasa tambahan. Dihitung per bahasa.",
  "store:seo": "Riset kata kunci dan penulisan konten profil serta deskripsi produk agar lebih mudah ditemukan di Google.",
  complexity: "Geser untuk menentukan titik estimasi di dalam kisaran harga. Semakin banyak halaman, interaksi, atau integrasi, semakin ke kanan.",
  dp: "Pembayaran awal 50% sebelum proyek dimulai, sekaligus mengamankan jadwal pengerjaan.",
  pelunasan: "50% sisanya dibayar setelah proyek selesai diuji dan siap go-live.",
  "spec:Jumlah produk": "Batas produk aktif di katalog. Melebihi batas perlu naik paket.",
  "spec:Pembayaran": "Cara pembeli membayar. Gateway memverifikasi otomatis, transfer manual perlu dicek admin.",
  "spec:Ongkir": "Tarif tetap, atau dihitung otomatis sesuai berat dan tujuan lewat API ekspedisi.",
  "spec:Stok & order": "Alat admin untuk memantau stok dan memproses pesanan.",
  "spec:Diskon": "Jenis promo yang didukung, dari kode kupon sampai aturan promo otomatis.",
  "spec:Akun pelanggan": "Pembeli punya akun: login, wishlist, riwayat order, dan alamat tersimpan.",
  "spec:Laporan": "Ringkasan penjualan yang bisa dilihat atau diekspor untuk keperluan keuangan.",
  "spec:Support": "Masa bantuan perbaikan dan pendampingan setelah toko go-live.",
};

/* ---------- Data wizard ---------- */
type Kind = "landing" | "store";
type P = { id: string; name: string; min: number; max: number; open?: boolean; duration?: string };
type A = { id: string; name: string; min: number; max: number };
type Feat = { id: string; label: string; hint: string; tier?: number; addon?: string };

const LEVELS: Record<Kind, { label: string; hint: string }[]> = {
  landing: [
    { label: "Sederhana dan informatif", hint: "Profil usaha, layanan, testimoni, dan tombol kontak dengan animasi secukupnya." },
    { label: "Dinamis dan berkarakter", hint: "Desain custom dan animasi yang mengikuti scroll, cocok untuk startup atau produk digital." },
    { label: "Imersif dan 3D", hint: "Objek 3D dan cerita interaktif untuk peluncuran produk besar atau brand korporat." },
  ],
  store: [
    { label: "Sampai 50 produk", hint: "Toko baru atau katalog ramping." },
    { label: "51 sampai 500 produk", hint: "Katalog yang berkembang dengan stok dan order rutin." },
    { label: "Lebih dari 500 produk", hint: "Katalog besar dengan banyak kategori, gudang, atau kanal penjualan." },
  ],
};

const FEATS: Record<Kind, Feat[]> = {
  landing: [
    { id: "scroll", label: "Animasi yang mengikuti scroll", tier: 1, hint: "Elemen bergerak presisi mengikuti gerakan scroll pengunjung." },
    { id: "design", label: "Desain UI/UX custom dari Figma", tier: 1, hint: "Tampilan dirancang khusus dan Anda setujui di Figma sebelum coding dimulai." },
    { id: "crm", label: "Terhubung ke CRM atau email marketing", tier: 1, hint: "Data pengunjung masuk otomatis ke Resend, Mailchimp, ConvertKit, dan sejenisnya." },
    { id: "three", label: "Objek 3D atau WebGL interaktif", tier: 2, hint: "Model 3D yang bisa diputar atau dijelajahi langsung di browser." },
    { id: "asset", label: "Aset 3D atau Lottie dibuatkan", addon: "3d", hint: TIPS["landing:3d"] },
    { id: "cms", label: "Konten bisa diedit sendiri (CMS)", addon: "cms", hint: TIPS["landing:cms"] },
    { id: "i18n", label: "Dua bahasa (IND / ENG)", addon: "i18n", hint: TIPS["landing:i18n"] },
    { id: "form", label: "Formulir interaktif", addon: "form", hint: TIPS["landing:form"] },
  ],
  store: [
    { id: "gateway", label: "Pembayaran otomatis (Midtrans / Xendit)", tier: 1, hint: "Pembeli membayar lewat VA, e-wallet, atau kartu dan statusnya terverifikasi otomatis." },
    { id: "ongkir", label: "Cek ongkir otomatis", tier: 1, hint: "Tarif kurir dihitung langsung sesuai berat dan alamat tujuan lewat RajaOngkir." },
    { id: "akun", label: "Akun pelanggan dan wishlist", tier: 1, hint: "Pembeli bisa login, menyimpan wishlist, dan melihat riwayat pesanan." },
    { id: "promo", label: "Flash sale dan bundle", tier: 1, hint: "Promo berbatas waktu dan paket produk dengan harga khusus." },
    { id: "erp", label: "Multi-gudang, ERP, atau PayLater", tier: 2, hint: "Stok tersinkron antar gudang dan sistem internal, plus kanal bayar yang lebih lengkap." },
    { id: "n8n", label: "Notifikasi order otomatis", addon: "n8n", hint: TIPS["store:n8n"] },
    { id: "i18n", label: "Tambah satu bahasa lain", addon: "i18n", hint: TIPS["store:i18n"] },
    { id: "seo", label: "Konten dan SEO dibuatkan", addon: "seo", hint: TIPS["store:seo"] },
  ],
};

const idr = (n: number) => "Rp " + Math.round(n).toLocaleString("id-ID");
const range = (a: number, b: number, open?: boolean) => (a === b ? idr(a) : `${idr(a)} – ${idr(b)}${open ? "+" : ""}`);

/* ---------- Wizard ---------- */
export function QuoteWizard({
  open,
  onClose,
  landing,
  store,
  addons,
  onApply,
}: {
  open: boolean;
  onClose: () => void;
  landing: P[];
  store: P[];
  addons: Record<Kind, A[]>;
  onApply: (kind: Kind, pkgId: string, qty: Record<string, number>, express: boolean, complexity: number) => void;
}) {
  const [step, setStep] = useState(0);
  const [kind, setKind] = useState<Kind | null>(null);
  const [level, setLevel] = useState<number | null>(null);
  const [feats, setFeats] = useState<string[]>([]);
  const [urgent, setUrgent] = useState(false);

  const k: Kind = kind ?? "landing";
  const steps = k === "store" ? ["Jenis", "Skala", "Fitur", "Hasil"] : ["Jenis", "Skala", "Fitur", "Waktu", "Hasil"];
  const isResult = step === steps.length - 1;
  const canNext = step === 0 ? kind !== null : step === 1 ? level !== null : true;

  const r = useMemo(() => {
    const pkgs = k === "landing" ? landing : store;
    const picked = FEATS[k].filter((f) => feats.includes(f.id));
    let tier = level ?? 0;
    for (const f of picked) if (f.tier !== undefined && f.tier > tier) tier = f.tier;
    const raisedBy = tier > (level ?? 0) ? picked.filter((f) => f.tier === tier).map((f) => f.label) : [];
    const pkg = pkgs[tier];
    let min = pkg.min;
    let max = pkg.max;
    const lines: { name: string; text: string }[] = [];
    const qty: Record<string, number> = {};
    for (const f of picked) {
      const a = addons[k].find((x) => x.id === f.addon);
      if (!a) continue;
      min += a.min;
      max += a.max;
      qty[`${k}:${a.id}`] = 1;
      lines.push({ name: a.name, text: range(a.min, a.max) });
    }
    const express = k === "landing" && urgent;
    if (express) {
      min *= 1 + EXPRESS_RATE;
      max *= 1 + EXPRESS_RATE;
    }
    const frac = Math.min(1, 0.15 + 0.1 * picked.length);
    return { pkg, min, max, est: min + (max - min) * frac, frac, lines, qty, express, raisedBy };
  }, [k, level, feats, urgent, landing, store, addons]);

  const wa = encodeURIComponent(
    [
      `Halo, saya sudah mencoba kalkulator estimasi dan hasilnya paket *${r.pkg.name}*.`,
      r.lines.length ? `Tambahan: ${r.lines.map((l) => l.name).join(", ")}` : "",
      r.express ? "Express delivery: ya" : "",
      `Kisaran: ${range(r.min, r.max, r.pkg.open)}`,
    ]
      .filter(Boolean)
      .join("\n")
  );

  const reset = () => {
    setStep(0);
    setKind(null);
    setLevel(null);
    setFeats([]);
    setUrgent(false);
  };

  const Choice = ({ on, onClick, title, hint }: { on: boolean; onClick: () => void; title: string; hint: string }) => (
    <button
      role="radio"
      aria-checked={on}
      onClick={onClick}
      className={`w-full rounded-xl p-4 text-left transition focus-visible:outline-2 focus-visible:outline-[#2F5BFF] ${
        on ? "bg-[#2F5BFF]/5 ring-2 ring-[#2F5BFF]" : "ring-1 ring-[#14202B]/15 hover:ring-[#2F5BFF]/60"
      }`}
    >
      <span className="block font-semibold">{title}</span>
      <span className="mt-1 block text-sm text-[#4A5968]">{hint}</span>
    </button>
  );

  return (
    <Dialog open={open} onClose={onClose} title="Kalkulator estimasi biaya">
      <p className="text-sm text-[#4A5968]">
        Langkah {step + 1} dari {steps.length}: {steps[step]}
      </p>
      <div className="mt-2 flex gap-1.5" aria-hidden>
        {steps.map((s, i) => (
          <span key={s} className={`h-1.5 flex-1 rounded-full ${i <= step ? "bg-[#2F5BFF]" : "bg-[#14202B]/10"}`} />
        ))}
      </div>

      <div className="mt-6 min-h-[260px]">
        {step === 0 && (
          <>
            <h3 className="mb-4 text-lg font-bold">Website apa yang Anda butuhkan?</h3>
            <div role="radiogroup" className="space-y-3">
              <Choice on={kind === "landing"} onClick={() => { setKind("landing"); setLevel(null); setFeats([]); }} title="Landing page" hint="Satu halaman untuk promosi, profil usaha, atau menjaring calon pelanggan." />
              <Choice on={kind === "store"} onClick={() => { setKind("store"); setLevel(null); setFeats([]); }} title="Toko online" hint="Katalog produk, keranjang, dan checkout untuk berjualan langsung." />
            </div>
          </>
        )}

        {step === 1 && (
          <>
            <h3 className="mb-4 text-lg font-bold">
              {k === "landing" ? "Seperti apa tampilan yang Anda harapkan?" : "Berapa banyak produk yang akan dijual?"}
            </h3>
            <div role="radiogroup" className="space-y-3">
              {LEVELS[k].map((l, i) => (
                <Choice key={l.label} on={level === i} onClick={() => setLevel(i)} title={l.label} hint={l.hint} />
              ))}
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <h3 className="text-lg font-bold">Fitur apa yang penting bagi Anda?</h3>
            <p className="mb-4 mt-1 text-sm text-[#4A5968]">Pilih yang sesuai, boleh dikosongkan. Arahkan kursor ke fitur untuk melihat penjelasannya.</p>
            <ul className="grid gap-3 sm:grid-cols-2">
              {FEATS[k].map((f) => {
                const on = feats.includes(f.id);
                const a = addons[k].find((x) => x.id === f.addon);
                return (
                  <li key={f.id}>
                    <Tip text={f.hint} block>
                      <label
                        className={`flex h-full cursor-pointer items-start gap-3 rounded-xl p-3.5 transition ${
                          on ? "bg-[#2F5BFF]/5 ring-2 ring-[#2F5BFF]" : "ring-1 ring-[#14202B]/15 hover:ring-[#2F5BFF]/60"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={on}
                          onChange={() => setFeats((s) => (on ? s.filter((x) => x !== f.id) : [...s, f.id]))}
                          className="mt-1 h-4 w-4 accent-[#2F5BFF]"
                        />
                        <span className="text-sm">
                          <span className="block font-medium">{f.label}</span>
                          {a && <span className="mt-0.5 block text-xs text-[#4A5968]">Tambahan {range(a.min, a.max)}</span>}
                        </span>
                      </label>
                    </Tip>
                  </li>
                );
              })}
            </ul>
          </>
        )}

        {step === 3 && k === "landing" && (
          <>
            <h3 className="mb-4 text-lg font-bold">Seberapa cepat website harus jadi?</h3>
            <div role="radiogroup" className="space-y-3">
              <Choice on={!urgent} onClick={() => setUrgent(false)} title="Normal" hint="Mengikuti durasi standar paket, tanpa biaya tambahan." />
              <Choice on={urgent} onClick={() => setUrgent(true)} title="Secepat mungkin (Express)" hint="Pengerjaan 2× lebih cepat dengan tambahan 30% dari total biaya." />
            </div>
          </>
        )}

        {isResult && (
          <div>
            <p className="text-sm text-[#4A5968]">Paket yang paling sesuai</p>
            <h3 className="text-2xl font-bold" style={{ fontFamily: "var(--font-display)" }}>
              {r.pkg.name}
            </h3>
            {r.raisedBy.length > 0 && (
              <p className="mt-2 rounded-lg bg-[#E8A317]/15 p-3 text-sm">
                Paket dinaikkan dari pilihan skala Anda karena fitur: {r.raisedBy.join(", ")}.
              </p>
            )}
            <p className="mt-4 text-3xl font-bold tabular-nums" style={{ fontFamily: "var(--font-display)" }}>
              {idr(r.est)}
            </p>
            <p className="text-sm text-[#4A5968]">Kisaran {range(r.min, r.max, r.pkg.open)}</p>

            <ul className="mt-4 space-y-2 border-t border-[#14202B]/10 pt-4 text-sm">
              <li className="flex justify-between gap-3">
                <span>{r.pkg.name}</span>
                <span className="tabular-nums">{range(r.pkg.min, r.pkg.max, r.pkg.open)}</span>
              </li>
              {r.lines.map((l) => (
                <li key={l.name} className="flex justify-between gap-3">
                  <span>{l.name}</span>
                  <span className="tabular-nums">{l.text}</span>
                </li>
              ))}
              {r.express && (
                <li className="flex items-center justify-between gap-3 text-[#B5790A]">
                  <span className="flex items-center gap-1"><Zap className="h-4 w-4" aria-hidden /> Express delivery</span>
                  <span>+30%</span>
                </li>
              )}
            </ul>

            <div className="mt-4 grid grid-cols-2 gap-3 rounded-xl bg-[#F2F5F8] p-4 text-sm">
              <div>
                <p className="flex items-center gap-1 text-[#4A5968]">DP 50% <InfoTip text={TIPS.dp} align="left" /></p>
                <p className="font-bold tabular-nums">{idr(r.est / 2)}</p>
              </div>
              <div>
                <p className="flex items-center gap-1 text-[#4A5968]">Pelunasan <InfoTip text={TIPS.pelunasan} align="right" /></p>
                <p className="font-bold tabular-nums">{idr(r.est / 2)}</p>
              </div>
            </div>
            {r.pkg.duration && (
              <p className="mt-3 text-sm text-[#4A5968]">
                Perkiraan waktu: {r.pkg.duration}
                {r.express ? ", dipercepat 2×" : ""}
              </p>
            )}
            <p className="mt-3 text-xs text-[#4A5968]">
              Ini gambaran awal. Angka final ditentukan setelah diskusi kebutuhan, dan belum termasuk domain, hosting, atau biaya pihak ketiga.
            </p>
          </div>
        )}
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-[#14202B]/10 pt-4">
        {step > 0 && !isResult ? (
          <button onClick={() => setStep(step - 1)} className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold ring-1 ring-[#14202B]/20 hover:bg-[#14202B]/5">
            <ArrowLeft className="h-4 w-4" aria-hidden /> Kembali
          </button>
        ) : isResult ? (
          <button onClick={reset} className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold ring-1 ring-[#14202B]/20 hover:bg-[#14202B]/5">
            <RotateCcw className="h-4 w-4" aria-hidden /> Ulangi
          </button>
        ) : (
          <span />
        )}

        {!isResult ? (
          <button
            disabled={!canNext}
            onClick={() => setStep(step + 1)}
            className="flex items-center gap-2 rounded-xl bg-[#2F5BFF] px-5 py-2.5 text-sm font-semibold text-white transition enabled:hover:bg-[#2548CC] disabled:opacity-40"
          >
            {step === steps.length - 2 ? "Lihat hasil" : "Lanjut"} <ArrowRight className="h-4 w-4" aria-hidden />
          </button>
        ) : (
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => {
                onApply(k, r.pkg.id, r.qty, r.express, r.frac * 100);
                onClose();
              }}
              className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold ring-1 ring-[#14202B]/20 hover:bg-[#14202B]/5"
            >
              <Check className="h-4 w-4" aria-hidden /> Pakai di kalkulator
            </button>
            <a
              href={`https://wa.me/${WA_NUMBER}?text=${wa}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-xl bg-[#2F5BFF] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#2548CC]"
            >
              <MessageCircle className="h-4 w-4" aria-hidden /> Kirim via WhatsApp
            </a>
          </div>
        )}
      </div>
    </Dialog>
  );
}
