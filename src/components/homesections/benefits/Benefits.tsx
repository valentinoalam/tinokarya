"use client";

import { useEffect, useRef, useState } from "react";
import {
  DynamicContainer,
  DynamicDescription,
  DynamicDiv,
  DynamicIsland,
  DynamicIslandProvider,
  DynamicTitle,
} from "@/components/ui/dynamic-island";
import BenefitLaptop from "./laptop";
import styles from "./Benefits.module.css";
import stage from "./Benefits.module.css";
import BenefitMural from "./mural";
import { MagicText } from "@/components/ui/magic-text";

type Row = {
  title: string;
  sum: string;
  items: { lead: string; text: string }[];
  aside?: { lead: string; text: string };
};

const ROWS: Row[] = [
  {
    title: "Dipercaya lebih cepat",
    sum: "Kredibilitas, kepercayaan, dan loyalitas pelanggan tumbuh dari kesan yang serius.",
    items: [
      { lead: "Citra profesional.", text: "Alamat web resmi (domain sendiri) terlihat lebih sah dan dapat dipercaya dibandingkan usaha yang hanya memakai akun media sosial." },
      { lead: "Reputasi brand.", text: "Konsumen modern cenderung menganggap bisnis yang terdaftar di internet memiliki standar operasional yang lebih baik." },
      { lead: "Kesan keseriusan.", text: "Website menunjukkan pemilik serius menjalankan usahanya, dan membantu membangun hubungan yang baik dengan pelanggan." },
      { lead: "Loyalitas.", text: "Semakin pelanggan mengenal brand Anda, semakin besar rasa bangga dan kesetiaan mereka." },
    ],
  },
  {
    title: "Ditemukan orang baru",
    sum: "Orang yang belum pernah mendengar usaha Anda tetap bisa menemukannya lewat pencarian.",
    items: [
      { lead: "Buka 24 jam.", text: "Website bekerja sebagai toko digital: calon pelanggan bisa mencari informasi, melihat katalog, atau bertransaksi kapan saja." },
      { lead: "Jangkauan lebih luas.", text: "Tidak terbatas lokasi fisik. Usaha Anda bisa ditemukan pembeli dari luar kota, bahkan luar negeri." },
      { lead: "Muncul saat dicari.", text: "Lewat optimasi SEO, produk atau jasa Anda berpeluang tampil ketika orang mengetik kata kunci seperti “jasa cuci mobil terdekat”, “barbershop di kota Anda”, atau “catering makanan tradisional”." },
      { lead: "Trafik gratis dari calon pembeli yang serius.", text: "Mereka yang datang memang sedang mencari solusi atau produk yang Anda tawarkan." },
    ],
    aside: {
      lead: "Jujur saja:",
      text: "website tidak otomatis membuat bisnis berada di halaman pertama Google. Namun tanpa aset digital yang bisa ditemukan dan dioptimalkan, peluang ditemukan secara organik jauh lebih terbatas.",
    },
  },
  {
    title: "Menjawab pertanyaan pelanggan",
    sum: "Pusat informasi yang tersedia terus, bahkan saat Anda tidak memegang ponsel.",
    items: [
      { lead: "Informasi lengkap.", text: "Harga, spesifikasi, FAQ, dan alamat tersaji jelas, sehingga beban tim customer service berkurang." },
      { lead: "Lebih sedikit hambatan membeli.", text: "Semakin mudah pelanggan mendapat jawaban, semakin mudah mereka melangkah: menelepon, mengirim WhatsApp, memesan, atau datang langsung." },
      { lead: "Ajakan bertindak yang jelas.", text: "Tombol seperti “Beli Sekarang”, “Booking Online”, atau “Hubungi WhatsApp” memudahkan pelanggan langsung bertransaksi." },
    ],
  },
  {
    title: "Sepenuhnya milik Anda",
    sum: "Media sosial bagus untuk berinteraksi, tetapi ruangnya dikendalikan pihak lain.",
    items: [
      { lead: "Kontrol penuh atas konten dan brand.", text: "Katalog, cerita brand, dan tampilan tersusun sesuai karakter usaha Anda, tanpa terganggu iklan pesaing seperti yang sering terjadi di marketplace." },
      { lead: "Bebas dari perubahan algoritma.", text: "Website adalah aset pribadi, tidak bergantung pada kebijakan platform pihak ketiga." },
      { lead: "Data pelanggan.", text: "Kumpulkan email dan nomor WhatsApp untuk promosi langsung." },
      { lead: "Pahami perilaku pelanggan.", text: "Pasang alat analitik seperti Google Analytics untuk melihat produk yang paling diminati, asal pengunjung, dan cara mereka berbelanja." },
    ],
  },
];
// Gambar dasar mural (opsional), mis. "/images/mural-wall.jpg" dari folder public.
// Boleh juga array 4 URL: satu gambar untuk tiap benefit.
const MURAL_IMAGE: string | string[] | undefined = [];
 
