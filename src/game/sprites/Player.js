import Phaser from 'phaser';

/**
 * Jack: sprite pemain dengan animasi jalan & animasi "ring-cowbell" ke 4 arah.
 * Spritesheet: jack-standing (4 frame), jack-walking (4x4), jack-cowbell (4x2).
 */
export default class Player extends Phaser.Physics.Arcade.Sprite {
  constructor({ scene, x, y, key, frame }) {
    super(scene, x, y, key, frame);
    scene.add.existing(this);
    scene.physics.add.existing(this);

    // The image has a bit of whitespace so use setSize and
    // setOffset to control the size of the player's body
    this.setSize(32, 42).setOffset(0, 22);

    this.setCollideWorldBounds(true);
    this.setDepth(10);
    // hitbox kecil di kaki supaya tidak "tersangkut" saat lewat di dekat objek
    this.body.setSize(16, 12).setOffset(4, 20);

    this.createAnims();

    // Set the camera to follow the game object
    scene.cameras.main.startFollow(this);
    scene.cameras.main.setZoom(1);
    
    // tabrakan dengan layer "blocked" milik Map
    scene.physics.add.collider(this, scene._MAP.blockedLayer);
  }

  createAnims() {
    const anims = this.scene.anims;
    ['down', 'up', 'left', 'right'].forEach((dir, row) => {
      if (!anims.exists(`walking-${dir}`)) {
        anims.create({
          key: `walking-${dir}`,
          frames: anims.generateFrameNumbers('jack-walking', { start: row * 4, end: row * 4 + 3, zeroPad: 3 }),
          frameRate: 8,
          repeat: -1,
        });
      }
      if (!anims.exists(`ring-cowbell-${dir}`)) {
        anims.create({
          key: `ring-cowbell-${dir}`,
          frames: anims.generateFrameNumbers('jack-cowbell', { start: row * 2, end: row * 2 + 1, zeroPad: 3 }),
          frameRate: 6,
          repeat: 2,
        });
      }
    });
  }
}
