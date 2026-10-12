'use client';

import { useEffect, useRef, useState } from 'react';
import type Phaser from 'phaser';
import { EventBus } from '../game/EventBus';
import GameOverlay from './GameOverlay';
import styles from './Game.module.css';

export default function PhaserGame() {
  const hostRef = useRef<HTMLDivElement>(null);
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    let game: Phaser.Game | undefined;
    let cancelled = false;

    (async () => {
      const { createGame } = await import('../game/createGame');
      if (cancelled || !hostRef.current) return;
      game = createGame(hostRef.current, hostRef.current);
    })();

    // Setelah dialog ditutup, kembalikan fokus ke game agar keyboard langsung jalan.
    let wasLocked = false;
    const off = EventBus.on<boolean>('ui-lock', (locked) => {
      if (!locked && wasLocked) hostRef.current?.focus({ preventScroll: true });
      wasLocked = locked;
    });

    return () => {
      cancelled = true;
      off();
      game?.destroy(true);
    };
  }, []);

  return (
    <div className={styles.wrap}>
      <div
        ref={hostRef}
        className={styles.host}
        tabIndex={0}
        aria-label="Game: jelajahi rumah dan Indomaret"
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />
      <GameOverlay focused={focused} />
    </div>
  );
}
