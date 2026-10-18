import SearchMockup from "./SearchMockup";
import styles from "./Intro.module.css";

export default function Intro() {
  return (
    <section id="intro" className={styles.intro}>
      <div className="wrap">
        <div className={styles.grid}>
          <div>
            <h2 data-reveal>Sebelum membeli, orang mencari dulu.</h2>
            <div className={styles.copy} data-reveal-group>
              <p>
                Hari ini, pelanggan tidak selalu menemukan sebuah usaha dari toko, papan nama, atau
                rekomendasi orang terdekat. Banyak yang lebih dulu mencari informasi di internet
                sebelum memutuskan membeli.
              </p>
              <p>
                Website menjadi rumah digital bagi bisnis Anda: tempat pertama calon pelanggan
                mengenal siapa Anda, apa yang Anda tawarkan, dan mengapa usaha Anda layak dipilih.
              </p>
            </div>
          </div>
          <SearchMockup />
        </div>
      </div>
    </section>
  );
}
