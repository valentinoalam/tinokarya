/** Isi NEXT_PUBLIC_BASE_PATH bila situs dipasang di sub-path (mis. GitHub Pages: /nama-repo). */
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/** Tautan antar-halaman memakai <a> biasa, jadi base path harus ditambahkan manual. */
export const withBase = (path: string) => `${BASE_PATH}${path}`;
