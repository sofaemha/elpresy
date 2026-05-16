import { useTranslations } from "next-intl";
import Profile from "@/components/landing/section/author/profile";

export default function Author() {
  const t = useTranslations("author");

  return (
    <section id="about" className="py-32 bg-surface-2 relative overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5">
        <img src="/upst.png" className="size-full invert object-contain object-center transform transition-transform scale-175 sm:scale-125 md:scale-135 lg:scale-150 xl:scale-175" alt="Logo"/>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <Profile t={t} />
      </div>
    </section>
  );
}
