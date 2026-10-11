"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import styles from "./Faq.module.css";
import { cn } from "@/lib/utils";

const ITEMS = [
  { q: "Apakah website otomatis muncul di halaman pertama Google?", a: "Tidak otomatis. Website memberi Anda aset yang bisa ditemukan dan dioptimalkan lewat SEO. Tanpa aset itu, peluang ditemukan secara organik jauh lebih terbatas." },
  { q: "Kalau sudah aktif di media sosial, apakah masih perlu website?", a: "Media sosial sangat berguna untuk berinteraksi dengan pelanggan, tetapi platformnya dikendalikan pihak lain. Website memberi ruang yang lebih bebas untuk membangun pengalaman brand Anda sendiri." },
  { q: "Apakah website bisa dikembangkan setelah paket dasar?", a: "Bisa. Website dapat berkembang mengikuti bisnis, misalnya dengan katalog produk, sistem pemesanan, blog, integrasi WhatsApp, newsletter, hingga sistem pembayaran." },
  { q: "Apa yang dimuat di Paket Dasar?", a: "Website resmi berisi informasi usaha: profil usaha, layanan, portofolio, dan kontak." },
];

function FaqItem({ q, a }: { q: string; a: string }) {
  const details = useRef<HTMLDetailsElement>(null);
  const body = useRef<HTMLDivElement>(null);
  const icon = useRef<HTMLSpanElement>(null);

  // <details> tetap dipakai (aksesibel tanpa JS), tinggi isinya dianimasikan GSAP.
  const toggle = (e: React.MouseEvent) => {
    const d = details.current, b = body.current, i = icon.current;
    if (!d || !b || !i) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return; // biarkan perilaku bawaan

    e.preventDefault();
    gsap.killTweensOf([b, i]);

    if (!d.open) {
      d.open = true;
      gsap.to(i, { rotate: 45, duration: 0.3 });
      gsap.fromTo(b, { height: 0, autoAlpha: 0 }, {
        height: "auto", autoAlpha: 1, duration: 0.45, ease: "power3.out",
        onComplete: () => ScrollTrigger.refresh(),
      });
    } else {
      gsap.to(i, { rotate: 0, duration: 0.3 });
      gsap.to(b, {
        height: 0, autoAlpha: 0, duration: 0.3, ease: "power2.in",
        onComplete: () => { d.open = false; ScrollTrigger.refresh(); },
      });
    }
  };

  return (
    <details ref={details} className={styles.item}>
      <summary onClick={toggle}>
        {q}
        <span ref={icon} className={styles.icon} aria-hidden="true">+</span>
      </summary>
      <div ref={body} className={styles.body}>
        <p>{a}</p>
      </div>
    </details>
  );
}

export default function Faq() {
  return (
    <section id="faq" className={cn(styles.faq, "justify-items-center")}>
      <div className="wrap">
        <h2 data-reveal>Pertanyaan yang sering muncul</h2>
        <div data-reveal-group>
          {ITEMS.map((it) => <FaqItem key={it.q} {...it} />)}
        </div>
      </div>
    </section>
  );
}
