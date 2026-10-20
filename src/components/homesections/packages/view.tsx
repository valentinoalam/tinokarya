
import { useTranslations } from "next-intl";
import Packages from "./Packages";

const PackageSection = () => {
    const t = useTranslations("packages");
    const title = [t("title.hook"), t("title.line")];
    const packages = t.raw("packages")
    const note = t("note")
    return (
        <section id="paket" className="mt-18 w-full"><Packages title={title} packages={packages} note={note}  /></section>
    )
}

export default PackageSection