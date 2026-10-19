import styles from "./Compare.module.css";
import { useTranslations } from "next-intl";

export default function Compare() {
  const t = useTranslations("compare");
  return (
    <section id="compare" className={styles.compare}>
      <div className="wrap">
        <h2 data-reveal>{t("title")}</h2>
        <p className={styles.sub} data-reveal>{t("sub")}</p>
        <div className={styles.scroll} data-reveal>
          <table>
            <thead>
              <tr>
                <th />
                <th>{t("headA")}</th>
                <th>{t("headB")}</th>
              </tr>
            </thead>
            <tbody>
              {(t.raw("rows") as [label:string, a:string, b:string]).map(([label, a, b]) => (
                <tr key={label}>
                  <th scope="row">{label}</th>
                  <td>{a}</td>
                  <td>{b}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
