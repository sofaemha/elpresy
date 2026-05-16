// filepath: src/components/landing/layout/footer/content.tsx
"use client";

import { Sparkles } from "lucide-react";

export default function Content({ t }: { t: any }) {
  // We duplicate the items to create a seamless infinite marquee
  const MarqueeContent = () => (
    <>
      <span className="text-5xl lg:text-7xl font-display font-bold text-white uppercase px-12">
        {t("marqueeEmail")}
      </span>
      <span className="text-gold text-3xl lg:text-5xl">✦</span>
      <span className="text-5xl lg:text-7xl font-display font-bold text-white uppercase px-12">
        {t("marqueeEmail")}
      </span>
      <span className="text-gold text-3xl lg:text-5xl">✦</span>
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
      <div className="w-1/3 p-8 border-r border-gold/20 flex items-center bg-bg">
        <p className="text-white/70 font-sans text-sm uppercase tracking-wider leading-relaxed">
          {t("ctaText")}
        </p>
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
