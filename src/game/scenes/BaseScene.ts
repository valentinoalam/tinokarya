import Phaser from 'phaser';
import { EventBus } from '../EventBus';

export const TILE = 32;
export const W = 640; // lebar layar game (20 tile)
export const H = 480; // tinggi layar game (15 tile)
const SPEED = 150;

export type InteractKind = 'info' | 'item' | 'kasir' | 'meter';

export interface PropOpts {
  /** posisi & ukuran dalam satuan tile (1 tile = 32px) */
  tx: number;
  ty: number;
  tw?: number;
  th?: number;
  color?: number;
  emoji?: string;
  fontSize?: number;
  /** true = karakter tidak bisa menembus objek ini */
  solid?: boolean;
}

interface Interactable {
  kind: InteractKind;
  id: string;
  label: string;
  x: number;
  y: number;
  radius: number;
}

/**
 * Scene dasar: karakter, kontrol, tabrakan, tombol interaksi, dan perpindahan scene.
 * HouseScene / StreetScene / StoreScene tinggal menata objek.
 */
export default abstract class BaseScene extends Phaser.Scene {
  abstract readonly placeName: string;
  protected abstract readonly defaultSpawn: { x: number; y: number };

  protected player!: Phaser.Physics.Arcade.Sprite;
  protected solids!: Phaser.Physics.Arcade.StaticGroup;

  private spawn = { x: 0, y: 0 };
  private keys!: Record<string, Phaser.Input.Keyboard.Key>;
  private interactables: Interactable[] = [];
  private hint!: Phaser.GameObjects.Text;
  private locked = false;
  private changing = false;
  private touch = { x: 0, y: 0 };
  private touchAction = false;

  init(data?: { x?: number; y?: number }) {
    this.spawn = {
      x: data?.x ?? this.defaultSpawn.x,
      y: data?.y ?? this.defaultSpawn.y,
    };
  }

  /** Panggil di awal create(), SETELAH menggambar lantai/latar. */
  protected setupBase(worldW: number, worldH: number) {
    this.interactables = [];
    this.locked = false;
    this.changing = false;
    this.touch = { x: 0, y: 0 };

    this.physics.world.setBounds(0, 0, worldW, worldH);
    this.solids = this.physics.add.staticGroup();

    this.player = this.physics.add.sprite(this.spawn.x, this.spawn.y, 'player');
    this.player.setCollideWorldBounds(true).setDepth(10);
    // hitbox kecil di kaki supaya terasa natural saat lewat di dekat objek
    (this.player.body as Phaser.Physics.Arcade.Body).setSize(16, 12).setOffset(4, 20);
    this.physics.add.collider(this.player, this.solids);

    this.keys = this.input.keyboard!.addKeys(
      'W,A,S,D,UP,DOWN,LEFT,RIGHT,E,SPACE,ENTER',
    ) as Record<string, Phaser.Input.Keyboard.Key>;

    this.cameras.main.setBounds(0, 0, worldW, worldH);
    this.cameras.main.startFollow(this.player, true, 0.12, 0.12);
    this.cameras.main.fadeIn(250, 0, 0, 0);

    this.hint = this.add
      .text(W / 2, H - 22, '', {
        fontFamily: 'monospace',
        fontSize: '14px',
        color: '#ffffff',
        backgroundColor: '#0f172ae6',
        padding: { x: 10, y: 5 },
        resolution: 2,
      })
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setDepth(100)
      .setVisible(false);

    const offs = [
      EventBus.on<boolean>('ui-lock', (v) => {
        this.locked = !!v;
        if (this.locked) this.player.setVelocity(0, 0);
      }),
      EventBus.on<{ x: number; y: number }>('touch-move', (d) => {
        this.touch = d;
      }),
      EventBus.on('touch-action', () => {
        this.touchAction = true;
      }),
    ];
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => offs.forEach((off) => off()));