export default function Benefits() {
  const [index, setIndex] = useState(0);
  const [shown, setShown] = useState(false);
  const stageRef = useRef<HTMLDivElement>(null);

  // Island baru dipasang saat area ini masuk layar, supaya animasi
  // membesarnya terlihat oleh pengunjung dan bukan terjadi saat halaman dimuat.
  useEffect(() => {
    const el = stageRef.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setShown(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const next = () => setIndex((i) => (i + 1) % ROWS.length);
  const row = ROWS[index];

  return (
    <section className={`${styles.band} ${stage.band}`} id="manfaat">
      <BenefitMural tone={index} ready={shown} image={MURAL_IMAGE} />
      <div className="wrap">
        <MagicText className="sec-title text-4xl text-end pr-20 mb-2 font-black">Yang berubah ketika usaha Anda punya website</MagicText>

        <div className={stage.stage} ref={stageRef} data-tone={index} data-shown={shown}>
          

          <div className={stage.laptopCol}>
            
            <div className={stage.dots} role="group" aria-label="Pilih manfaat">
              {ROWS.map((r, i) => (
                <button
                  key={r.title}
                  type="button"
                  className={stage.dot}
                  aria-label={r.title}
                  aria-pressed={i === index}
                  onClick={() => setIndex(i)}
                />
              ))}
            </div>
            {/* <p className={stage.hint}>Klik laptop untuk melihat manfaat</p> */}
            <BenefitLaptop
              scene={index}
              onToggle={next}
              label={`Ganti manfaat. Sedang tampil ${index + 1} dari ${ROWS.length}: ${row.title}`}
            />
            
          </div>

          <div className={stage.bubble} aria-live="polite">
            {shown && (
              <DynamicIslandProvider initialSize="benefit">
                <DynamicIsland id="benefit-island">
                  <DynamicContainer className={stage.container}>
                    {/* key membuat judul, ringkasan, dan daftar masuk lagi dengan animasi island */}
                    <div className={stage.panel} key={index}>
                      <DynamicTitle className={stage.title}>{row.title}</DynamicTitle>
                      <DynamicDescription className={stage.sum}>{row.sum}</DynamicDescription>
                      <DynamicDiv className={stage.items}>
                        <ul className={stage.list}>
                          {row.items.map((it) => (
                            <li key={it.lead}>
                              <strong>{it.lead}</strong> {it.text}
                            </li>
                          ))}
                        </ul>
                        {row.aside && (
                          <div className={stage.aside}>
                            <strong>{row.aside.lead}</strong> {row.aside.text}
                          </div>
                        )}
                      </DynamicDiv>
                    </div>
                  </DynamicContainer>
                </DynamicIsland>
              </DynamicIslandProvider>
            )}

            {/* Ekor bubble: sibling island (bukan child) agar tidak terpotong clip-path island */}
            <svg className={stage.tail} viewBox="0 0 28 32" aria-hidden="true" focusable="false">
              <path d="M28 3 C18 9 8 13 0 16 C8 19 18 23 28 29 Z" fill="currentColor" />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}