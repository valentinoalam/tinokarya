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
import { useTranslations } from "next-intl";
import type { BenefitRow } from "@/i18n/types";
import BenefitMural from "./mural";
import { MagicText } from "@/components/ui/magic-text";

// Gambar dasar mural (opsional), mis. "/images/mural-wall.jpg" dari folder public.
// Boleh juga array 4 URL: satu gambar untuk tiap benefit.
const MURAL_IMAGE: string | string[] | undefined = [];
 
export default function Benefits() {
  const t = useTranslations("benefits");
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
  const ROWS = t.raw("rows");
  const next = () => setIndex((i) => (i + 1) % ROWS.length);
  const row: BenefitRow = ROWS[index];

  return (
    <section className={`${styles.band} ${stage.band}`} id="manfaat">
      <BenefitMural tone={index} ready={shown} image={MURAL_IMAGE} />
      <div className="wrap">
        <MagicText className="sec-title text-4xl text-center mb-2 font-black">{t("title")}</MagicText>

        <div className={stage.stage} ref={stageRef} data-tone={index} data-shown={shown}>
          

          <div className={stage.laptopCol}>
            
            <div className={stage.dots} role="group" aria-label="Pilih manfaat">
              {(t.raw("rows") as BenefitRow[]).map((r, i) => (
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