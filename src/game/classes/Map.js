/**
 * Membuat peta dari Tiled JSON.
 * Layer wajib di Tiled: "background" (visual) dan "blocked" (tile apa pun di sini = tidak bisa dilewati).
 * Layer "blocked" disembunyikan di game.
 *
 * Catatan: class ini sengaja bernama Map (seperti proyek asli), jadi `Map` bawaan JS
 * tidak bisa dipakai di file yang meng-import-nya.
 */
export default class Map {
  constructor({ scene, key, imgKey, tileSetName, bgLayerName, blockedLayerName }) {
    this.scene = scene;
    this.tilemap = scene.make.tilemap({ key });
    this.tileset = this.tilemap.addTilesetImage(tileSetName, imgKey);

    this.backgroundLayer = this.tilemap.createLayer(bgLayerName, this.tileset, 0, 0);
    this.blockedLayer = this.tilemap.createLayer(blockedLayerName, this.tileset, 0, 0);

    this.blockedLayer.setCollisionByExclusion([-1]);
    this.blockedLayer.setVisible(false);
  }
}
