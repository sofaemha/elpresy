"use client";

import { Zap } from "lucide-react";

export default function Right() {
  return (
    <div className="relative lg:h-[640px] flex items-center justify-center lg:justify-end">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-gold rounded-full blur-[140px] animate-pulse-gold pointer-events-none" />

      <div className="relative w-full max-w-[420px] bg-surface border border-border rounded-2xl shadow-2xl shadow-black/60 overflow-hidden backdrop-blur-xl h-[400px] flex items-center justify-center flex-col gap-4">
        <Zap className="text-gold" size={48} />
        <p className="text-text-muted font-display font-medium text-sm">ELPRESY</p>
      </div>
    </div>
  );
}