import { cn } from "@/lib/utils";
import styles from "./Packages.module.css";

const LATER = [
  "Katalog produk", "Sistem pemesanan dan booking", "Artikel dan blog", "Formulir konsultasi",
  "Integrasi WhatsApp", "Newsletter", "Sistem pembayaran", "Berbagai otomatisasi bisnis",
];

export default function Packages() {
  return (
    <section id="paket">
      <div className="wrap">
        <h2 className="sec-title text-center font-black text-4xl" data-reveal>Mulai dari yang dasar. Kembangkan saat bisnis siap.</h2>
        <div className={cn(styles.grid, "w-[80%] mx-auto")} data-reveal-group>
          <div className={`${styles.col} ${styles.now}`}>
            <h3 className="text-left font-black text-xl">Paket Dasar</h3>
            <p className={styles.tag}>Website resmi berisi informasi usaha</p>
            <ul>
              <li>Profil usaha</li>
              <li>Layanan</li>
              <li>Portofolio</li>
              <li>Kontak</li>
            </ul>
          </div>
          <div className={`${styles.col} ${styles.later}`}>
            <h3 className="text-left font-black text-xl">Bisa ditambahkan kemudian</h3>
            <p className={styles.tag}>Website berkembang mengikuti bisnis Anda</p>
            <ul>
              {LATER.map((t) => <li key={t}>{t}</li>)}
            </ul>
          </div>
        </div>
        <p className={cn(styles.note, "text-center mx-auto w-max")} data-reveal>
          Website bukan sekadar biaya untuk “punya halaman di internet”. Ia adalah aset digital yang
          dapat terus dikembangkan seiring pertumbuhan bisnis Anda.
        </p>
      </div>
    </section>
  );
}
