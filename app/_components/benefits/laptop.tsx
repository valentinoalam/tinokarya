"use client";

import { useId, type CSSProperties, type ReactNode } from "react";
import s from "./Benefits.module.css";

type Props = {
  /** Indeks benefit aktif (0-3). Menentukan screen saver yang tampil. */
  scene: number;
  onToggle: () => void;
  label: string;
};

const css = (vars: Record<string, string | number>) => vars as CSSProperties;

const GRADIENTS: [string, string][] = [
  ["#0f2a43", "#0e5e63"], // dipercaya
  ["#3a1f0e", "#8a4a12"], // ditemukan
  ["#0b3b2c", "#0f6a4a"], // menjawab
  ["#25164a", "#4b2f8f"], // milik sendiri
];

const MOTES: [number, number][] = [
  [104, 58], [372, 70], [96, 178], [380, 172], [318, 40], [142, 206],
];

// ---- Keyboard berperspektif -------------------------------------------
// Alas keyboard berbentuk trapesium: sempit di belakang, lebar di depan.
const SLOPE = 35 / 136;
const edgeL = (y: number) => 64 - (y - 236) * SLOPE;
const edgeR = (y: number) => 416 + (y - 236) * SLOPE;

// Lebar tiap tombol (satuan relatif); tiap baris dinormalisasi ke lebar penuh.
const KEY_ROWS: number[][] = [
  Array(14).fill(1),
  [...Array(13).fill(1), 2],
  [1.5, ...Array(12).fill(1), 1.5],
  [1.8, ...Array(11).fill(1), 2.2],
  [2.3, ...Array(10).fill(1), 2.7],
  [1.25, 1.25, 1.25, 1.25, 6.25, 1.25, 1.25, 1.25],
];
// Baris belakang lebih pendek dari baris depan, menambah kesan kedalaman.
const KEY_ROW_H = [0.6, 0.85, 0.95, 1, 1.05, 1.15];

function buildKeys(): string {
  const top = 255;
  const avail = 64;
  const gapY = 2.6;
  const gapX = 1.2;
  const unit = (avail - gapY * (KEY_ROWS.length - 1)) / KEY_ROW_H.reduce((a, b) => a + b, 0);
  let y = top;
  let d = "";
  KEY_ROWS.forEach((row, r) => {
    const yt = y;
    const yb = y + KEY_ROW_H[r] * unit;
    const total = row.reduce((a, b) => a + b, 0);
    const lt = edgeL(yt) + 13, rt = edgeR(yt) - 13;
    const lb = edgeL(yb) + 13, rb = edgeR(yb) - 13;
    let acc = 0;
    row.forEach((w) => {
      const f0 = acc / total;
      const f1 = (acc + w) / total;
      acc += w;
      const x0t = lt + (rt - lt) * f0 + gapX, x1t = lt + (rt - lt) * f1 - gapX;
      const x0b = lb + (rb - lb) * f0 + gapX, x1b = lb + (rb - lb) * f1 - gapX;
      d += `M${x0t.toFixed(1)} ${yt.toFixed(1)}L${x1t.toFixed(1)} ${yt.toFixed(1)}L${x1b.toFixed(1)} ${yb.toFixed(1)}L${x0b.toFixed(1)} ${yb.toFixed(1)}Z`;
    });
    y = yb + gapY;
  });
  return d;
}

const KEYS_D = buildKeys();

function Scene({ on, children }: { on: boolean; children: ReactNode }) {
  return (
    <g className={s.scene} data-on={on ? "true" : "false"}>
      {children}
    </g>
  );
}

function Motes({ color }: { color: string }) {
  return (
    <>
      {MOTES.map(([x, y], i) => (
        <circle
          key={i}
          className={`${s.sv} ${s.mote}`}
          cx={x}
          cy={y}
          r={i % 2 ? 2 : 3}
          fill={color}
          style={{ animationDelay: `${i * 0.8}s` }}
        />
      ))}
    </>
  );
}

