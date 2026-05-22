// filepath: src/components/landing/layout/footer/content.tsx
"use client";

import { Sparkles } from "lucide-react";
import Link from "next/link";

export default function Content({ t }: { t: any }) {
  // We duplicate the items to create a seamless infinite marquee
  const MarqueeContent = () => (
    <>
      <span className="text-5xl lg:text-7xl font-display font-bold text-white uppercase px-12">
        {t("marqueeUniversity")}
      </span>
      <span className="text-gold text-3xl lg:text-5xl"><Sparkles className="size-15 fill-gold" /></span>
      <span className="text-5xl lg:text-7xl font-display font-bold text-white uppercase px-12">
        {t("marqueeProgram")}
      </span>
      <span className="text-gold text-3xl lg:text-5xl"><Sparkles className="size-15 fill-gold" /></span>
    </>
  );

  return (
    <div className="hidden md:flex w-full border-b border-border/30">

    <div className="hidden md:flex w-full justify-center items-center px-8 py-6 bg-bg">
      <div className="flex items-center gap-2">
        <span className="text-gold font-display font-bold">ELPRESY</span> &mdash; 
        <span className="text-white/50 text-sm font-sans">{t("credit")}</span>
      </div>
    </div>

    </div>
  );
}
