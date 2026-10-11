"use client";

import { useRef, type ReactNode } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { waHref } from "@/lib/whatsapp";

type Props = {
  variant: "hero" | "hero-ghost" | "accent";
  children: ReactNode;
  className?: string;
  /** Tautan WhatsApp (nomor dari NEXT_PUBLIC_WA_NUMBER). */
  wa?: boolean;
  href?: string;
};

/** Tombol dengan efek magnetik halus (hanya untuk mouse, bukan layar sentuh). */
export default function Button({ variant, children, className, wa, href }: Props) {
  const ref = useRef<HTMLAnchorElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const mm = gsap.matchMedia();

      mm.add(
        "(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)",
        () => {
          const xTo = gsap.quickTo(el, "x", { duration: 0.6, ease: "power3" });
          const yTo = gsap.quickTo(el, "y", { duration: 0.6, ease: "power3" });

          const move = (e: PointerEvent) => {
            const r = el.getBoundingClientRect();
            xTo((e.clientX - (r.left + r.width / 2)) * 0.28);
            yTo((e.clientY - (r.top + r.height / 2)) * 0.4);
          };
          const leave = () => {
            xTo(0);
            yTo(0);
          };

          el.addEventListener("pointermove", move);
          el.addEventListener("pointerleave", leave);
          return () => {
            el.removeEventListener("pointermove", move);
            el.removeEventListener("pointerleave", leave);
          };
        }
      );

      return () => mm.revert();
    },
    { scope: ref }
  );

  const link = wa ? waHref() : href;

  return (
    <a
      ref={ref}
      className={`btn btn--${variant} ${className}`}
      href={link}
      {...(wa ? { target: "_blank", rel: "noopener" } : {})}
    >
      {children}
    </a>
  );
}
