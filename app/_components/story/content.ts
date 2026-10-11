
export type Slide = {
  judul: string;
  gambar: string; // Assuming gambar is a URL or path to an image
  cerita: string;
};

type Story = {
  judul: string;
  slides: Slide[];
};
export const cerita_bergambar: Story[] = [
  {
    judul: "Yummy Cake",
    slides: [
      { 
        judul: "Perjuangan Dina dan Toko Kue 'Yummy Cake'",
        gambar: "/story-slides/1-1.png",
        cerita: "Dina adalah seorang ibu rumah tangga yang pandai membuat kue. Kue-kue buatannya selalu laris manis di lingkungan rumahnya. Teman-teman dan tetangga sering memesan kue ulang tahun, kue kering, atau dessert box untuk acara-acara spesial. Melihat potensi ini, Dina memutuskan untuk membuka usaha kecil-kecilan bernama 'Lezatnya Dina'."
      },
      {
        judul: "Promosi Media Sosial",
        gambar: "/story-slides/1-2.png",
        cerita: "Awalnya, Dina hanya mengandalkan pesanan dari mulut ke mulut. Namun, lama-kelamaan, ia merasa usahanya tidak berkembang. Teman-temannya menyarankan untuk mempromosikan kuenya di media sosial. Dina pun membuat akun Instagram dan Facebook untuk memamerkan foto-foto kue buatannya. Pesanan pun mulai berdatangan dari luar lingkungan rumahnya."
      },
      {
        judul: "Pesanan Besar yang Hilang",
        gambar: "/story-slides/1-3-3.jpg",
        cerita: "Suatu hari, Dina mendapat pesanan besar dari seorang calon pelanggan yang menemukan akun Instagram-nya. Pelanggan itu ingin memesan 50 box dessert untuk acara kantor. Namun, si pelanggan kebingungan karena Dina hanya mengandalkan pesan langsung di Instagram. Tidak ada informasi lengkap tentang menu, harga, atau cara pemesanan. Akhirnya, si pelanggan memilih toko kue lain yang memiliki website dengan informasi lengkap."
      },
      {
        judul: "Membuat Landing Page",
        gambar: "/story-slides/1-4.png",
        cerita: "Dina pun menyadari kekurangannya. Ia belajar dari temannya yang sudah berpengalaman di dunia digital dan memutuskan untuk membuat landing page sederhana untuk usahanya. Di landing page tersebut, Dina menampilkan foto-foto kue terbaiknya, daftar menu lengkap dengan harga, testimoni dari pelanggan yang puas, dan tombol 'Pesan Sekarang' yang langsung terhubung ke WhatsApp-nya."
      },
      {
        judul: "Hasil Luar Biasa",
        gambar: "/story-slides/1-5.png",
        cerita: "Setelah landing page-nya aktif, Dina membagikan link-nya di media sosial dan iklan online. Hasilnya luar biasa! Banyak pelanggan baru yang merasa lebih nyaman karena semua informasi ada di satu halaman. Mereka tidak perlu lagi bertanya-tanya tentang harga atau menu. Bahkan, Dina mulai mendapat pesanan dari kota-kota lain berkat iklan online yang mengarahkan calon pelanggan ke landing page-nya."
      },
    ]
  },
  {
    judul: "CreativeInk",
    slides: [
      {
        judul: "Perjalanan Rian dan Jasa Desain Grafis 'CreativeInk'",
        gambar: "/story-slides/2-1.png",
        cerita: "Rian adalah seorang desainer grafis berbakat yang baru memulai bisnis jasa desain bernama 'CreativeInk'. Awalnya, Rian hanya mengandalkan platform freelance lokal untuk mendapatkan proyek. Namun, ia merasa platform tersebut mengambil komisi besar dan membuatnya sulit membangun identitas bisnisnya sendiri. Rian pun memutuskan untuk mencari cara agar klien bisa langsung menghubunginya."
      },
      {
        judul: "Klien Potensial yang Hilang",
        gambar: "/story-slides/2-2.png",
        cerita: "Suatu hari, Rian bertemu dengan seorang calon klien potensial melalui rekomendasi teman. Klien tersebut membutuhkan desain logo dan branding untuk usaha barunya. Rian dengan antusias menjelaskan portofolio dan layanannya melalui email. Namun, klien tersebut meminta Rian mengirimkan link website atau halaman khusus yang berisi informasi lengkap tentang jasanya, termasuk portofolio, harga paket, dan testimoni dari klien sebelumnya. Rian kebingungan karena ia tidak memiliki website atau landing page. Ia hanya mengandalkan file PDF yang berisi portofolio dan penawaran harga. Klien tersebut akhirnya memilih desainer lain yang sudah memiliki website profesional dengan informasi lengkap dan mudah diakses."
      },
      {
        judul: "Membuat Landing Page",
        gambar: "/story-slides/2-3.png",
        cerita: "Menyadari kesalahannya, Rian segera membuat landing page sederhana untuk 'CreativeInk'. Di landing page tersebut, Rian menampilkan portofolio desain terbaiknya, paket layanan beserta harganya, testimoni dari klien sebelumnya, dan tombol 'Hubungi Saya' yang langsung terhubung ke email dan WhatsApp-nya."
      },
      {
        judul: "Hasil Menakjubkan",
        gambar: "/story-slides/2-4.png",
        cerita: "Setelah landing page-nya selesai, Rian mulai mempromosikannya di media sosial, forum desain, dan grup komunitas bisnis. Hasilnya sungguh menakjubkan! Banyak calon klien yang merasa lebih nyaman karena semua informasi yang mereka butuhkan sudah tersedia di satu halaman. Mereka tidak perlu lagi bertanya-tanya tentang harga atau proses kerja. Bahkan, Rian mulai mendapatkan klien dari luar kota dan luar negeri berkat promosi online yang mengarahkan calon klien ke landing page-nya."
      },
    ]
  },
  {
    judul: "Wanderlust Adventures",
    slides: [
      {
        judul: "Usaha Tour & Travel 'Wanderlust Adventures' milik Andi",
        gambar: "/story-slides/3-1.webp",
        cerita: "Andi adalah seorang pemandu wisata yang memiliki usaha tour & travel bernama 'Wanderlust Adventures'. Usahanya menawarkan paket wisata ke destinasi alam eksotis, seperti hiking ke gunung, menjelajahi hutan, atau mengunjungi pantai-pantai tersembunyi. Awalnya, Andi hanya mengandalkan promosi dari mulut ke mulut dan brosur fisik yang dibagikan di kafe-kafe atau tempat nongkrong anak muda."    
      },
      {
        judul: "Peluang yang Hilang",
        gambar: "/story-slides/3-2.webp",
        cerita: "Suatu hari, Andi mendapat kabar bahwa ada komunitas pecinta alam dari kota besar yang sedang mencari paket wisata untuk 30 orang. Mereka menemukan nama 'Wanderlust Adventures' dari rekomendasi teman, tetapi ketika mencoba mencari informasi lebih lanjut secara online, mereka tidak menemukan website atau landing page yang bisa diakses. Andi hanya memiliki akun Instagram yang jarang di-update, dan tidak ada informasi lengkap tentang paket wisata, harga, atau itinerary. Komunitas tersebut akhirnya memilih biro perjalanan lain yang memiliki website profesional dengan informasi lengkap, foto-foto destinasi, dan testimoni dari pelanggan sebelumnya. Andi pun kehilangan peluang besar karena calon kliennya tidak bisa menemukan informasi yang mereka butuhkan."
      },
      {
        judul: "Membuat Landing Page",
        gambar: "/story-slides/3-3-1.jpeg",
        cerita: "Menyadari hal ini, Andi memutuskan untuk membuat landing page sederhana untuk 'Wanderlust Adventures'. Di landing page tersebut, Andi menampilkan foto-foto destinasi wisata yang menakjubkan, daftar paket wisata beserta harganya, itinerary lengkap untuk setiap paket, testimoni dari pelanggan yang puas, dan tombol 'Daftar Sekarang' yang langsung terhubung ke WhatsApp-nya."
      },
      {
        judul: "Hasil Luar Biasa",
        gambar: "/story-slides/3-4-4.jpeg",
        cerita: "Setelah landing page-nya aktif, Andi mulai mempromosikannya melalui Google Ads dan media sosial. Hasilnya luar biasa! Banyak calon pelanggan yang merasa lebih percaya karena semua informasi tersedia dengan jelas. Mereka tidak perlu lagi bertanya-tanya tentang harga atau jadwal. Bahkan, Andi mulai mendapatkan pelanggan dari luar daerah yang tertarik dengan paket wisatanya."
      },
    ]
  },
  {
    judul: "SkillUp Academy",
    slides: [
      {
        judul: "Bisnis Online Course 'SkillUp Academy' milik Sarah",
        gambar: "/story-slides/4-1.jpeg",
        cerita: "Sarah adalah seorang ahli pemasaran digital yang memutuskan untuk membuat bisnis online course bernama 'SkillUp Academy'. Ia menawarkan kursus online tentang digital marketing, SEO, dan content creation. Awalnya, Sarah hanya mengandalkan platform kursus online untuk menjual kelasnya. Namun, ia merasa platform tersebut mengambil komisi besar dan membatasi kreativitasnya dalam mempromosikan kelas."    
      },
      {
        judul: "Webinar yang Menarik",
        gambar: "/story-slides/4-2-1.jpeg",
        cerita: "Suatu hari, Sarah mengikuti webinar dan berkesempatan untuk mempromosikan kursusnya kepada ratusan peserta. Ia memberikan presentasi yang menarik, dan banyak peserta yang tertarik untuk mendaftar. Namun, ketika Sarah hanya memberikan link ke platform kursus online, banyak peserta yang merasa kurang nyaman karena harus mendaftar dan membayar melalui platform tersebut. Beberapa bahkan meminta link langsung ke website atau halaman khusus yang bisa memberikan informasi lebih lengkap."
      },
      {
        judul: "Membuat Landing Page",
        gambar: "/story-slides/4-3-2.jpeg",
        cerita: "Sarah pun menyadari pentingnya memiliki landing page sendiri. Ia segera membuat landing page untuk 'SkillUp Academy' yang berisi deskripsi lengkap tentang kursus yang ditawarkan, daftar modul dan manfaat yang akan didapatkan, testimoni dari peserta sebelumnya, dan tombol 'Daftar Sekarang' yang langsung mengarahkan ke pembayaran."
      },
      {
        judul: "Peningkatan Jumlah Pendaftar",
        gambar: "/story-slides/4-3-4.jpeg",
        cerita: "Setelah landing page-nya aktif, Sarah mulai mempromosikannya melalui webinar, email marketing, dan iklan Facebook. Hasilnya, jumlah pendaftar kursusnya meningkat signifikan karena calon peserta merasa lebih nyaman dan percaya dengan informasi yang tersedia di landing page-nya."
      }
    ]
  },
];