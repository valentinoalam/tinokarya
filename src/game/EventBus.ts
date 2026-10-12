// Jembatan komunikasi super ringan antara Phaser (game) dan React (UI).
// Sengaja tidak memakai Phaser.Events agar file ini aman di-import saat SSR.

type Handler<T> = (payload: T) => void;

class Bus {
  private handlers = new Map<string, Set<Handler<unknown>>>();

  on<T = undefined>(event: string, fn: Handler<T>): () => void {
    if (!this.handlers.has(event)) this.handlers.set(event, new Set());
    this.handlers.get(event)!.add(fn as Handler<unknown>);
    return () => this.handlers.get(event)?.delete(fn as Handler<unknown>);
  }

  emit(event: string, payload?: unknown) {
    this.handlers.get(event)?.forEach((fn) => fn(payload));
  }
}

/**
 * Event yang dipakai:
 *  - 'interact'      Phaser -> React   { kind, id }   pemain menekan E di dekat objek
 *  - 'scene-ready'   Phaser -> React   string         nama lokasi saat ini
 *  - 'ui-lock'       React  -> Phaser  boolean        true = dialog terbuka, karakter berhenti
 *  - 'touch-move'    React  -> Phaser  {x, y}         d-pad layar sentuh
 *  - 'touch-action'  React  -> Phaser  -              tombol E layar sentuh
 */
export const EventBus = new Bus();
