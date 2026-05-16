import { useTranslations } from "next-intl";
import Header from "@/components/landing/section/features/header";
import Grid from "@/components/landing/section/features/grid";

export default function Features() {
  const t = useTranslations("features");

  return (
    <section id="features" className="py-28 bg-surface-2 relative">
      <div className="container mx-auto px-6">
        <Header t={t} />
        <Grid t={t} />
      </div>
    </section>
  );
}
