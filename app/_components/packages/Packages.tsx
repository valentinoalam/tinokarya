'use client'
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);

import { cn } from "@/lib/utils";
import styles from "./Packages.module.css";

const LATER = [
  "Katalog produk", "Sistem pemesanan dan booking", "Artikel dan blog", "Formulir konsultasi",
  "Integrasi WhatsApp", "Newsletter", "Sistem pembayaran", "Berbagai otomatisasi bisnis",
];

export default function Packages() {
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  useEffect(() => {
      const scrollTriggers: ScrollTrigger[] = [];
  
      // Helper function to create scroll triggers
      const createScrollTrigger = (
        element: gsap.DOMTarget,
        animation: gsap.TweenVars,
        triggerConfig: ScrollTrigger.Vars
      ) => {
        const tl = gsap.fromTo(element, animation.from, animation.to);
        const st = ScrollTrigger.create({
          trigger: element,
          animation: tl,
          ...triggerConfig
        });
        scrollTriggers.push(st);
      };
  
      // Header animation
      if (titleRef.current) 
        createScrollTrigger(
          titleRef.current,
          { from: { opacity: 0, y: 50 }, to: { opacity: 1, y: 0, duration: 1 } },
          { start: "top 80%", toggleActions: "play none none reverse" }
        );
  
      if (subtitleRef.current)
        createScrollTrigger(
          subtitleRef.current,
          { from: { opacity: 0, y: 30 }, to: { opacity: 1, y: 0, duration: 1, delay: 0.2 } },
          { start: "top 80%", toggleActions: "play none none reverse" }
        );
  
      // Cards stagger animation
      if (cardsRef.current.length > 0) 
        cardsRef.current.forEach((card, index) => {
          if (card) {
            createScrollTrigger(
              card,
              { from: { opacity: 0, y: 50 }, to: { opacity: 1, y: 0, duration: 0.8, delay: index * 0.2 } },
              { start: "top 75%", toggleActions: "play none none reverse" }
            );
          }
        });
      
      return () => {
        scrollTriggers.forEach(st => st.kill());
      };
    }, []);
  return (
    <section id="paket">
      <div className="wrap flex flex-col gap-5">
        <h2 ref={titleRef} className="sec-title text-center font-black text-4xl" data-reveal>Mulai dari yang dasar. Kembangkan saat bisnis siap.</h2>
        <div className={cn(styles.grid, "w-[80%] mx-auto")} data-reveal-group>
          <div ref={el => { cardsRef.current[0] = el; }} className={`${styles.col} ${styles.now}`}>
            <h3 className="text-left font-black text-xl">Paket Dasar</h3>
            <p className={styles.tag}>Website resmi berisi informasi usaha</p>
            <ul>
              <li>Profil usaha</li>
              <li>Layanan</li>
              <li>Portofolio</li>
              <li>Kontak</li>
            </ul>
          </div>
          <div ref={el => { cardsRef.current[1] = el; }}  className={`${styles.col} ${styles.later}`}>
            <h3 className="text-left font-black text-xl">Bisa ditambahkan kemudian</h3>
            <p className={styles.tag}>Website berkembang mengikuti bisnis Anda</p>
            <ul>
              {LATER.map((t) => <li key={t}>{t}</li>)}
            </ul>
          </div>
        </div>
        <p className={cn(styles.note, "text-center mx-auto w-max")} data-reveal>
          Website bukan sekadar biaya untuk “punya halaman di internet”. Ia adalah aset digital yang
          dapat terus dikembangkan seiring pertumbuhan bisnis Anda.
        </p>
      </div>
    </section>
  );
}
