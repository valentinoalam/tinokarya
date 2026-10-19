import Image from "next/image";
import React, { forwardRef } from 'react';
import { TextureOverlay } from "../ui/texture-overlay";
import { useTranslations } from "next-intl";

interface PageProps {
  index: number;
  iscover: boolean;
  nextPage: ()=>void;
  previousPage: ()=>void;
}

// Paragraf biasa berupa string. Diawali "• " = poin daftar.
// "strike" = teks dicoret (cara lama), "quote" = kutipan brand.
type Paragraph = string | { text: string; variant: 'strike' | 'quote' };

interface Face {
  title?: string;
  image?: { src: string; alt: string; width?: number; height?: number };
  paragraphs?: Paragraph[];
}

interface Sheet {
  front: Face;
  back: Face;
}


const Page = forwardRef<HTMLDivElement, PageProps>(({ index, iscover, nextPage=()=>{}, previousPage=()=>{}}, ref) => {
  const t = useTranslations("Book");
  const pageIndex = index;
  const isFrontCover = iscover && index === 0;
  const isBackCover = iscover && index !== 0;

  // Buku kecil: 5 lembar (index 0–4). Index 0 = sampul depan, index 4 = sampul belakang.
  // Ilustrasi ada di public/images/illust/book-*.svg
  // const pageContents: Sheet[] = [
  //   // 0. Sampul: gagasan inti
  //   {
  //     front: {
  //       title: "Website Adalah Rumah",
  //       image: { src: "/images/illust/book-house.svg", alt: "Ilustrasi rumah dengan jendela berbentuk halaman website dan pintu yang terbuka" },
  //       paragraphs: [
  //         "Bukan hanya lapak untuk menjual, tetapi tempat brand Anda bercerita."
  //       ]
  //     },
  //     back: {
  //       title: "Lapak atau Rumah?",
  //       image: { src: "/images/illust/book-lapak-rumah.svg", alt: "Ilustrasi lapak sederhana di kiri dan rumah yang hangat di kanan" },
  //       paragraphs: [
  //         { text: "“Ini produk kami. Silakan beli.”", variant: 'strike' },
  //         "Lapak hanya memajang. Rumah memperkenalkan siapa Anda dan apa yang Anda pedulikan.",
  //         { text: "“Kami memahami masalah Anda, dan kami mengusahakan yang terbaik untuk membantu Anda.”", variant: 'quote' }
  //       ]
  //     }
  //   },

  //   // 1. Pelanggan dan cerita brand
  //   {
  //     front: {
  //       title: "Pelanggan Datang dengan Pertanyaan",
  //       image: { src: "/images/illust/book-pertanyaan.svg", alt: "Ilustrasi pelanggan dengan banyak pertanyaan dan ponsel yang menampilkan jawaban" },
  //       paragraphs: [
  //         "Apa layanannya? Berapa biayanya? Di mana lokasinya? Apakah usaha ini layak dipercaya?",
  //         "Website menjawabnya kapan saja, bahkan saat toko sudah tutup."
  //       ]
  //     },
  //     back: {
  //       title: "Brand Punya Cerita",
  //       image: { src: "/images/illust/book-cerita.svg", alt: "Ilustrasi buku terbuka dengan hati dan bintang yang muncul dari halamannya" },
  //       paragraphs: [
  //         "Latar belakang, nilai, dan cara kerja Anda membantu pelanggan mengenal siapa yang mereka percaya.",
  //         "Produk tetap penting. Namun cerita yang jelas memberi alasan untuk memilih Anda."
  //       ]
  //     }
  //   },

  //   // 2. Usaha setempat dan usaha pengiriman
  //   {
  //     front: {
  //       title: "Untuk Usaha Setempat",
  //       image: { src: "/images/illust/book-setempat.svg", alt: "Ilustrasi toko dengan tenda bergaris, tanda buka, pin lokasi, dan chat WhatsApp" },
  //       paragraphs: [
  //         "Kedai, bengkel, salon, atau klinik: orang sekitar biasanya mencari dulu sebelum datang.",
  //         "• Alamat, peta, dan jam buka",
  //         "• Layanan dan harga yang jelas",
  //         "• Tombol WhatsApp untuk pesan atau reservasi"
  //       ]
  //     },
  //     back: {
  //       title: "Untuk Usaha Pengiriman",
  //       image: {
  //         src: "/images/illust/book-pengiriman.png",
  //         alt: "Ilustrasi truk membawa paket melalui rute menuju kota tujuan",
  //         width: 320,
  //         height: 200,
  //       },
  //       paragraphs: [
  //         "Toko online, UMKM, atau produsen yang melayani pembeli di luar kota.",
  //         "• Katalog lengkap dengan foto dan harga",
  //         "• Informasi pengiriman dan cara memesan",
  //         "• Brand milik sendiri, tidak hanya bergantung pada marketplace"
  //       ]
  //     }
  //   },

  //   // 3. Lebih proper dan langkah awal
  //   {
  //     front: {
  //       title: "Setiap Usaha Lebih Proper",
  //       image: { src: "/images/illust/book-proper.jfif", alt: "Ilustrasi halaman website rapi dengan lencana centang hijau dan bintang lima" },
  //       paragraphs: [
  //         "Melayani di tempat maupun lewat pengiriman, website membuat usaha tampak lebih siap dan layak dipercaya.",
  //         "• Informasi rapi dan mudah ditemukan",
  //         "• Mudah dihubungi",
  //         "• Kesan profesional sejak kunjungan pertama"
  //       ]
  //     },
  //     back: {
  //       title: "Mulai dari yang Sederhana",
  //       image: { src: "/images/illust/book-mulai.svg", alt: "Ilustrasi daftar periksa dengan pensil dan tunas yang baru tumbuh" },
  //       paragraphs: [
  //         "Tulis siapa yang Anda bantu, masalah apa yang Anda selesaikan, dan bagaimana cara menghubungi Anda.",
  //         "Website tidak otomatis mendatangkan pembeli, tetapi membantu mereka yakin ketika tiba. Perbarui seiring usaha Anda tumbuh."
  //       ]
  //     }
  //   },

  //   // 4. Sampul belakang: penutup
  //   {
  //     front: {
  //       title: "Undang Pelanggan Masuk",
  //       image: { src: "/images/illust/book-selamat-datang.svg", alt: "Ilustrasi pintu rumah yang terbuka hangat menyambut tamu" },
  //       paragraphs: [
  //         "Rumah yang baik terasa ramah: jelas, mudah dijelajahi, dan siap membantu.",
  //         "Mulailah dari informasi yang paling dibutuhkan pelanggan Anda."
  //       ]
  //     },
  //     back: {
  //       title: "Website Adalah Rumah",
  //       image: { src: "/images/illust/book-house.svg", alt: "Rumah sebagai simbol brand yang terbuka bagi pelanggan" },
  //       paragraphs: [
  //         { text: "“Kami memahami masalah Anda, dan kami mengusahakan yang terbaik untuk membantu Anda.”", variant: 'quote' },
  //         "Bangun rumah untuk brand Anda."
  //       ]
  //     }
  //   }
  // ];

  const content = (t.raw("pages") as Sheet[])[pageIndex];
  const renderParagraph = (p: Paragraph, key: number) => {
    if (typeof p === 'string') {
      if (p.startsWith('• ')) {
        return <p key={key} className="page-text page-bullet">{p.slice(2)}</p>;
      }
      return <p key={key} className="page-text">{p}</p>;
    }
    return <p key={key} className={`page-text page-text--${p.variant}`}>{p.text}</p>;
  };

  const renderFace = (face: Face, priority = false) => (
    <div className="page-inner font-inter">
      {iscover && <TextureOverlay texture="noise" opacity={0.3} className="-z-10 mix-blend-overlay"/> }
      {!iscover && face.title && <h2 className="page-title font-serif" style={{marginBottom: 0}}>{face.title}</h2>}
      {face.image && (
        <div className="page-figure h-1/2 w-full -z-10 absolute -bottom-3">
          {face.image.width || face.image.height? 
          <Image
            src={face.image.src}
            alt={face.image.alt}
            width={face.image.width || 300}
            height={face.image.height || 300}
            priority={priority}
            unoptimized={face.image.src.endsWith('.svg')}
            style={{ 
              objectFit: 'cover', 
              position: 'absolute',
              top: -60,
              width: '100%',     // or a specific pixel value like '300px'
              height: 'auto'     // <-- Fixes the warning by letting height scale naturally
            }}
          />
          : <Image
            fill
            src={face.image.src}
            alt={face.image.alt}
            sizes="(max-width: 899px) 90vw, 40vw"
            priority={priority}
            
            unoptimized={face.image.src.endsWith('.svg')}
            style={{ objectFit: 'cover' }}
          />  }
        </div>
      )}
      {iscover && face.title && <h2 className="page-title font-serif" style={{marginBottom: 0}}>{face.title}</h2>}
      {face.paragraphs && face.paragraphs.length > 0 && (
        <div className="page-body">{face.paragraphs.map(renderParagraph)}</div>
      )}
    </div>
  );
  return (
    <div
      ref={ref}
      className={`page book__page${iscover ? ' book__cover' : ''} ${isFrontCover ? ' book__cover--front' : ''} ${isBackCover ? ' book__cover--back' : ''}`}
      style={{ '--page-index': pageIndex } as React.CSSProperties}
    >
      
                  
      <div onClick={nextPage} className="page__half page__half--front">
        <div className="book-shadow"></div>
        {content && <div className="page-content">{renderFace(content.front, pageIndex === 0)}</div>}
        {!iscover && <div className="page__number">{2 * index - 1}</div>}
      </div>

      <div onClick={previousPage} className="page__half page__half--back">
        <div className="book-shadow"></div>
        {content && <div className="page-content page-back">{renderFace(content.back)}</div>}
        {!iscover && <div className="page__number">{2 * index}</div>}
      </div>
    </div>
  );
});

Page.displayName = 'Page';

export default Page;