import type { Metadata } from 'next';
import { Pixelify_Sans } from 'next/font/google';
import GameLoader from '@/components/GameLoader';
import { infos, profile } from '@/game/content';
import styles from './about.module.css';

const pixel = Pixelify_Sans({ subsets: ['latin'], weight: ['500', '700'], display: 'swap' });

export const metadata: Metadata = {
  title: `Tentang ${profile.name}`,
  description: `${profile.name}, ${profile.role}. Jelajahi rumah dan Indomaret untuk mengenal saya.`,
};

// Teks di bawah ini ikut dirender di server: berguna untuk SEO, pembaca layar,
// dan pengunjung yang tidak bisa memainkan game.
const textSections = ['bed', 'desk', 'shelf', 'trophy', 'sofa'].map((id) => infos[id]);

export default function AboutPage() {
  return (
    <main className={styles.page}>
      <div className={styles.inner}>
        <header className={styles.header}>
          <h1 className={`${styles.title} ${pixel.className}`}>Halo, saya {profile.name}</h1>
          <p className={styles.lead}>{profile.intro}</p>
        </header>

        <GameLoader />
        <p className={styles.help}>WASD / panah untuk jalan · E, Spasi, atau Enter untuk interaksi · Esc untuk menutup</p>

        <section className={styles.fallback} aria-labelledby="ringkasan">
          <h2 id="ringkasan" className={pixel.className}>
            Versi teks
          </h2>
          <p>Ringkasan yang sama tanpa harus keliling rumah.</p>
          <div className={styles.grid}>
            {textSections.map((s) => (
              <article key={s.title}>
                <h3>{s.title}</h3>
                {s.body.map((line, i) => (
                  <p key={i}>{line}</p>
                ))}
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
