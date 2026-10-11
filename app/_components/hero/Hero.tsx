"use client";

import { useRef } from "react";
import { gsap, useGSAP, MOTION_OK } from "@/lib/gsap";
import Button from "../../../src/components/buttons/Button";
import GoogleLogo from "./GoogleLogo";
import MapLens from "./MapLens";
import styles from "./Hero.module.css";

/** Memecah kalimat menjadi kata; tiap kata bermasker supaya bisa "naik" saat intro. */
function Words({ text }: { text: string }) {
  return (
    <>
      {text.split(" ").map((w, i) => (
        <span key={i}>
          <span className={styles.word}>
            <span className={styles.wordInner} data-hero="word">{w}</span>
          </span>{" "}
        </span>
      ))}
    </>
  );
}

export default function Hero() {
  const root = useRef<HTMLDivElement>(null);

  // Satu rangkaian animasi saat halaman dibuka.
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
        const clear = { clearProps: "transform" };

        tl.fromTo('[data-hero="topbar"]', { autoAlpha: 0, y: -16 }, { autoAlpha: 1, y: 0, duration: 0.6, ...clear })
          .fromTo(
            '[data-hero="map"]',
            { autoAlpha: 0, y: 60, rotate: 2.5 },
            { autoAlpha: 1, y: 0, rotate: 0, duration: 1.1, ease: "power4.out", ...clear },
            0.4
          )
          .fromTo(
            '[data-hero="word"]',
            { autoAlpha: 0, yPercent: 110 },
            { autoAlpha: 1, yPercent: 0, duration: 0.85, stagger: 0.045, ...clear },
            0.1
          )
          .fromTo(
            '[data-hero="logo"]',
            { autoAlpha: 0, scale: 0.4, rotate: -10 },
            { autoAlpha: 1, scale: 1, rotate: 0, duration: 0.9, ease: "back.out(2.2)", ...clear },
            0.55
          )
          .fromTo('[data-hero="lead"]', { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 0.8, ...clear }, 0.85)
          .fromTo('[data-hero="actions"]', { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 0.8, ...clear }, 1);
      });
      return () => mm.revert();
    },
    { scope: root }
  );

  return (
    <div id="hero" className={styles.hero} ref={root}>
      <div data-hero="topbar"></div>
      <div className="wrap">
        <div className={styles.grid}>
          
          <div data-hero="map">
            <MapLens lensSize={240} zoomDelta={2} />
            <p className={styles.note}>Ilustrasi. Pin dan posisi di peta bergantung pada data dan optimasi usaha Anda.</p>
          </div>
          <div>
            <h1 className={styles.title}>
              <Words text="Pelanggan mencari di" />
              <span className={styles.chip} data-hero="logo">
                <span className="sr-only">Google</span>
                <GoogleLogo className={styles.logo} />
              </span>{" "}
              {/* <span className={styles.word}>
                <span className={styles.wordInner} data-hero="word">.</span>
              </span>{" "} */}
              <Words text="Pastikan usaha Anda bisa ditemukan." />
            </h1>
            <div className="flex flex-row">
              <p className={styles.lead} data-hero="lead">
                Website resmi berisi informasi usaha: rumah digital yang menjelaskan siapa Anda, apa yang
                Anda tawarkan, dan apa yang membedakan Anda dari kompetitor.
              </p>
              <div className={styles.actions} data-hero="actions">
                <Button className="text-center w-full bg-green-500 border-accent-100 border h-max p-1 rounded-xl" variant="hero" wa>Konsultasi lewat WhatsApp</Button>
                <Button className="text-center w-max border bg-gray-100 h-max p-1 rounded-xl" variant="hero-ghost" href="#manfaat">Lihat manfaatnya</Button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
