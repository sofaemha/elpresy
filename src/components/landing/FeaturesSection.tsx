import { Network, LineChart, History, Download, Languages } from "lucide-react";

export default function FeaturesSection() {
  return (
    <section id="features" className="py-28 bg-surface-2 relative">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="mb-16 max-w-2xl">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4 tracking-tight">
            Everything You Need to Analyze AC Energy Consumption
          </h2>
          <p className="text-lg text-text-muted leading-relaxed">
            A comprehensive suite of tools built for rigorous academic analysis and practical energy monitoring.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

          {/* ── Large Card — Prediction Engine (spans 2 cols, 2 rows) ── */}
          <div className="lg:col-span-2 lg:row-span-2 relative rounded-2xl border border-white/[0.06] bg-bg p-8 md:p-10 flex flex-col justify-between overflow-hidden group transition-all duration-500 hover:border-white/[0.1] min-h-[340px]">
            {/* Hover gold gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-gold/0 via-gold/0 to-gold/0 group-hover:from-gold/[0.04] group-hover:via-transparent group-hover:to-gold/[0.02] transition-all duration-700 pointer-events-none rounded-2xl" />
            {/* Large ambient accent */}
            <div className="absolute -right-16 -top-16 w-64 h-64 bg-gold/[0.06] rounded-full blur-[80px] pointer-events-none group-hover:bg-gold/[0.12] transition-all duration-700" />

            <div className="relative z-10 flex flex-col h-full justify-between">
              <div>
                <Network className="text-gold mb-6" size={28} strokeWidth={1.5} />
                <h3 className="text-2xl md:text-3xl font-display font-bold text-white mb-3 tracking-tight">
                  CART Decision Tree<br />Regression Engine
                </h3>
                <p className="text-text-muted leading-relaxed max-w-md">
                  Powered by the <span className="text-gold font-medium">ml-cart</span> algorithm, our prediction engine delivers high-accuracy estimations using robust machine learning models optimized for continuous variables.
                </p>
              </div>

              {/* Decorative mini-visual: decision tree abstraction */}
              <div className="mt-8 flex items-end gap-3 opacity-40 group-hover:opacity-60 transition-opacity duration-500">
                {[
                  { w: "w-16", h: "h-1" },
                  { w: "w-10", h: "h-1" },
                  { w: "w-24", h: "h-1" },
                  { w: "w-8", h: "h-1" },
                  { w: "w-20", h: "h-1" },
                  { w: "w-12", h: "h-1" },
                ].map((bar, i) => (
                  <div key={i} className={`${bar.w} ${bar.h} bg-gold rounded-full`} />
                ))}
              </div>
            </div>
          </div>

          {/* ── Charts & Visualization ── */}
          <div className="relative rounded-2xl border border-white/[0.06] bg-bg p-7 flex flex-col overflow-hidden group transition-all duration-500 hover:border-white/[0.1] min-h-[200px]">
            <div className="absolute inset-0 bg-gradient-to-br from-gold/0 to-gold/0 group-hover:from-gold/[0.03] group-hover:to-transparent transition-all duration-700 pointer-events-none rounded-2xl" />

            <div className="relative z-10 flex flex-col h-full">
              <LineChart className="text-gold mb-5" size={22} strokeWidth={1.5} />
              <h3 className="text-lg font-display font-semibold text-white mb-2 tracking-tight">
                Charts & Visualization
              </h3>
              <p className="text-text-muted text-sm leading-relaxed">
                Interactive charts that map out your predictions over time, making it easy to spot trends and anomalies.
              </p>
            </div>
          </div>

          {/* ── History & Log ── */}
          <div className="relative rounded-2xl border border-white/[0.06] bg-bg p-7 flex flex-col overflow-hidden group transition-all duration-500 hover:border-white/[0.1] min-h-[200px]">
            <div className="absolute inset-0 bg-gradient-to-br from-gold/0 to-gold/0 group-hover:from-gold/[0.03] group-hover:to-transparent transition-all duration-700 pointer-events-none rounded-2xl" />

            <div className="relative z-10 flex flex-col h-full">
              <History className="text-gold mb-5" size={22} strokeWidth={1.5} />
              <h3 className="text-lg font-display font-semibold text-white mb-2 tracking-tight">
                History & Log
              </h3>
              <p className="text-text-muted text-sm leading-relaxed">
                A detailed repository of all past predictions. Filter, search, and review historical data with ease.
              </p>
            </div>
          </div>

          {/* ── Export Data ── */}
          <div className="relative rounded-2xl border border-white/[0.06] bg-bg p-7 flex flex-col overflow-hidden group transition-all duration-500 hover:border-white/[0.1] min-h-[200px]">
            <div className="absolute inset-0 bg-gradient-to-br from-gold/0 to-gold/0 group-hover:from-gold/[0.03] group-hover:to-transparent transition-all duration-700 pointer-events-none rounded-2xl" />

            <div className="relative z-10 flex flex-col h-full">
              <Download className="text-gold mb-5" size={22} strokeWidth={1.5} />
              <h3 className="text-lg font-display font-semibold text-white mb-2 tracking-tight">
                Export Data
              </h3>
              <p className="text-text-muted text-sm leading-relaxed">
                Export your findings instantly to CSV and PDF formats for academic reporting and further analysis.
              </p>
            </div>
          </div>

          {/* ── Multi-language ── */}
          <div className="relative rounded-2xl border border-white/[0.06] bg-bg p-7 flex flex-col overflow-hidden group transition-all duration-500 hover:border-white/[0.1] min-h-[200px]">
            <div className="absolute inset-0 bg-gradient-to-br from-gold/0 to-gold/0 group-hover:from-gold/[0.03] group-hover:to-transparent transition-all duration-700 pointer-events-none rounded-2xl" />

            <div className="relative z-10 flex flex-col h-full">
              <Languages className="text-gold mb-5" size={22} strokeWidth={1.5} />
              <h3 className="text-lg font-display font-semibold text-white mb-2 tracking-tight">
                Multi-language
              </h3>
              <p className="text-text-muted text-sm leading-relaxed">
                Fully localized interface supporting both Indonesian and English to suit your audience.
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
