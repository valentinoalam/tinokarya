'use client';

import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { ReactLenis, useLenis } from 'lenis/react';
import type Lenis from 'lenis';
import throttle from 'lodash.throttle';
// import { trackEvent } from '@/lib/utils';
import { useClientWindow } from './useClientWindow';

export interface ScrollToOptions {
  /** Offset dalam px. Positif = berhenti lebih bawah. Untuk sticky header, pakai nilai negatif. */
  offset?: number;
  /** Lompat langsung tanpa animasi */
  immediate?: boolean;
  /** Durasi animasi (detik) */
  duration?: number;
}

export interface ScrollContextType {
  scrollY: number;
  scrollDirection: 'up' | 'down' | null;
  scrollToPosition: (target: number | HTMLElement | string, options?: ScrollToOptions) => void;
  scrollToElement: (element: HTMLElement, offset?: number) => void;
  isOut1stScreen: boolean;
  isScrolled: boolean;
  isAtTop: boolean;
  isAtBottom: boolean;
}

const ScrollContext = createContext<ScrollContextType | undefined>(undefined);

const DEPTH_THRESHOLDS = [25, 50, 75, 100] as const;

export const ScrollProvider = ({ children }: { children: ReactNode }) => {
  return (
    <ReactLenis root>
      <ScrollProviderContent>{children}</ScrollProviderContent>
    </ReactLenis>
  );
};

const ScrollProviderContent = ({ children }: { children: ReactNode }) => {
  const { height: windowHeight } = useClientWindow();

  const [scrollY, setScrollY] = useState(0);
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down' | null>(null);
  const [isAtBottom, setIsAtBottom] = useState(false);

  const lastScrollY = useRef(0);
  const lastDirection = useRef<'up' | 'down' | null>(null);
  const lastAtBottom = useRef(false);
  const firedDepths = useRef<Set<number>>(new Set());

  // scrollY di-throttle supaya consumer tidak re-render ~60x/detik saat smooth scroll
  const throttledSetScrollY = useMemo(
    () => throttle((y: number) => setScrollY(y), 100, { leading: true, trailing: true }),
    []
  );

  useEffect(() => () => throttledSetScrollY.cancel(), [throttledSetScrollY]);

  const handleScroll = useCallback(
    (lenis: Lenis) => {
      const { scroll, direction, limit } = lenis;

      // 1. Posisi (dibulatkan + dedupe)
      const y = Math.round(scroll);
      if (y !== lastScrollY.current) {
        lastScrollY.current = y;
        throttledSetScrollY(y);
      }

      // 2. Arah — abaikan 0 agar arah terakhir dipertahankan
      if (direction !== 0) {
        const next = direction > 0 ? 'down' : 'up';
        if (next !== lastDirection.current) {
          lastDirection.current = next;
          setScrollDirection(next);
        }
      }

      // 3. Bottom — berbasis piksel, bukan persentase
      const nextAtBottom = scroll >= limit - 1;
      if (nextAtBottom !== lastAtBottom.current) {
        lastAtBottom.current = nextAtBottom;
        setIsAtBottom(nextAtBottom);
      }

      // 4. Scroll depth analytics
      if (limit > 0 && typeof window !== 'undefined') {
        try {
          const viewport = window.innerHeight;
          const percent = ((scroll + viewport) / (limit + viewport)) * 100;

          for (const threshold of DEPTH_THRESHOLDS) {
            // Pakai ">=" + Set agar threshold tidak terlewat saat lompat (mis. 20% → 60%)
            if (percent >= threshold - 0.5 && !firedDepths.current.has(threshold)) {
              firedDepths.current.add(threshold);
              // trackEvent({
              //   category: 'Engagement',
              //   action: 'Scroll Depth',
              //   label: `${threshold}%`,
              // });
            }
          }
        } catch (error) {
          console.error('Error tracking scroll:', error);
        }
      }
    },
    [throttledSetScrollY]
  );

  const lenis = useLenis(handleScroll);

  // Lenis tidak memicu event saat mount → hitung nilai awal (mis. halaman pendek = sudah di bottom)
  useEffect(() => {
    if (lenis) handleScroll(lenis);
  }, [lenis, handleScroll]);

  const scrollToPosition = useCallback(
    (target: number | HTMLElement | string, options?: ScrollToOptions) => {
      lenis?.scrollTo(target, { duration: 1.2, ...options });
    },
    [lenis]
  );

  // Kompatibel dengan API lama: offset lama = "kurangi dari posisi elemen"
  const scrollToElement = useCallback(
    (element: HTMLElement, offset = 0) => {
      if (!element) return;
      scrollToPosition(element, { offset: -offset });
    },
    [scrollToPosition]
  );

  const isOut1stScreen = scrollY > windowHeight / 2;
  const isScrolled = scrollY > 50;
  const isAtTop = scrollY <= 1;

  const contextValue = useMemo(
    () => ({
      scrollY,
      scrollDirection,
      scrollToPosition,
      scrollToElement,
      isOut1stScreen,
      isScrolled,
      isAtTop,
      isAtBottom,
    }),
    [
      scrollY,
      scrollDirection,
      scrollToPosition,
      scrollToElement,
      isOut1stScreen,
      isScrolled,
      isAtTop,
      isAtBottom,
    ]
  );

  return <ScrollContext.Provider value={contextValue}>{children}</ScrollContext.Provider>;
};

export const useScrollContext = (): ScrollContextType => {
  const context = useContext(ScrollContext);

  if (!context) {
    throw new Error('useScrollContext must be used within a ScrollProvider');
  }

  return context;
};

export default useScrollContext;