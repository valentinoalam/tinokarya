"use client";

import { useEffect, useId, useMemo, useRef, useState, type CSSProperties } from "react";
import s from "./Benefits.module.css";
import { cn } from "@/lib/utils";
type Props = {
  /** Indeks benefit aktif (0-3). Menentukan palet dan susunan goresan. */
  tone: number;
  /** Mulai menggambar goresan pertama setelah area ini masuk layar. */
  ready: boolean;
  /**
   * Gambar dasar mural (opsional). Satu URL untuk semua slide, atau array URL
   * (satu per slide). Warna tiap slide tetap dioleskan di atasnya.
   * Tanpa gambar, dasarnya warna polos.
   */
  image?: string | string[];
};
 
type Box = { w: number; h: number };
 
const css = (vars: Record<string, string | number>) => vars as CSSProperties;
const n1 = (v: number) => v.toFixed(1);
 
// Palet mural, selaras dengan screen saver tiap benefit.
const TONES = [
  { base: "#a9e0d6", ink: ["#5cc4b4", "#1f8a8a", "#17506e", "#f2c14e"] }, // dipercaya
  { base: "#f7cf8a", ink: ["#f4a43a", "#e0652f", "#a8360b", "#ffe7b0"] }, // ditemukan
  { base: "#a8e3b9", ink: ["#5fcb88", "#27905f", "#0c5a40", "#f6d365"] }, // menjawab
  { base: "#c9bcf5", ink: ["#a48cef", "#6a48d6", "#3f2780", "#f4a6c0"] }, // milik sendiri
];
 
// Kemiringan bingkai tiap slide, supaya tepinya berubah bentuk.
const MASK_TILT = [-2, 1.6, -1.2, 2.2];
 
