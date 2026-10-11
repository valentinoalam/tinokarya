import type { LatLngTuple } from "leaflet";

/** Pusat peta ilustrasi (Jakarta Pusat). Ganti sesuai kota target. */
export const MAP_CENTER: LatLngTuple = [-6.195, 106.823];
export const MAP_ZOOM = 15;

/**
 * Tile OpenStreetMap cukup untuk pengembangan / trafik ringan.
 * Untuk produksi dengan trafik tinggi, pakai penyedia tile sendiri
 * (MapTiler, Stadia, Carto, dsb.) dan sesuaikan atribusinya.
 */
export const TILE_URL = "https://tile.openstreetmap.org/{z}/{x}/{y}.png";
export const TILE_ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a>';

export type Pin = { label: string; pos: LatLngTuple; me?: boolean };

/** Pin ilustrasi, bukan bisnis sungguhan. */
export const MAP_PINS: Pin[] = [
  { label: "Usaha Anda", pos: [-6.195, 106.823], me: true },
  { label: "Cuci mobil", pos: [-6.1985, 106.8275] },
  { label: "Barbershop", pos: [-6.1905, 106.818] },
  { label: "Catering", pos: [-6.199, 106.8185] },
  { label: "Kopi", pos: [-6.1912, 106.8282] },
];
