"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP, MOTION_OK, MOTION_REDUCED } from "@/lib/gsap";
import styles from "./SearchMockup.module.css";

const QUERIES = [
  "jasa cuci mobil terdekat",
  "barbershop di kota Anda",
  "catering makanan tradisional",
  "jasa desain website untuk UMKM",
];

/**
 * Ilustrasi kolom pencarian dengan animasi mengetik (GSAP timeline).
 * Timeline hanya berjalan saat kartu terlihat di layar.
 */
export default function SearchMockup() {
  const root = useRef<HTMLDivElement>(null);
  const typed = useRef<HTMLSpanElement>(null);
  const result = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(MOTION_REDUCED, () => {
        if (typed.current) typed.current.textContent = QUERIES[0];
        gsap.set(result.current, { autoAlpha: 1, y: 0 });
      });

      mm.add(MOTION_OK, () => {
        const out = typed.current;
        const res = result.current;
        if (!out || !res) return;

        out.textContent = "";
        gsap.set(res, { autoAlpha: 0, y: 8 });

        const tl = gsap.timeline({ repeat: -1, paused: true });
        QUERIES.forEach((q, idx) => {
          const o = { n: 0 };
          const write = () => {
            out.textContent = q.slice(0, Math.round(o.n));
          };
          tl.to(o, { n: q.length, duration: q.length * 0.07, ease: "none", onUpdate: write }, idx === 0 ? 0.6 : ">0.4");
          if (idx === 0) tl.to(res, { autoAlpha: 1, y: 0, duration: 0.5, ease: "power2.out" });
          tl.to({}, { duration: 2.2 });
          tl.to(o, { n: 0, duration: q.length * 0.03, ease: "none", onUpdate: write });
        });

        const st = ScrollTrigger.create({
          trigger: root.current,
          start: "top 85%",
          end: "bottom 10%",
          onToggle: (self) => (self.isActive ? tl.play() : tl.pause()),
        });

        return () => {
          st.kill();
          tl.kill();
        };
      });

      return () => mm.revert();
    },
    { scope: root }
  );

  return (
    <div
      ref={root}
      className={styles.search}
      data-reveal="scale"
      role="img"
      aria-label="Ilustrasi pencarian Google: calon pelanggan mengetik kata kunci seperti jasa cuci mobil terdekat, lalu menemukan website sebuah usaha."
    >
      <div className={styles.bar} aria-hidden="true">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#12213A" strokeWidth="2.5" strokeLinecap="round">
          <circle cx="11" cy="11" r="7" />
          <path d="M20 20l-3.5-3.5" />
        </svg>
        <span>
          <span ref={typed}>{QUERIES[0]}</span>
          <span className={styles.caret} />
        </span>
      </div>

      <div className={styles.results} aria-hidden="true">
        <div className={styles.ghostres}><div className={styles.line} /><div className={`${styles.line} ${styles.short}`} /></div>
        <div ref={result} className={styles.ourres}>
          <div className={styles.url}>www.namausaha.com</div>
          <div className={styles.ttl}>Nama Usaha Anda — Website Resmi</div>
          <p className={styles.snip}>Profil usaha, layanan, portofolio, dan kontak. Hubungi kami lewat WhatsApp.</p>
        </div>
        <div className={styles.ghostres}><div className={styles.line} /><div className={`${styles.line} ${styles.short}`} /></div>
      </div>
      <p className={styles.note}>Ilustrasi. Posisi di hasil pencarian bergantung pada optimasi.</p>
    </div>
  );
}
