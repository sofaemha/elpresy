"use client";

import { useState, useMemo, useCallback } from "react";
import { useTranslations } from "next-intl";
import { Activity, Zap, Clock, Database, RefreshCw, BarChart3 } from "lucide-react";
import { DecisionTreeRegression } from "ml-cart";

// ── Constants ─────────────────────────────────────────────────────────────
const WORKING_DAYS_PER_MONTH = 22; // 30 days − 4 Sat − 4 Sun
const TRAIN_MONTHS = [1, 2, 3] as const;
const PRED_MONTHS  = [1, 3, 6] as const;
type TrainMonth = (typeof TRAIN_MONTHS)[number];
type PredMonth  = (typeof PRED_MONTHS)[number];
const GOLD = "#C9A84C";

// ── Random training data generator ────────────────────────────────────────
function generateData(months: TrainMonth) {
  const count = months * WORKING_DAYS_PER_MONTH;
  const x: number[][] = [];
  const y: number[]   = [];
  for (let i = 0; i < count; i++) {
    const a = +(6 + Math.random() * 4).toFixed(1);       // 6–10 A (2 PK range)
    const h = +(4 + Math.random() * 8).toFixed(1);       // 4–12 hrs
    const n = +((Math.random() - 0.5) * 1.4).toFixed(1); // ±0.7 noise
    x.push([a, h]);
    y.push(+(a * h + n).toFixed(1));
  }
  return { x, y };
}

// ── SVG area path builder ─────────────────────────────────────────────────
function buildPath(pts: number[], W: number, H: number) {
  if (pts.length < 2) return { area: "", line: "" };
  const min = Math.min(...pts), max = Math.max(...pts);
  const range = max - min || 1;
  const pad = 8;
  const coords = pts.map((v, i) => ({
    x: (i / (pts.length - 1)) * W,
    y: pad + ((max - v) / range) * (H - pad * 2),
  }));
  const segs: string[] = [];
  coords.forEach((p, i) => {
    if (i === 0) { segs.push(`M${p.x},${p.y}`); return; }
    const pr = coords[i - 1];
    const mx = (pr.x + p.x) / 2;
    segs.push(`C${mx},${pr.y} ${mx},${p.y} ${p.x},${p.y}`);
  });
  const line = segs.join(" ");
  const last = coords[coords.length - 1];
  const area = `${line} L${last.x},${H} L0,${H} Z`;
  return { area, line, coords, last };
}

