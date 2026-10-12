// ============================================================
//  SEMUA ISI HALAMAN "ABOUT ME" ADA DI FILE INI.
//  Ganti teks, tautan, dan harga sesuai keinginanmu.
// ============================================================

export type ExtLink = { label: string; href: string };
export type Info = { title: string; body: string[]; links?: ExtLink[] };
export type Item = {
  id: string;
  emoji: string;
  name: string;
  price: number;
  tag: string;
  description: string;
  link?: ExtLink;
};

export const profile = {
  name: 'Nama Kamu',
  role: 'Web Developer',
  intro:
    'Selamat datang di rumah saya. Jalan-jalan dulu, lalu mampir ke Indomaret: ada token listrik yang harus dibayar.',
};

/** Uang awal pemain. Pastikan total harga item + tagihan listrik tidak melebihi ini. */
export const START_MONEY = 150_000;
/** Tagihan listrik yang harus dibayar di kasir. */
export const ELECTRICITY_BILL = 50_000;

export const rupiah = (n: number) => 'Rp' + n.toLocaleString('id-ID');

/** Objek di dalam rumah & jalan. Kunci = id yang dipakai di scene. */
export const infos: Record<string, Info> = {
  bed: {
    title: '🛏️ Tentang Saya',
    body: [
      'Halo, saya Nama Kamu, seorang web developer yang tinggal di Jakarta.',
      'Saya suka membangun hal kecil yang berguna: dari dashboard sampai game iseng.',
    ],
  },
  desk: {
    title: '💻 Skill & Teknologi',
    body: [
      'Sehari-hari saya memakai TypeScript, React, Next.js, dan Node.js.',
      'Sedang belajar: Phaser, WebGL, dan sedikit Rust.',
    ],
  },
  shelf: {
    title: '📚 Pendidikan & Pengalaman',
    body: [
      '2018–2022 · S1 Teknik Informatika, Universitas Contoh.',
      '2022–sekarang · Frontend Developer di Perusahaan Contoh.',
    ],
  },
  trophy: {
    title: '🏆 Pencapaian',
    body: [
      'Juara 2 Hackathon Contoh 2023.',
      'Kontributor open source dengan 500+ bintang di GitHub.',
    ],
  },
  sofa: {
    title: '🛋️ Hobi',
    body: [
      'Ngopi, main gim indie, dan sepeda sore di akhir pekan.',
      'Kalau sedang santai, saya biasanya mengutak-atik proyek sampingan.',
    ],
  },
  sign: {
    title: '🪧 Papan Petunjuk',
    body: [
      'Gerak: WASD atau tombol panah. Interaksi: E, Spasi, atau Enter.',
      'Misi: ambil uang di rumah? Tidak perlu, dompet sudah terisi. Pergilah ke Indomaret di ujung kanan jalan dan bayar listrik.',
      'Kamu juga bisa belanja: setiap barang di rak adalah salah satu proyek saya.',
    ],
  },
  cat: {
    title: '🐈 Kucing Tetangga',
    body: ['Meong. (Kucing ini tidak tahu apa-apa soal listrik, tapi dia setuju kamu harus cepat.)'],
  },
};

/** Barang di rak Indomaret = proyek/portofolio. Maksimal 12 item. */
export const items: Item[] = [
  {
    id: 'p1',
    emoji: '🥤',
    name: 'Es Teh Dashboard',
    price: 8_000,
    tag: 'Proyek · React',
    description: 'Dashboard penjualan untuk warung teh: grafik harian, stok, dan laporan otomatis.',
    link: { label: 'Lihat proyek', href: 'https://example.com/es-teh' },
  },
  {
    id: 'p2',
    emoji: '🍞',
    name: 'Roti Landing Page',
    price: 12_000,
    tag: 'Proyek · Next.js',
    description: 'Landing page toko roti dengan pemesanan lewat WhatsApp dan skor Lighthouse 98.',
    link: { label: 'Lihat proyek', href: 'https://example.com/roti' },
  },
  {
    id: 'p3',
    emoji: '☕',
    name: 'Kopi API Service',
    price: 15_000,
    tag: 'Proyek · Node.js',
    description: 'REST API untuk katalog biji kopi lengkap dengan autentikasi dan rate limit.',
    link: { label: 'Lihat proyek', href: 'https://example.com/kopi-api' },
  },
  {
    id: 'p4',
    emoji: '🍿',
    name: 'Snack UI Kit',
    price: 10_000,
    tag: 'Open source · Design system',
    description: 'Kumpulan komponen UI yang ringan, aksesibel, dan mudah di-tema.',
    link: { label: 'Lihat di GitHub', href: 'https://github.com/username/snack-ui' },
  },
  {
    id: 'p5',
    emoji: '🥛',
    name: 'Susu Mobile App',
    price: 20_000,
    tag: 'Proyek · React Native',
    description: 'Aplikasi pengingat minum dan kebiasaan sehat dengan notifikasi lokal.',
    link: { label: 'Lihat proyek', href: 'https://example.com/susu-app' },
  },
  {
    id: 'p6',
    emoji: '🍫',
    name: 'Cokelat Open Source',
    price: 25_000,
    tag: 'Open source · CLI',
    description: 'Alat CLI untuk membuat boilerplate proyek dalam satu perintah.',
    link: { label: 'Lihat di GitHub', href: 'https://github.com/username/cokelat' },
  },
];

/** Dialog meteran listrik di rumah. */
export const meter = {
  unpaid: {
    title: '⚡ Meteran Listrik',
    body: [
      'Layar meteran berkedip merah: token hampir habis.',
      'Jalan ke Indomaret di ujung kanan jalan, lalu bayar di kasir.',
    ],
  } as Info,
  paid: {
    title: '⚡ Meteran Listrik',
    body: ['Token terisi. Lampu rumah menyala normal. Terima kasih sudah membantu!'],
  } as Info,
};

/** Hadiah setelah listrik lunas: kontak kamu. */
export const contact: Info = {
  title: '🎉 Listrik lunas!',
  body: ['Terima kasih sudah mampir. Kalau mau ngobrol atau kerja bareng, hubungi saya lewat:'],
  links: [
    { label: 'Email', href: 'mailto:halo@example.com' },
    { label: 'GitHub', href: 'https://github.com/username' },
    { label: 'LinkedIn', href: 'https://linkedin.com/in/username' },
    { label: 'Instagram', href: 'https://instagram.com/username' },
  ],
};
