"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP, MOTION_OK } from "@/lib/gsap";

/**
 * Animasi scroll yang dipakai bersama lewat atribut data:
 *   data-reveal="up|fade|scale"  → elemen itu sendiri muncul saat masuk viewport
 *   data-reveal-group            → anak langsungnya muncul bergantian
 * Plus bilah progres scroll di bagian atas halaman.
 */
export default function ScrollAnimations() {
  const bar = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();

    mm.add(MOTION_OK, () => {
      const from = (type: string | undefined) => {
        if (type === "fade") return { autoAlpha: 0 };
        if (type === "scale") return { autoAlpha: 0, scale: 0.94 };
        return { autoAlpha: 0, y: 28 };
      };
      const to = { autoAlpha: 1, y: 0, scale: 1, clearProps: "transform" };

      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) => {
        gsap.fromTo(el, from(el.dataset.reveal), {
          ...to,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 88%", once: true },
        });
      });

      gsap.utils.toArray<HTMLElement>("[data-reveal-group]").forEach((group) => {
        gsap.fromTo(group.children, from(group.dataset.revealGroup || undefined), {
          ...to,
          duration: 0.35,
          ease: "power3.out",
          stagger: 0.09,
          scrollTrigger: { trigger: group, start: "top 88%", once: true },
        });
      });

      gsap.to(bar.current, {
        scaleX: 1,
        ease: "none",
        scrollTrigger: { start: 0, end: "max", scrub: 0.2 },
      });
    });

    // Setelah font termuat, tinggi layout berubah → hitung ulang posisi trigger.
    document.fonts?.ready.then(() => ScrollTrigger.refresh());

    return () => mm.revert();
  });

  return <div ref={bar} className="scroll-progress bottom-0" aria-hidden="true" />;
}
