// filepath: src/components/landing/layout/footer/bottom-bar.tsx
"use client";

import { Globe } from "lucide-react";

export default function BottomBar({ t }: { t: any }) {
  const socials = [
    { name: "BEHANCE", href: "#" },
    { name: "LINKEDIN", href: "#" },
    { name: "INSTAGRAM", href: "#" },
    { name: "X", href: "#" },
  ];

  return (
    <div className="hidden md:flex w-full justify-between items-center px-8 py-6 bg-bg">
      {/* Left */}
      <div className="flex items-center">
        <div className="w-10 h-10 rounded-full border border-gold/20 flex items-center justify-center">
          <Globe className="text-white w-5 h-5" strokeWidth={1} />
        </div>
      </div>
      
      {/* Center - Socials */}
      <div className="flex gap-4">
        {socials.map((s) => (
          <a 
            key={s.name} 
            href={s.href} 
            className="px-6 py-2 rounded-full border border-gold/20 text-white font-sans text-xs tracking-widest transition-all duration-180 hover:border-gold/40 hover:shadow-[0_0_15px_rgba(212,175,55,0.15)] bg-bg"
          >
            {s.name}
          </a>
        ))}
      </div>

      {/* Right */}
      <div className="flex items-center gap-2">
        <span className="text-white/50 text-sm font-sans">{t("craftedBy")}</span>
        <span className="text-gold font-display font-bold">ELPRESY</span>
      </div>
    </div>
  );
}
