"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type * as LeafletNS from "leaflet";
import "leaflet/dist/leaflet.css";
import { gsap } from "@/lib/gsap";
import {
  MAP_CENTER,
  MAP_PINS,
  MAP_ZOOM,
  TILE_ATTRIBUTION,
  TILE_URL,
} from "@/lib/map";
import styles from "./MapLens.module.css";

type Props = {
  /** Diameter kaca pembesar (px). */
  lensSize?: number;
  /** Tambahan level zoom di dalam lensa (2 = 4x lebih besar). */
  zoomDelta?: number;
};

/**
 * Peta Leaflet + kursor kaca pembesar.
 *
 * Terinspirasi Magic UI <Lens>: lensa bulat mengikuti kursor dan menampilkan
 * versi diperbesar dari isi di bawahnya. Bedanya, Magic UI menggandakan
 * children lalu men-scale dengan CSS (tile peta jadi buram). Di sini lensa
 * berisi instance Leaflet kedua yang disinkronkan ke titik di bawah kursor
 * dengan zoom lebih tinggi, jadi tile dimuat tajam.
 */
export default function MapLens({ lensSize = 240, zoomDelta = 2 }: Props) {
  const frameRef = useRef<HTMLDivElement>(null);
  const mapElRef = useRef<HTMLDivElement>(null);
  const hintRef = useRef<HTMLSpanElement>(null);
  const lensOuterRef = useRef<HTMLDivElement>(null);
  const lensInnerRef = useRef<HTMLDivElement>(null);
  const lensMapElRef = useRef<HTMLDivElement>(null);

  // Lensa hanya untuk perangkat dengan mouse; layar sentuh memakai peta biasa.
  const [lensEnabled, setLensEnabled] = useState(false);
  useEffect(() => {
    setLensEnabled(window.matchMedia("(hover: hover) and (pointer: fine)").matches);
  }, []);

  useEffect(() => {
    const frame = frameRef.current;
    const mapEl = mapElRef.current;
    if (!frame || !mapEl) return;
    if (lensEnabled && (!lensMapElRef.current || !lensOuterRef.current || !lensInnerRef.current)) return;

    let cancelled = false;
    let cleanup = () => {};

    (async () => {
      const mod = await import("leaflet");
      const L = ((mod as unknown as { default?: typeof LeafletNS }).default ?? mod) as typeof LeafletNS;
      if (cancelled) return;

      const coarse = window.matchMedia("(pointer: coarse)").matches;

      const makePins = (map: LeafletNS.Map) => {
        MAP_PINS.forEach((p) => {
          const html = `<span class="${styles.pin} ${p.me ? styles.pinMe : ""}"><span class="${styles.pinLabel}">${p.label}</span><span class="${styles.pinDot}"></span></span>`;
          L.marker(p.pos, {
            icon: L.divIcon({ className: "", html, iconSize: [0, 0] }),
            interactive: false,
            keyboard: false,
          }).addTo(map);
        });
      };

      // ---------- Peta utama ----------
      const map = L.map(mapEl, {
        center: MAP_CENTER,
        zoom: MAP_ZOOM,
        minZoom: 12,
        maxZoom: 17,
        zoomControl: false,
        attributionControl: false,
        scrollWheelZoom: false, // supaya scroll halaman (Lenis) tidak terhenti di atas peta
        boxZoom: false,
        keyboard: false,
        dragging: !coarse,
        touchZoom: !coarse,
        doubleClickZoom: !coarse,
      });
      L.control.attribution({ prefix: false, position: "bottomright" }).addAttribution(TILE_ATTRIBUTION).addTo(map);
      L.tileLayer(TILE_URL, { maxZoom: 19 }).addTo(map);
      makePins(map);

      const ro = new ResizeObserver(() => map.invalidateSize());
      ro.observe(mapEl);

      if (!lensEnabled) {
        cleanup = () => {
          ro.disconnect();
          map.remove();
        };
        return;
      }

      // ---------- Peta di dalam lensa ----------
      const lensMap = L.map(lensMapElRef.current!, {
        center: MAP_CENTER,
        zoom: MAP_ZOOM + zoomDelta,
        maxZoom: 19,
        zoomSnap: 0,
        zoomControl: false,
        attributionControl: false,
        dragging: false,
        touchZoom: false,
        scrollWheelZoom: false,
        doubleClickZoom: false,
        boxZoom: false,
        keyboard: false,
        zoomAnimation: false,
        fadeAnimation: false,
        markerZoomAnimation: false,
        inertia: false,
      });
      L.tileLayer(TILE_URL, { maxZoom: 19 }).addTo(lensMap);
      makePins(lensMap);

      const outer = lensOuterRef.current!;
      const inner = lensInnerRef.current!;
      const hint = hintRef.current;
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const half = lensSize / 2;

      gsap.set(inner, { scale: 0.55, autoAlpha: 0 });

      const pointer = { x: 0, y: 0, inside: false };
      let shown = false;
      let raf = 0;

      const show = () => {
        if (shown) return;
        shown = true;
        gsap.to(inner, { scale: 1, autoAlpha: 1, duration: reduced ? 0 : 0.45, ease: "back.out(1.7)", overwrite: true });
        if (hint) gsap.to(hint, { autoAlpha: 0, duration: 0.2 });
      };
      const hide = () => {
        if (!shown) return;
        shown = false;
        gsap.to(inner, { scale: 0.55, autoAlpha: 0, duration: reduced ? 0 : 0.2, ease: "power2.in", overwrite: true });
        if (hint) gsap.to(hint, { autoAlpha: 1, duration: 0.3 });
      };

      const sync = () => {
        raf = 0;
        if (!pointer.inside) return;
        const rect = frame.getBoundingClientRect();
        const inFrame =
          pointer.x >= rect.left && pointer.x <= rect.right &&
          pointer.y >= rect.top && pointer.y <= rect.bottom;
        if (!inFrame) {
          pointer.inside = false;
          hide();
          return;
        }
        gsap.set(outer, { x: pointer.x - half, y: pointer.y - half });
        const ll = map.containerPointToLatLng([pointer.x - rect.left, pointer.y - rect.top]);
        lensMap.setView(ll, Math.min(map.getZoom() + zoomDelta, 19), { animate: false });
        show();
      };
      const schedule = () => {
        if (!raf) raf = requestAnimationFrame(sync);
      };

      const isMouse = (e: PointerEvent) => e.pointerType === "mouse" || e.pointerType === "pen";
      const onEnter = (e: PointerEvent) => {
        if (!isMouse(e)) return;
        pointer.inside = true;
        pointer.x = e.clientX;
        pointer.y = e.clientY;
        lensMap.invalidateSize();
        schedule();
      };
      const onMove = (e: PointerEvent) => {
        if (!isMouse(e)) return;
        pointer.inside = true;
        pointer.x = e.clientX;
        pointer.y = e.clientY;
        schedule();
      };
      const onLeave = () => {
        pointer.inside = false;
        hide();
      };

      frame.addEventListener("pointerenter", onEnter);
      frame.addEventListener("pointermove", onMove);
      frame.addEventListener("pointerleave", onLeave);
      window.addEventListener("scroll", schedule, { passive: true }); // peta bergeser saat scroll tanpa gerak mouse
      map.on("move zoom", schedule); // drag / double-click zoom pada peta utama

      cleanup = () => {
        cancelAnimationFrame(raf);
        frame.removeEventListener("pointerenter", onEnter);
        frame.removeEventListener("pointermove", onMove);
        frame.removeEventListener("pointerleave", onLeave);
        window.removeEventListener("scroll", schedule);
        gsap.killTweensOf([inner, hint]);
        ro.disconnect();
        map.remove();
        lensMap.remove();
      };
    })();

    return () => {
      cancelled = true;
      cleanup();
    };
  }, [lensEnabled, lensSize, zoomDelta]);

  return (
    <>
      <div
        ref={frameRef}
        className={`${styles.frame} ${lensEnabled ? styles.hasLens : ""}`}
        role="img"
        aria-label="Ilustrasi peta: usaha Anda muncul di antara usaha lain di sekitar calon pelanggan. Arahkan kursor untuk memperbesar."
      >
        <div ref={mapElRef} className={styles.map} />
        <span ref={hintRef} className={styles.hint} aria-hidden="true">
          Arahkan kursor untuk memperbesar
        </span>
      </div>

      {lensEnabled &&
        createPortal(
          <div
            ref={lensOuterRef}
            className={styles.lensOuter}
            style={{ width: lensSize, height: lensSize, "--s": `${lensSize}px` } as React.CSSProperties}
            aria-hidden="true"
          >
            <div ref={lensInnerRef} className={styles.lensInner}>
              <div className={styles.handleArm}>
                <div className={styles.handle} />
              </div>
              <div className={styles.glass}>
                <div ref={lensMapElRef} className={styles.lensMap} />
                <div className={styles.glare} />
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
