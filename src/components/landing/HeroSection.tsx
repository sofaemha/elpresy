import { ArrowRight, Activity, TrendingUp, Zap, Clock, BarChart3, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";

export default function HeroSection() {
  const t = useTranslations("hero");

  return (
    <section className="relative min-h-[100dvh] flex flex-col justify-center pt-20 overflow-hidden">
      {/* Background Subtle Grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)",
          backgroundSize: "4rem 4rem",
        }}
      />

      {/* Ambient corner glow */}
      <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-gold rounded-full blur-[200px] animate-pulse-gold pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10 grid lg:grid-cols-2 gap-16 items-center">
        {/* Left Content */}
        <div className="flex flex-col items-start max-w-[55ch]">
          <div className="h-[1px] w-12 bg-gold mb-6" />

          <Badge
            variant="outline"
            className="border-gold/30 text-gold-light bg-gold/5 mb-6 rounded-full px-4 py-1 font-medium"
          >
            {t("badge")}
          </Badge>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold leading-[1.1] tracking-tight mb-6">
            <span className="text-transparent bg-clip-text bg-gradient-to-br from-white via-zinc-200 to-zinc-500">
              {t("headline1")}
            </span>
            <br />
            <span className="gold-shimmer">{t("headline2")}</span>
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-br from-zinc-300 to-zinc-600">
              {t("headline3")}
            </span>
          </h1>

          <p className="text-lg text-text-muted mb-10 leading-relaxed font-light">
            {t("subheadline")}
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <Button className="bg-gold hover:bg-gold-light text-black font-semibold rounded-full px-8 py-6 h-auto text-base transition-all duration-300 group shadow-[0_0_20px_rgba(201,168,76,0.25)] hover:shadow-[0_0_30px_rgba(201,168,76,0.4)]">
              {t("ctaPrimary")}
              <ArrowRight
                className="ml-2 group-hover:translate-x-1 transition-transform"
                size={18}
              />
            </Button>
            <Button
              variant="ghost"
              className="text-text-primary hover:text-gold hover:bg-gold/10 rounded-full px-8 py-6 h-auto text-base transition-all duration-300"
            >
              {t("ctaSecondary")}
            </Button>
          </div>
        </div>

        {/* Right Visualization — Detailed Mock UI */}
        <div className="relative lg:h-[640px] flex items-center justify-center lg:justify-end">
          {/* Ambient Glow behind card */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-gold rounded-full blur-[140px] animate-pulse-gold pointer-events-none" />

          <div className="relative w-full max-w-[420px] bg-surface border border-border rounded-2xl shadow-2xl shadow-black/60 overflow-hidden backdrop-blur-xl transition-transform duration-500 hover:-translate-y-2 group">
            {/* Window Chrome */}
            <div className="px-5 py-3.5 border-b border-border/50 bg-surface-2/60 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
                </div>
              </div>
              <div className="flex-1 flex justify-center">
                <div className="px-4 py-1 bg-black/40 rounded-md border border-border/30 text-[10px] text-text-faint font-mono">
                  elpresy.app/predict
                </div>
              </div>
              <div className="w-12" />
            </div>

            {/* App Header inside card */}
            <div className="px-5 py-3 border-b border-border/30 bg-surface-2/30 flex items-center justify-between">
              <div className="flex items-center gap-2 text-text-primary font-display font-semibold text-sm">
                <Zap className="text-gold" size={14} fill="currentColor" />
                <span>ELPRESY</span>
              </div>
              <div className="flex items-center gap-3 text-text-faint text-[10px] font-medium">
                <span className="hover:text-text-muted cursor-default">Dashboard</span>
                <span className="text-gold border-b border-gold pb-0.5 cursor-default">Predict</span>
                <span className="hover:text-text-muted cursor-default">History</span>
              </div>
            </div>

            {/* Main Prediction Form */}
            <div className="p-5 space-y-5">
              {/* Status Badge */}
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] text-emerald-400/80 font-medium uppercase tracking-wider">
                  {t("mockStatus")}
                </span>
              </div>

              {/* Input Fields */}
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <label className="text-[11px] text-text-muted font-medium uppercase tracking-wider flex items-center gap-1.5">
                    <Activity size={10} className="text-gold/60" />
                    {t("mockAmpereLabel")}
                  </label>
                  <div className="h-9 w-full bg-zinc-900/80 rounded-lg border border-border/50 flex items-center justify-between px-3 group-hover:border-gold/20 transition-colors">
                    <span className="text-text-primary font-mono text-sm">1.2</span>
                    <span className="text-[10px] text-text-faint font-mono">A</span>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] text-text-muted font-medium uppercase tracking-wider flex items-center gap-1.5">
                    <Clock size={10} className="text-gold/60" />
                    {t("mockHoursLabel")}
                  </label>
                  <div className="h-9 w-full bg-zinc-900/80 rounded-lg border border-border/50 flex items-center justify-between px-3 group-hover:border-gold/20 transition-colors">
                    <span className="text-text-primary font-mono text-sm">8.5</span>
                    <span className="text-[10px] text-text-faint font-mono">hrs/day</span>
                  </div>
                </div>
              </div>

              {/* Predict Button */}
              <button className="w-full h-10 bg-gold/90 hover:bg-gold text-black text-sm font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(201,168,76,0.15)]">
                <BarChart3 size={14} />
                {t("mockPredict")}
              </button>

              {/* Results Area */}
              <div className="pt-4 border-t border-border/40 space-y-4">
                <div className="flex items-center gap-2 mb-1">
                  <CheckCircle2 size={12} className="text-emerald-400" />
                  <span className="text-[10px] text-emerald-400/80 font-medium">{t("mockComplete")}</span>
                </div>

                <div className="flex items-end justify-between">
                  <div>
                    <div className="text-[10px] text-text-faint uppercase tracking-wider mb-1">
                      {t("mockResultLabel")}
                    </div>
                    <div className="text-4xl font-display font-bold text-white leading-none">
                      8.4<span className="text-lg text-text-muted ml-0.5">A</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <div className="flex items-center text-gold gap-1">
                      <TrendingUp size={12} />
                      <span className="text-xs font-semibold">+2.4%</span>
                    </div>
                    <span className="text-[9px] text-text-faint">{t("mockVsLast")}</span>
                  </div>
                </div>

                {/* Mini Confidence Stats */}
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { label: t("mockConfidence"), value: "94.2%" },
                    { label: t("mockMin"), value: "7.8 A" },
                    { label: t("mockMax"), value: "9.1 A" },
                  ].map((stat) => (
                    <div
                      key={stat.label}
                      className="bg-zinc-900/60 rounded-md px-2.5 py-2 border border-border/30"
                    >
                      <div className="text-[9px] text-text-faint uppercase tracking-wider">
                        {stat.label}
                      </div>
                      <div className="text-xs font-semibold text-text-primary font-mono mt-0.5">
                        {stat.value}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Mini Line Chart */}
                <div className="bg-zinc-900/40 rounded-lg border border-border/30 p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[9px] text-text-faint uppercase tracking-wider">
                      {t("mockTrend")}
                    </span>
                    <span className="text-[9px] text-gold font-mono">{t("mockLive")}</span>
                  </div>
                  <div className="h-14 w-full relative">
                    <svg
                      className="w-full h-full"
                      preserveAspectRatio="none"
                      viewBox="0 0 100 50"
                    >
                      <defs>
                        <linearGradient id="heroChartGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#C9A84C" stopOpacity="0.3" />
                          <stop offset="100%" stopColor="#C9A84C" stopOpacity="0" />
                        </linearGradient>
                      </defs>
                      {/* Grid lines */}
                      <line x1="0" y1="12.5" x2="100" y2="12.5" stroke="#ffffff" strokeOpacity="0.03" strokeWidth="0.5" />
                      <line x1="0" y1="25" x2="100" y2="25" stroke="#ffffff" strokeOpacity="0.03" strokeWidth="0.5" />
                      <line x1="0" y1="37.5" x2="100" y2="37.5" stroke="#ffffff" strokeOpacity="0.03" strokeWidth="0.5" />
                      {/* Area fill */}
                      <path
                         d="M0,40 C8,38 12,30 20,28 C28,26 32,35 40,30 C48,25 52,15 60,18 C68,21 72,25 80,20 C88,15 92,8 100,10 L100,50 L0,50 Z"
                        fill="url(#heroChartGrad)"
                      />
                      {/* Line */}
                      <path
                        d="M0,40 C8,38 12,30 20,28 C28,26 32,35 40,30 C48,25 52,15 60,18 C68,21 72,25 80,20 C88,15 92,8 100,10"
                        fill="none"
                        stroke="#C9A84C"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                      {/* End dot */}
                      <circle cx="100" cy="10" r="2.5" fill="#C9A84C" />
                      <circle cx="100" cy="10" r="4" fill="#C9A84C" fillOpacity="0.2" />
                    </svg>
                    {/* Day labels */}
                    <div className="absolute -bottom-3 left-0 right-0 flex justify-between text-[7px] text-text-faint font-mono">
                      <span>Mon</span>
                      <span>Tue</span>
                      <span>Wed</span>
                      <span>Thu</span>
                      <span>Fri</span>
                      <span>Sat</span>
                      <span>Sun</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