export default function BenefitLaptop({ scene, onToggle, label }: Props) {
  // useId menghasilkan ":" yang merepotkan di url(#...), jadi dibersihkan.
  const uid = useId().replace(/:/g, "");
  const fill = (i: number) => `url(#${uid}-g${i})`;

  return (
    <button type="button" className={s.laptop} onClick={onToggle} aria-label={label}>
      <svg viewBox="0 0 480 400" aria-hidden="true" focusable="false">
        <defs>
          <clipPath id={`${uid}-screen`}>
            <rect x="74" y="24" width="332" height="204" rx="6" />
          </clipPath>
          <linearGradient id={`${uid}-deck`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#e9ebef" />
            <stop offset=".55" stopColor="#d3d6dc" />
            <stop offset="1" stopColor="#bec2c9" />
          </linearGradient>
          <linearGradient id={`${uid}-shade`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#000" stopOpacity=".3" />
            <stop offset="1" stopColor="#000" stopOpacity="0" />
          </linearGradient>
          <linearGradient id={`${uid}-glare`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#fff" stopOpacity=".13" />
            <stop offset="1" stopColor="#fff" stopOpacity="0" />
          </linearGradient>
          <filter id={`${uid}-blur`} x="-20%" y="-200%" width="140%" height="500%">
            <feGaussianBlur stdDeviation="6" />
          </filter>
          {GRADIENTS.map(([a, b], i) => (
            <linearGradient key={i} id={`${uid}-g${i}`} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor={a} />
              <stop offset="1" stopColor={b} />
            </linearGradient>
          ))}
        </defs>

        <ellipse cx="240" cy="388" rx="204" ry="8" className={s.lapShadow} filter={`url(#${uid}-blur)`} />

        {/* alas keyboard: tebal (sisi depan), permukaan aluminium, lekuk jempol */}
        <path
          transform="translate(0 5)"
          d="M64 236 H416 L449 366 Q451 372 443 372 H37 Q29 372 31 366 Z"
          fill="#8d919a"
        />
        <path
          d="M64 236 H416 L449 366 Q451 372 443 372 H37 Q29 372 31 366 Z"
          fill={`url(#${uid}-deck)`}
        />
        <path d="M38 371 H442" stroke="#fff" strokeOpacity=".75" strokeWidth="1.2" />
        <path d="M212 372 Q240 367 268 372" fill="none" stroke="#9a9ea7" strokeWidth="1.6" strokeLinecap="round" />
        <rect x="64" y="244" width="352" height="8" fill={`url(#${uid}-shade)`} />

        {/* sumur keyboard + tombol */}
        <path
          d="M68.4 250 H411.6 L430.7 324 H49.3 Z"
          fill="#1d1e22"
          stroke="#1d1e22"
          strokeWidth="3"
          strokeLinejoin="round"
        />
        <g className={s.keys}>
          <path d={KEYS_D} transform="translate(0 1.2)" fill="#0b0b0d" stroke="#0b0b0d" strokeWidth="1.2" strokeLinejoin="round" />
          <path d={KEYS_D} fill="#3a3c43" stroke="#3a3c43" strokeWidth="1.2" strokeLinejoin="round" />
        </g>

        {/* trackpad */}
        <polygon
          points="176,334 304,334 312,362 168,362"
          fill="#d9dce1"
          stroke="#a4a8b0"
          strokeWidth="1.4"
          strokeLinejoin="round"
        />

        {/* lid: rim aluminium tipis + bezel hitam + kamera */}
        <path d="M64 244 V28 Q64 12 80 12 H400 Q416 12 416 28 V244 Z" fill="#c4c8cf" />
        <path d="M66 244 V28 Q66 14 80 14 H400 Q414 14 414 28 V244 Z" fill="#0d0e11" />
        <circle cx="240" cy="19" r="2.7" fill="#1a1c22" stroke="#2c2f37" strokeWidth=".8" />
        <circle cx="240" cy="19" r="1" fill="#1f4468" />

        <g clipPath={`url(#${uid}-screen)`}>
          {/* 0. Dipercaya lebih cepat */}
          <Scene on={scene === 0}>
            <rect x="74" y="24" width="332" height="204" fill={fill(0)} />
            <Motes color="#5eead4" />
            {[0, 1, 2].map((i) => (
              <circle
                key={i}
                className={`${s.sv} ${s.ring}`}
                cx="240"
                cy="122"
                r="34"
                fill="none"
                stroke="#5eead4"
                strokeWidth="1.5"
                style={{ animationDelay: `${i * 1.3}s` }}
              />
            ))}
            <g className={`${s.sv} ${s.bob}`}>
              <path
                d="M240 78 L276 91 V120 C276 143 261 158 240 167 C219 158 204 143 204 120 V91 Z"
                fill="#e8fffb"
              />
              <path
                className={s.draw}
                pathLength={1}
                d="M224 120 L236 132 L258 106"
                fill="none"
                stroke="#0e5e63"
                strokeWidth="9"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </g>
            <text x="240" y="208" textAnchor="middle" className={s.screenLabel}>Terpercaya</text>
          </Scene>

          {/* 1. Ditemukan orang baru */}
          <Scene on={scene === 1}>
            <rect x="74" y="24" width="332" height="204" fill={fill(1)} />
            <Motes color="#fcd34d" />
            <rect x="108" y="46" width="264" height="30" rx="15" fill="#fff4dc" />
            <circle cx="128" cy="61" r="6" fill="none" stroke="#8a4a12" strokeWidth="2" />
            <path d="M132.5 65.5 L138 71" stroke="#8a4a12" strokeWidth="2" strokeLinecap="round" />
            <text x="148" y="65" className={s.query}>cuci mobil terdekat</text>
            {[0, 1, 2].map((i) => {
              const y = 94 + i * 38;
              const top = i === 0;
              return (
                <g key={i} className={s.row} style={css({ "--i": i })}>
                  <rect x="108" y={y} width="264" height="30" rx="9" fill={top ? "#fcd34d" : "rgba(255,255,255,.14)"} />
                  <circle cx="127" cy={y + 15} r="7" fill={top ? "#8a4a12" : "rgba(255,255,255,.4)"} />
                  <rect x="143" y={y + 8} width={top ? 120 : 96} height="5" rx="2.5" fill={top ? "#5b3511" : "rgba(255,255,255,.55)"} />
                  <rect x="143" y={y + 18} width={top ? 72 : 60} height="4" rx="2" fill={top ? "rgba(91,53,17,.55)" : "rgba(255,255,255,.3)"} />
                </g>
              );
            })}
            <text x="240" y="219" textAnchor="middle" className={s.screenLabel}>Ditemukan</text>
          </Scene>

          {/* 2. Menjawab pertanyaan pelanggan */}
          <Scene on={scene === 2}>
            <rect x="74" y="24" width="332" height="204" fill={fill(2)} />
            <Motes color="#86efac" />
            <g className={`${s.sv} ${s.pop}`} style={css({ "--d": "0s" })}>
              <rect x="108" y="44" width="156" height="42" rx="14" fill="#f0fff6" />
              <rect x="122" y="57" width="116" height="5" rx="2.5" fill="#0b3b2c" opacity=".7" />
              <rect x="122" y="69" width="72" height="5" rx="2.5" fill="#0b3b2c" opacity=".45" />
            </g>
            <g className={`${s.sv} ${s.pop}`} style={css({ "--d": ".9s" })}>
              <rect x="226" y="98" width="146" height="32" rx="14" fill="#86efac" />
              <rect x="240" y="111" width="96" height="5" rx="2.5" fill="#0b3b2c" opacity=".7" />
            </g>
            <g className={`${s.sv} ${s.pop}`} style={css({ "--d": "1.8s" })}>
              <rect x="108" y="142" width="64" height="28" rx="14" fill="#f0fff6" />
              {[0, 1, 2].map((i) => (
                <circle
                  key={i}
                  className={`${s.sv} ${s.typing}`}
                  cx={126 + i * 14}
                  cy="156"
                  r="3.5"
                  fill="#0f6a4a"
                  style={{ animationDelay: `${i * 0.15}s` }}
                />
              ))}
            </g>
            <rect className={`${s.sv} ${s.glow}`} x="140" y="184" width="200" height="30" rx="15" fill="none" stroke="#86efac" strokeWidth="2" />
            <rect x="140" y="184" width="200" height="30" rx="15" fill="#86efac" />
            <text x="240" y="203" textAnchor="middle" className={s.btnText}>Hubungi WhatsApp</text>
          </Scene>

          {/* 3. Sepenuhnya milik Anda */}
          <Scene on={scene === 3}>
            <rect x="74" y="24" width="332" height="204" fill={fill(3)} />
            <Motes color="#c4b5fd" />
            <g className={s.orbit}>
              <circle cx="240" cy="112" r="62" fill="none" stroke="rgba(255,255,255,.16)" strokeDasharray="3 5" />
              <circle cx="302" cy="112" r="7" fill="#c4b5fd" />
              <circle cx="209" cy="165.7" r="7" fill="#ddd6fe" />
              <circle cx="209" cy="58.3" r="7" fill="#a78bfa" />
            </g>
            <path
              className={`${s.sv} ${s.shackle}`}
              d="M222 104 V94 A18 18 0 0 1 258 94 V104"
              fill="none"
              stroke="#ede9fe"
              strokeWidth="7"
              strokeLinecap="round"
            />
            <rect x="210" y="102" width="60" height="46" rx="10" fill="#ede9fe" />
            <circle cx="240" cy="121" r="6" fill="#4b2f8f" />
            <rect x="237.5" y="124" width="5" height="13" rx="2.5" fill="#4b2f8f" />
            <text x="240" y="208" textAnchor="middle" className={s.screenLabel}>Milik Anda</text>
          </Scene>

          {/* kilatan singkat saat layar "terbangun" oleh klik */}
          <rect key={scene} className={s.flash} x="74" y="24" width="332" height="204" />
          {/* pantulan cahaya di kaca layar */}
          <path d="M74 24 H238 L146 228 H74 Z" fill={`url(#${uid}-glare)`} />
        </g>
        <rect x="74" y="24" width="332" height="204" rx="6" fill="none" stroke="#000" strokeOpacity=".55" strokeWidth="1.5" />

      </svg>
    </button>
  );
}