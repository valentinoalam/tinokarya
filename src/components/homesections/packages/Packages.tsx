'use client'
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);

import { cn } from "@/lib/utils";
import styles from "./Packages.module.css";
import ParallaxCard from '@/components/cards/paralax';
import { ThreeLines } from '@/components/lines/3lines';
import Link from 'next/link';
import { InteractiveHoverButton } from '@/components/ui/interactive-hover-button';

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
        <div className={cn(styles.grid, "w-[80%] mx-auto mt-4")} data-reveal-group>
          <ParallaxCard ref={cardsRef.current[0]} className={cn("relative border bg-card text-card-foreground cursor-pointer",
                'from-[#667db6] via-[#0082c8] to-[#667db6] border-[#667db6] hover:border-[#0082c8]',
                "transition-all duration-200 ease-in-out pricing-item relative text-white overflow-hidden bg-linear-to-r", `${styles.col} ${styles.now}`)}>
            
            <h3 className="text-left font-black text-xl">Paket Dasar</h3>
            
            <p className={styles.tag}>Website resmi berisi informasi usaha</p>
            <ul>
              <li>Profil usaha</li>
              <li>Layanan</li>
              <li>Portofolio</li>
              <li>Kontak</li>
            </ul>
          </ParallaxCard>
          <ParallaxCard ref={cardsRef.current[1]}  className={cn("relative border bg-card text-card-foreground cursor-pointer",
                'from-[#b69166] via-[#c8c500] to-[#b68a66] border-[#b69166] hover:border-[#c8c500]',
                "transition-all duration-200 ease-in-out pricing-item relative overflow-hidden bg-linear-to-r", `${styles.col} ${styles.later}`)}>
            <ThreeLines className='absolute opacity-80 -z-10' />
            <h3 className="text-left font-black text-xl">Bisa ditambahkan kemudian</h3>
            <p className={styles.tag}>Website berkembang mengikuti bisnis Anda</p>
            <ul>
              {LATER.map((t) => <li key={t}>{t}</li>)}
            </ul>
          </ParallaxCard>
        </div>
        <Link href={'/price'} className='flex place-self-center w-max mt-4'><InteractiveHoverButton className='bg-[#c8c500]/60 transition-all duration-200 ease-in-out hover:bg-[#667db6] hover:border-[#c8c500]'>Hitung disini</InteractiveHoverButton></Link>
        <p className={cn(styles.note, "text-center mx-auto w-max text-black")} data-reveal>
          Website bukan sekadar biaya untuk “punya halaman di internet”. Ia adalah aset digital yang
          dapat terus dikembangkan seiring pertumbuhan bisnis Anda.
        </p>
      </div>
    </section>
  );
}