// Pengacak deterministik: hasil sama di server dan klien, dan sama tiap render.
function rng(seed: number) {
  let a = seed;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
 
/** Jarak aman bingkai dari tepi kotak mural. Sudah memperhitungkan filter tepi kasar dan kemiringan. */
const framePad = (w: number) => Math.round(Math.min(64, Math.max(40, w * 0.05)));
 
/**
 * Goresan lebar berwarna putih untuk mask: bentuk "bingkai" dengan tepi kasar.
 * Semua goresan (termasuk ujung membulatnya) berada di dalam `framePad`,
 * jadi bingkai tidak pernah menyentuh batas section.
 */
function maskStrokes(tone: number, { w, h }: Box) {
  const r = rng(101 + tone * 97);
  const pad = framePad(w);
  const innerH = h - pad * 2;
  const sw = Math.min(150, Math.max(90, innerH / 5));
  const rows = Math.max(3, Math.round((innerH - sw) / (sw * 0.74)) + 1);
  const step = (innerH - sw) / (rows - 1);
  const wob = sw * 0.2;
  const left = pad + sw / 2;
  const right = w - pad - sw / 2;
 
  return Array.from({ length: rows }, (_, i) => {
    const y = pad + sw / 2 + i * step;
    // baris pertama hanya boleh melenceng ke bawah, baris terakhir ke atas
    const jitter = () => {
      const v = (r() - 0.5) * wob * 2;
      return i === 0 ? Math.abs(v) : i === rows - 1 ? -Math.abs(v) : v;
    };
    let x0 = left + r() * w * 0.05;
    let x1 = right - r() * w * 0.05;
    if (i % 2) [x0, x1] = [x1, x0]; // arah goresan bergantian seperti tangan pelukis
    const c1 = x0 + (x1 - x0) * 0.33;
    const c2 = x0 + (x1 - x0) * 0.66;
    const d =
      `M${n1(x0)} ${n1(y + jitter() * 0.5)}` +
      `C${n1(c1)} ${n1(y + jitter())} ${n1(c2)} ${n1(y + jitter())} ` +
      `${n1(x1)} ${n1(y + jitter() * 0.5)}`;
    return { d, width: sw * (0.92 + r() * 0.2) };
  });
}
 
/** Goresan warna, pita tipis, dan percikan yang terlihat di dalam bingkai. */
function paintStrokes(tone: number, { w, h }: Box) {
  const r = rng(7 + tone * 131);
  const ink = TONES[tone].ink;
  const u = Math.min(w, h);
  const long = Math.max(w, h);
  const base = w >= h ? 0 : Math.PI / 2; // layar sempit: goresan dominan vertikal
  const lean = tone % 2 ? 0.3 : -0.3;
 
  const curve = (len: number, bendK: number) => {
    const ang = base + lean + (r() - 0.5) * 1.2;
    const cx = w * (0.05 + r() * 0.9);
    const cy = h * (0.08 + r() * 0.84);
    const dx = (Math.cos(ang) * len) / 2;
    const dy = (Math.sin(ang) * len) / 2;
    const bend = (r() - 0.5) * len * bendK;
    const qx = cx - Math.sin(ang) * bend;
    const qy = cy + Math.cos(ang) * bend;
    return `M${n1(cx - dx)} ${n1(cy - dy)}Q${n1(qx)} ${n1(qy)} ${n1(cx + dx)} ${n1(cy + dy)}`;
  };
 
  const brushes = Array.from({ length: 9 }, () => ({
    d: curve(long * (0.22 + r() * 0.28), 0.35),
    width: u * (0.05 + r() * 0.11),
    color: ink[Math.floor(r() * ink.length)],
    opacity: 0.72 + r() * 0.25,
  }));
 
  const ribbons = Array.from({ length: 4 }, () => ({
    d: curve(long * (0.3 + r() * 0.3), 0.5),
    width: 5 + r() * 5,
    color: ink[2],
    opacity: 0.8,
  }));
 
  const dots = Array.from({ length: 12 }, () => ({
    x: w * (0.03 + r() * 0.94),
    y: h * (0.05 + r() * 0.9),
    r: 3 + r() * 8,
    color: ink[Math.floor(r() * ink.length)],
  }));
 
  return { brushes, ribbons, dots };
}
 
function pickImage(image: Props["image"], k: number): string | undefined {
  if (!image) return undefined;
  return Array.isArray(image) ? image[k % image.length] : image;
}
 
function useBox(ref: React.RefObject<HTMLElement | null>) {
  const [box, setBox] = useState<Box | null>(null);
 
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const read = () => {
      const rect = el.getBoundingClientRect();
      // dibulatkan per 40px supaya goresan tidak dibuat ulang di setiap piksel resize
      const w = Math.max(240, Math.round(rect.width / 40) * 40);
      const h = Math.max(240, Math.round(rect.height / 40) * 40);
      setBox((b) => (b && b.w === w && b.h === h ? b : { w, h }));
    };
    read();
    const ro = new ResizeObserver(read);
    ro.observe(el);
    return () => ro.disconnect();
  }, [ref]);
 
  return box;
}
 
