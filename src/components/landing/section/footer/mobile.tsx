// filepath: src/components/landing/layout/footer/mobile.tsx
"use client";

import { Sparkles } from "lucide-react";
import Link from "next/link";

export default function Mobile({ t }: { t: any }) {
  return (
    <div className="flex flex-col md:hidden w-full bg-bg">
      {/* Bottom Section - Credits */}
      <div className="w-full flex items-center justify-center py-6 px-6 bg-bg gap-2 text-center">
        <span className="text-gold font-display font-bold text-sm">ELPRESY</span>
        <span className="text-white/50">&mdash;</span>
        <span className="text-white/50 text-xs font-sans">{t("credit")}</span>
      </div>
    </div>
  );
}
