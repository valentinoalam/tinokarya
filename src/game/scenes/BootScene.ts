import Phaser from 'phaser';

/**
 * Membuat semua tekstur lewat kode, jadi template ini jalan tanpa file gambar.
 * Ingin pixel art sendiri? Ganti bagian ini dengan this.load.image / this.load.spritesheet
 * di preload(), lalu pakai key yang sama ('player', 'wood', 'grass', ...).
 */
export default class BootScene extends Phaser.Scene {
  constructor() {
    super('Boot');
  }

  create() {
    this.makePlayer();

    this.makeTile('wood', (g) => {
      g.fillStyle(0xc99a68).fillRect(0, 0, 32, 32);
      g.fillStyle(0xb5865a).fillRect(0, 0, 32, 2).fillRect(0, 16, 32, 2);
      g.fillStyle(0xa87750).fillRect(10, 0, 2, 16).fillRect(22, 16, 2, 16);
    });
    this.makeTile('wall', (g) => {
      g.fillStyle(0xf3e5c8).fillRect(0, 0, 32, 32);
      g.fillStyle(0xcdb48a).fillRect(0, 26, 32, 6);
      g.fillStyle(0xe6d3ae).fillRect(15, 0, 2, 26);
    });
    this.makeTile('grass', (g) => {
      g.fillStyle(0x6abe45).fillRect(0, 0, 32, 32);
      g.fillStyle(0x5aab39).fillRect(4, 6, 3, 3).fillRect(20, 14, 3, 3).fillRect(11, 25, 3, 3);
      g.fillStyle(0x7ccd55).fillRect(25, 4, 2, 2).fillRect(8, 17, 2, 2);
    });
    this.makeTile('road', (g) => {
      g.fillStyle(0x4b5563).fillRect(0, 0, 32, 32);
      g.fillStyle(0x434c5a).fillRect(6, 8, 3, 3).fillRect(22, 20, 3, 3);
    });
    this.makeTile('sidewalk', (g) => {
      g.fillStyle(0xd6d3cb).fillRect(0, 0, 32, 32);
      g.fillStyle(0xb9b5aa).fillRect(0, 0, 32, 1).fillRect(0, 0, 1, 32);
    });
    this.makeTile('tile', (g) => {
      g.fillStyle(0xf8fafc).fillRect(0, 0, 32, 32);
      g.fillStyle(0xe2e8f0).fillRect(0, 0, 16, 16).fillRect(16, 16, 16, 16);
    });

    this.scene.start('House');
  }

  private makeTile(key: string, draw: (g: Phaser.GameObjects.Graphics) => void) {
    const g = this.make.graphics({}, false);
    draw(g);
    g.generateTexture(key, 32, 32);
    g.destroy();
  }

  private makePlayer() {
    const g = this.make.graphics({}, false);
    g.fillStyle(0x2b2b2b).fillRoundedRect(5, 0, 14, 8, 3); // rambut
    g.fillStyle(0xf1c27d).fillRoundedRect(6, 4, 12, 10, 3); // wajah
    g.fillStyle(0x000000).fillRect(9, 8, 2, 2).fillRect(14, 8, 2, 2); // mata
    g.fillStyle(0x3b82f6).fillRoundedRect(3, 14, 18, 10, 3); // baju
    g.fillStyle(0x1f2937).fillRect(6, 24, 5, 8).fillRect(13, 24, 5, 8); // celana
    g.generateTexture('player', 24, 32);
    g.destroy();
  }
}
