// filepath: src/components/landing/layout/footer.tsx
"use client";

import { useTranslations } from "next-intl";
import Content from "../section/footer/content";
import Mobile from "../section/footer/mobile";

export default function Footer() {
  const t = useTranslations("footer");

  return (
    <footer className="bg-bg w-full flex flex-col items-center relative pt-8 md:pt-0">
      {/* Glowing Neon Gold Top Border */}
      <div className="absolute top-0 left-0 w-full flex justify-center z-1">
        {/* The core bright line */}
        <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-gold/70 to-transparent" />
        {/* The outer glow effect centered */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-[2px] bg-gold blur-[8px] opacity-60" />
      </div>

      <Content t={t} />
      
    <div className="hidden md:flex w-full justify-center items-center px-8 py-6 bg-bg">
      <div className="flex items-center gap-2">
        <span className="text-gold font-display font-bold">ELPRESY</span> &mdash; 
        <span className="text-white/50 text-sm font-sans">{t("credit")}</span>
      </div>
    </div>

      <Mobile t={t} />
    </footer>
  );
}
