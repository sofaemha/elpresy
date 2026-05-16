// filepath: src/components/landing/layout/footer/mobile-variant.tsx
"use client";

import { ArrowUpRight } from "lucide-react";

export default function MobileVariant({ t }: { t: any }) {
  const socials = [
    { name: "BEHANCE", href: "#" },
    { name: "LINKEDIN", href: "#" },
    { name: "INSTAGRAM", href: "#" },
    { name: "X", href: "#" },
  ];

  return (
    <div className="flex flex-col md:hidden w-full px-6 py-16 gap-16 text-center bg-bg">
      <div className="flex flex-col items-center gap-6">
        <h3 className="text-white font-display font-bold uppercase tracking-widest text-sm">
          {t("mobileReady")}
        </h3>
        <h2 className="text-gold font-display font-bold text-5xl leading-tight">
          {t("mobileChat")}
        </h2>
        <button className="mt-6 bg-bg border border-border/30 px-6 py-3 rounded-full flex items-center gap-4 text-white text-sm tracking-widest uppercase hover:border-gold/40 hover:shadow-[0_0_15px_rgba(212,175,55,0.15)] transition-all duration-180">
          {t("contactBtn")}
          <div className="w-8 h-8 rounded-full border border-gold/30 flex items-center justify-center">
            <ArrowUpRight className="w-4 h-4 text-gold" />
          </div>
        </button>
      </div>
      
      <div className="flex flex-wrap justify-center gap-x-4 gap-y-3 text-text-faint text-xs font-sans uppercase tracking-widest">
        {socials.map((s, i) => (
          <div key={s.name} className="flex items-center gap-4">
            <a href={s.href} className="hover:text-white transition-colors">{s.name}</a>
            {i < socials.length - 1 && <span className="text-border/30">·</span>}
          </div>
        ))}
      </div>

      <div className="flex flex-col items-center gap-3 pt-8">
        <span className="text-white/50 text-xs font-sans">{t("craftedBy")}</span>
        <span className="text-gold font-display font-bold text-base tracking-widest">ELPRESY</span>
      </div>
    </div>
  );
}
