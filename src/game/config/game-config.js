/**
 * State global game (pola sama dengan Game.js asli).
 * - loadedScene   : peta yang sedang dimuat ('house' | 'street' | 'store')
 * - previousData  : peta sebelumnya + arah hadap, dipakai menentukan posisi awal pemain
 * - overlapData   : objek interaktif yang sedang disentuh pemain
 * - map[...]      : file peta Tiled, ukuran dunia, dan posisi awal per peta asal
 *
 * Tambah peta baru: buat json di public/assets/maps, lalu daftarkan di `map`.
 */
const gameConfig = {
  playerSpeed: 150,

  loadedScene: 'house',
  previousData: { scene: '', direction: 'down' },

  pauseUpdateLoop: false,
  taskMenuOpen: false,
  overlapData: { isActive: false, sprite: {}, overlap: null },

  map: {
    house: {
      placeName: 'Rumah',
      key: 'house-map',
      file: '/assets/maps/house.json',
      imgKey: 'town-tiles',
      tileSetName: 'town',
      mapBounds: { width: 640, height: 480 },
      playerStartPos: {
        default: { x: 320, y: 384 },
        street: { x: 320, y: 384 },
      },
    },
    street: {
      placeName: 'Jalan Depan Rumah',
      key: 'street-map',
      file: '/assets/maps/street.json',
      imgKey: 'town-tiles',
      tileSetName: 'town',
      mapBounds: { width: 1280, height: 480 },
      playerStartPos: {
        default: { x: 176, y: 240 },
        house: { x: 176, y: 240 },
        store: { x: 1072, y: 240 },
      },
    },
    store: {
      placeName: 'Indomaret',
      key: 'store-map',
      file: '/assets/maps/store.json',
      imgKey: 'town-tiles',
      tileSetName: 'town',
      mapBounds: { width: 640, height: 480 },
      playerStartPos: {
        default: { x: 320, y: 384 },
        street: { x: 320, y: 384 },
      },
    },
  },
};

export default gameConfig;
