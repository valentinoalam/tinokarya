export const WA_NUMBER = process.env.NEXT_PUBLIC_WA_NUMBER ?? "6285798079847";
export const WA_TEXT = "Halo, saya tertarik dengan Paket Dasar Digitalisasi UMKM.";

export const waHref = (text: string=WA_TEXT) =>
  `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`;
