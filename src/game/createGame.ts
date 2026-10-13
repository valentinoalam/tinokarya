import Phaser from 'phaser';
import BootScene from './scenes/BootScene';
import HouseScene from './scenes/HouseScene';
import StoreScene from './scenes/StoreScene';
import StreetScene from './scenes/StreetScene';

export function createGame(parent: HTMLElement, keyboardTarget: HTMLElement) {
  return new Phaser.Game({
    type: Phaser.AUTO,
    parent,
    width: 640,
    height: 480,
    backgroundColor: '#10242b',
    pixelArt: true,
    roundPixels: true,
    physics: { default: 'arcade', arcade: { debug: false } },
    scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH },
    // Keyboard hanya aktif saat area game difokuskan, jadi scroll halaman tidak terganggu.
    input: { keyboard: { target: keyboardTarget } },
    scene: [BootScene, HouseScene, StreetScene, StoreScene],
  });
}