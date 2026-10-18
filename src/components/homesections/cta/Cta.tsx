import { cn } from "@/lib/utils";
import Button from "../../buttons/Button";
import styles from "./Cta.module.css";
import { MessageCircle } from "lucide-react";

export default function Cta() {
  return (
    <section className={cn(styles.cta, "mt-8 mb-18")} id="kontak">
      <div className="wrap">
        <h2 data-reveal>Siap punya rumah digital untuk usaha Anda?</h2>
        <p data-reveal>Ceritakan usaha Anda. Kami bantu jelaskan isi paket dan langkah berikutnya.</p>

        <div data-reveal>
          {/* <WhatsAppContact phoneNumber="6285798079847" message="Halo, saya tertarik dengan jasa Anda" cta="Konsultasi lewat WhatsApp" /> */}
          
          <Button variant="hero" className="flex items-baseline w-max rounded-2xl py-1 px-2 border" wa><span className='transition-colors duration-150 font-bold group-hover:text-yellow-500'>Konsultasi lewat WhatsApp</span>
            <MessageCircle className="w-4 h-4 ml-1 fill-green-500 stroke-black z-20 opacity-80 group-hover:opacity-100 group-hover:stroke-yellow-300 group-hover:fill-yellow-400 transition-all duration-150 group-hover:translate-x-1" />
          </Button>
        </div>
      </div>
    </section>
  );
}
