import { useTranslations } from "next-intl";
import SearchMockup from "./SearchMockup";
import styles from "./Intro.module.css";

export default function Intro() {
  const t = useTranslations("intro");
  return (
    <section id="intro" className={styles.intro}>
      <div className="wrap">
        <div className={styles.grid}>
          <div>
            <h2 data-reveal>{t("title")}</h2>
            <div className={styles.copy} data-reveal-group>
              <p>{t("p1")}</p>
              <p>{t("p2")}</p>
            </div>
          </div>
          <SearchMockup />
        </div>
      </div>
    </section>
  );
}
