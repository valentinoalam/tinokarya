import type { LatLngTuple } from "leaflet";
import type { PinId } from "@/i18n/types";

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

export type Pin = { id: PinId; pos: LatLngTuple; me?: boolean };

/** Pin ilustrasi, bukan bisnis sungguhan. */
export const MAP_PINS: Pin[] = [
  { id: "me", pos: [-6.195, 106.823], me: true },
  { id: "carwash", pos: [-6.1985, 106.8275] },
  { id: "barber", pos: [-6.1905, 106.818] },
  { id: "catering", pos: [-6.199, 106.8185] },
  { id: "coffee", pos: [-6.1912, 106.8282] },
];
