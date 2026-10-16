import gameConfig from '../../config/game-config';
import { EventBus } from '../../EventBus';

/**
 * Mengatur kotak dialog.
 * Di template ini tampilannya dirender oleh React (components/GameOverlay.tsx),
 * BoxManager hanya meminta React membuka / menutupnya lewat EventBus.
 *
 *  createBox('dialog') -> dialog objek yang sedang disentuh (Enter)
 *  createBox('tasks')  -> menu Misi & Tas (Shift)
 *  hideBox()           -> menutup (Esc)
 */
export default class BoxManager {
  constructor(scene) {
    this.scene = scene;
    this.isOpen = false;

    // React memberi tahu saat dialog benar-benar terbuka/tertutup
    const off = EventBus.on('ui-lock', (locked) => {
      this.isOpen = !!locked;
      gameConfig.pauseUpdateLoop = !!locked;
      if (!locked) gameConfig.taskMenuOpen = false;
    });
    scene.events.once('shutdown', off);
  }

  createBox(type) {
    if (this.isOpen) return;

    let payload;
    if (type === 'dialog') {
      const data = gameConfig.overlapData.sprite;
      if (!data || !data.kind) return;
      payload = { kind: data.kind, id: data.id };
    } else if (type === 'tasks') {
      payload = { kind: 'tasks', id: 'tasks' };
      gameConfig.taskMenuOpen = true;
    } else {
      return;
    }

    this.isOpen = true;
    gameConfig.pauseUpdateLoop = true;
    this.scene.stopPlayerAnim();
    EventBus.emit('interact', payload);
  }

  hideBox() {
    if (!this.isOpen) return;
    EventBus.emit('close-modal');
  }
}
