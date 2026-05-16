import { useTranslations } from "next-intl";
import Header from "@/components/landing/section/research/header";
import Content from "@/components/landing/section/research/content";
import Specs from "@/components/landing/section/research/specs";

export default function Research() {
  const t = useTranslations("research");

  return (
    <section id="research" className="py-28 bg-bg relative">
      <div className="container mx-auto px-6">
        <Header t={t} />

        {/* Two-Column Layout with Gold Divider */}
        <div className="grid lg:grid-cols-2 gap-0 items-stretch relative">
          <Content t={t} />

          {/* ── Gold Vertical Divider (desktop only) ── */}
          <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 -translate-x-1/2">
            <div className="w-[1px] h-full bg-gradient-to-b from-transparent via-gold/30 to-transparent" />
          </div>

          <Specs t={t} />
        </div>
      </div>
    </section>
  );
}
