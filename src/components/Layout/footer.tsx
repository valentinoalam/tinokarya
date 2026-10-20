"use client"
import { useEffect, useRef, useState } from "react"
import type React from "react"
import "./cardboard-footer.css"

import Link from "next/link"
import { Barlow_Condensed } from "next/font/google"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { ArrowUp, Recycle, Umbrella, Wine } from "lucide-react"
import Logo from "../logo/Logo"
import { defaultNavData } from "./navigationData"
import { cn } from "@/lib/utils"

gsap.registerPlugin(ScrollTrigger)

// Huruf cetak kondensed khas kardus pengiriman
const printFont = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  display: "swap",
})

interface FooterLink {
  label: string
  href: string
}
interface FooterColumn {
  title: string
  links: FooterLink[]
}

// Kolom tautan diambil dari data navigasi yang sama dengan navbar
const buildColumns = (): FooterColumn[] => {
  const pages: FooterLink[] = []
  const groups: FooterColumn[] = []

  for (const item of defaultNavData) {
    if (item.type === "button") continue
    
    pages.push({ label: item.label, href: item.href })
    
  }

  return [...(pages.length ? [{ title: "Pages", links: pages }] : []), ...groups]
}

const MARKS = [
  { icon: Wine, label: "Fragile" },
  { icon: Umbrella, label: "Keep dry" },
]

interface FooterProps {
  /** Kalimat singkat yang dicetak di bawah logo (opsional) */
  tagline?: string
  /** Nama brand untuk aksesibilitas dan baris hak cipta (opsional) */
  brandName?: string
  className?: string
}

