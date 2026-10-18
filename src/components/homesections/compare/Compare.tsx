import styles from "./Compare.module.css";

const ROWS = [
  ["Kendali atas tampilan dan konten", "Mengikuti aturan platform", "Anda menyusun informasi, cerita, visual, dan penawaran sendiri"],
  ["Iklan pesaing", "Bisa muncul di sekitar produk Anda (marketplace)", "Pengalaman pengguna sepenuhnya Anda arahkan"],
  ["Perubahan algoritma", "Jangkauan bergantung kebijakan pihak ketiga", "Aset pribadi yang bisa Anda kontrol penuh"],
  ["Data pelanggan", "Ada di platform", "Email dan nomor WhatsApp bisa Anda kumpulkan sendiri"],
  ["Alamat resmi", "Akun di platform", "Alamat web dengan domain sendiri"],
];

export default function Compare() {
  return (
    <section id="compare" className={styles.compare}>
      <div className="wrap">
        <h2 data-reveal>Media sosial melengkapi. Website menjadi milik Anda.</h2>
        <p className={styles.sub} data-reveal>Keduanya berguna. Perbedaannya ada pada siapa yang memegang kendali.</p>
        <div className={styles.scroll} data-reveal>
          <table>
            <thead>
              <tr>
                <th />
                <th>Hanya media sosial atau marketplace</th>
                <th>Dengan website sendiri</th>
              </tr>
            </thead>
            <tbody>
              {ROWS.map(([label, a, b]) => (
                <tr key={label}>
                  <th scope="row">{label}</th>
                  <td>{a}</td>
                  <td>{b}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
