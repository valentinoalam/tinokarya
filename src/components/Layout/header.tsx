"use client"
import { useState, useEffect, useRef } from "react"
import type React from "react"
import "./cardboard-nav.css"
import "./landing-fold.css"

import { usePathname } from "next/navigation"
import {Link} from "@/i18n/navigation"
import { routing } from '@/i18n/routing';
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { Menu, X, Sparkles, ChevronRight, ChevronDown } from "lucide-react"
import { ShinyButton } from "@/components/ui/shiny-button"
import Logo from "../logo/Logo"
import { defaultNavData, flattenDefaultNavForMobile, landingPageData } from "./navigationData"
import { type NavItem, NavLink } from "./navigationMenu"
import dynamic from "next/dynamic"
import { cn } from "@/lib/utils"
import useScrollContext from "@/hooks/useScrollTracking"
import ShareButton from "../buttons/shareButton"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { LocaleSwitcher } from "../buttons/LocaleSwitcher"
import { ThemeToggle } from "../buttons/ThemeToggle"

gsap.registerPlugin(ScrollTrigger)

const DockNavigation = dynamic(() => import("./dockNav"), {
  ssr: false,
})

// Types for mobile navigation
interface MobileNavItem {
  label: string
  href: string
  intl: boolean
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>> | string | null
  children?: MobileNavItem[]
  type?: "dropdown" | "featured" | "button" | "link"
  description?: string
  image?: string
}

// Helper function to group navigation items for desktop (max 4 visible + "Other")
const groupDesktopNavItems = (navItems: NavItem[]): NavItem[] => {
  const maxVisibleItems = 4

  // Separate button items from regular items - use stable sorting
  const buttonItems = navItems.filter(item => item.type === "button")
  const regularItems = navItems.filter(item => item.type !== "button")

  // If regular items are within limit, return all items as-is
  if (regularItems.length <= maxVisibleItems) {
    return [...regularItems, ...buttonItems]
  }

  // Group regular items
  const visibleRegularItems = regularItems.slice(0, maxVisibleItems)


  return [...visibleRegularItems, ...buttonItems]
}

// Delay (detik) buka/tutup tiap lipatan, dibaca oleh CSS (--do / --dc)
const foldDelay = (open: number, close: number) =>
  ({ "--do": `${open}s`, "--dc": `${close}s` }) as React.CSSProperties

