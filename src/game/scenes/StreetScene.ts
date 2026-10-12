import BaseScene, { TILE } from './BaseScene';

const COLS = 40;
const ROWS = 15;
const WORLD_W = COLS * TILE;
const WORLD_H = ROWS * TILE;

/** Jalan: 40 x 15 tile (kamera mengikuti pemain). Rumah di kiri, Indomaret di kanan. */
export default class StreetScene extends BaseScene {
  readonly placeName = 'Jalan Depan Rumah';
  protected readonly defaultSpawn = { x: 5 * TILE + 16, y: 240 };

  constructor() {
    super('Street');
  }

  create() {
    // latar
    this.add.tileSprite(0, 0, WORLD_W, WORLD_H, 'grass').setOrigin(0);
    this.add.tileSprite(0, 7 * TILE, WORLD_W, TILE, 'sidewalk').setOrigin(0);
    this.add.tileSprite(0, 8 * TILE, WORLD_W, 3 * TILE, 'road').setOrigin(0);
    this.add.tileSprite(0, 11 * TILE, WORLD_W, TILE, 'sidewalk').setOrigin(0);
    for (let x = 0; x < WORLD_W; x += 64) {
      this.add.rectangle(x + 16, 9.5 * TILE, 32, 4, 0xfacc15);
    }
    this.add.tileSprite(5 * TILE, 5 * TILE, TILE, 2 * TILE, 'sidewalk').setOrigin(0);
    this.add.tileSprite(33 * TILE, 5 * TILE, TILE, 2 * TILE, 'sidewalk').setOrigin(0);

    this.setupBase(WORLD_W, WORLD_H);

    // --- bangunan ---
    this.building(2, 1, 7, 4, 0xfde68a, 0x92400e, 'RUMAH SAYA', 5);
    this.building(29, 1, 9, 4, 0xe0f2fe, 0x1d4ed8, 'INDOMARET', 33);
    this.add.rectangle(29 * TILE, 2 * TILE, 9 * TILE, 8, 0xdc2626).setOrigin(0).setDepth(2);
    this.add.rectangle(29 * TILE, 2 * TILE + 8, 9 * TILE, 5, 0xfacc15).setOrigin(0).setDepth(2);
    this.add.text(33.5 * TILE, 3.4 * TILE, '🛒', { fontSize: '30px', resolution: 2 }).setOrigin(0.5).setDepth(3);

    // pintu: sentuh untuk masuk
    this.addExit(5, 5, 1, 1, 'House', { x: 320, y: 384 });
    this.addExit(33, 5, 1, 1, 'Store', { x: 320, y: 384 });

    // --- pohon ---
    const trees: [number, number][] = [
      [11, 2], [12, 4], [15, 1], [16, 5], [20, 2], [23, 4], [26, 2], [27, 5],
      [1, 6], [1, 13], [6, 13], [10, 13], [15, 12], [19, 13], [24, 13], [28, 12],
      [34, 13], [38, 12], [39, 6],
    ];
    trees.forEach(([tx, ty]) => this.addProp({ tx, ty, emoji: '🌳', fontSize: 40 }));

    // --- objek interaktif ---
    this.addObject(
      { tx: 7, ty: 6, emoji: '🪧', fontSize: 28 },
      { kind: 'info', id: 'sign', label: 'Baca papan petunjuk' },
    );
    this.addObject(
      { tx: 20, ty: 12, emoji: '🐈', fontSize: 26 },
      { kind: 'info', id: 'cat', label: 'Elus kucing' },
    );

    // --- kendaraan (hiasan, tidak menabrak) ---
    this.car('🚗', 8.55, false, 0);
    this.car('🚙', 8.55, false, 5200);
    this.car('🚕', 10.45, true, 1800);
    this.car('🚌', 10.45, true, 6500);
  }

  private building(tx: number, ty: number, tw: number, th: number, color: number, roof: number, name: string, doorTx: number) {
    this.addProp({ tx, ty, tw, th, color });
    this.add.rectangle(tx * TILE, ty * TILE, tw * TILE, TILE, roof).setOrigin(0).setDepth(2).setStrokeStyle(2, 0x000000, 0.25);
    this.add
      .text((tx + tw / 2) * TILE, ty * TILE + TILE / 2, name, {
        fontFamily: 'monospace', fontSize: '16px', fontStyle: 'bold', color: '#ffffff', resolution: 2,
      })
      .setOrigin(0.5)
      .setDepth(3);
    this.add.rectangle(doorTx * TILE, (ty + th - 1) * TILE, TILE, TILE, 0x7c4a1e).setOrigin(0).setDepth(2);
    const wy = (ty + 1.7) * TILE;
    [(tx + 0.9) * TILE, (tx + tw - 1.9) * TILE].forEach((x) =>
      this.add.rectangle(x, wy, TILE, TILE, 0x7dd3fc).setOrigin(0).setDepth(2).setStrokeStyle(2, 0x000000, 0.3),
    );
  }

  private car(emoji: string, row: number, toRight: boolean, delay: number) {
    const t = this.add.text(toRight ? -60 : WORLD_W + 60, row * TILE, emoji, { fontSize: '28px', resolution: 2 })
      .setOrigin(0.5)
      .setDepth(5);
    if (toRight) t.setFlipX(true);
    this.tweens.add({
      targets: t,
      x: toRight ? WORLD_W + 60 : -60,
      duration: 11000,
      delay,
      repeat: -1,
    });
  }
}