    EventBus.emit('scene-ready', this.placeName);
  }

  /** Kotak berwarna + emoji, opsional solid. Mengembalikan titik tengahnya. */
  protected addProp(o: PropOpts) {
    const { tx, ty, tw = 1, th = 1, color, emoji, solid = true } = o;
    const w = tw * TILE;
    const h = th * TILE;
    const cx = tx * TILE + w / 2;
    const cy = ty * TILE + h / 2;

    if (color !== undefined || solid) {
      const rect = this.add
        .rectangle(cx, cy, w, h, color ?? 0x000000, color === undefined ? 0 : 1)
        .setDepth(1);
      if (color !== undefined) rect.setStrokeStyle(2, 0x000000, 0.25);
      if (solid) this.solids.add(rect);
    }
    if (emoji) {
      this.add
        .text(cx, cy, emoji, {
          fontSize: `${o.fontSize ?? Math.round(Math.min(tw, th) * TILE * 0.8)}px`,
          resolution: 2,
        })
        .setOrigin(0.5)
        .setDepth(2);
    }
    return { cx, cy };
  }

  /** Objek yang bisa diajak interaksi (muncul tanda ❗ dan petunjuk [E]). */
  protected addObject(p: PropOpts, i: { kind: InteractKind; id: string; label: string }) {
    const { cx, cy } = this.addProp(p);
    const tw = p.tw ?? 1;
    const th = p.th ?? 1;
    this.interactables.push({
      ...i,
      x: cx,
      y: cy,
      radius: (Math.max(tw, th) * TILE) / 2 + 36,
    });
    const mark = this.add
      .text(cx, cy - (th * TILE) / 2 - 12, '❗', { fontSize: '16px', resolution: 2 })
      .setOrigin(0.5)
      .setDepth(20);
    this.tweens.add({ targets: mark, y: mark.y - 5, yoyo: true, repeat: -1, duration: 600 });
  }

  /** Zona pintu: menyentuhnya memindahkan pemain ke scene lain. */
  protected addExit(
    tx: number,
    ty: number,
    tw: number,
    th: number,
    target: string,
    spawn: { x: number; y: number },
  ) {
    const zone = this.add.zone(
      tx * TILE + (tw * TILE) / 2,
      ty * TILE + (th * TILE) / 2,
      tw * TILE,
      th * TILE,
    );
    this.physics.add.existing(zone, true);
    this.physics.add.overlap(this.player, zone, () => {
      if (this.changing) return;
      this.changing = true;
      this.player.setVelocity(0, 0);
      this.cameras.main.fadeOut(250, 0, 0, 0);
      this.cameras.main.once('camerafadeoutcomplete', () => this.scene.start(target, spawn));
    });
  }

  update(time: number) {
    if (!this.player) return;
    const body = this.player.body as Phaser.Physics.Arcade.Body;
    const k = this.keys;

    let vx = 0;
    let vy = 0;
    if (!this.locked && !this.changing) {
      vx = (k.RIGHT.isDown || k.D.isDown ? 1 : 0) - (k.LEFT.isDown || k.A.isDown ? 1 : 0) + this.touch.x;
      vy = (k.DOWN.isDown || k.S.isDown ? 1 : 0) - (k.UP.isDown || k.W.isDown ? 1 : 0) + this.touch.y;
    }
    const dir = new Phaser.Math.Vector2(vx, vy);
    if (dir.lengthSq() > 1) dir.normalize();
    body.setVelocity(dir.x * SPEED, dir.y * SPEED);

    if (vx !== 0) this.player.setFlipX(vx < 0);
    const moving = dir.lengthSq() > 0;
    this.player.setScale(1, moving ? 1 + Math.sin(time / 55) * 0.05 : 1);

    // cari objek interaktif terdekat
    let nearest: Interactable | null = null;
    let best = Infinity;
    for (const it of this.interactables) {
      const d = Phaser.Math.Distance.Between(body.center.x, body.center.y, it.x, it.y);
      if (d < it.radius && d < best) {
        best = d;
        nearest = it;
      }
    }

    const pressed =
      Phaser.Input.Keyboard.JustDown(k.E) ||
      Phaser.Input.Keyboard.JustDown(k.SPACE) ||
      Phaser.Input.Keyboard.JustDown(k.ENTER) ||
      this.touchAction;
    this.touchAction = false;

    if (nearest && !this.locked && !this.changing) {
      this.hint.setText(`[E] ${nearest.label}`).setVisible(true);
      if (pressed) {
        this.locked = true; // React akan membuka dialog lalu membuka kunci saat ditutup
        body.setVelocity(0, 0);
        EventBus.emit('interact', { kind: nearest.kind, id: nearest.id });
      }
    } else {
      this.hint.setVisible(false);
    }
  }
}
