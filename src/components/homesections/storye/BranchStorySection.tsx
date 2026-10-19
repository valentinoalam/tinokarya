"use client";

import { useEffect, useRef, useState } from "react";
import { createStoryScene, STAGE_THRESHOLDS } from "./createStoryScene";
import { inter, geist, merriweather, playfair, display, body } from "@/config/fonts";

const STAGES = [
  { n: "01", title: "Toko Sederhana", sub: "Sudah ada pembeli, tampilannya apa adanya" },
  { n: "02", title: "+ Branding & Dekor", sub: "Orang mulai mengenal brand, bukan sekadar produk" },
  { n: "03", title: "+ Komputer & Kasir", sub: "Bisnis mulai punya ingatan: order, stok, pelanggan" },
  { n: "04", title: "+ Layanan Take Away", sub: "Pesan dulu, ambil tanpa antre, atau diantar kurir" },
  { n: "05", title: "+ Banyak Cabang", sub: "Satu brand, satu sistem, banyak toko" },
  { n: "∞", title: "Satu toko, banyak cabang.", sub: "Brand, sistem, dan data yang sama dibawa ke setiap toko—itulah aset bisnis Anda." },
];
const STEPS = ["Toko sederhana", "Branding & dekor", "Komputer & data", "Take away", "Banyak cabang", "Aset bisnis"];

export default function BranchStorySection() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const vizRef = useRef<HTMLDivElement>(null);
  const [stage, setStage] = useState(0);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (!canvasRef.current || !vizRef.current) return;
    const dispose = createStoryScene({
      canvas: canvasRef.current,
      container: vizRef.current,
      fonts: { serif: geist.style.fontFamily, sans: merriweather.style.fontFamily, hand: playfair.style.fontFamily },
      getProgress: () => {
        const el = sectionRef.current;
        if (!el) return 0;
        const r = el.getBoundingClientRect();
        return Math.min(1, Math.max(0, -r.top / (r.height - window.innerHeight)));
      },
      onStage: setStage,
      onError: () => setFailed(true),
    });
    return dispose;
  }, []);

  const jumpTo = (i: number) => {
    const el = sectionRef.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY + STAGE_THRESHOLDS[i] * (el.offsetHeight - window.innerHeight) + (i ? 4 : 0);
    window.scrollTo({ top, behavior: "smooth" });
  };

  const s = STAGES[stage];

  return (
    <section ref={sectionRef} className={`bs ${display.variable} ${inter.variable} ${body.variable}`} aria-label="Perjalanan bisnis dari toko sederhana menjadi banyak cabang">
      <style>{css}</style>
      <div className="bs-stick font-sans">
        <div className="bs-txt">
          <p className="bs-eyebrow">Perjalanan Bisnis</p>
          <h1 className="text-4xl font-bold">Dari Toko Sederhana Menjadi <em className="font-extrabold">Banyak Cabang</em></h1>
          
          <div className="bs-card">
            <div key={stage} className="bs-in" aria-live="polite">
              <div className="bs-num">{s.n}</div>
              <h2 className="bs-h2">{s.title}</h2>
              <p className="bs-sub">{s.sub}</p>
              {stage === 5 && <p className="bs-quote">“Dulu satu toko. Sekarang satu brand dengan sistem yang bisa diulang di banyak tempat.”</p>}
            </div>
          </div>
          <ol className="flex lg:hidden bs-steps">
            {STEPS.map((t, i) => (
              <li key={t} className={i === stage ? "cur on" : i < stage ? "on" : ""} onClick={() => jumpTo(i)}>
                <span>{t}</span>
              </li>
            ))}
          </ol>
          <div className="bs-hint" style={{ opacity: stage === 0 ? 1 : 0 }}>Gulir untuk membangun ↓</div>
        </div>

        <div className="bs-viz" ref={vizRef}>
          <canvas className="mask-[radial-gradient(500px_circle_at_center,white,transparent)]" ref={canvasRef} />
          <div className="bs-vig" />
          {failed && <p className="bs-fail">WebGL tidak tersedia di perangkat ini.</p>}
        </div>
        
      </div>
      
    </section>
  );
}