export default function Header() {
  const { isScrolled } = useScrollContext()
  const pathname = usePathname()
  const isDefaultRoute = routing.locales.some(
    (locale) => pathname === `/${locale}` || pathname === `/${locale}/`
  );
  const navigationData = defaultNavData

  const desktopNavigationData = groupDesktopNavItems(navigationData)
  const [isOpen, setIsOpen] = useState(false)
  const [isClosing, setIsClosing] = useState(false)
  const [spacerH, setSpacerH] = useState(0)

  const [isMobile, setIsMobile] = useState(false)
  const ctx = useRef<gsap.Context | null>(null)
  const navRef = useRef<HTMLElement>(null)

  // Get button items for separate display
  const buttonItems = navigationData.filter(item => item.type === "button")

  const closeMobileMenu = () => {
    const t = setTimeout(() =>  setIsOpen(false), 900)
    return () => clearTimeout(t)
  }

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768
      setIsMobile(mobile)
      if (!mobile) {
        setIsOpen(false)
      }
    }
    
    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // Initial animation
  useEffect(() => {
    ctx.current = gsap.context(() => {
      gsap.fromTo(
        navRef.current,
        {
          y: -100,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          ease: "power2.out",
          // Bersihkan sisa inline transform/translate/rotate/scale dari GSAP setelah animasi masuk
          // (kalau dibiarkan, `translate: none` inline menimpa animasi tutup di CSS)
          clearProps: "transform,translate,rotate,scale",
        },
      )
 
      gsap.fromTo(
        ".logo-container",
        { opacity: 0 },
        {
          opacity: 1,
          duration: 0.6,
          delay: 0.3,
          ease: "power2.out",
        },
      )
    })
    return () => {
      ctx.current?.revert()
      ctx.current = null
    }
  }, [])


    // Dengarkan sinyal dari <Footer /> (lihat footer.tsx)
  useEffect(() => {
    const onClosing = (e: Event) => {
      const closing = (e as CustomEvent<boolean>).detail
      // Simpan tinggi navbar agar layout tidak melompat saat navbar jadi fixed
      if (closing) setSpacerH(navRef.current?.offsetHeight ?? 0)
      setIsClosing(closing)
    }
    window.addEventListener("cb:closing", onClosing)
    return () => window.removeEventListener("cb:closing", onClosing)
  }, [])

  // Tutup menu mobile saat klik di luar navbar atau tekan Escape
  useEffect(() => {
    if (!isOpen) return
    const onDown = (e: PointerEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false)
    }
    document.addEventListener("pointerdown", onDown)
    document.addEventListener("keydown", onKey)
    return () => {
      document.removeEventListener("pointerdown", onDown)
      document.removeEventListener("keydown", onKey)
    }
  }, [isOpen])

  const renderMobileItem = (item: MobileNavItem) => {
    return (
      <MobileNavLink intl={item.intl}
        href={item.href}
        onClick={closeMobileMenu}
        className="cb-chip group flex items-center gap-3 w-full px-4 py-3 text-left"
      >
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {item.image && (
            <div className="relative w-12 h-12 rounded-md overflow-hidden shrink-0">
              <Image
                width={48}
                height={48}
                src={item.image}
                alt={item.label}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          {item.icon && (
            <div className="cb-tile">
              {typeof item.icon === "string"? item.icon : <item.icon className="w-4 h-4" />}
            </div>
          )}
          <div className="flex flex-col flex-1 min-w-0">
            <span className={cn("font-bold truncate", item.type === "featured" ? "text-xl" : "text-base")}>
              {item.label}
            </span>
            {item.description && (
              <span className="cb-ink-soft text-sm mt-1 line-clamp-2">{item.description}</span>
            )}
          </div>
        </div>
      </MobileNavLink>
    )
  }
  
  
  const alreadyFixed = isMobile && isScrolled

  const renderDesktopNav = () => (
    <header
      ref={navRef}
      data-scrolled={isScrolled}
      data-closing={isClosing && !alreadyFixed}
      className={cn(
        "cb-nav w-full z-50 transition-transform duration-300 overflow-x-clip",
        alreadyFixed ? "sticky lg:fixed top-0" : "relative", isClosing ? "scale-x-110 lg:scale-x-100 lg:fixed lg:-top-16 lg:translate-y-16": ""
      )}
    >
      {/* Lapisan kardus: tekstur + bentuk flap ujung tutup */}
      <div className="cb-bar" aria-hidden="true">
        <div className="cb-bar-shape cb-paper">
          <span className="cb-bar-flap" />
        </div>
      </div>

      <div className="container mx-auto px-4 lg:px-8 relative">
        <div className="flex items-center justify-between space-x-4 h-16">
          <div className="flex items-center logo-container">
            <Sparkles className="w-6 h-6 fill-accent" />
            <Link href="/" className="text-xl font-bold">
              <Logo />
            </Link>
          </div>

          <CardboardDesktopMenu items={desktopNavigationData} className="hidden md:flex max-w-4/6" />

          <div className="flex items-center gap-2">
            {buttonItems.length > 0 && (
              <div className="hidden md:flex items-center gap-2">
                {buttonItems.map((item) => (
                  <Button key={item.label}>{item.label}</Button>
                ))}
              </div>
            )}
            <ShinyButton
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden"
              aria-label="Toggle menu"
              aria-expanded={isOpen}
              aria-controls="cb-mobile-menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </ShinyButton>
            <div className="hidden md:flex items-center gap-3">
              <LocaleSwitcher />
              <ThemeToggle />
              <ShareButton />
            </div>
          </div>
        </div>
      </div>

      {/* Ruang untuk flap bawah */}
      <div style={{ height: "var(--cb-flap)" }} aria-hidden="true" />

      {renderMobileMenu()}
    </header>
  )

  // Menu mobile: tiga lipatan (header → daftar menu → aksi) terbuka ke bawah berurutan
  const renderMobileMenu = () => {
    const hasActions = buttonItems.length > 0

    return (
      <div
        id="cb-mobile-menu"
        className="cb-m md:hidden"
        data-cb-open={isOpen}
        aria-hidden={!isOpen}
      >
        {/* Lipatan 1: judul + mode */}
        <div className="cb-fold" style={foldDelay(0, 0.32)}>
          <Face className="md:hidden">
            <div className="flex items-center justify-between px-4 py-3">
              <div className="flex items-center gap-2 font-bold text-lg">
                <Sparkles className="w-5 h-5 fill-accent" />
                Menu
              </div>
              <div className="flex items-center gap-2">
                <LocaleSwitcher />
                <ThemeToggle />
                <ShareButton />
              </div>
            </div>
          </Face>

          {/* Lipatan 2: breadcrumb + daftar */}
          <div className="cb-fold" style={foldDelay(0.22, 0.16)}>
            {isDefaultRoute ? 
              <LandingFold
                items={landingPageData as MobileNavItem[]}
                onNavigate={closeMobileMenu}
                menuOpen={isOpen}
              />
              : <Face className="cb-crease">
                <MobileNavLink intl
                  href="/"
                  onClick={closeMobileMenu}
                  className="cb-chip group flex items-center gap-3 w-full px-4 py-3 text-left"
                >Home</MobileNavLink></Face>
              }
            <Face className="cb-crease" clip={hasActions ? undefined : "cb-clip-end"}>

              <div className="cb-m-scroll">
                <div className="p-3 space-y-2">
                  {navigationData.map((item, index) => (
                    <div
                      key={`${item.label}-${index}`}
                      className="cb-item"
                      style={{ "--i": index } as React.CSSProperties}
                    >
                      {renderMobileItem(item)}
                    </div>
                  ))}
                  
                </div>
              </div>
            </Face>
            
            {/* Lipatan 3: tombol aksi (flap ujung kardus) */}
            {hasActions && ( 
              <div className="cb-fold" style={foldDelay(0.44, 0)}>
                <Face className="cb-crease" clip="cb-clip-end" bodyClassName="pb-3">
                  <div className="p-4 space-y-2">
                    <div className="cb-ink-soft text-xs font-bold mb-2">Actions</div>
                    {buttonItems.map((item) => (
                      <Button
                        key={item.label}
                        className="w-full justify-center"
                        onClick={closeMobileMenu}
                      >
                        {item.label}
                      </Button>
                    ))}
                    <ShareButton className="w-full justify-center" />
                  </div>
                </Face>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  const renderFloatingDock = () =>
    isDefaultRoute && isScrolled && <DockNavigation isDefaultRoute={isDefaultRoute} />

  return (
    <>
      {isClosing && !alreadyFixed && <div aria-hidden="true" style={{ height: spacerH }} />}
      {renderDesktopNav()}
      {!isMobile && !isClosing && renderFloatingDock()}
    </>
  )
}

// Satu sisi kardus: tekstur + bayangan + (opsional) bentuk ujung
function Face({
  children,
  className,
  bodyClassName,
  clip,
}: {
  children: React.ReactNode
  className?: string
  bodyClassName?: string
  clip?: string
}) {
  return (
    <div className={cn("cb-face", className)}>
      <div className="cb-face-shadow" aria-hidden="true">
        <div className={cn("cb-paper cb-face-paper", clip)}>
          <span className="cb-shade" />
        </div>
      </div>
      <div className={cn("cb-face-body", bodyClassName)}>{children}</div>
    </div>
  )
}

// Menu desktop: submenu terbuka seperti flap kardus yang dilipat ke bawah
function CardboardDesktopMenu({ items, className }: { items: NavItem[]; className?: string }) {
  const pathname = usePathname()
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const lastInput = useRef<"mouse" | "touch" | "key">("mouse")
  const rootRef = useRef<HTMLUListElement>(null)

  // Tombol dirender terpisah di sisi kanan header
  const visible = items.filter(item => item.type !== "button")

  const clearTimer = () => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current)
      closeTimer.current = null
    }
  }
  const openMenu = (index: number) => {
    clearTimer()
    setOpenIndex(index)
  }
  const scheduleClose = () => {
    clearTimer()
    closeTimer.current = setTimeout(() => setOpenIndex(null), 180)
  }

  useEffect(() => {
    const onDown = (e: PointerEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpenIndex(null)
      }
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenIndex(null)
    }
    document.addEventListener("pointerdown", onDown)
    document.addEventListener("keydown", onKey)
    return () => {
      document.removeEventListener("pointerdown", onDown)
      document.removeEventListener("keydown", onKey)
      clearTimer()
    }
  }, [])

  return (
    <nav aria-label="Main" className={className}>
      <ul ref={rootRef} className="flex items-center gap-1">
        {visible.map((item, index) => {
          const isActive = !!item.href && pathname === item.href
            return (
              <li key={`${item.label}-${index}`}>
                <NavLink intl={item.intl}
                  href={item.href || "#"}
                  onClick={() => setOpenIndex(null)}
                  className={cn("cb-trigger", isActive && "is-active")}
                >
                  {item.label}
                </NavLink>
              </li>
            )
          
        })}
      </ul>
    </nav>
  )
}

// Navigasi landing page di mobile: satu lipatan kertas yang membuka/menutup ke bawah.
// Tiap item menempati satu baris penuh (tanpa ikon).
function LandingFold({
  items,
  onNavigate,
  menuOpen,
}: {
  items: MobileNavItem[]
  onNavigate: () => void
  menuOpen: boolean
}) {
  const [open, setOpen] = useState(false)

  // Setelah menu mobile selesai menutup, kembalikan lipatan ke keadaan tertutup
  // (ditunda agar tidak berebut animasi dengan penutupan menu utama)
  useEffect(() => {
    if (!menuOpen) setOpen(false)
  }, [menuOpen])

  const links = items.filter(item => !!item.href)
  if (links.length === 0) return null

  return (
    <>
      <Face className="cb-crease">
        <button
          type="button"
          className="lp-head"
          aria-expanded={open}
          aria-controls="cb-landing-fold"
          onClick={() => setOpen(v => !v)}
        >
          <span className="font-bold text-base">Landing Page</span>
          <span className="flex items-center gap-2">
            <span className="cb-ink-soft text-xs">{links.length} bagian</span>
            <ChevronDown className="lp-chev w-4 h-4" />
          </span>
        </button>
      </Face>

      <div id="cb-landing-fold" className="lp-fold cb-paper" data-open={open} aria-hidden={!open}>
        <div className="lp-fold-inner">
          <Face className="cb-crease">
            <div className="lp-list">
              {links.map((item, j) => (
                <div
                  key={`${item.label}-${j}`}
                  className="lp-item"
                  style={{ "--i": j } as React.CSSProperties}
                >
                  <MobileNavLink intl={item.intl}
                    href={item.href as string}
                    onClick={onNavigate}
                    className="cb-chip lp-chip justify-around"
                  >
                    <span >{item.label}</span>
                    {/* {typeof item.icon === "string" && <span className="w-1/2 "> {item.icon}</span>} */}
                  </MobileNavLink>
                </div>
              ))}
            </div>
          </Face>
        </div>
      </div>
    </>
  )
}

// Enhanced MobileNavLink component
function MobileNavLink({
  href,
  intl,
  children,
  className,
  onClick
}: {
  href: string;
  intl: boolean;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void
}) {
  return (
    <NavLink intl={intl}
      href={href}
      onClick={onClick}
      className={cn("transition-colors duration-200", className)}
    >
      {children}
    </NavLink>
  )
}