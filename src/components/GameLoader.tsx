'use client';

import dynamic from 'next/dynamic';

// Phaser butuh `window`, jadi komponen game hanya dimuat di browser.
const PhaserGame = dynamic(() => import('./PhaserGame'), {
  ssr: false,
  loading: () => <p style={{ textAlign: 'center', padding: '4rem 0' }}>Memuat dunia kecil saya…</p>,
});

export default function GameLoader() {
  return <PhaserGame />;
}
