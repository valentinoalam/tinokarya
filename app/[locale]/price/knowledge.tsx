"use client";

import { useEffect, useId, useMemo, useRef, useState, type ReactNode } from "react";
import { Check, X, Search, BookOpen, HelpCircle, ChevronRight, MessageCircle } from "lucide-react";

const WA_NUMBER = "6281234567890"; // samakan dengan page.tsx

/* ---------- Dialog dasar (native <dialog>: fokus, Esc, & backdrop otomatis) ---------- */
export function Dialog({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const tid = useId();
  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(e) => e.target === ref.current && onClose()}
      aria-labelledby={tid}
      className="m-auto w-[min(680px,calc(100vw-2rem))] max-h-[85vh] rounded-2xl bg-white p-0 text-[#14202B] shadow-2xl backdrop:bg-[#14202B]/60"
    >
      <div className="flex items-start justify-between gap-4 border-b border-[#14202B]/10 p-5 sm:p-6">
        <h2 id={tid} className="text-xl font-bold leading-snug sm:text-2xl" style={{ fontFamily: "var(--font-display)" }}>
          {title}
        </h2>
        <button
          onClick={onClose}
          aria-label="Tutup"
          className="rounded-full p-2 hover:bg-[#14202B]/5 focus-visible:outline-2 focus-visible:outline-[#2F5BFF]"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
      <div className="max-h-[calc(85vh-5.5rem)] overflow-y-auto p-5 sm:p-6">{children}</div>
    </dialog>
  );
}

/* ---------- Konten Knowledge Base & FAQ ---------- */
type Item = { id: string; kind: "kb" | "faq"; cat: string; title: string; body: (string | string[])[] };

