"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import { Activity, Zap, Clock, BarChart3 } from "lucide-react";
import { DecisionTreeRegression } from "ml-cart";

// ── CART Model — trained once at module level ─────────────────────────────
// Features: [amperePerCycle, dailyHours]
// Target:   daily ampere-hour consumption (realistic AC data with slight variance)
const TRAIN_X = [
  [3.5, 4],  [4.0, 4],  [4.0, 8],  [4.5, 6],
  [5.0, 8],  [5.0, 10], [5.5, 6],  [5.5, 10],
  [6.0, 6],  [6.0, 8],  [6.5, 9],  [6.5, 12],
  [7.0, 7],  [7.0, 10], [7.5, 8],  [7.5, 12],
  [8.0, 7],  [8.0, 9],  [8.0, 10], [8.5, 8],
  [8.5, 9],  [8.5, 12], [9.0, 8],  [9.0, 10],
  [9.0, 12], [9.5, 9],  [9.5, 11], [10.0, 8],
  [10.0, 10],[10.0, 12],
];

const TRAIN_Y = [
  14.2, 16.1, 31.7, 27.4,
  39.8, 50.5, 33.2, 54.6,
  36.3, 47.8, 58.9, 77.7,
  49.3, 69.6, 60.5, 89.8,
  56.3, 71.7, 80.2, 68.4,
  76.3, 102.3, 71.6, 90.3,
  107.7, 85.9, 104.3, 80.3,
  99.6, 120.3,
];

const cartModel = new DecisionTreeRegression({ maxDepth: 5, minNumSamples: 2 });
cartModel.train(TRAIN_X, TRAIN_Y);

// ── Constants ─────────────────────────────────────────────────────────────
// 30 days/month − 4 Saturdays − 4 Sundays = 22 working days
const WORKING_DAYS_PER_MONTH = 22;
const MONTH_OPTIONS = [1, 3, 6] as const;
type MonthOption = (typeof MONTH_OPTIONS)[number];

const GOLD = "#C9A84C";
const GOLD_DIM = "#C9A84C44";

