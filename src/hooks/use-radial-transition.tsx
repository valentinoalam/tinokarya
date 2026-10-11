"use client"

import type React from "react"
import { useCallback } from "react"
import { gsap } from "gsap"

type RadialOptions = {
  x: number
  y: number
  background?: string
  duration?: number
  delay?: number
}

/**
 * Creates a fullscreen overlay and runs a radial clip-path animation to reveal the UI underneath.
 * Flow: open the dialog/content first, then shrink overlay to reveal it.
 */
export function useRadialTransition() {
  const trigger = useCallback((opts: RadialOptions, onComplete?: () => void) => {
    if (typeof window === "undefined" || typeof document === "undefined") return

    const { x, y, background = "rgba(2, 6, 23, 0.96)", duration = 0.6, delay = 0 } = opts

    const vw = window.innerWidth
    const vh = window.innerHeight
    const r = Math.max(Math.hypot(x, y), Math.hypot(vw - x, y), Math.hypot(x, vh - y), Math.hypot(vw - x, vh - y))

    const el = document.createElement("div")
    el.setAttribute("data-radial-overlay", "true")
    Object.assign(el.style, {
      position: "fixed",
      inset: "0",
      zIndex: "9999",
      background,
      pointerEvents: "none",
      clipPath: `circle(${r}px at ${x}px ${y}px)`,
      willChange: "clip-path",
      WebkitClipPath: `circle(${r}px at ${x}px ${y}px)`,
    })

    document.body.appendChild(el)

    gsap.to(el, {
      delay,
      duration,
      ease: "power3.out",
      clipPath: `circle(0px at ${x}px ${y}px)`,
      WebkitClipPath: `circle(0px at ${x}px ${y}px)`,
      onComplete: () => {
        el.parentElement?.removeChild(el)
        onComplete?.()
      },
    })
  }, [])

  const triggerFromEvent = useCallback(
    (e: React.MouseEvent | React.TouchEvent, opts?: Omit<RadialOptions, "x" | "y">, onComplete?: () => void) => {
      let cx = window.innerWidth / 2
      let cy = window.innerHeight / 2
      if ("clientX" in e && typeof e.clientX === "number") {
        cx = e.clientX
        cy = e.clientY
      } else if ("touches" in e && (e as React.TouchEvent).touches?.[0]) {
        const t = (e as React.TouchEvent).touches[0]
        cx = t.clientX
        cy = t.clientY
      }
      trigger({ x: cx, y: cy, ...(opts || {}) }, onComplete)
    },
    [trigger],
  )

  const getMaxRadius = useCallback((x: number, y: number) => {
    const vw = window.innerWidth
    const vh = window.innerHeight
    return Math.max(Math.hypot(x, y), Math.hypot(vw - x, y), Math.hypot(x, vh - y), Math.hypot(vw - x, vh - y))
  }, [])

  const revealOnTarget = useCallback(
    (target: Element, x: number, y: number, duration = 0.6) => {
      const r = getMaxRadius(x, y)
      const el = target as HTMLElement
      if (!el) return
      el.style.willChange = "clip-path"
      gsap.fromTo(
        el,
        {
          clipPath: `circle(0px at ${x}px ${y}px)`,
          WebkitClipPath: `circle(0px at ${x}px ${y}px)`,
        },
        {
          duration,
          ease: "power2.out",
          clipPath: `circle(${r}px at ${x}px ${y}px)`,
          WebkitClipPath: `circle(${r}px at ${x}px ${y}px)`,
          onComplete: () => {
            // let the browser decide next; remove will-change
            el.style.willChange = ""
          },
        },
      )
    },
    [getMaxRadius],
  )

  const revealOnSelector = useCallback(
    (selector: string, x: number, y: number, duration = 0.6) => {
      const target = document.querySelector(selector)
      if (target) {
        revealOnTarget(target, x, y, duration)
        return true
      }
      return false
    },
    [revealOnTarget],
  )

  const revealAfterOpen = useCallback(
    (selector: string, x: number, y: number, duration = 0.6, attempts = 12) => {
      let tries = 0
      const tryAnim = () => {
        if (revealOnSelector(selector, x, y, duration)) return
        tries += 1
        if (tries < attempts) {
          requestAnimationFrame(tryAnim)
        }
      }
      requestAnimationFrame(tryAnim)
    },
    [revealOnSelector],
  )

  return {
    trigger, // overlay shrink fallback
    triggerFromEvent, // overlay shrink fallback
    revealOnTarget,
    revealOnSelector,
    revealAfterOpen,
  }
}