const ITEMS: Item[] = [
  {
    id: "kb-nextjs",
    kind: "kb",
    cat: "Teknologi",
    title: "Kenapa Next.js membuat website terasa cepat",
    body: [
      "Next.js menyiapkan halaman di server atau saat build, sehingga browser langsung menerima HTML yang siap tampil. Pengunjung tidak menunggu JavaScript selesai dijalankan baru melihat konten.",
      ["Gambar dioptimasi otomatis (ukuran dan format menyesuaikan perangkat).", "Kode hanya dimuat per halaman, bukan sekaligus.", "Konten mudah dibaca mesin pencari karena sudah ada di HTML."],
      "Hasilnya: loading lebih singkat, skor Lighthouse lebih baik, dan peluang lebih besar untuk tampil di Google.",
    ],
  },
  {
    id: "kb-seo",
    kind: "kb",
    cat: "SEO",
    title: "Apa saja yang termasuk SEO teknis",
    body: [
      "Setiap paket sudah mencakup fondasi SEO teknis. Ini yang dikerjakan:",
      ["Meta title & description per halaman", "Open Graph (tampilan saat link dibagikan)", "Sitemap dan robots.txt", "Struktur heading yang benar", "Gambar dengan teks alternatif dan ukuran ringan", "Schema dasar (Organization / Product) bila relevan"],
      "Yang tidak termasuk: riset kata kunci, penulisan artikel, dan link building. Untuk itu tersedia add-on SEO copywriting & konten. Perlu dicatat, peringkat Google tidak bisa dijamin karena bergantung pada kompetisi dan konsistensi konten.",
    ],
  },
  {
    id: "kb-hosting",
    kind: "kb",
    cat: "Operasional",
    title: "Domain, hosting, dan biaya di luar paket",
    body: [
      "Harga paket adalah biaya pembuatan website. Biaya berikut dibayar langsung ke penyedianya, atas nama Anda:",
      ["Domain (tahunan)", "Hosting / platform deploy seperti Vercel, Netlify, atau VPS", "Biaya per transaksi payment gateway (toko online)", "Layanan pihak ketiga berbayar seperti email marketing, CRM, atau API ongkir tertentu"],
      "Kami membantu proses setup dan mengarahkan pilihan yang sesuai dengan kebutuhan serta trafik Anda. Akun dibuat atas nama Anda supaya kepemilikan jelas.",
    ],
  },
  {
    id: "kb-revisi",
    kind: "kb",
    cat: "Alur kerja",
    title: "Revisi mayor vs revisi minor",
    body: [
      "Revisi mayor mengubah arah atau struktur: tata letak seksi, alur halaman, gaya visual, atau menambah fitur baru. Jatahnya 2 kali.",
      "Revisi minor menyempurnakan tanpa mengubah struktur: teks, warna, ukuran, penggantian gambar, jarak antar elemen. Jumlahnya tidak dibatasi selama masa pengerjaan.",
      "Tips: kumpulkan seluruh masukan dari semua pihak dalam satu daftar sebelum dikirim. Satu putaran revisi yang lengkap dihitung sebagai satu kali, sehingga jatah mayor tidak cepat habis.",
    ],
  },
  {
    id: "kb-materi",
    kind: "kb",
    cat: "Alur kerja",
    title: "Materi yang perlu Anda siapkan sebelum mulai",
    body: [
      "Keterlambatan proyek paling sering berasal dari materi yang belum siap. Siapkan:",
      ["Logo (SVG/PNG) dan panduan warna bila ada", "Teks per seksi, atau gunakan add-on copywriting", "Foto produk / tim dengan resolusi memadai", "Akses domain dan akun yang akan dihubungkan (WhatsApp, CRM, payment gateway)", "Satu orang penanggung jawab yang bisa memberi keputusan"],
      "Untuk toko online, tambahkan data produk (nama, harga, stok, berat, foto) dalam format spreadsheet agar bisa diimpor sekaligus.",
    ],
  },
  {
    id: "kb-payment",
    kind: "kb",
    cat: "Toko online",
    title: "Memilih payment gateway dan cek ongkir",
    body: [
      "Transfer manual / WhatsApp cocok untuk volume kecil: tanpa biaya per transaksi, tetapi konfirmasi dilakukan manual.",
      "Payment gateway seperti Midtrans atau Xendit memverifikasi pembayaran otomatis dan mendukung VA, e-wallet, kartu, dan PayLater. Ada proses pendaftaran bisnis dan biaya per transaksi dari penyedia.",
      "Cek ongkir otomatis (RajaOngkir API) menghitung tarif sesuai berat dan tujuan. Ketersediaan kurir dan batas penggunaan mengikuti paket langganan API yang Anda pilih.",
    ],
  },
  {
    id: "faq-waktu",
    kind: "faq",
    cat: "Waktu",
    title: "Kapan proyek mulai dikerjakan?",
    body: [
      "Hitungan hari kerja dimulai setelah DP 50% diterima dan materi awal (brief, logo, teks) lengkap. Jika materi menyusul, jadwal ikut bergeser.",
    ],
  },
  {
    id: "faq-edit",
    kind: "faq",
    cat: "Pengelolaan",
    title: "Bisakah saya mengubah isi website sendiri?",
    body: [
      "Pada paket tanpa CMS, perubahan konten dilakukan di kode, sehingga paling mudah lewat kami. Jika Anda ingin mengubah sendiri, tambahkan add-on Headless CMS (Sanity, Strapi, atau WordPress). Toko online sudah dilengkapi dashboard admin untuk produk dan order.",
    ],
  },
  {
    id: "faq-owner",
    kind: "faq",
    cat: "Legal",
    title: "Siapa pemilik source code dan akunnya?",
    body: [
      "Setelah pelunasan, source code, desain, dan seluruh akun (domain, hosting, repository) menjadi milik Anda. Library open-source tetap mengikuti lisensinya masing-masing.",
    ],
  },
  {
    id: "faq-upgrade",
    kind: "faq",
    cat: "Paket",
    title: "Bisakah naik paket di tengah jalan?",
    body: [
      "Bisa. Selisih harga paket dihitung dari bagian yang sudah dikerjakan, dan jadwal disesuaikan. Hal yang sama berlaku bila Anda menambah fitur yang belum ada di scope awal.",
    ],
  },
  {
    id: "faq-change",
    kind: "faq",
    cat: "Scope",
    title: "Bagaimana jika permintaan melebihi scope?",
    body: [
      "Permintaan di luar daftar \"Termasuk\" dicatat sebagai change request. Kami kirim estimasi biaya dan dampak jadwalnya terlebih dulu, dan baru dikerjakan setelah Anda setuju.",
    ],
  },
  {
    id: "faq-bug",
    kind: "faq",
    cat: "Support",
    title: "Bagaimana jika ada bug setelah go-live?",
    body: [
      "Bug dari pekerjaan kami diperbaiki tanpa biaya selama masa support paket (Starter Store 1 bulan, Pro 3 bulan, Flagship 6 bulan, Premium 3D 1 bulan maintenance). Setelah itu tersedia paket maintenance terpisah.",
    ],
  },
  {
    id: "faq-bayar",
    kind: "faq",
    cat: "Pembayaran",
    title: "Bagaimana skema pembayarannya?",
    body: [
      "DP 50% sebelum proyek dimulai, dan pelunasan 50% setelah proyek selesai diuji dan siap go-live. Angka final dipastikan pada proposal setelah diskusi kebutuhan.",
    ],
  },
  {
    id: "faq-umkm",
    kind: "faq",
    cat: "Diskon",
    title: "Bagaimana syarat diskon 50% untuk UMKM?",
    body: [
      "Usaha mikro, kecil, dan menengah mendapat diskon 50% dari total biaya proyek, termasuk add-on.",
      ["Siapkan bukti usaha yang bisa diverifikasi, misalnya NIB, surat izin usaha mikro, atau profil usaha aktif.", "Diskon berlaku untuk satu proyek per usaha dan tidak digabung dengan promo lain.", "DP 50% dan pelunasan dihitung dari total setelah diskon."],
      "Verifikasi dilakukan sebelum DP, sehingga angka pada proposal sudah final.",
    ],
  },
];

