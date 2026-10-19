"use client";

import { useTranslations } from "next-intl";
import { useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import styles from "./Faq.module.css";

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
  const t = useTranslations("faq");
  const items = t.raw("items") as { q: string; a: string }[];
  return (
    <section className={styles.faq}>
      <div className="wrap">
        <h2 data-reveal>{t("title")}</h2>
        <div data-reveal-group>
          {items.map((it) => <FaqItem key={it.q} {...it} />)}
        </div>
      </div>
    </section>
  );
}