// ── Component ─────────────────────────────────────────────────────────────
export default function Right() {
  const t = useTranslations("hero");

  const [ampere, setAmpere] = useState<number>(8.0);
  const [hours, setHours] = useState<number>(9);
  const [months, setMonths] = useState<MonthOption>(1);

  const workingDays = months * WORKING_DAYS_PER_MONTH;

  const prediction = useMemo(() => {
    const rawVal = cartModel.predict([[ampere, hours]])[0];
    const dailyUsage = Math.max(0, rawVal);
    const perMonth = dailyUsage * WORKING_DAYS_PER_MONTH;
    const totalUsage = perMonth * months;
    const monthlyBreakdown = Array.from({ length: months }, (_, i) => ({
      month: i + 1,
      usage: perMonth,
    }));
    return { dailyUsage, perMonth, totalUsage, monthlyBreakdown };
  }, [ampere, hours, months]);

  const maxBar = prediction.perMonth || 1;

  const handleAmpere = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = parseFloat(e.target.value);
    if (!isNaN(v)) setAmpere(Math.min(20, Math.max(0.1, v)));
  };

  const handleHours = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = parseFloat(e.target.value);
    if (!isNaN(v)) setHours(Math.min(24, Math.max(1, v)));
  };

  return (
    <div className="relative lg:h-[640px] flex items-center justify-center lg:justify-end">
      {/* Ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-gold rounded-full blur-[140px] animate-pulse-gold pointer-events-none" />

      {/* Card */}
      <div className="relative w-full max-w-[420px] bg-surface border border-border rounded-2xl shadow-2xl shadow-black/60 overflow-hidden backdrop-blur-xl">

        {/* Browser chrome */}
        <div className="px-5 py-3.5 border-b border-border/50 bg-surface-2/60 flex justify-between items-center">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
            <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
          </div>
          <div className="flex-1 flex justify-center">
            <div className="px-4 py-1 bg-black/40 rounded-md border border-border/30 text-[10px] text-text-faint font-mono">
              elpresy.app/predict
            </div>
          </div>
          <div className="w-12" />
        </div>

        {/* App header */}
        <div className="px-5 py-3 border-b border-border/30 bg-surface-2/30 flex items-center justify-between">
          <div className="flex items-center gap-2 text-text-primary font-display font-semibold text-sm">
            <Zap className="text-gold" size={14} fill="currentColor" />
            <span>ELPRESY</span>
          </div>
          <div className="flex items-center gap-3 text-text-faint text-[10px] font-medium">
            <span className="hover:text-text-muted cursor-default transition-colors">Dashboard</span>
            <span className="text-gold border-b border-gold pb-0.5 cursor-default">Predict</span>
            <span className="hover:text-text-muted cursor-default transition-colors">History</span>
          </div>
        </div>

        {/* Main content */}
        <div className="p-5 space-y-4">

          {/* Status badge */}
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] text-emerald-400/80 font-medium uppercase tracking-wider">
              {t("mockStatus")}
            </span>
          </div>

          {/* ── Inputs ── */}
          <div className="space-y-3">

            {/* Ampere Per Cycle */}
            <div className="space-y-1.5">
              <label className="text-[11px] text-text-muted font-medium uppercase tracking-wider flex items-center gap-1.5">
                <Activity size={10} className="text-gold/60" />
                {t("mockAmpereLabel")}
              </label>
              <div className="h-9 w-full bg-zinc-900/80 rounded-lg border border-border/50 flex items-center px-3 gap-2 focus-within:border-gold/40 transition-colors">
                <input
                  id="hero-ampere-input"
                  type="number"
                  value={ampere}
                  min={0.1}
                  max={20}
                  step={0.1}
                  onChange={handleAmpere}
                  className="bg-transparent text-text-primary font-mono text-sm flex-1 outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                />
                <span className="text-[10px] text-text-faint font-mono shrink-0">A</span>
              </div>
            </div>

            {/* Daily Usage Hours */}
            <div className="space-y-1.5">
              <label className="text-[11px] text-text-muted font-medium uppercase tracking-wider flex items-center gap-1.5">
                <Clock size={10} className="text-gold/60" />
                {t("mockHoursLabel")}
              </label>
              <div className="h-9 w-full bg-zinc-900/80 rounded-lg border border-border/50 flex items-center px-3 gap-2 focus-within:border-gold/40 transition-colors">
                <input
                  id="hero-hours-input"
                  type="number"
                  value={hours}
                  min={1}
                  max={24}
                  step={0.5}
                  onChange={handleHours}
                  className="bg-transparent text-text-primary font-mono text-sm flex-1 outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                />
                <span className="text-[10px] text-text-faint font-mono shrink-0">hrs/day</span>
              </div>
            </div>

            {/* Month Selector */}
            <div className="space-y-1.5">
              <label className="text-[11px] text-text-muted font-medium uppercase tracking-wider flex items-center gap-1.5">
                <BarChart3 size={10} className="text-gold/60" />
                {t("mockMonthLabel")}
              </label>
              <div className="grid grid-cols-3 gap-2">
                {MONTH_OPTIONS.map((m) => {
                  const label = m === 1 ? t("mockMonth1") : m === 3 ? t("mockMonth3") : t("mockMonth6");
                  return (
                    <button
                      key={m}
                      id={`hero-month-${m}`}
                      onClick={() => setMonths(m)}
                      className={`h-9 rounded-lg border text-[11px] font-semibold font-mono transition-all duration-200 ${
                        months === m
                          ? "bg-gold/15 border-gold/50 text-gold shadow-[0_0_8px_rgba(201,168,76,0.15)]"
                          : "bg-zinc-900/60 border-border/40 text-text-faint hover:border-gold/30 hover:text-text-muted"
                      }`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ── Results ── */}
          <div className="pt-4 border-t border-border/40 space-y-3">

            {/* Total usage hero number */}
            <div className="flex items-end justify-between">
              <div>
                <div className="text-[10px] text-text-faint uppercase tracking-wider mb-1">
                  {t("mockTotalUsage")}
                </div>
                <div className="text-3xl font-display font-bold text-white leading-none tabular-nums">
                  {prediction.totalUsage.toFixed(1)}
                  <span className="text-base text-text-muted ml-1">Ah</span>
                </div>
              </div>
              <div className="flex flex-col items-end gap-1 pb-0.5">
                <div className="text-[9px] text-text-faint uppercase tracking-wider">{t("mockWorkingDays")}</div>
                <div className="text-sm font-bold text-gold font-mono">{workingDays}d</div>
              </div>
            </div>

            {/* Mini stats */}
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-zinc-900/60 rounded-md px-2.5 py-2 border border-border/30">
                <div className="text-[9px] text-text-faint uppercase tracking-wider">{t("mockAvgDaily")}</div>
                <div className="text-xs font-semibold text-text-primary font-mono mt-0.5 tabular-nums">
                  {prediction.dailyUsage.toFixed(1)} Ah
                </div>
              </div>
              <div className="bg-zinc-900/60 rounded-md px-2.5 py-2 border border-border/30">
                <div className="text-[9px] text-text-faint uppercase tracking-wider">{t("mockMonthlyAvg")}</div>
                <div className="text-xs font-semibold text-text-primary font-mono mt-0.5 tabular-nums">
                  {prediction.perMonth.toFixed(1)} Ah
                </div>
              </div>
            </div>

            {/* Per-month bar chart */}
            <div className="bg-zinc-900/40 rounded-lg border border-border/30 p-3">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[9px] text-text-faint uppercase tracking-wider">
                  {t("mockPerMonth")}
                </span>
                <span className="text-[9px] text-gold font-mono">{t("mockLive")}</span>
              </div>

              {/* Bars */}
              <div className="h-12 flex items-end gap-1.5">
                {prediction.monthlyBreakdown.map((bar) => {
                  const pct = maxBar > 0 ? (bar.usage / maxBar) * 100 : 0;
                  return (
                    <div key={bar.month} className="flex-1 flex flex-col items-center justify-end gap-1">
                      <div
                        style={{
                          height: `${pct}%`,
                          background: `linear-gradient(to top, ${GOLD}, ${GOLD_DIM})`,
                          minHeight: "4px",
                          transition: "height 0.4s cubic-bezier(0.4,0,0.2,1)",
                        }}
                        className="w-full rounded-sm"
                      />
                      <span className="text-[7px] text-text-faint font-mono">M{bar.month}</span>
                    </div>
                  );
                })}
              </div>

              {/* Y-axis label */}
              <div className="flex justify-between mt-2">
                <span className="text-[7px] text-text-faint font-mono">0</span>
                <span className="text-[7px] text-text-faint font-mono">
                  {maxBar.toFixed(0)} Ah
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}