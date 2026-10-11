import styles from "./UseCase.module.css";

const ITEMS = [
  { title: "Ditemukan di Google", text: "SEO lokal untuk pencarian seperti “cuci mobil terdekat” atau “cuci mobil [kota]”." },
  { title: "Jadwal dan reservasi", text: "Pelanggan bisa memesan lewat tombol “Booking Online” atau “Hubungi WhatsApp”." },
  { title: "Data pelanggan", text: "Email dan nomor WhatsApp terkumpul untuk promosi langsung." },
];
const CHIPS = ["Barbershop", "Catering makanan tradisional", "Usaha kuliner", "Jasa profesional"];

export default function UseCase() {
  return (
    <section className={styles.usecase}>
      <div className="wrap">
        <h2 data-reveal>Contoh: jasa cuci mobil</h2>
        <p className={styles.sub} data-reveal>
          Kategori usaha ini sangat cocok punya website, karena membutuhkan jadwal dan reservasi, serta
          bergantung pada pencarian lokal.
        </p>
        <div className={styles.list} data-reveal-group>
          {ITEMS.map((it) => (
            <div key={it.title}>
              <h3>{it.title}</h3>
              <p>{it.text}</p>
            </div>
          ))}
        </div>
        <div className={styles.chips} data-reveal-group="scale" aria-label="Usaha lain yang cocok">
          {CHIPS.map((c) => <span className={styles.chip} key={c}>{c}</span>)}
        </div>
      </div>
    </section>
  );
}
