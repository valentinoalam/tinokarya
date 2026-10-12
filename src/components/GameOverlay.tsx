'use client';

import { useEffect, useState } from 'react';
import { EventBus } from '../game/EventBus';
import {
  ELECTRICITY_BILL,
  START_MONEY,
  contact,
  infos,
  items,
  meter,
  rupiah,
  type ExtLink,
  type Info,
} from '../game/content';
import styles from './Game.module.css';

type ModalState = { kind: 'info' | 'item' | 'kasir' | 'meter'; id: string } | null;

function Links({ links }: { links?: ExtLink[] }) {
  if (!links?.length) return null;
  return (
    <div className={styles.links}>
      {links.map((l) => (
        <a key={l.href} href={l.href} target="_blank" rel="noopener noreferrer">
          {l.label}
        </a>
      ))}
    </div>
  );
}

function InfoBody({ info }: { info: Info }) {
  return (
    <>
      <h2>{info.title}</h2>
      {info.body.map((p, i) => (
        <p key={i}>{p}</p>
      ))}
      <Links links={info.links} />
    </>
  );
}

export default function GameOverlay({ focused }: { focused: boolean }) {
  const [location, setLocation] = useState('');
  const [money, setMoney] = useState(START_MONEY);
  const [basket, setBasket] = useState<string[]>([]);
  const [owned, setOwned] = useState<string[]>([]);
  const [billPaid, setBillPaid] = useState(false);
  const [modal, setModal] = useState<ModalState>(null);
  const [toast, setToast] = useState<string | null>(null);

  // Phaser -> React
  useEffect(() => {
    const offs = [
      EventBus.on<ModalState>('interact', (p) => setModal(p)),
      EventBus.on<string>('scene-ready', (name) => setLocation(name)),
    ];
    return () => offs.forEach((off) => off());
  }, []);

  // React -> Phaser: karakter berhenti selama dialog terbuka
  useEffect(() => {
    EventBus.emit('ui-lock', modal !== null);
  }, [modal]);

  useEffect(() => {
    if (!modal) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setModal(null);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [modal]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2400);
    return () => clearTimeout(t);
  }, [toast]);

  const basketItems = items.filter((i) => basket.includes(i.id));
  const ownedItems = items.filter((i) => owned.includes(i.id));
  const total = basketItems.reduce((sum, i) => sum + i.price, 0);

  const addToBasket = (id: string) => {
    setBasket((b) => (b.includes(id) ? b : [...b, id]));
    setToast('Masuk keranjang');
  };
  const removeFromBasket = (id: string) => setBasket((b) => b.filter((x) => x !== id));

  const checkout = () => {
    if (total > money) return setToast('Saldo tidak cukup');
    setMoney((m) => m - total);
    setOwned((o) => [...o, ...basket]);
    setBasket([]);
    setToast('Belanjaan terbayar');
  };

  const payBill = () => {
    if (billPaid) return;
    if (money < ELECTRICITY_BILL) return setToast('Saldo tidak cukup untuk listrik');
    setMoney((m) => m - ELECTRICITY_BILL);
    setBillPaid(true);
    setToast('Listrik lunas');
  };

  const press = (x: number, y: number) => EventBus.emit('touch-move', { x, y });
  const dpadBtn = (label: string, area: string, x: number, y: number) => (
    <button
      className={`${styles.pad} ${styles[area]}`}
      aria-label={label}
      onPointerDown={(e) => {
        e.preventDefault();
        press(x, y);
      }}
      onPointerUp={() => press(0, 0)}
      onPointerLeave={() => press(0, 0)}
      onPointerCancel={() => press(0, 0)}
    >
      {label}
    </button>
  );

  function renderModal() {
    if (!modal) return null;

    if (modal.kind === 'info') {
      const info = infos[modal.id];
      return info ? <InfoBody info={info} /> : <p>Belum ada isi untuk “{modal.id}”.</p>;
    }

    if (modal.kind === 'meter') {
      return (
        <>
          <InfoBody info={billPaid ? meter.paid : meter.unpaid} />
          {billPaid && <Links links={contact.links} />}
        </>
      );
    }

    if (modal.kind === 'item') {
      const item = items.find((i) => i.id === modal.id);
      if (!item) return <p>Barang tidak ditemukan.</p>;
      const isOwned = owned.includes(item.id);
      const inBasket = basket.includes(item.id);
      return (
        <>
          <h2>
            {item.emoji} {item.name}
          </h2>
          <p className={styles.muted}>
            {item.tag} · {rupiah(item.price)}
          </p>
          <p>{item.description}</p>
          {isOwned ? (
            <>
              <p className={styles.ok}>Sudah kamu beli.</p>
              <Links links={item.link ? [item.link] : undefined} />
            </>
          ) : (
            <button className={styles.primary} disabled={inBasket} onClick={() => addToBasket(item.id)}>
              {inBasket ? 'Sudah di keranjang' : 'Masukkan ke keranjang'}
            </button>
          )}
        </>
      );
    }

    // kasir
    return (
      <>
        <h2>🧾 Kasir</h2>
        <p className={styles.muted}>Saldo kamu: {rupiah(money)}</p>

        <h3>Keranjang</h3>
        {basketItems.length === 0 ? (
          <p className={styles.muted}>Keranjang kosong. Lihat rak-rak di toko untuk memilih barang.</p>
        ) : (
          <>
            <ul className={styles.list}>
              {basketItems.map((i) => (
                <li key={i.id}>
                  <span>
                    {i.emoji} {i.name}
                  </span>
                  <span>{rupiah(i.price)}</span>
                  <button className={styles.ghost} onClick={() => removeFromBasket(i.id)} aria-label={`Hapus ${i.name}`}>
                    ✕
                  </button>
                </li>
              ))}
            </ul>
            <p>
              <strong>Total: {rupiah(total)}</strong>
            </p>
            <button className={styles.primary} onClick={checkout} disabled={total > money}>
              Bayar belanjaan
            </button>
            {total > money && <p className={styles.warn}>Saldo kurang. Keluarkan beberapa barang.</p>}
          </>
        )}

        <h3>⚡ Token listrik</h3>
        {billPaid ? (
          <p className={styles.ok}>Lunas. Listrik rumah sudah menyala.</p>
        ) : (
          <>
            <p>Tagihan: {rupiah(ELECTRICITY_BILL)}</p>
            <button className={styles.primary} onClick={payBill} disabled={money < ELECTRICITY_BILL}>
              Bayar listrik
            </button>
            {money < ELECTRICITY_BILL && <p className={styles.warn}>Saldo tidak cukup.</p>}
          </>
        )}

        {ownedItems.length > 0 && (
          <>
            <h3>Struk belanja</h3>
            <ul className={styles.list}>
              {ownedItems.map((i) => (
                <li key={i.id}>
                  <span>
                    {i.emoji} {i.name}
                  </span>
                  {i.link ? (
                    <a href={i.link.href} target="_blank" rel="noopener noreferrer">
                      {i.link.label}
                    </a>
                  ) : (
                    <span />
                  )}
                </li>
              ))}
            </ul>
          </>
        )}

        {billPaid && (
          <div className={styles.reward}>
            <InfoBody info={contact} />
          </div>
        )}
      </>
    );
  }

  return (
    <div className={styles.overlay}>
      <div className={styles.hud}>
        <div className={styles.col}>
          <span className={styles.pill}>📍 {location}</span>
          <span className={styles.pill}>💰 {rupiah(money)}</span>
        </div>
        <div className={`${styles.col} ${styles.colRight}`}>
          <span className={styles.pill}>🛒 {basket.length} barang</span>
          <span className={`${styles.pill} ${billPaid ? styles.pillOk : styles.pillWarn}`}>
            {billPaid ? '✅ Listrik lunas' : '⚡ Misi: bayar listrik'}
          </span>
        </div>
      </div>

      {toast && <div className={styles.toast}>{toast}</div>}

      {!focused && !modal && (
        <div className={styles.startHint}>Klik area game, lalu jalan dengan WASD atau panah</div>
      )}

      {!modal && (
        <div className={styles.controls}>
          <div className={styles.dpad}>
            {dpadBtn('▲', 'up', 0, -1)}
            {dpadBtn('◀', 'left', -1, 0)}
            {dpadBtn('▶', 'right', 1, 0)}
            {dpadBtn('▼', 'down', 0, 1)}
          </div>
          <button
            className={styles.action}
            onPointerDown={(e) => {
              e.preventDefault();
              EventBus.emit('touch-action');
            }}
            aria-label="Interaksi"
          >
            E
          </button>
        </div>
      )}

      {modal && (
        <div className={styles.backdrop} onClick={() => setModal(null)}>
          <div className={styles.modal} role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
            <button className={styles.close} onClick={() => setModal(null)} aria-label="Tutup">
              ✕
            </button>
            {renderModal()}
          </div>
        </div>
      )}
    </div>
  );
}
