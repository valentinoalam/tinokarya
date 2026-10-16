import Phaser from 'phaser';
import gameConfig from '../config/game-config';
import { EventBus } from '../EventBus';
import { items, rupiah } from '@/data/content';

// Properti objek Tiled bisa berupa array [{name, value}] atau objek biasa.
const toProps = (obj) => {
  const p = obj.properties;
  if (Array.isArray(p)) return Object.fromEntries(p.map((x) => [x.name, x.value]));
  return p || {};
};

/**
 * Membaca object layer dari peta Tiled dan membuat isinya:
 *  - decor        : emoji hiasan                   (emoji, fontSize)
 *  - labels       : teks di peta                   (text, color, fontSize, bold)
 *  - interactions : objek yang bisa di-Enter       (kind, id, label, emoji, fontSize)
 *                   kind: info | item | kasir | meter
 *                   kind "item": id (p1..p12) dicocokkan dengan items di content.ts
 *  - exits        : pintu pindah peta              (target, direction)
 *  - vehicles     : kendaraan hiasan yang lewat    (emoji, direction, delay, duration)
 */
export default class ObjectLoader {
  constructor({ scene, objectLayers }) {
    this.scene = scene;
    this.objectLayers = objectLayers || [];
  }

  setup() {
    this.objectLayers.forEach((layer) => {
      layer.objects.forEach((obj) => {
        const p = toProps(obj);
        const box = {
          x: obj.x,
          y: obj.y,
          w: obj.width,
          h: obj.height,
          cx: obj.x + obj.width / 2,
          cy: obj.y + obj.height / 2,
        };

        switch (layer.name) {
          case 'decor':
            this.addEmoji(box, p.emoji, p.fontSize);
            break;
          case 'labels':
            this.addLabel(box, p);
            break;
          case 'interactions':
            this.addInteraction(box, p);
            break;
          case 'exits':
            this.addExit(box, p);
            break;
          case 'vehicles':
            this.addVehicle(box, p);
            break;
          default:
            break;
        }
      });
    });
  }

  addEmoji(box, emoji, fontSize) {
    if (!emoji) return;
    this.scene.add
      .text(box.cx, box.cy, emoji, {
        fontSize: `${fontSize || Math.round(Math.min(box.w, box.h) * 0.8)}px`,
        resolution: 2,
      })
      .setOrigin(0.5)
      .setDepth(2);
  }

  addLabel(box, p) {
    this.scene.add
      .text(box.cx, box.cy, p.text || '', {
        fontFamily: 'monospace',
        fontSize: `${p.fontSize || 14}px`,
        fontStyle: p.bold ? 'bold' : 'normal',
        color: p.color || '#ffffff',
        resolution: 2,
      })
      .setOrigin(0.5)
      .setDepth(3);
  }

  addInteraction(box, p) {
    const data = { kind: p.kind, id: p.id, label: p.label };
    let emoji = p.emoji;
    let size = p.fontSize;

    if (p.kind === 'item') {
      const item = items.find((i) => i.id === p.id);
      if (!item) return; // slot rak kosong (tidak ada item dengan id ini)
      data.label = `Lihat ${item.name}`;
      emoji = item.emoji;
      size = 26;
      this.scene.add
        .text(box.cx, box.y + box.h + 11, rupiah(item.price), {
          fontFamily: 'monospace',
          fontSize: '10px',
          color: '#111827',
          backgroundColor: '#fde047',
          padding: { x: 3, y: 1 },
          resolution: 2,
        })
        .setOrigin(0.5)
        .setDepth(3);
    }

    this.addEmoji(box, emoji, size);

    // tanda ❗ yang naik-turun
    const mark = this.scene.add
      .text(box.cx, box.y - 12, '❗', { fontSize: '16px', resolution: 2 })
      .setOrigin(0.5)
      .setDepth(20);
    this.scene.tweens.add({ targets: mark, y: mark.y - 5, yoyo: true, repeat: -1, duration: 600 });

    // zona sentuh sedikit lebih besar dari objeknya
    const zone = this.scene.add.zone(box.cx, box.cy, box.w + 28, box.h + 28);
    this.scene.physics.add.existing(zone, true);
    this.scene.physics.add.overlap(this.scene._PLAYER, zone, () => {
      const od = gameConfig.overlapData;
      if (od.isActive) return; // sudah ada objek aktif; Game.update() yang melepasnya
      gameConfig.overlapData = { isActive: true, sprite: data, overlap: zone };
      EventBus.emit('hint', data.label);
    });
  }

  addExit(box, p) {
    const scene = this.scene;
    const zone = scene.add.zone(box.cx, box.cy, box.w, box.h);
    scene.physics.add.existing(zone, true);
    scene.physics.add.overlap(scene._PLAYER, zone, () => {
      if (scene._changing) return;
      scene._changing = true;
      gameConfig.pauseUpdateLoop = true;
      scene.stopPlayerAnim();

      scene.cameras.main.fadeOut(250, 0, 0, 0);
      scene.cameras.main.once('camerafadeoutcomplete', () => {
        gameConfig.previousData = { scene: gameConfig.loadedScene, direction: p.direction || 'down' };
        gameConfig.loadedScene = p.target;
        scene.scene.restart();
      });
    });
  }

  addVehicle(box, p) {
    const worldW = this.scene._MAP.tilemap.widthInPixels;
    const toRight = p.direction === 'right';
    const car = this.scene.add
      .text(toRight ? -60 : worldW + 60, box.cy, p.emoji || '🚗', { fontSize: '28px', resolution: 2 })
      .setOrigin(0.5)
      .setDepth(5);
    if (toRight) car.setFlipX(true);
    this.scene.tweens.add({
      targets: car,
      x: toRight ? worldW + 60 : -60,
      duration: p.duration || 11000,
      delay: p.delay || 0,
      repeat: -1,
    });
  }
}
