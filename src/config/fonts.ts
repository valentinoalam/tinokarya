import { Bricolage_Grotesque, Figtree, Geist, Inter, Merriweather, Playfair_Display  } from "next/font/google";

export const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});
export const merriweather = Merriweather({
  subsets: ['latin'],
  weight: ['300', '400', '700'], // Pilih weight yang dibutuhkan
  display: 'swap',
  variable: '--font-merriweather',
});
export const playfair = Playfair_Display({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-playfair',
});


export const geist = Geist({subsets:['latin'],variable:'--font-sans'});
export const display = Bricolage_Grotesque({
  subsets: ["latin"],
  axes: ["opsz"],
  variable: "--font-display",
  display: "swap",
});

export const body = Figtree({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});
