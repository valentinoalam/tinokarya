import BaseScene, { H, TILE, W } from './BaseScene';

/** Dalam rumah: 20 x 15 tile. Tiap objek membuka dialog "tentang saya". */
export default class HouseScene extends BaseScene {
  readonly placeName = 'Rumah';
  protected readonly defaultSpawn = { x: 320, y: 384 };

  constructor() {
    super('House');
  }

  create() {
    this.add.tileSprite(0, 0, W, H, 'wood').setOrigin(0);
    this.add.tileSprite(0, 0, W, TILE * 2, 'wall').setOrigin(0).setDepth(0.5);
    this.add.rectangle(10 * TILE, 11 * TILE, 8 * TILE, 4 * TILE, 0x7f1d1d, 0.35).setDepth(0.6); // karpet
    this.add.text(10 * TILE, TILE, '🖼️', { fontSize: '26px', resolution: 2 }).setOrigin(0.5).setDepth(1);

    this.setupBase(W, H);
    this.addProp({ tx: 0, ty: 0, tw: 20, th: 2 }); // dinding atas (solid, tak terlihat)

    // --- objek interaktif ---
    this.addObject(
      { tx: 1, ty: 2, tw: 2, th: 3, color: 0x93c5fd, emoji: '🛏️' },
      { kind: 'info', id: 'bed', label: 'Tempat tidur: tentang saya' },
    );
    this.addObject(
      { tx: 5, ty: 2, tw: 3, th: 1, color: 0x92400e, emoji: '📚', fontSize: 24 },
      { kind: 'info', id: 'shelf', label: 'Rak buku: pendidikan' },
    );
    this.addObject(
      { tx: 12, ty: 2, tw: 3, th: 2, color: 0x78350f, emoji: '💻' },
      { kind: 'info', id: 'desk', label: 'Meja kerja: skill' },
    );
    this.addObject(
      { tx: 17, ty: 2, tw: 2, th: 2, color: 0x854d0e, emoji: '🏆' },
      { kind: 'info', id: 'trophy', label: 'Lemari piala: pencapaian' },
    );
    this.addObject(
      { tx: 2, ty: 10, tw: 3, th: 2, color: 0xef4444, emoji: '🛋️' },
      { kind: 'info', id: 'sofa', label: 'Sofa: hobi' },
    );
    this.addObject(
      { tx: 18, ty: 8, tw: 1, th: 1, color: 0xfacc15, emoji: '⚡', fontSize: 22 },
      { kind: 'meter', id: 'meter', label: 'Cek meteran listrik' },
    );

    // --- dekorasi ---
    this.addProp({ tx: 13, ty: 6, tw: 3, th: 2, color: 0xb45309, emoji: '🍽️' });
    this.addProp({ tx: 9, ty: 2, emoji: '🪴', fontSize: 26 });

    // --- pintu keluar ---
    this.add.rectangle(10 * TILE, 14.5 * TILE, 2 * TILE, TILE, 0x7c4a1e).setDepth(1);
    this.add
      .text(10 * TILE, 14.5 * TILE, 'KELUAR', { fontFamily: 'monospace', fontSize: '11px', color: '#fde68a', resolution: 2 })
      .setOrigin(0.5)
      .setDepth(2);
    this.addExit(9, 14, 2, 1, 'Street', { x: 5 * TILE + 16, y: 240 });
  }
}
