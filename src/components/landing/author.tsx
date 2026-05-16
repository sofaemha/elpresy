import { useTranslations } from "next-intl";
import Profile from "@/components/landing/section/author/profile";

export default function Author() {
  const t = useTranslations("author");

  return (
    <section id="about" className="py-32 bg-surface-2 relative overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.02]">
        <div className="w-[800px] h-[800px] rounded-full border-[100px] border-white" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <Profile t={t} />
      </div>
    </section>
  );
}