const css = `
.bs{--bg:#ffffff;--ink:#212123;--mut:#1c1810;--line:#d8d2c5;--acc:#d9622b;position:relative;height:700vh;background:var(--bg);color:var(--ink);font-family:var(--bs-sans),system-ui,sans-serif;-webkit-font-smoothing:antialiased}
@media (prefers-color-scheme:dark){.bs{--bg:#1b1b1d;--ink:#efeae0;--mut:#9d998f;--line:#39393b}}
.bs *{box-sizing:border-box}
.bs-stick{position:sticky;top:0;height:100vh;height:100svh;display:grid;grid-template-columns:45fr 55fr;overflow:hidden}
.bs-txt{padding:clamp(24px,4.5vw,76px);display:flex;flex-direction:column;justify-content:center;gap:clamp(14px,2.4vh,26px);position:relative;z-index:2}
.bs-eyebrow{font:600 12px/1 var(--bs-sans),sans-serif;letter-spacing:.18em;text-transform:uppercase;color:var(--acc);margin:0}
.bs-h1{font:400 clamp(36px,4.7vw,78px)/1.02 var(--bs-serif),Georgia,serif;letter-spacing:-.02em;margin:0}
.bs-h1 em{color:var(--acc);font-style:italic}
.bs-lead{font-size:clamp(15px,1.25vw,18px);line-height:1.6;color:var(--mut);max-width:34em;margin:0}
.bs-card{border-top:1px solid var(--line);padding-top:clamp(12px,2vh,22px);min-height:132px}
.bs-in{animation:bs-in .6s cubic-bezier(.2,.8,.2,1)}
@keyframes bs-in{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none}}
.bs-num{font:500 13px/1 ui-monospace,Menlo,monospace;color:var(--acc);letter-spacing:.1em}
.bs-h2{font:600 clamp(21px,2.1vw,31px)/1.15 var(--bs-sans),sans-serif;letter-spacing:-.015em;margin:10px 0 8px}
.bs-sub{font-size:clamp(15px,1.3vw,19px);line-height:1.45;color:var(--mut);margin:0}
.bs-quote{font:italic 400 clamp(15px,1.2vw,18px)/1.5 var(--bs-serif),Georgia,serif;margin:14px 0 0}
.bs-steps{list-style:none;margin:0;padding:0;display:flex;gap:6px}
.bs-steps li{flex:1;font-size:11.5px;line-height:1.3;color:var(--mut);border-top:2px solid var(--line);padding-top:8px;transition:.5s;cursor:pointer}
.bs-steps li.on{border-color:var(--ink);color:var(--ink)}
.bs-steps li.cur{border-color:var(--acc);color:var(--acc)}
.bs-hint{font:500 12px var(--bs-sans),sans-serif;color:var(--mut);letter-spacing:.1em;text-transform:uppercase;transition:opacity .4s}
.bs-viz{position:relative;min-height:0}
.bs-viz canvas{position:absolute;inset:0;width:100%;height:100%;display:block}
.bs-vig{position:absolute;inset:0;pointer-events:none;background:radial-gradient(ellipse 75% 70% at 50% 48%,transparent 55%,var(--bg) 100%)}
.bs-fail{position:absolute;inset:0;display:grid;place-items:center;margin:0;color:var(--mut)}
.bs-legend{position:absolute;right:clamp(10px,2vw,28px);top:50%;transform:translateY(-50%);list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:8px;pointer-events:none;z-index:2}
.bs-legend li{display:flex;list-style-type: none;align-items:center;gap:10px;font:600 12px/1 var(--bs-sans),sans-serif;letter-spacing:.07em;text-transform:uppercase;white-space:nowrap;padding:9px 13px;border-radius:99px;background:rgba(33,33,35,.92);color:#f6f1e8;opacity:.28;transition:opacity .5s,transform .5s}
.bs-legend i{width:8px;height:8px;border-radius:50%;background:#8a867c;transition:.5s}
.bs-legend li.on{opacity:1}
.bs-legend li.cur{opacity:1;transform:translateX(-6px)}
@media (max-width:820px){
 .bs-stick{grid-template-columns:1fr;grid-template-rows:54% 46%}
 .bs-viz{order:-1}
 .bs-txt{padding:14px 20px 18px;justify-content:flex-start;gap:10px}
 .bs-h1{font-size:125px}.bs-lead,.bs-eyebrow{display:none}
 .bs-steps li span{display:none}.bs-steps li{padding-top:0;height:4px;border-top-width:4px}
 .bs-card{min-height:0;padding-top:10px}
 .bs-h2{font-size:20px;margin:6px 0}.bs-sub{font-size:15px}
 .bs-quote{font-size:14px;margin-top:8px}
 .bs-legend{right:8px;gap:6px}.bs-legend li{padding:7px 10px;gap:8px}
}
@media (prefers-reduced-motion:reduce){.bs-in{animation:none}}
`;
