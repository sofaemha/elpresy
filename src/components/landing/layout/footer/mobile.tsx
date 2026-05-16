// filepath: src/components/landing/layout/footer/mobile.tsx
"use client";

import { Sparkles } from "lucide-react";
import Link from "next/link";

export default function Mobile({ t }: { t: any }) {
  const MarqueeContent = () => (
    <>
      <span className="text-3xl font-display font-bold text-white uppercase px-6">
        {t("marqueeUniversity")}
      </span>
      <span className="text-gold text-xl"><Sparkles className="size-8 fill-gold" /></span>
      <span className="text-3xl font-display font-bold text-white uppercase px-6">
        {t("marqueeProgram")}
      </span>
      <span className="text-gold text-xl"><Sparkles className="size-8 fill-gold" /></span>
    </>
  );

  return (
    <div className="flex flex-col md:hidden w-full bg-bg">
      <style>{`
        @keyframes marquee-mobile {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-100%); }
        }
        .animate-marquee-mobile {
          animation: marquee-mobile 15s linear infinite;
        }
      `}</style>

      {/* Top Section - Marquee */}
      <div className="w-full py-8 px-6 flex flex-row items-center justify-center gap-6 bg-bg border-b border-border/30 text-center">
        <div className="flex flex-col gap-1">
          <p className="text-gold/80 font-sans text-[10px] uppercase tracking-widest">
            {t("tutor1Role")}
          </p>
          <Link href="https://estaff.upstegal.ac.id/tenaga-pendidik/386">
            <p className="text-white/90 font-display font-bold text-sm tracking-wide">
              {t("tutor1Name")}
            </p>
          </Link>
        </div>
        <div className="w-12 h-px bg-border/30" />
        <div className="flex flex-col gap-1">
          <p className="text-gold/80 font-sans text-[10px] uppercase tracking-widest">
            {t("tutor2Role")}
          </p>
          <Link href="https://estaff.upstegal.ac.id/tenaga-pendidik/189">
            <p className="text-white/90 font-display font-bold text-sm tracking-wide">
              {t("tutor2Name")}
            </p>
          </Link>
        </div>
      </div>

      {/* Middle Section - Tutors */}
      <div className="w-full overflow-hidden flex items-center bg-bg relative py-6 border-b border-border/30">
        <div className="flex overflow-hidden w-full group">
          <div className="flex animate-marquee-mobile motion-reduce:animate-none shrink-0 items-center">
            <MarqueeContent />
          </div>
          <div className="flex animate-marquee-mobile motion-reduce:animate-none shrink-0 items-center" aria-hidden="true">
            <MarqueeContent />
          </div>
        </div>
      </div>

      {/* Bottom Section - Credits */}
      <div className="w-full flex items-center justify-center py-6 px-6 bg-bg gap-2 text-center">
        <span className="text-gold font-display font-bold text-sm">ELPRESY</span>
        <span className="text-white/50">&mdash;</span>
        <span className="text-white/50 text-xs font-sans">{t("credit")}</span>
      </div>
    </div>
  );
}
