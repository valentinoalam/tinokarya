'use client';

import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent, type RefObject } from 'react';
import { EventBus } from '../game/EventBus';
import styles from './Game.module.css';

type Dir = { x: number; y: number };

const buzz = (ms = 12) => {
  // getar singkat (didukung Chrome Android)
  try {
    navigator.vibrate?.(ms);
  } catch {
    /* abaikan */
  }
};

function PadButton({
  className,
  label,
  event,
  children,
}: {
  className: string;
  label: string;
  event: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      className={`${styles.padBtn} ${className}`}
      aria-label={label}
      onPointerDown={(e) => {
        e.preventDefault();
        buzz();
        EventBus.emit(event);
      }}
      onContextMenu={(e) => e.preventDefault()}
    >
      {children}
    </button>
  );
}

/**
 * Controller layar sentuh (Android):
 *  - joystick 4 arah: geser jari ke arah mana pun, bisa berganti arah tanpa melepas
 *  - A = interaksi (Enter) · B = bunyikan lonceng (Spasi) · ☰ = menu misi & tas (Shift)
 *  - tombol layar penuh (mengunci landscape bila didukung)
 * Hanya tampil di perangkat sentuh (lihat media query di Game.module.css).
 */
export default function TouchControls({ fullscreenTarget }: { fullscreenTarget: RefObject<HTMLElement | null> }) {
  const stickRef = useRef<HTMLDivElement>(null);
  const activePointer = useRef<number | null>(null);
  const dir = useRef<Dir>({ x: 0, y: 0 });
  const [knob, setKnob] = useState<Dir>({ x: 0, y: 0 });
  const [isFull, setIsFull] = useState(false);
  const [canFull] = useState(() => typeof document !== 'undefined' && !!document.fullscreenEnabled);

  const emitDir = (next: Dir) => {
    if (next.x === dir.current.x && next.y === dir.current.y) return;
    dir.current = next;
    EventBus.emit('touch-move', next);
  };

  const readStick = (e: ReactPointerEvent) => {
    const el = stickRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const dx = e.clientX - (r.left + r.width / 2);
    const dy = e.clientY - (r.top + r.height / 2);
    const radius = r.width / 2;
    const dist = Math.hypot(dx, dy);

    // posisi kenop (dibatasi di dalam lingkaran)
    const travel = radius * 0.55;
    const k = dist > travel ? travel / dist : 1;
    setKnob({ x: dx * k, y: dy * k });

    // arah: satu sumbu saja, dengan histeresis agar tidak "goyang" saat diagonal
    if (dist < radius * 0.22) return emitDir({ x: 0, y: 0 });
    const horizontalNow = dir.current.x !== 0;
    const verticalNow = dir.current.y !== 0;
    const ax = Math.abs(dx);
    const ay = Math.abs(dy);
    let horizontal: boolean;
    if (horizontalNow) horizontal = !(ay > ax * 1.3);
    else if (verticalNow) horizontal = ax > ay * 1.3;
    else horizontal = ax > ay;
    emitDir(horizontal ? { x: Math.sign(dx), y: 0 } : { x: 0, y: Math.sign(dy) });
  };

  const stopStick = () => {
    activePointer.current = null;
    setKnob({ x: 0, y: 0 });
    emitDir({ x: 0, y: 0 });
  };

  // pastikan karakter berhenti jika komponen hilang saat jari masih menekan
  useEffect(() => () => EventBus.emit('touch-move', { x: 0, y: 0 }), []);

  // sinkronkan status layar penuh (juga saat keluar lewat tombol Back Android)
  useEffect(() => {
    const onChange = () => {
      const full = !!document.fullscreenElement;
      setIsFull(full);
      if (!full) screen.orientation?.unlock?.();
    };
    document.addEventListener('fullscreenchange', onChange);
    return () => document.removeEventListener('fullscreenchange', onChange);
  }, []);

  const toggleFullscreen = async () => {
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
        return;
      }
      await fullscreenTarget.current?.requestFullscreen();
      // kunci landscape (hanya berhasil saat layar penuh di Chrome Android)
      const so = screen.orientation as ScreenOrientation & { lock?: (o: string) => Promise<void> };
      await so.lock?.('landscape').catch(() => undefined);
      // jaga layar tetap menyala
      await navigator.wakeLock?.request('screen').catch(() => undefined);
    } catch {
      /* browser menolak: abaikan */
    }
  };

  return (
    <div className={styles.controls} onContextMenu={(e) => e.preventDefault()}>
      {canFull && (
        <button
          type="button"
          className={styles.fsBtn}
          onClick={toggleFullscreen}
          aria-label={isFull ? 'Keluar layar penuh' : 'Layar penuh'}
        >
          {isFull ? '⤡' : '⤢'}
        </button>
      )}

      <div
        ref={stickRef}
        className={styles.stick}
        role="application"
        aria-label="Joystick"
        onPointerDown={(e) => {
          if (activePointer.current !== null) return;
          e.preventDefault();
          activePointer.current = e.pointerId;
          e.currentTarget.setPointerCapture(e.pointerId);
          buzz(8);
          readStick(e);
        }}
        onPointerMove={(e) => {
          if (e.pointerId === activePointer.current) readStick(e);
        }}
        onPointerUp={(e) => e.pointerId === activePointer.current && stopStick()}
        onPointerCancel={(e) => e.pointerId === activePointer.current && stopStick()}
        onLostPointerCapture={(e) => e.pointerId === activePointer.current && stopStick()}
      >
        <span className={`${styles.arrow} ${styles.aUp}`}>▲</span>
        <span className={`${styles.arrow} ${styles.aDown}`}>▼</span>
        <span className={`${styles.arrow} ${styles.aLeft}`}>◀</span>
        <span className={`${styles.arrow} ${styles.aRight}`}>▶</span>
        <div className={styles.knob} style={{ transform: `translate(${knob.x}px, ${knob.y}px)` }} />
      </div>

      <div className={styles.buttons}>
        <PadButton className={styles.btnMenu} label="Menu misi dan tas" event="touch-menu">
          ☰
        </PadButton>
        <PadButton className={styles.btnB} label="Bunyikan lonceng" event="touch-bell">
          🔔
        </PadButton>
        <PadButton className={styles.btnA} label="Interaksi" event="touch-action">
          A
        </PadButton>
      </div>
    </div>
  );
}
