import { useTranslations } from "next-intl";
import Header from "@/components/landing/section/preview/header";
import Mockup from "@/components/landing/section/preview/mockup";
import Proof from "@/components/landing/section/preview/proof";

export default function Preview() {
  const t = useTranslations("preview");

  return (
    <section className="py-28 bg-surface relative overflow-hidden">
      <div className="container mx-auto px-6">
        <Header t={t} />
        <Mockup t={t} />
        <Proof t={t} />
      </div>
    </section>
  );
}
