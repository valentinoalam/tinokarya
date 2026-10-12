import { items, rupiah } from '../content';
import BaseScene, { H, TILE, W } from './BaseScene';

/** Dalam Indomaret: rak = proyek (maks. 12), kasir = bayar belanjaan & listrik. */
export default class StoreScene extends BaseScene {
  readonly placeName = 'Indomaret';
  protected readonly defaultSpawn = { x: 320, y: 384 };

  constructor() {
    super('Store');
  }

  create() {
    this.add.tileSprite(0, 0, W, H, 'tile').setOrigin(0);
    this.add.rectangle(0, 0, W, TILE * 2, 0x1e40af).setOrigin(0).setDepth(0.5);
    this.add.rectangle(0, TILE * 2 - 8, W, 8, 0xdc2626).setOrigin(0).setDepth(0.6);
    this.add
      .text(W / 2, TILE - 4, 'INDOMARET', { fontFamily: 'monospace', fontSize: '22px', fontStyle: 'bold', color: '#fde047', resolution: 2 })
      .setOrigin(0.5)
      .setDepth(1);

    this.setupBase(W, H);
    this.addProp({ tx: 0, ty: 0, tw: 20, th: 2 }); // dinding atas

    // rak produk: dua baris, masing-masing 6 slot
    items.slice(0, 12).forEach((it, i) => {
      const col = 2 + (i % 6) * 3;
      const row = i < 6 ? 2 : 6;
      this.addObject(
        { tx: col, ty: row, tw: 2, th: 1, color: 0xe5e7eb, emoji: it.emoji, fontSize: 26 },
        { kind: 'item', id: it.id, label: `Lihat ${it.name}` },
      );
      this.add
        .text((col + 1) * TILE, (row + 1) * TILE + 11, rupiah(it.price), {
          fontFamily: 'monospace', fontSize: '10px', color: '#111827', backgroundColor: '#fde047', padding: { x: 3, y: 1 }, resolution: 2,
        })
        .setOrigin(0.5)
        .setDepth(3);
    });

    // dekorasi
    this.addProp({ tx: 2, ty: 9, tw: 6, th: 1, color: 0x93c5fd, emoji: '🥤', fontSize: 22 });

    // kasir
    this.addProp({ tx: 16, ty: 8.7, emoji: '🧑‍💼', fontSize: 30, solid: false });
    this.addObject(
      { tx: 14, ty: 10, tw: 5, th: 2, color: 0x2563eb, emoji: '🧾' },
      { kind: 'kasir', id: 'kasir', label: 'Bayar di kasir' },
    );

    // pintu keluar
    this.add.rectangle(10 * TILE, 14.5 * TILE, 2 * TILE, TILE, 0x374151).setDepth(1);
    this.add
      .text(10 * TILE, 14.5 * TILE, 'KELUAR', { fontFamily: 'monospace', fontSize: '11px', color: '#e5e7eb', resolution: 2 })
      .setOrigin(0.5)
      .setDepth(2);
    this.addExit(9, 14, 2, 1, 'Street', { x: 33 * TILE + 16, y: 240 });
  }
}
