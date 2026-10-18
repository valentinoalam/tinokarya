import styles from "./Topbar.module.css";
import { waHref } from "@/lib/whatsapp";

export default function Topbar() {
  return (
    <div className={styles.topbar} data-hero="topbar">
      <span>Paket Dasar Digitalisasi UMKM</span>
      <a href={waHref()} target="_blank" rel="noopener">
        Tanya paket
      </a>
    </div>
  );
}
