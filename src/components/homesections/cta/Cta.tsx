import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import Button from "../../buttons/Button";
import styles from "./Cta.module.css";
import { MessageCircle } from "lucide-react";

export default function Cta() {
  const t = useTranslations("cta");
  const wa = useTranslations("wa");
  return (
    <section className={cn(styles.cta, "relative mt-8 lg:mb-30")} id="kontak">
      <div className="wrap">
        <h2 data-reveal>{t("title")}</h2>
        <p data-reveal>{t("text")}</p>
        <div data-reveal>
          <Button variant="hero" className="flex items-baseline w-max rounded-2xl py-1 px-2 border" wa>
            <span className='transition-colors duration-150 font-bold group-hover:text-yellow-500'>{wa("cta")}</span>
            <MessageCircle className="w-4 h-4 ml-1 fill-green-500 stroke-black z-20 opacity-80 group-hover:opacity-100 group-hover:stroke-yellow-300 group-hover:fill-yellow-400 transition-all duration-150 group-hover:translate-x-1" />
          </Button>
        </div>
      </div>
    </section>
  );
}