/* ---------- Pusat bantuan ---------- */
export function HelpCenter() {
  const [tab, setTab] = useState<"kb" | "faq">("kb");
  const [q, setQ] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);

  const list = useMemo(() => {
    const s = q.trim().toLowerCase();
    return ITEMS.filter(
      (i) =>
        i.kind === tab &&
        (!s || (i.title + i.cat + i.body.flat().join(" ")).toLowerCase().includes(s))
    );
  }, [tab, q]);
  const current = ITEMS.find((i) => i.id === openId);

  return (
    <section aria-labelledby="help" className="mt-20">
      <h2 id="help" className="text-3xl font-bold sm:text-4xl" style={{ fontFamily: "var(--font-display)" }}>
        Pusat bantuan
      </h2>
      <p className="mt-2 max-w-xl text-[#4A5968]">Jawaban untuk pertanyaan yang paling sering muncul sebelum proyek dimulai.</p>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <div role="tablist" className="inline-flex rounded-full bg-white p-1 ring-1 ring-[#14202B]/10">
          {(
            [
              ["kb", "Knowledge base", BookOpen],
              ["faq", "FAQ", HelpCircle],
            ] as const
          ).map(([k, label, Icon]) => (
            <button
              key={k}
              role="tab"
              aria-selected={tab === k}
              onClick={() => setTab(k)}
              className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold focus-visible:outline-2 focus-visible:outline-[#2F5BFF] ${
                tab === k ? "bg-[#14202B] text-white" : "text-[#4A5968]"
              }`}
            >
              <Icon className="h-4 w-4" aria-hidden /> {label}
            </button>
          ))}
        </div>
        <label className="relative min-w-55 flex-1 sm:max-w-sm">
          <span className="sr-only">Cari di pusat bantuan</span>
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#4A5968]" aria-hidden />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Cari, mis. hosting, revisi, SEO"
            className="w-full rounded-full bg-white py-2.5 pl-9 pr-4 text-sm ring-1 ring-[#14202B]/10 focus-visible:outline-2 focus-visible:outline-[#2F5BFF]"
          />
        </label>
      </div>

      {list.length === 0 ? (
        <p className="mt-6 rounded-xl bg-white p-5 text-sm text-[#4A5968] ring-1 ring-[#14202B]/10">
          Tidak ada hasil untuk &ldquo;{q}&rdquo;. Coba kata kunci lain atau tanyakan langsung lewat WhatsApp.
        </p>
      ) : (
        <ul className="mt-6 grid gap-3 md:grid-cols-2">
          {list.map((i) => (
            <li key={i.id}>
              <button
                onClick={() => setOpenId(i.id)}
                className="flex w-full items-center justify-between gap-3 rounded-xl bg-white p-4 text-left ring-1 ring-[#14202B]/10 transition hover:ring-[#2F5BFF]/60 focus-visible:outline-2 focus-visible:outline-[#2F5BFF]"
              >
                <span>
                  <span className="block text-xs font-medium text-[#2F5BFF]">{i.cat}</span>
                  <span className="mt-0.5 block font-semibold">{i.title}</span>
                </span>
                <ChevronRight className="h-4 w-4 shrink-0 text-[#4A5968]" aria-hidden />
              </button>
            </li>
          ))}
        </ul>
      )}

      <Dialog open={!!current} onClose={() => setOpenId(null)} title={current?.title ?? ""}>
        {current && (
          <>
            <div className="space-y-4 text-[15px] leading-relaxed">
              {current.body.map((b, idx) =>
                Array.isArray(b) ? (
                  <ul key={idx} className="space-y-2">
                    {b.map((li) => (
                      <li key={li} className="flex gap-2">
                        <Check className="mt-1 h-4 w-4 shrink-0 text-[#1FA37F]" aria-hidden />
                        {li}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p key={idx}>{b}</p>
                )
              )}
            </div>
            <a
              href={`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(`Halo, saya ingin bertanya tentang: ${current.title}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#14202B] px-4 py-2.5 text-sm font-semibold text-white"
            >
              <MessageCircle className="h-4 w-4" aria-hidden /> Masih ada pertanyaan? Tanya kami
            </a>
          </>
        )}
      </Dialog>
    </section>
  );
}

/* ---------- Ruang lingkup proyek ---------- */
type Scope = { include: string[]; phases: string[] };

const SCOPE: Record<string, Scope> = {
  starter: {
    include: [
      "Desain halaman berdasarkan template yang disesuaikan dengan brand Anda",
      "Pengembangan 5–6 seksi, responsif di mobile, tablet, dan desktop",
      "SEO teknis dasar (meta, sitemap, Open Graph)",
      "Tombol WhatsApp dan form kontak yang terhubung ke API / webhook",
      "Animasi dasar (fade-in, hover, smooth scroll)",
      "Deploy ke hosting Anda dan pengaturan domain",
      "Serah terima repository dan panduan singkat",
    ],
    phases: ["Brief & pengumpulan materi", "Penyusunan layout", "Pengembangan", "Uji & revisi", "Go-live & serah terima"],
  },
  interactive: {
    include: [
      "Seluruh scope Starter",
      "Desain UI/UX custom dan prototipe Figma yang disetujui sebelum coding",
      "Animasi scroll-triggered dan komponen interaktif (Framer Motion / GSAP)",
      "SVG morphing pada elemen yang disepakati",
      "Integrasi satu layanan CRM / email marketing",
      "Optimasi performa: zero layout shift dan FPS stabil",
    ],
    phases: ["Brief & riset referensi", "Desain Figma & persetujuan", "Pengembangan & animasi", "Uji performa & revisi", "Go-live & serah terima"],
  },
  immersive: {
    include: [
      "Seluruh scope Interactive",
      "Integrasi model 3D / WebGL canvas (aset 3D dari Anda atau add-on)",
      "Alur storytelling berbasis scroll, custom cursor, audio, dan shader sesuai konsep",
      "Fallback untuk perangkat yang tidak mendukung WebGL",
      "Setup analytics dan conversion tracking",
      "Maintenance dan priority support 1 bulan",
    ],
    phases: ["Konsep kreatif & storyboard", "Desain & persetujuan aset", "Pengembangan 3D & interaksi", "Uji lintas perangkat & revisi", "Go-live & maintenance"],
  },
  "s-starter": {
    include: [
      "Katalog hingga 50 produk dengan halaman detail dan pencarian",
      "Keranjang dan checkout via transfer manual / WhatsApp",
      "Ongkir flat rate atau opsi manual",
      "Dashboard admin sederhana untuk produk dan order",
      "Kupon sederhana dan export laporan Excel",
      "Support 1 bulan",
    ],
    phases: ["Brief & data produk", "Desain toko", "Pengembangan katalog & checkout", "Uji order & revisi", "Go-live & pelatihan admin"],
  },
  "s-pro": {
    include: [
      "Katalog hingga 500 produk dengan impor data massal",
      "Payment gateway (Midtrans / Xendit) dan cek ongkir RajaOngkir",
      "Manajemen order dan kontrol inventori penuh",
      "Kupon lanjutan, flash sale, dan bundle",
      "Akun pelanggan: login, wishlist, riwayat order",
      "Dashboard analytics dan laporan pendapatan",
      "Maintenance dan pelatihan 3 bulan",
    ],
    phases: ["Brief & arsitektur toko", "Desain & persetujuan", "Pengembangan & integrasi", "Uji pembayaran sandbox", "Go-live & pelatihan"],
  },
  "s-flagship": {
    include: [
      "Katalog tanpa batas dengan arsitektur monorepo / microservices",
      "Multi gateway, e-wallet, dan PayLater",
      "Pemilihan kurir otomatis dan tracking real-time",
      "Sinkron inventori multi-gudang dan integrasi ERP yang disepakati",
      "Aturan promo otomatis dan poin loyalitas bertingkat",
      "SSO Google / Apple, alamat tersimpan, area member",
      "Pelaporan lanjutan dan export analytics custom",
      "Priority support dan SLA server 6 bulan",
    ],
    phases: ["Discovery & analisis sistem", "Desain & spesifikasi teknis", "Pengembangan bertahap", "Uji beban & keamanan", "Go-live bertahap & SLA"],
  },
};

const EXCLUDE = [
  "Domain, hosting, dan biaya layanan pihak ketiga (gateway, API berbayar)",
  "Penulisan konten, foto, dan video (tersedia sebagai add-on atau Anda sediakan)",
  "Lisensi font, stok foto, atau musik berbayar",
  "Fitur di luar daftar \"Termasuk\" (diproses sebagai change request)",
  "Revisi mayor di atas 2 kali",
  "Maintenance di luar masa support paket",
];
const CLIENT = [
  "Logo, panduan brand, teks, dan foto sesuai jadwal",
  "Akses ke domain dan akun yang diperlukan",
  "Satu penanggung jawab untuk feedback dan persetujuan",
  "Respons feedback maksimal 2 hari kerja agar jadwal terjaga",
];

export function ScopeDialog({
  open,
  onClose,
  pkgId,
  pkgName,
}: {
  open: boolean;
  onClose: () => void;
  pkgId: string;
  pkgName: string;
}) {
  const s = SCOPE[pkgId];
  if (!s) return null;
  const Block = ({ title, items, tone }: { title: string; items: string[]; tone: "ok" | "no" | "plain" }) => (
    <section>
      <h3 className="mb-3 font-bold">{title}</h3>
      <ul className="space-y-2 text-sm">
        {items.map((t) => (
          <li key={t} className="flex gap-2">
            {tone === "ok" && <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#1FA37F]" aria-hidden />}
            {tone === "no" && <X className="mt-0.5 h-4 w-4 shrink-0 text-[#C2410C]" aria-hidden />}
            {tone === "plain" && <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-[#2F5BFF]" aria-hidden />}
            {t}
          </li>
        ))}
      </ul>
    </section>
  );
  return (
    <Dialog open={open} onClose={onClose} title={`Ruang lingkup: ${pkgName}`}>
      <div className="space-y-7">
        <Block title="Termasuk" items={s.include} tone="ok" />
        <Block title="Tidak termasuk" items={EXCLUDE} tone="no" />
        <Block title="Yang perlu Anda siapkan" items={CLIENT} tone="plain" />
        <section>
          <h3 className="mb-3 font-bold">Tahapan pengerjaan</h3>
          <ol className="space-y-2 text-sm">
            {s.phases.map((p, i) => (
              <li key={p} className="flex items-center gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#14202B] text-xs font-semibold text-white">
                  {i + 1}
                </span>
                {p}
              </li>
            ))}
          </ol>
        </section>
        <p className="rounded-xl bg-[#F2F5F8] p-4 text-sm text-[#4A5968]">
          Scope ini menjadi lampiran proposal. Perubahan setelah desain disetujui diproses sebagai change request dengan estimasi biaya dan jadwal yang Anda setujui lebih dulu.
        </p>
      </div>
    </Dialog>
  );
}