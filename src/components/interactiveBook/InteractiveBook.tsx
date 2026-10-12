'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Page from './page';
import './InteractiveBook.css';
import { gsap, useGSAP, MOTION_OK } from "@/lib/gsap";

// Harus sama dengan jumlah lembar di pageContents (page.tsx)
const TOTAL_PAGES = 5;

const NEW_LINE = "“Kami memahami masalah Anda, dan kami memiliki sesuatu yang dapat membantu.”";

// "View" = sisi buku yang sedang dilihat. Urutannya:
// 0 = sampul depan (kanan), 1 = sisi kiri setelah sampul dibuka, 2 = sisi kanan lembar berikutnya, dst.
// Genap = sisi kanan lembar ke-(view/2), ganjil = sisi kiri (balik) lembar ke-((view-1)/2).
const LAST_VIEW = TOTAL_PAGES * 2 - 1;
const COMPACT_QUERY = '(max-width: 899px)';

type Mode = 'wide' | 'compact';

const InteractiveBook = () => {
  const root = useRef<HTMLElement>(null);
  const oldRef = useRef<HTMLParagraphElement>(null);
  const newRef = useRef<HTMLParagraphElement>(null);
  const shifterRef = useRef<HTMLDivElement | null>(null);
  const pagesRef = useRef<(HTMLDivElement | null)[]>([]);
  const isFirstRun = useRef(true);

  const [view, setView] = useState(0);
  const [mode, setMode] = useState<Mode | null>(null); // null sampai terpasang di browser

  // Jumlah lembar yang sudah dibalik pada view ini
  const turned = Math.ceil(view / 2);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        // 1) Kalimat lama dicoret saat masuk layar.
        gsap.fromTo(
          oldRef.current,
          { textDecorationColor: "rgba(18,33,58,0)" },
          {
            textDecorationColor: "rgba(18,33,58,0.9)", duration: 0.9, ease: "power2.inOut",
            scrollTrigger: { trigger: oldRef.current, start: "top 80%", toggleActions: "play none none reverse" },
          }
        );

        // 2) Kalimat baru "menyala" kata demi kata mengikuti scroll.
        gsap.fromTo(
          "[data-word]",
          { opacity: 0.15 },
          {
            opacity: 1, ease: "none", stagger: 0.12,
            scrollTrigger: { trigger: newRef.current, start: "top 82%", end: "bottom 50%", scrub: true },
          }
        );
      });
      return () => mm.revert();
    },
    { scope: root }
  );
  // Deteksi layar: lebar (2 halaman) atau ringkas (1 halaman + tombol)
  useEffect(() => {
    const mq = window.matchMedia(COMPACT_QUERY);
    const update = () => setMode(mq.matches ? 'compact' : 'wide');
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    if (!mode) return;

    // Render pertama: langsung set posisi tanpa animasi
    const duration = isFirstRun.current ? 0 : 0.6;
    isFirstRun.current = false;

    // 1) Balik lembar: yang sudah dibalik menumpuk di kiri, yang belum menumpuk di kanan
    pagesRef.current.forEach((page, i) => {
      if (!page) return;
      const isTurned = i < turned;
      gsap.to(page, {
        rotateY: isTurned ? -180 : 0,
        zIndex: isTurned ? i : 1000 - i,
        duration,
        ease: 'power2.inOut',
        overwrite: 'auto',
      });
    });

    // 2) Geser buku agar bagian yang dilihat selalu di tengah layar.
    //    Posisi dasar: kotak buku (= 1 halaman) berada di tengah layar.
    //    xPercent 0   -> halaman kanan di tengah (sampul tertutup / tampilan 1 sisi kanan)
    //    xPercent 50  -> punggung buku di tengah (2 halaman terbuka)
    //    xPercent 100 -> halaman kiri di tengah (sampul belakang / tampilan 1 sisi kiri)
    let xPercent: number;
    if (mode === 'compact') {
      xPercent = view % 2 === 1 ? 100 : 0;
    } else if (turned === 0) {
      xPercent = 0;
    } else if (turned === TOTAL_PAGES) {
      xPercent = 100;
    } else {
      xPercent = 50;
    }

    if (shifterRef.current) {
      gsap.to(shifterRef.current, {
        xPercent,
        duration,
        ease: 'power2.inOut',
        overwrite: 'auto',
      });
    }
  }, [view, turned, mode]);

  const goNext = useCallback(() => {
    setView((v) =>
      mode === 'compact'
        ? Math.min(v + 1, LAST_VIEW) // tampilan 1 sisi: maju satu sisi
        : Math.min(2 * Math.ceil(v / 2) + 1, LAST_VIEW) // tampilan 2 sisi: balik satu lembar
    );
  }, [mode]);

  const goPrev = useCallback(() => {
    setView((v) =>
      mode === 'compact'
        ? Math.max(v - 1, 0)
        : Math.max(2 * Math.ceil(v / 2) - 2, 0)
    );
  }, [mode]);

  // Navigasi dengan keyboard
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') goNext();
      if (e.key === 'ArrowLeft') goPrev();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [goNext, goPrev]);

  return (
    <section className="book-stage" ref={root}>
      <div className="wrap lg:w-1/2 absolute left-0 -top-3">
        <h2 style={{ fontSize: "clamp(1.9rem, 4.2vw, 2.8rem)"}} className='max-w-[20ch] mb-8' data-reveal>Website bisa bercerita, bukan hanya menjual.</h2>
        <p className="hidden md:inline font-display tracking-wide font-medium leading-4 line-through decoration-3 text-blue-950 mx-2 max-w-[24ch]" style={{fontSize: "clamp(1.4rem, 3vw, 1.6rem)"}} ref={oldRef}>“Ini produk kami. Silakan beli.”</p>
        <p className="hidden md:inline font-display tracking-wide font-extrabold leading-18 mt-4" style={{fontSize: "clamp(1.9rem, 4.6vw, 3.3rem)"}} ref={newRef}>
          {NEW_LINE.split(" ").map((w, i) => (
            <span key={i}>
              <span data-word>{w}</span>{" "}
            </span>
          ))}
        </p>
      </div>
      <div ref={shifterRef} className="book-shifter">
        <div className="book">
          <div className="book__spine"></div>
          {[...Array(TOTAL_PAGES)].map((_, index) => (
            <Page
              key={index}
              index={index}
              ref={(el: HTMLDivElement | null) => {
                pagesRef.current[index] = el;
              }}
              iscover={index === 0 || index === TOTAL_PAGES - 1}
              nextPage={goNext}
              previousPage={goPrev}
            />
          ))}
        </div>
      </div>

      {mode === 'compact' && (
        <div className="book-nav">
          <button
            type="button"
            className="book-nav__btn opacity-35"
            onClick={goPrev}
            disabled={view === 0}
            aria-label="Halaman sebelumnya"
          >
            ‹ 
          </button>
          <span className="book-nav__count">{view + 1} / {LAST_VIEW + 1}</span>
          <button
            type="button"
            className="book-nav__btn opacity-35"
            onClick={goNext}
            disabled={view === LAST_VIEW}
            aria-label="Halaman berikutnya"
          >
             ›
          </button>
        </div>
      )}
    </section>
  );
};

export default InteractiveBook;