// ── Main component ────────────────────────────────────────────────────────
export default function Right() {
  const t = useTranslations("hero");

  // Training
  const [trainMonths, setTrainMonths] = useState<TrainMonth>(1);
  const [trainData, setTrainData]     = useState<{ x: number[][]; y: number[] } | null>(null);
  const [model, setModel]             = useState<DecisionTreeRegression | null>(null);

  // Prediction inputs
  const [ampere, setAmpere]       = useState<number>(8.0);
  const [hours, setHours]         = useState<number>(9);
  const [predMonths, setPredMonths] = useState<PredMonth>(1);

  const workingDays = predMonths * WORKING_DAYS_PER_MONTH;

  const handleGenerate = useCallback(() => {
    const data = generateData(trainMonths);
    const m = new DecisionTreeRegression({ maxDepth: 5, minNumSamples: 2 });
    m.train(data.x, data.y);
    setTrainData(data);
    setModel(m);
  }, [trainMonths]);

  const avgY = useMemo(() => {
    if (!trainData) return null;
    const sum = trainData.y.reduce((a, b) => a + b, 0);
    return sum / trainData.y.length;
  }, [trainData]);

  const prediction = useMemo(() => {
    if (!model) return null;
    const daily   = Math.max(0, model.predict([[ampere, hours]])[0]);
    const perMonth = daily * WORKING_DAYS_PER_MONTH;
    const total    = perMonth * predMonths;
    // Simulate daily variance for chart
    const pts = Array.from({ length: workingDays }, (_, d) => {
      const v = (Math.sin(d * 0.9) * 0.07 + Math.cos(d * 1.5) * 0.04) * daily;
      return daily + v;
    });
    return { daily, perMonth, total, pts };
  }, [model, ampere, hours, predMonths, workingDays]);

  const isReady = model !== null;

  return (
    <div className="relative lg:h-[640px] flex items-center justify-center lg:justify-end">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-gold rounded-full blur-[140px] animate-pulse-gold pointer-events-none" />

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

        {/* App nav */}
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

        <div className="p-5 space-y-4">

          {/* ── SECTION 1: Training Data ───────────────────────────────── */}
          <div className="space-y-3">
            <div className="flex items-center gap-1.5">
              <Database size={10} className="text-gold/60" />
              <span className="text-[11px] text-text-muted font-medium uppercase tracking-wider">Training Data</span>
            </div>

            {/* Train month cards */}
            <div className="grid grid-cols-3 gap-2">
              {TRAIN_MONTHS.map((m) => (
                <button
                  key={m}
                  id={`hero-train-${m}mo`}
                  onClick={() => setTrainMonths(m)}
                  className={`h-10 rounded-lg border flex flex-col items-center justify-center gap-0.5 transition-all duration-200 ${
                    trainMonths === m
                      ? "bg-gold/15 border-gold/50 text-gold shadow-[0_0_8px_rgba(201,168,76,0.15)]"
                      : "bg-zinc-900/60 border-border/40 text-text-faint hover:border-gold/30 hover:text-text-muted"
                  }`}
                >
                  <span className="text-[11px] font-bold font-mono">{m} mo</span>
                  <span className="text-[8px] font-normal opacity-60">{m * WORKING_DAYS_PER_MONTH} samples</span>
                </button>
              ))}
            </div>

            {/* Generate button */}
            <button
              id="hero-generate-btn"
              onClick={handleGenerate}
              className="w-full h-9 bg-zinc-800/80 hover:bg-gold/10 border border-border/50 hover:border-gold/40 text-text-muted hover:text-gold text-[11px] font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
            >
              <RefreshCw size={11} />
              Generate Training Data
            </button>

            {/* Availability stats */}
            <div className={`grid grid-cols-2 gap-2 transition-opacity duration-500 ${trainData ? "opacity-100" : "opacity-35 pointer-events-none"}`}>
              <div className="bg-zinc-900/60 rounded-md px-2.5 py-2 border border-border/30">
                <div className="text-[9px] text-text-faint uppercase tracking-wider">Samples</div>
                <div className={`text-sm font-bold font-mono mt-0.5 tabular-nums ${trainData ? "text-emerald-400" : "text-text-faint"}`}>
                  {trainData ? trainData.x.length : "—"}
                </div>
              </div>
              <div className="bg-zinc-900/60 rounded-md px-2.5 py-2 border border-border/30">
                <div className="text-[9px] text-text-faint uppercase tracking-wider">Avg Target</div>
                <div className={`text-sm font-bold font-mono mt-0.5 tabular-nums ${trainData ? "text-emerald-400" : "text-text-faint"}`}>
                  {avgY !== null ? `${avgY.toFixed(1)} Ah` : "—"}
                </div>
              </div>
            </div>
          </div>

          {/* ── GOLD GLOWING DIVIDER ──────────────────────────────────── */}
          <div className="relative h-px my-1">
            <div
              className="absolute inset-0"
              style={{
                background: `linear-gradient(to right, transparent, ${GOLD}99, transparent)`,
                boxShadow: `0 0 10px 2px ${GOLD}55`,
              }}
            />
          </div>

          {/* ── SECTION 2: Prediction ─────────────────────────────────── */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className={`w-1.5 h-1.5 rounded-full transition-colors duration-500 ${isReady ? "bg-emerald-500 animate-pulse" : "bg-zinc-600"}`} />
              <span className={`text-[10px] font-medium uppercase tracking-wider transition-colors duration-500 ${isReady ? "text-emerald-400/80" : "text-zinc-600"}`}>
                {isReady ? t("mockStatus") : "No Model — Generate Data First"}
              </span>
            </div>

            {/* Inputs */}
            <div className="space-y-2.5">
              <div className="space-y-1.5">
                <label className="text-[11px] text-text-muted font-medium uppercase tracking-wider flex items-center gap-1.5">
                  <Activity size={10} className="text-gold/60" />
                  {t("mockAmpereLabel")}
                </label>
                <div className="h-9 w-full bg-zinc-900/80 rounded-lg border border-border/50 flex items-center px-3 gap-2 focus-within:border-gold/40 transition-colors">
                  <input
                    id="hero-ampere-input"
                    type="number" value={ampere} min={0.1} max={20} step={0.1}
                    onChange={(e) => { const v = parseFloat(e.target.value); if (!isNaN(v)) setAmpere(Math.min(20, Math.max(0.1, v))); }}
                    className="bg-transparent text-text-primary font-mono text-sm flex-1 outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                  />
                  <span className="text-[10px] text-text-faint font-mono shrink-0">A</span>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] text-text-muted font-medium uppercase tracking-wider flex items-center gap-1.5">
                  <Clock size={10} className="text-gold/60" />
                  {t("mockHoursLabel")}
                </label>
                <div className="h-9 w-full bg-zinc-900/80 rounded-lg border border-border/50 flex items-center px-3 gap-2 focus-within:border-gold/40 transition-colors">
                  <input
                    id="hero-hours-input"
                    type="number" value={hours} min={1} max={24} step={0.5}
                    onChange={(e) => { const v = parseFloat(e.target.value); if (!isNaN(v)) setHours(Math.min(24, Math.max(1, v))); }}
                    className="bg-transparent text-text-primary font-mono text-sm flex-1 outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                  />
                  <span className="text-[10px] text-text-faint font-mono shrink-0">hrs/day</span>
                </div>
              </div>

              {/* Prediction period */}
              <div className="space-y-1.5">
                <label className="text-[11px] text-text-muted font-medium uppercase tracking-wider flex items-center gap-1.5">
                  <BarChart3 size={10} className="text-gold/60" />
                  {t("mockMonthLabel")}
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {PRED_MONTHS.map((m) => {
                    const lbl = m === 1 ? t("mockMonth1") : m === 3 ? t("mockMonth3") : t("mockMonth6");
                    return (
                      <button
                        key={m}
                        id={`hero-pred-${m}mo`}
                        onClick={() => setPredMonths(m)}
                        className={`h-9 rounded-lg border text-[11px] font-semibold font-mono transition-all duration-200 ${
                          predMonths === m
                            ? "bg-gold/15 border-gold/50 text-gold shadow-[0_0_8px_rgba(201,168,76,0.15)]"
                            : "bg-zinc-900/60 border-border/40 text-text-faint hover:border-gold/30 hover:text-text-muted"
                        }`}
                      >
                        {lbl}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Results + Chart */}
            {prediction !== null ? (
              <div className="space-y-3 pt-3 border-t border-border/40">
                <div className="flex items-end justify-between">
                  <div>
                    <div className="text-[10px] text-text-faint uppercase tracking-wider mb-1">{t("mockTotalUsage")}</div>
                    <div className="text-3xl font-display font-bold text-white leading-none tabular-nums">
                      {prediction.total.toFixed(1)}<span className="text-base text-text-muted ml-1">Ah</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1 pb-0.5">
                    <div className="text-[9px] text-text-faint uppercase tracking-wider">{t("mockWorkingDays")}</div>
                    <div className="text-sm font-bold text-gold font-mono">{workingDays}d</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-zinc-900/60 rounded-md px-2.5 py-2 border border-border/30">
                    <div className="text-[9px] text-text-faint uppercase tracking-wider">{t("mockAvgDaily")}</div>
                    <div className="text-xs font-semibold font-mono mt-0.5 text-text-primary tabular-nums">{prediction.daily.toFixed(1)} Ah</div>
                  </div>
                  <div className="bg-zinc-900/60 rounded-md px-2.5 py-2 border border-border/30">
                    <div className="text-[9px] text-text-faint uppercase tracking-wider">{t("mockMonthlyAvg")}</div>
                    <div className="text-xs font-semibold font-mono mt-0.5 text-text-primary tabular-nums">{prediction.perMonth.toFixed(1)} Ah</div>
                  </div>
                </div>

                <AreaChart pts={prediction.pts} months={predMonths} liveLabel={t("mockLive")} trendLabel={t("mockPerMonth")} />
              </div>
            ) : (
              <div className="h-14 flex items-center justify-center rounded-lg border border-dashed border-border/30">
                <span className="text-[10px] text-text-faint italic">Generate training data to enable prediction</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Area Chart ────────────────────────────────────────────────────────────
function AreaChart({
  pts, months, liveLabel, trendLabel,
}: {
  pts: number[];
  months: number;
  liveLabel: string;
  trendLabel: string;
}) {
  const W = 400;
  const H = 120;

  const { area, line, coords, last } = useMemo(() => {
    const r = buildPath(pts, W, H);
    return {
      area:   r.area,
      line:   r.line,
      coords: (r as any).coords as { x: number; y: number }[] | undefined,
      last:   (r as any).last   as { x: number; y: number } | undefined,
    };
  }, [pts]);

  // Month separator X positions
  const separators = useMemo(() => {
    return Array.from({ length: months - 1 }, (_, i) => {
      const dayFrac = ((i + 1) * WORKING_DAYS_PER_MONTH) / pts.length;
      return { x: dayFrac * W, label: `M${i + 2}` };
    });
  }, [months, pts.length]);

  return (
    <div className="rounded-lg border border-border/30 overflow-hidden" style={{ background: "rgba(9,9,11,0.5)" }}>
      <div className="flex items-center justify-between px-3 pt-2.5 pb-0">
        <span className="text-[9px] text-text-faint uppercase tracking-wider">{trendLabel}</span>
        <span className="text-[9px] font-mono" style={{ color: GOLD }}>{liveLabel}</span>
      </div>

      <svg
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="none"
        width="100%"
        height="120"
        className="block"
      >
        <defs>
          <linearGradient id="ag" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor={GOLD} stopOpacity="0.45" />
            <stop offset="75%"  stopColor={GOLD} stopOpacity="0.08" />
            <stop offset="100%" stopColor={GOLD} stopOpacity="0" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        {/* Grid */}
        {[0.25, 0.5, 0.75].map((f) => (
          <line key={f} x1={0} y1={H * f} x2={W} y2={H * f}
            stroke="#ffffff" strokeOpacity="0.04" strokeWidth="0.6" />
        ))}

        {/* Month separators */}
        {separators.map(({ x, label }) => (
          <g key={label}>
            <line x1={x} y1={0} x2={x} y2={H}
              stroke={GOLD} strokeOpacity="0.18" strokeWidth="0.8" strokeDasharray="3,3" />
          </g>
        ))}

        {/* Area fill */}
        {area && <path d={area} fill="url(#ag)" />}

        {/* Line with glow */}
        {line && (
          <path d={line} fill="none" stroke={GOLD} strokeWidth="2"
            strokeLinecap="round" strokeLinejoin="round" filter="url(#glow)" />
        )}

        {/* Live dot */}
        {last && (
          <>
            <circle cx={last.x} cy={last.y} r={5} fill={GOLD} fillOpacity="0.2" />
            <circle cx={last.x} cy={last.y} r={2.5} fill={GOLD} />
          </>
        )}
      </svg>

      {/* X-axis labels */}
      <div className="flex justify-between px-2 pb-2">
        <span className="text-[7px] text-text-faint font-mono">M1</span>
        {months >= 3 && (
          <span className="text-[7px] text-text-faint font-mono">M{Math.ceil(months / 2)}</span>
        )}
        <span className="text-[7px] text-text-faint font-mono">M{months}</span>
      </div>
    </div>
  );
}