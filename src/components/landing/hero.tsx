import { useTranslations } from "next-intl";
import { Ambient, Background } from "@/components/landing/section/hero/background";
import Left from "@/components/landing/section/hero/content/left";
import Right from "@/components/landing/section/hero/content/right";

export default function Hero() {
  const t = useTranslations("hero");

  return (
    <section className="relative min-h-[100dvh] flex flex-col justify-center pt-20 overflow-hidden">
      <div className="container mx-auto px-6 relative z-10 grid lg:grid-cols-2 gap-16 items-center">
        <Background />
        <Ambient />

        <Left t={t}/>
        <Right t={t}/>
      </div>
    </section>
  );
}
