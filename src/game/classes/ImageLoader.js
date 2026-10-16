import gameConfig from '../config/game-config';

/**
 * Memuat aset. Dipanggil di preload() Game scene.
 * Tileset & sprite dimuat sekali (Phaser melewati key yang sudah ada di cache),
 * file peta hanya untuk peta yang sedang dibuka.
 */
export default class ImageLoader {
  constructor(scene) {
    const mapVars = gameConfig.map[gameConfig.loadedScene];

    scene.load.image(mapVars.imgKey, '/assets/tilesets/town.png');
    scene.load.tilemapTiledJSON(mapVars.key, mapVars.file);

    const frame = { frameWidth: 24, frameHeight: 32 };
    scene.load.spritesheet('jack-standing', '/assets/sprites/jack-standing.png', frame); // 0 bawah, 1 atas, 2 kiri, 3 kanan
    scene.load.spritesheet('jack-walking', '/assets/sprites/jack-walking.png', frame); // 4 baris (arah) x 4 frame
    scene.load.spritesheet('jack-cowbell', '/assets/sprites/jack-cowbell.png', frame); // 4 baris (arah) x 2 frame
  }
}