export default function Footer({ tagline, brandName, className }: FooterProps) {
  const bodyRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const rimRef = useRef<HTMLDivElement>(null)
  const [lifted, setLifted] = useState(false)
  const columns = buildColumns()
  const year = new Date().getFullYear()

  // Tanpa animasi bila pengguna meminta gerak dikurangi: footer biasa di akhir halaman
  useEffect(() => {
    function initLifted() {
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
      setLifted(!reduced)
    }
    initLifted()
  }, [])

  // Badan kardus naik dari bawah menutup section terakhir; navbar turun sebagai tutup
  useEffect(() => {
    if (!lifted) return
    const body = bodyRef.current
    const track = trackRef.current
    const rim = rimRef.current
    if (!body || !track || !rim) return
 
    let closing = false
    const getNav = () => document.querySelector<HTMLElement>(".cb-nav")
 
    const ctx = gsap.context(() => {
      // Tinggi flap tutup (dibaca dari CSS) -> badan naik sedikit lagi untuk menutupinya
      const flap = parseFloat(getComputedStyle(body).getPropertyValue("--cb-flap")) || 14
      const rimHeight = rim.offsetHeight
 
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: track,
          start: "top bottom",
          end: "bottom bottom",
          scrub: 0.4,
          invalidateOnRefresh: true,
          onUpdate: self => {
            const p = self.progress
            body.style.visibility = p > 0 ? "visible" : "hidden"
 
            // 1) Tutup (navbar) turun lebih dulu: 50% pertama
            getNav()?.style.setProperty("--cb-close", Math.min(1, p / 0.5).toFixed(3))
 
            const nowClosing = p > 0
            if (nowClosing !== closing) {
              closing = nowClosing
              window.dispatchEvent(new CustomEvent("cb:closing", { detail: nowClosing }))
            }
          },
        },
      })
 
      // 2) Badan naik dan bertemu tutup (70%)
      tl.fromTo(body, { y: () => window.innerHeight }, { y: 0, ease: "power1.out", duration: 0.7 })
        // 3) Badan naik sedikit lagi, menutup lipatan ujung tutup kardus (15%)
        .to(body, { y: -(flap + 1), ease: "power2.inOut", duration: 0.15 })
        // 4) Terakhir: penampang kardus (rim) tertutup navbar. Tingginya menyusut ke 0 dan
        //    background-nya berpatokan ke bawah, jadi gelombang tampak masuk ke bawah tepi navbar (15%)
        .fromTo(rim, { height: rimHeight }, { height: 0, ease: "power1.inOut", duration: 0.15 })
    })
 
    return () => {
      ctx.revert()
      getNav()?.style.removeProperty("--cb-close")
      if (closing) window.dispatchEvent(new CustomEvent("cb:closing", { detail: false }))
    }
  }, [lifted])
 
  return (
    <footer className={cn("cb-footer", printFont.className, className)}>
      <InkFilter />
 
      {/* Jarak scroll ekstra yang menggerakkan pengangkatan */}
      {lifted && <div ref={trackRef} className="cb-footer-track" aria-hidden="true" />}
 
      <div ref={bodyRef} className={cn("cb-footer-body", lifted && "is-lifted")}>
        <div ref={rimRef} className="cb-rim" aria-hidden="true" />
 
        <div className="cb-footer-face cb-paper">
          <span className="cb-seam cb-seam-l" aria-hidden="true" />
          <span className="cb-seam cb-seam-r" aria-hidden="true" />
 
          <div className="cb-footer-scroll no-scrollbar">
            <div className="cb-print">
              <div className="cb-print-top" aria-hidden="true">
                <div className="cb-this-up">
                  <span className="arrows">
                    <ArrowUp className="w-6 h-6" strokeWidth={3} />
                    <ArrowUp className="w-6 h-6 -ml-2" strokeWidth={3} />
                  </span>
                  This side up
                </div>
                <Stamp />
              </div>
 
              <div className="cb-print-logo">
                <Link href="/" aria-label={brandName ? `${brandName} home` : "Home"}>
                  <Logo />
                </Link>
              </div>
 
              {tagline && <p className="cb-print-tagline">{tagline}</p>}
 
              {columns.length > 0 && (
                <nav aria-label="Footer" className="cb-contents">
                  {columns.map(column => (
                    <div key={column.title} className="cb-col">
                      <h3>{column.title}</h3>
                      <ul>
                        {column.links.map(link => (
                          <li key={`${link.label}-${link.href}`}>
                            <Link href={link.href}>{link.label}</Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </nav>
              )}
 
              <div className="cb-print-bottom">
                <div className="cb-marks" aria-hidden="true">
                  {MARKS.map(({ icon: Icon, label }) => (
                    <div key={label} className="cb-mark">
                      <span className="cb-mark-box">
                        <Icon className="w-8 h-8" strokeWidth={2.2} />
                      </span>
                      {label}
                    </div>
                  ))}
                </div>
 
                <div className="cb-print-legal">
                  <Recycle className="w-6 h-6" strokeWidth={2.2} aria-hidden="true" />
                  <span>
                    &copy; {year}
                    {brandName ? ` ${brandName}` : ""}
                  </span>
                </div>
 
                <Barcode />
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
 
// Filter cetak: apa pun warna aslinya, isi jadi satu warna tinta dengan tepi sedikit
// kasar dan bintik tinta yang tidak merata, seperti cetak flexo di kardus.
function InkFilter() {
  return (
    <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true" focusable="false">
      <defs>
        <filter id="cb-ink" x="-2%" y="-2%" width="104%" height="104%" colorInterpolationFilters="sRGB">
          <feFlood floodColor="#2a1708" floodOpacity="0.92" result="ink" />
          <feComposite in="ink" in2="SourceAlpha" operator="in" result="shape" />
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="7" result="noise" />
          <feDisplacementMap
            in="shape"
            in2="noise"
            scale="1.8"
            xChannelSelector="R"
            yChannelSelector="G"
            result="rough"
          />
          <feColorMatrix
            in="noise"
            type="matrix"
            values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  -2.4 0 0 0 2.1"
            result="speckle"
          />
          <feComposite in="rough" in2="speckle" operator="in" />
        </filter>
      </defs>
    </svg>
  )
}
 
// Cap lingkaran "kardus bergelombang, dapat didaur ulang"
function Stamp() {
  return (
    <svg viewBox="0 0 100 100" className="cb-stamp" focusable="false">
      <defs>
        <path id="cb-stamp-arc" d="M50,50 m-37,0 a37,37 0 1,1 74,0 a37,37 0 1,1 -74,0" />
      </defs>
      <circle cx="50" cy="50" r="46" fill="none" stroke="currentColor" strokeWidth="3" />
      <circle cx="50" cy="50" r="27" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <text fontSize="10.5" fontWeight="700" fill="currentColor">
        <textPath href="#cb-stamp-arc" textLength="226" lengthAdjust="spacing">
          CORRUGATED BOARD · RECYCLABLE ·
        </textPath>
      </text>
      <text x="50" y="47" textAnchor="middle" fontSize="15" fontWeight="700" fill="currentColor">
        ECT
      </text>
      <text x="50" y="63" textAnchor="middle" fontSize="15" fontWeight="700" fill="currentColor">
        32
      </text>
    </svg>
  )
}
 
// Barcode dekoratif (bukan kode sungguhan)
const BARS = [2, 1, 1, 3, 1, 2, 2, 1, 3, 1, 1, 2, 1, 3, 2, 1, 1, 2, 3, 1, 1, 2, 1, 1, 3, 2, 1, 2, 1, 1, 3, 1, 2, 1, 1, 2, 2, 1, 3, 1]
 
function Barcode() {
  const unit = 1.6
  let x = 0
  const rects: React.ReactNode[] = []
  BARS.forEach((width, i) => {
    if (i % 2 === 0) {
      rects.push(<rect key={i} x={x} y={0} width={width * unit} height={44} fill="currentColor" />)
    }
    x += width * unit
  })
 
  return (
    <div className="cb-barcode-wrap" aria-hidden="true">
      <svg className="cb-barcode" viewBox={`0 0 ${x} 44`} preserveAspectRatio="none" focusable="false">
        {rects}
      </svg>
      <span className="cb-barcode-num">0 48213 77650 3</span>
    </div>
  )
}
