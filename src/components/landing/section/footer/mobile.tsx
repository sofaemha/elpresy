// filepath: src/components/landing/section/footer/mobile.tsx
"use client";

import { Zap } from "lucide-react";
import { useTranslations } from "next-intl";

export default function Mobile({ t }: { t: ReturnType<typeof useTranslations> }) {
  return (
    <div className="flex flex-col md:hidden w-full bg-bg py-10 px-6 items-center justify-center gap-3 text-center">
      <div className="flex items-center gap-2">
        <Zap className="size-4 fill-gold text-gold" />
        <span className="text-gold font-display font-bold text-sm tracking-widest">ELPRESY</span>
      </div>
      <p className="text-text-muted text-xs font-sans leading-relaxed">
        {t("credit")}
      </p>
    </div>
  );
}