export default function BenefitMural({ tone, ready, image }: Props) {
  const uid = useId().replace(/:/g, "");
  const ref = useRef<HTMLDivElement>(null);
  const box = useBox(ref);
 
  const sets = useMemo(
    () => (box ? TONES.map((_, k) => ({ mask: maskStrokes(k, box), paint: paintStrokes(k, box) })) : null),
    [box]
  );
 
  return (
    <div className={cn("mask-t-from-70%", s.mural)} ref={ref} data-ready={ready ? "true" : "false"} aria-hidden="true">
      {box && sets && (
        <svg viewBox={`0 0 ${box.w} ${box.h}`} preserveAspectRatio="none" focusable="false">
          <defs>
            {/* tepi bingkai: bristle kasar memanjang searah goresan */}
            <filter id={`${uid}-mrough`} x="-5%" y="-5%" width="110%" height="110%" colorInterpolationFilters="sRGB">
              <feTurbulence type="fractalNoise" baseFrequency="0.006 0.16" numOctaves="2" seed="4" result="n" />
              <feDisplacementMap in="SourceGraphic" in2="n" scale="26" xChannelSelector="R" yChannelSelector="G" />
            </filter>
            {/* tekstur sapuan kuas pada cat */}
            <filter id={`${uid}-prough`} x="-5%" y="-5%" width="110%" height="110%" colorInterpolationFilters="sRGB">
              <feTurbulence type="fractalNoise" baseFrequency="0.01 0.3" numOctaves="2" seed="9" result="n" />
              <feDisplacementMap in="SourceGraphic" in2="n" scale="10" xChannelSelector="R" yChannelSelector="G" />
            </filter>
            {/* butiran seperti dinding bertekstur */}
            <filter id={`${uid}-grain`} x="0" y="0" width="100%" height="100%">
              <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" />
              <feColorMatrix
                type="matrix"
                values="0 0 0 0 0.1  0 0 0 0 0.08  0 0 0 0 0.05  0 0 0 0.9 -0.35"
              />
            </filter>
 
            <mask id={`${uid}-frame`} maskUnits="userSpaceOnUse" x="0" y="0" width={box.w} height={box.h}>
              <g filter={`url(#${uid}-mrough)`}>
                {sets.map((set, k) => (
                  <g
                    key={k}
                    className={s.layer}
                    data-on={ready && k === tone ? "true" : "false"}
                    transform={`rotate(${MASK_TILT[k]} ${box.w / 2} ${box.h / 2})`}
                  >
                    {set.mask.map((m, i) => (
                      <path
                        key={i}
                        className={s.brush}
                        pathLength={1}
                        d={m.d}
                        fill="none"
                        stroke="#fff"
                        strokeWidth={m.width}
                        strokeLinecap="round"
                        style={css({ "--i": i })}
                      />
                    ))}
                  </g>
                ))}
              </g>
            </mask>
          </defs>
 
          <g mask={`url(#${uid}-frame)`}>
            {sets.map((set, k) => (
              <g key={k} className={s.layer} data-on={ready && k === tone ? "true" : "false"}>
                <rect width={box.w} height={box.h} fill={TONES[k].base} />
                {pickImage(image, k) && (
                  <>
                    <image
                      href={pickImage(image, k)}
                      x="0"
                      y="0"
                      width={box.w}
                      height={box.h}
                      preserveAspectRatio="xMidYMid slice"
                    />
                    {/* wash warna slide di atas gambar, agar nuansa tetap berganti */}
                    <rect
                      width={box.w}
                      height={box.h}
                      fill={TONES[k].base}
                      opacity=".55"
                      style={{ mixBlendMode: "multiply" }}
                    />
                  </>
                )}
                <g filter={`url(#${uid}-prough)`} fill="none" strokeLinecap="round">
                  {set.paint.brushes.map((b, i) => (
                    <path
                      key={`b${i}`}
                      className={s.brush}
                      pathLength={1}
                      d={b.d}
                      stroke={b.color}
                      strokeWidth={b.width}
                      opacity={b.opacity}
                      style={css({ "--i": i })}
                    />
                  ))}
                  {set.paint.ribbons.map((b, i) => (
                    <path
                      key={`r${i}`}
                      className={s.brush}
                      pathLength={1}
                      d={b.d}
                      stroke={b.color}
                      strokeWidth={b.width}
                      opacity={b.opacity}
                      style={css({ "--i": i + 5 })}
                    />
                  ))}
                </g>
                {set.paint.dots.map((d, i) => (
                  <circle
                    key={`d${i}`}
                    className={s.splat}
                    cx={d.x}
                    cy={d.y}
                    r={d.r}
                    fill={d.color}
                    style={css({ "--i": i })}
                  />
                ))}
              </g>
            ))}
            <rect width={box.w} height={box.h} filter={`url(#${uid}-grain)`} opacity=".28" />
          </g>
        </svg>
      )}
    </div>
  );
}
