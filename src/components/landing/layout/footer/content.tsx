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

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-100%); }
        }
        .animate-marquee {
          animation: marquee 20s linear infinite;
        }
      `}</style>

      {/* Left Column */}
      <div className="w-1/3 p-8 border-r border-gold/20 flex flex-col xl:flex-row items-center justify-center gap-6 bg-bg">
        <div className="flex flex-col gap-1">
          <p className="text-gold/80 font-sans text-xs uppercase tracking-widest">
            {t("tutor1Role")}
          </p>
          <Link href="https://estaff.upstegal.ac.id/tenaga-pendidik/386">
            <p className="text-white/90 font-display font-bold text-sm lg:text-base tracking-wide">
              {t("tutor1Name")}
            </p>
          </Link>
        </div>
        <div className="w-8 h-px bg-border/30" />
        <div className="flex flex-col gap-1">
          <p className="text-gold/80 font-sans text-xs uppercase tracking-widest">
            {t("tutor2Role")}
          </p>
          <Link href="https://estaff.upstegal.ac.id/tenaga-pendidik/189">
            <p className="text-white/90 font-display font-bold text-sm lg:text-base tracking-wide">
              {t("tutor2Name")}
            </p>
          </Link>
        </div>
      </div>

      {/* Right Column (Marquee) */}
      <div className="w-2/3 overflow-hidden flex items-center bg-bg relative py-8">
        <div className="flex overflow-hidden w-full group">
          <div className="flex animate-marquee motion-reduce:animate-none shrink-0 items-center">
            <MarqueeContent />
          </div>
          <div className="flex animate-marquee motion-reduce:animate-none shrink-0 items-center" aria-hidden="true">
            <MarqueeContent />
          </div>
        </div>
      </div>
    </div>
  );
}
