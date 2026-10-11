import type { ProjectItem } from "@/components/scroll-stack-deck";

export interface CaseSection {
  id: string;
  heading: string;
  paragraphs?: string[];
  /** Daftar tanpa urutan. */
  bullets?: string[];
  /** Daftar berurutan (alur / langkah). */
  steps?: string[];
  /** Potongan teknis pendek, mis. endpoint atau path. */
  code?: string[];
  /** Catatan / batasan yang sengaja dibuka secara jujur. */
  callout?: string;
}

export interface CaseStudy {
  slug: string;
  name: string;
  /** Satu kalimat untuk kartu & metadata. */
  tagline: string;
  summary: string;
  category: string;
  stack: string[];
  /** Isi dengan URL website yang sudah live. */
  websiteUrl: string;
  image: string;
  /** Warna pastel, dipakai di kartu deck dan hero halaman studi kasus. */
  color: string;
  highlights: string[];
  sections: CaseSection[];
  principle: string;
  /** Catatan di akhir halaman. */
  closingNote?: string;
}

export const caseStudies: CaseStudy[] = [
  {
    slug: "shine-carwash",
    name: "Shine Carwash",
    tagline: "Website booking cuci mobil yang tampil cepat di atas data Google Sheets.",
    summary:
      "Website layanan cuci mobil dengan booking online, pengisian formulir otomatis, dan caching bertingkat agar kuota Google Sheets API tetap hemat.",
    category: "Booking layanan",
    stack: ["Next.js", "Google Sheets API", "Caching bertingkat", "WhatsApp"],
    websiteUrl: "https://carwash-tino.vercel.app/", // TODO: ganti dengan URL Shine Carwash
    image:
      "https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?auto=format&fit=crop&w=1600&q=80",
    color: "#C9DFF5",
    highlights: [
      "Antarmuka tampil tanpa menunggu API",
      "Katalog diambil ulang hanya saat versinya berubah",
      "Booking dicatat ke Sheets dan diteruskan ke WhatsApp",
    ],
    principle:
      "Tampilkan data secepat mungkin, periksa perubahan dengan biaya sekecil mungkin, dan ambil data lengkap hanya ketika benar-benar diperlukan.",
    sections: [
      {
        id: "gambaran",
        heading: "Gambaran proyek",
        paragraphs: [
          "Shine Carwash adalah website layanan cuci mobil yang membantu pelanggan mengenali layanan, melihat pilihan paket, dan memesan secara online. Website ini juga menjadi antarmuka operasional yang menghubungkan pelanggan, data layanan, informasi kendaraan, dan pencatatan booking.",
          "Data layanan dan booking dikelola di Google Sheets, sehingga pemilik bisa memperbarui harga atau paket lewat spreadsheet tanpa dashboard admin dan database konvensional sejak awal.",
        ],
      },
      {
        id: "tantangan",
        heading: "Tantangan: data dinamis, kuota API terbatas",
        paragraphs: [
          "Setiap permintaan ke Google Sheets API memakai kuota dan tunduk pada batasan penggunaan. Kalau data diambil setiap kali halaman dibuka, jumlah permintaan naik, waktu respons jadi tidak konsisten, dan kuota bisa cepat habis.",
          "Pengembangan difokuskan pada tiga hal:",
        ],
        bullets: [
          "Performa: halaman menampilkan konten dengan cepat, bahkan sebelum data server tersedia.",
          "Efisiensi data: permintaan ke Google Sheets diminimalkan lewat caching dan pemeriksaan versi.",
          "Kemudahan pemesanan: data pelanggan dan kendaraan dipakai ulang agar tidak mengisi formulir berulang.",
        ],
      },
      {
        id: "arsitektur-caching",
        heading: "Arsitektur caching bertingkat",
        paragraphs: [
          "Aplikasi menggabungkan data lokal, cache server, dan penyimpanan sementara di sisi klien. Setiap lapisan punya tugas berbeda:",
        ],
        steps: [
          "Local fallback data: file /data/services menyediakan data awal agar antarmuka selalu bisa tampil.",
          "Client in-memory cache: menyimpan data layanan selama aplikasi berjalan di browser, sehingga navigasi berikutnya tidak perlu fetch ulang.",
          "Next.js server cache: menyimpan hasil pengambilan dari Google Sheets agar permintaan berikutnya tidak selalu memanggil Google API.",
          "Version endpoint: memberi tahu versi katalog terbaru untuk mengetahui apakah sumber data berubah.",
          "Google Sheets API: sumber data utama, diperiksa atau diambil ketika diperlukan.",
        ],
      },
      {
        id: "instant-shell",
        heading: "Instant Shell First",
        paragraphs: [
          "Saat halaman booking dibuka, aplikasi tidak menunggu Google Sheets selesai merespons. Kalau data ada di cache klien, langsung dipakai. Kalau tidak, aplikasi menampilkan data awal dari /data/services, sementara pemeriksaan data terbaru berjalan di latar belakang.",
          "Data lokal adalah fallback, bukan pengganti sumber utama. Begitu data terbaru tiba, tampilan diperbarui bertahap tanpa pelanggan memuat ulang halaman.",
        ],
      },
      {
        id: "revalidasi-versi",
        heading: "Revalidasi cache berbasis versi",
        paragraphs: [
          "Agar data tetap mutakhir tanpa mengunduh seluruh katalog, aplikasi memakai variabel versi (catalogVersion) yang naik setiap kali data layanan berubah. Klien memeriksanya lewat endpoint ringan, lalu membandingkan dengan versi data yang sedang dipakai.",
          "Versi sama: data dipertahankan. Versi berbeda: klien mengambil katalog terbaru, memperbarui cache, lalu merender ulang komponen terkait.",
        ],
        code: ["/api/catalog/version", "/api/catalog"],
        steps: [
          "Pelanggan membuka halaman booking.",
          "Aplikasi memeriksa client in-memory cache; kalau kosong, memakai data awal dari /data/services.",
          "Secara paralel, aplikasi memeriksa versi lewat /api/catalog/version.",
          "Versi sama: pertahankan data. Versi berbeda: ambil katalog terbaru lewat /api/catalog.",
          "Cache klien diperbarui dan komponen dirender ulang.",
        ],
      },
      {
        id: "integrasi-sheets",
        heading: "Integrasi Google Sheets lewat server",
        paragraphs: [
          "Browser tidak pernah berbicara langsung dengan Google Sheets API. Semua akses lewat endpoint server-side Next.js, sehingga kredensial tetap di server, transformasi dan validasi data terpusat, dan operasi tulis bisa dikendalikan.",
          "Untuk deployment serverless, cache dalam memori proses Node.js tidak otomatis bertahan setelah restart dan tidak dibagi antar-instance. Karena itu Next.js Data Cache atau penyimpanan bersama dipakai sesuai kebutuhan deployment.",
        ],
      },
      {
        id: "login-autofill",
        heading: "Identifikasi pelanggan dan pengisian otomatis",
        paragraphs: [
          "Pelanggan memasukkan nama dan email. Jika cocok dengan pelanggan terdaftar, informasi seperti nomor telepon dan data kendaraan diambil kembali dan disimpan di local storage, lalu mengisi formulir booking secara otomatis. Pelanggan tetap bisa memeriksa dan mengubahnya sebelum mengirim.",
        ],
        callout:
          "Login nama + email adalah identifikasi sederhana, bukan autentikasi yang kuat, dan local storage bukan perlindungan identitas. Bila data pelanggan harus dilindungi, tambahkan autentikasi dan otorisasi yang sesuai.",
      },
      {
        id: "booking-whatsapp",
        heading: "Booking dan integrasi WhatsApp",
        paragraphs: [
          "Formulir menggabungkan data pelanggan, kendaraan, dan layanan terpilih. Setelah divalidasi, data dikirim ke endpoint server untuk dicatat ke Google Sheets, lalu ringkasannya disusun menjadi pesan WhatsApp agar pelanggan melanjutkan lewat kanal yang sudah familier.",
          "WhatsApp berfungsi sebagai kanal komunikasi, Google Sheets sebagai pencatatan operasional, sehingga data booking tidak bergantung pada riwayat chat. Booking baru berstatus pending dan diperbarui setelah konfirmasi.",
        ],
      },
      {
        id: "batas-ip",
        heading: "Pembatasan booking berdasarkan IP",
        paragraphs: [
          "Server memeriksa apakah IP pengirim sudah membuat booking dalam periode pembatasan. Pemeriksaan dilakukan di server agar tidak mudah dilewati dengan mengubah kode di browser.",
          "IP diperlakukan sebagai salah satu sinyal, bukan identitas mutlak: beberapa pelanggan bisa berbagi Wi-Fi yang sama, dan satu pelanggan bisa berganti IP saat pindah jaringan. Untuk hasil yang lebih andal, dikombinasikan dengan identitas pelanggan, token idempotensi, dan batas waktu pemesanan.",
        ],
      },
      {
        id: "konsistensi",
        heading: "Pertimbangan teknis dan konsistensi data",
        bullets: [
          "Versi katalog harus punya sumber kebenaran yang jelas dan diperbarui bersama perubahan data, atau memakai hash/timestamp yang dihitung konsisten.",
          "Versi harus bisa diperiksa tanpa membaca seluruh sheet, kalau tidak penghematan API menjadi terbatas.",
          "Bila sumber versi tidak terjangkau, aplikasi tetap memakai cache yang ada dan dapat menampilkan status pembaruan.",
          "Cache server dan cache klien punya siklus hidup berbeda; sinkronisasi dijaga lewat pemeriksaan versi berkala atau saat halaman kembali aktif.",
          "Penulisan booking butuh validasi server-side, penanganan kegagalan Sheets API, dan pencegahan duplikasi saat permintaan dikirim ulang.",
          "Pada deployment di balik proxy, alamat IP harus diambil dari header tepercaya yang dikonfigurasi benar.",
        ],
      },
      {
        id: "hasil",
        heading: "Hasil yang diharapkan",
        bullets: [
          "Waktu tampil awal lebih singkat karena antarmuka dirender dari data lokal atau cache.",
          "Penggunaan API lebih efisien: katalog diambil ulang hanya saat versi berubah atau cache kosong.",
          "Informasi layanan lebih konsisten berkat pemeriksaan versi.",
          "Pengisian formulir lebih praktis karena data pelanggan dan kendaraan dipakai ulang.",
          "Pencatatan booking terstruktur di Google Sheets tanpa dashboard khusus.",
        ],
      },
    ],
    closingNote:
      "Bagian hasil di atas adalah hasil yang diharapkan dari rancangan, bukan klaim hasil pengujian. Tambahkan data aktual (waktu muat, jumlah permintaan API sebelum dan sesudah caching) setelah diukur.",
  },
  {
    slug: "barbershop",
    name: "Barbershop Booking & Shop",
    tagline: "Satu platform untuk reservasi pangkas rambut dan toko produk original.",
    summary:
      "Website barbershop dengan dua alur transaksi terpisah, booking jadwal barber dan toko produk perawatan rambut, dalam satu ekosistem Next.js.",
    category: "Booking layanan + e-commerce",
    stack: ["Next.js", "Server validation", "Cart & checkout", "Payment gateway"],
    websiteUrl: "https://barbershop-tino.vercel.app", // TODO: ganti dengan URL website barbershop
    image:
      "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=1600&q=80",
    color: "#F7E0C8",
    highlights: [
      "Slot jadwal divalidasi ulang di server",
      "Status booking dan status pesanan dipisah",
      "Harga dan stok tidak dipercaya dari browser",
    ],
    principle:
      "Menyatukan pengalaman pelanggan tanpa mencampuradukkan logika operasional booking jasa dan penjualan produk.",
    sections: [
      {
        id: "gambaran",
        heading: "Gambaran proyek",
        paragraphs: [
          "Website ini mengintegrasikan layanan pangkas rambut dengan penjualan produk perawatan rambut original. Tujuannya bukan hanya mempermudah pelanggan melihat layanan dan reservasi, tetapi juga membuka kanal pendapatan di luar layanan utama.",
          "Ada dua alur transaksi: booking layanan berdasarkan jadwal barber, dan pembelian produk lewat halaman shop. Pelanggan mengakses keduanya dari satu platform, sementara pengelola mendapat struktur data yang rapi untuk reservasi, katalog, dan pesanan.",
        ],
      },
      {
        id: "tantangan",
        heading: "Tantangan dan pendekatan solusi",
        paragraphs: [
          "Layanan bergantung pada ketersediaan waktu dan barber, sedangkan produk punya stok, harga, varian, dan pengiriman. Satu formulir generik untuk keduanya akan membingungkan dan sulit dikembangkan, sehingga logika booking dan pembelian dipisah, tetapi tetap memakai komponen antarmuka dan sistem data yang konsisten.",
        ],
        bullets: [
          "Menampilkan layanan, barber, dan produk dengan cepat.",
          "Mencegah benturan jadwal reservasi.",
          "Menjaga konsistensi harga dan ketersediaan stok.",
          "Menyederhanakan pengisian informasi pelanggan.",
          "Memisahkan status booking dari status pesanan produk.",
          "Pengalaman mobile yang nyaman.",
        ],
      },
      {
        id: "arsitektur",
        heading: "Arsitektur aplikasi",
        paragraphs: [
          "Next.js dipilih karena mendukung rendering di server dan klien, routing berbasis file, dan caching yang bisa disesuaikan per jenis data. Halaman informasional seperti beranda, layanan, dan katalog dioptimalkan untuk kecepatan dan SEO; fitur interaktif seperti pemilihan jadwal, filter produk, keranjang, dan checkout memakai komponen client-side.",
          "Validasi dan perubahan data dikelola di lapisan server, tidak bergantung pada browser.",
        ],
        steps: [
          "Presentation layer: beranda, booking, shop, detail produk, riwayat transaksi.",
          "Application layer: pemilihan layanan, pemeriksaan jadwal, keranjang, checkout, pengelolaan status.",
          "Data layer: pelanggan, layanan, barber, jadwal, produk, stok, transaksi.",
          "Integration layer: WhatsApp, pembayaran, pengiriman, atau sistem eksternal lain.",
        ],
      },
      {
        id: "booking",
        heading: "Sistem booking layanan",
        paragraphs: [
          "Pelanggan memilih layanan (haircut, haircut and wash, beard trim, paket grooming) lengkap dengan harga dan durasi, lalu memilih barber tertentu atau yang tersedia lebih awal. Slot waktu dihitung dari jadwal kerja barber, durasi layanan, waktu istirahat, dan reservasi yang sudah ada.",
        ],
        steps: [
          "Pelanggan membuka halaman booking.",
          "Memilih layanan dan cabang jika tersedia.",
          "Memilih barber atau opsi barber yang tersedia.",
          "Memilih tanggal dan slot waktu.",
          "Mengisi atau memeriksa informasi pelanggan.",
          "Server memvalidasi ulang ketersediaan slot.",
          "Reservasi disimpan dan diberi nomor booking.",
          "Pelanggan menerima ringkasan dan instruksi konfirmasi.",
        ],
        callout:
          "Validasi di antarmuka saja tidak cukup. Saat formulir dikirim, server memeriksa ulang jadwal agar dua pelanggan tidak bisa memesan slot yang sama bersamaan. Bila perlu deposit, slot hold dengan masa berlaku dapat dipakai sebelum booking dikonfirmasi. Status booking: pending, confirmed, completed, cancelled, no_show.",
      },
      {
        id: "shop",
        heading: "Halaman shop produk original",
        paragraphs: [
          "Shop adalah katalog sekaligus kanal penjualan pomade, hair clay, hair wax, shampoo, conditioner, tonic, dan perlengkapan grooming lain. Klaim original perlu didukung sumber yang bisa dipertanggungjawabkan, seperti distributor resmi atau faktur pembelian, bukan sekadar label pemasaran.",
        ],
        bullets: [
          "Katalog dengan foto, harga, ukuran/varian, dan status stok.",
          "Kategori dan filter berdasarkan jenis, merek, atau kebutuhan rambut.",
          "Detail produk dengan deskripsi dan petunjuk penggunaan.",
          "Keranjang untuk meninjau barang sebelum checkout.",
          "Checkout dengan ringkasan biaya produk, pengiriman, diskon, dan total.",
          "Riwayat pesanan dan status pemenuhan.",
        ],
      },
      {
        id: "checkout",
        heading: "Keranjang dan checkout",
        paragraphs: [
          "Isi keranjang disimpan sementara di local storage agar tetap ada saat pelanggan berpindah halaman atau kembali lagi. Namun harga dan stok dari local storage tidak dianggap sebagai sumber kebenaran: saat checkout, server mengambil atau memvalidasi ulang harga, varian, dan stok dari data utama.",
        ],
        steps: [
          "Pelanggan menjelajahi katalog dan memilih produk serta varian.",
          "Menambahkan ke keranjang dan memeriksa ringkasan.",
          "Mengisi informasi penerima dan alamat pengiriman.",
          "Server memvalidasi harga, stok, dan biaya pengiriman.",
          "Sistem membuat pesanan dengan nomor transaksi.",
          "Pelanggan membayar; pengelola memproses dan memperbarui status pengiriman.",
        ],
        callout:
          "Status pesanan dipisah dari status booking karena siklus operasionalnya berbeda: pending_payment, paid, processing, shipped, delivered, cancelled.",
      },
      {
        id: "pelanggan",
        heading: "Pengelolaan pelanggan",
        paragraphs: [
          "Pelanggan yang sudah teridentifikasi bisa memakai ulang nama, email, dan nomor telepon di booking maupun checkout. Local storage cocok untuk preferensi dan data keranjang non-sensitif, sedangkan data identitas privat sebaiknya dilindungi sesi autentikasi yang aman. Riwayat booking dan riwayat pesanan tetap dicatat terpisah agar mudah ditelusuri.",
        ],
      },
      {
        id: "caching",
        heading: "Caching dan performa",
        paragraphs: [
          "Data yang cocok di-cache: daftar layanan, profil barber, kategori dan deskripsi produk, serta konten informasional. Data yang wajib divalidasi ulang saat transaksi: slot booking, harga final, stok, dan status pembayaran.",
          "Gambar produk dioptimalkan lewat ukuran yang sesuai, format modern, dan lazy loading untuk gambar di luar viewport pada katalog yang panjang.",
        ],
      },
      {
        id: "keamanan",
        heading: "Keamanan dan integritas transaksi",
        bullets: [
          "Validasi input booking dan checkout di server.",
          "Pemeriksaan ulang jadwal sebelum reservasi dikonfirmasi.",
          "Harga dan total dihitung di server.",
          "Idempotency key untuk mencegah pesanan atau pembayaran ganda.",
          "Pembatasan frekuensi permintaan untuk mengurangi penyalahgunaan.",
          "Pengamanan endpoint admin dan data pelanggan.",
          "Status pembayaran diverifikasi lewat notifikasi payment gateway, bukan hanya redirect.",
          "Perubahan status transaksi dicatat agar operasional bisa ditelusuri.",
          "Stok diperbarui secara konsisten agar transaksi bersamaan tidak menjual melebihi stok.",
        ],
      },
      {
        id: "hasil",
        heading: "Hasil yang diharapkan",
        paragraphs: [
          "Website menjadi lebih dari profil digital: mendukung dua jalur pendapatan sekaligus, layanan berdasarkan reservasi dan penjualan produk. Bagi pengelola, data booking dan pesanan yang terstruktur membantu memahami permintaan layanan, produk populer, frekuensi kunjungan, dan pola pembelian.",
        ],
      },
    ],
    closingNote:
      "Bagian hasil di atas adalah hasil yang diharapkan, bukan klaim hasil pengujian. Perkuat dengan data aktual setelah website selesai: waktu muat halaman, jumlah langkah booking, hasil uji benturan jadwal, dan keberhasilan checkout.",
  },
];

export function getCaseStudy(slug: string) {
  return caseStudies.find((c) => c.slug === slug);
}

/** Bentuk data yang dibutuhkan ScrollStackDeck. */
export const showcaseProjects: ProjectItem[] = caseStudies.map((c, i) => ({
  id: c.slug,
  tabTitle: `${String(i + 1).padStart(2, "0")} · ${c.name}`,
  title: `${c.name}: ${c.tagline}`,
  description: c.summary,
  image: c.image,
  color: c.color,
  href: `/study-case/${c.slug}`,
  websiteUrl: c.websiteUrl,
  tags: c.stack,
}));