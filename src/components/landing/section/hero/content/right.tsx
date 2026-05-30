"use client";

import { useState, useMemo, useCallback } from "react";
import { useTranslations } from "next-intl";
import { Activity, Zap, Clock, Database, RefreshCw, BarChart3, Play, ChevronDown, ChartBar } from "lucide-react";
import { DecisionTreeRegression } from "ml-cart";

// ── Constants ─────────────────────────────────────────────────────────────
const WORKING_DAYS_PER_MONTH = 22;
const TRAIN_MONTHS = [1, 2, 3] as const;
const PRED_MONTHS = [1, 3, 6] as const;
type TrainMonth = (typeof TRAIN_MONTHS)[number];
type PredMonth = (typeof PRED_MONTHS)[number];
const GOLD = "#C9A84C";

// ── Helpers ───────────────────────────────────────────────────────────────
function generateData(months: TrainMonth) {
  const x: number[][] = [], y: number[] = [];
  for (let i = 0; i < months * WORKING_DAYS_PER_MONTH; i++) {
    const a = +(6 + Math.random() * 4).toFixed(1);
    const h = +(4 + Math.random() * 8).toFixed(1);
    x.push([a, h]);
    y.push(+(a * h + (Math.random() - 0.5) * 1.4).toFixed(1));
  }
  return { x, y };
}

import { NumericStepper } from "@/components/ui/numeric-stepper";
import { AreaChart } from "@/components/ui/area-chart";

// ── Main Component ────────────────────────────────────────────────────────
export default function Right() {
  const t = useTranslations("hero");

  // Training
  const [trainMonths, setTrainMonths] = useState<TrainMonth>(1);
  const [trainData, setTrainData] = useState<{ x: number[][]; y: number[] } | null>(null);
  const [model, setModel] = useState<DecisionTreeRegression | null>(null);

  // Prediction inputs
  const [ampere, setAmpere] = useState<number>(8.0);
  const [hours, setHours] = useState<number>(9);
  const [predMonths, setPredMonths] = useState<PredMonth>(1);

  // Prediction result — only set on explicit submit
  const [result, setResult] = useState<{ daily: number; perMonth: number; total: number; pts: number[] } | null>(null);

  // Accordion open state
  const [trainOpen, setTrainOpen] = useState(true);
  const [predOpen, setPredOpen] = useState(false);
  const [resultOpen, setResultOpen] = useState(false);

  const workingDays = predMonths * WORKING_DAYS_PER_MONTH;

  const avgY = useMemo(() => {
    if (!trainData) return null;
    return trainData.y.reduce((a, b) => a + b, 0) / trainData.y.length;
  }, [trainData]);

  const handleGenerate = useCallback(() => {
    const data = generateData(trainMonths);
    const m = new DecisionTreeRegression({ maxDepth: 5, minNumSamples: 2 });
    m.train(data.x, data.y);
    setTrainData(data);
    setModel(m);
    setResult(null); // clear stale result when model changes
  }, [trainMonths]);

  const handlePredict = useCallback(() => {
    if (!model) return;
    const days = predMonths * WORKING_DAYS_PER_MONTH;
    const daily = Math.max(0, model.predict([[ampere, hours]])[0]);
    const perMonth = daily * WORKING_DAYS_PER_MONTH;
    const pts = Array.from({ length: days }, (_, d) =>
      daily + (Math.sin(d * 0.9) * 0.07 + Math.cos(d * 1.5) * 0.04) * daily
    );
    setResult({ daily, perMonth, total: perMonth * predMonths, pts });
  }, [model, ampere, hours, predMonths]);

  const isReady = model !== null;

  return (
    <div className="relative lg:h-[640px] flex items-center justify-center lg:justify-end">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-gold rounded-full blur-[140px] animate-pulse-gold pointer-events-none" />

      <div className="relative w-full max-w-[420px] bg-surface border border-border rounded-2xl shadow-2xl shadow-black/60 overflow-hidden backdrop-blur-xl">

        {/* Nav */}
        <div className="px-5 py-3 border-b border-border/50 bg-surface-2/30 flex items-center justify-between">
          <div className="flex items-center gap-2 text-text-primary font-display font-semibold text-sm">
            <Zap className="text-gold" size={14} fill="currentColor" /><span>ELPRESY</span>
          </div>
          <span className="text-gold border-b border-gold pb-0.5 cursor-default text-[10px] font-medium">Predict Simulator</span>
        </div>

        <div className="p-5 space-y-4">

          {/* ── Training Data ─────────────────────────────────────────── */}
          <div>
            {/* Accordion header */}
            <button
              onClick={() => setTrainOpen((o) => !o)}
              className="w-full flex items-center justify-between py-0.5 group"
            >
              <div className="flex items-center gap-1.5">
                <Database size={10} className="text-gold/60" />
                <span className="text-[11px] text-text-muted font-medium uppercase tracking-wider group-hover:text-text-primary transition-colors">Training Data</span>
              </div>
              <ChevronDown size={12} className={`text-text-faint transition-transform duration-300 ${trainOpen ? "rotate-180" : ""}`} />
            </button>

            {/* Collapsible content */}
            <div className={`grid transition-all duration-300 ease-in-out ${trainOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
              <div className="overflow-hidden">
                <div className="space-y-3 pt-3">
                  {/* Availability */}
                  <div className={`grid grid-cols-2 gap-2 transition-opacity duration-500 ${trainData ? "opacity-100" : "opacity-35 pointer-events-none"}`}>
                    <div className="bg-zinc-900/60 rounded-md px-2.5 py-2 border border-border/30">
                      <div className="text-[9px] text-white uppercase tracking-wider">Samples</div>
                      <div className={`text-sm font-bold font-mono mt-0.5 tabular-nums ${trainData ? "text-emerald-400" : "text-white"}`}>
                        {trainData ? trainData.x.length : "—"}
                      </div>
                    </div>
                    <div className="bg-zinc-900/60 rounded-md px-2.5 py-2 border border-border/30">
                      <div className="text-[9px] text-white uppercase tracking-wider">Avg Target</div>
                      <div className={`text-sm font-bold font-mono mt-0.5 tabular-nums ${trainData ? "text-emerald-400" : "text-white"}`}>
                        {avgY !== null ? `${avgY.toFixed(1)} Ah` : "—"}
                      </div>
                    </div>
                  </div>

                  {/* Train month cards */}
                  <div className="grid grid-cols-3 gap-2">
                    {TRAIN_MONTHS.map((m) => (
                      <button key={m} id={`hero-train-${m}mo`} onClick={() => setTrainMonths(m)}
                        className={`h-10 rounded-lg border flex flex-col items-center justify-center gap-0.5 transition-all duration-200 ${trainMonths === m ? "bg-gold/15 border-gold/50 text-gold shadow-[0_0_8px_rgba(201,168,76,0.15)]" : "bg-zinc-900/60 border-border/40 text-text-faint hover:border-gold/30 hover:text-text-muted"}`}>
                        <span className="text-[11px] font-bold font-mono">{m} mo</span>
                        <span className="text-[8px] font-normal opacity-60">{m * WORKING_DAYS_PER_MONTH} samples</span>
                      </button>
                    ))}
                  </div>

                  <button id="hero-generate-btn" onClick={handleGenerate}
                    className="w-full h-9 bg-zinc-800/80 hover:bg-gold/10 border border-border/50 hover:border-gold/40 text-text-muted hover:text-gold text-[11px] font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-2">
                    <RefreshCw size={11} />Generate Training Data
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* ── Gold divider ───────────────────────────────────────────── */}
          <div className="relative h-px my-7">
            <div className="absolute inset-0" style={{ background: `linear-gradient(to right, transparent, ${GOLD}99, transparent)` }} />
          </div>

          {/* ── Prediction ────────────────────────────────────────────── */}
          <div>
            {/* Accordion header */}
            <button
              onClick={() => setPredOpen((o) => !o)}
              className="w-full flex items-center justify-between py-0.5 group"
            >
              <div className="flex items-center gap-2">
                <div className={`w-1.5 h-1.5 rounded-full transition-colors duration-500 ${isReady ? "bg-emerald-500 animate-pulse" : "bg-zinc-600"}`} />
                <span className={`text-[10px] font-medium uppercase tracking-wider transition-colors duration-500 ${isReady ? "text-emerald-400/80" : "text-zinc-600"}`}>
                  {isReady ? t("mockStatus") : "No Model — Generate Data First"}
                </span>
              </div>
              <ChevronDown size={12} className={`text-text-faint transition-transform duration-300 ${predOpen ? "rotate-180" : ""}`} />
            </button>

            {/* Collapsible content */}
            <div className={`grid transition-all duration-300 ease-in-out ${predOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
              <div className="overflow-hidden">
                <div className="space-y-3 pt-3">

                  {/* Inputs */}
                  <div className="space-y-2.5">
                    <div className="space-y-1.5">
                      <label className="text-[11px] text-text-muted font-medium uppercase tracking-wider flex items-center gap-1.5">
                        <Activity size={10} className="text-gold/60" />{t("mockAmpereLabel")}
                      </label>
                      <NumericStepper id="hero-ampere-input" value={ampere} min={0.1} max={20} step={0.1} unit="A" onChange={setAmpere} />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[11px] text-text-muted font-medium uppercase tracking-wider flex items-center gap-1.5">
                        <Clock size={10} className="text-gold/60" />{t("mockHoursLabel")}
                      </label>
                      <NumericStepper id="hero-hours-input" value={hours} min={1} max={24} step={0.5} unit="hrs/day" onChange={setHours} />
                    </div>

                    {/* Prediction period */}
                    <div className="space-y-1.5">
                      <label className="text-[11px] text-text-muted font-medium uppercase tracking-wider flex items-center gap-1.5">
                        <BarChart3 size={10} className="text-gold/60" />{t("mockMonthLabel")}
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {PRED_MONTHS.map((m) => {
                          const lbl = m === 1 ? t("mockMonth1") : m === 3 ? t("mockMonth3") : t("mockMonth6");
                          return (
                            <button key={m} id={`hero-pred-${m}mo`} onClick={() => setPredMonths(m)}
                              className={`h-9 rounded-lg border text-[11px] font-semibold font-mono transition-all duration-200 ${predMonths === m ? "bg-gold/15 border-gold/50 text-gold shadow-[0_0_8px_rgba(201,168,76,0.15)]" : "bg-zinc-900/60 border-border/40 text-text-faint hover:border-gold/30 hover:text-text-muted"}`}>
                              {lbl}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Predict button */}
                  <button
                    id="hero-predict-btn"
                    onClick={handlePredict}
                    disabled={!isReady}
                    className="w-full h-10 bg-gold/90 hover:bg-gold disabled:bg-zinc-800 disabled:border disabled:border-border/40 disabled:text-zinc-600 disabled:cursor-not-allowed text-black text-[12px] font-bold rounded-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(201,168,76,0.15)] hover:shadow-[0_0_25px_rgba(201,168,76,0.3)]"
                  >
                    <Play size={12} fill="currentColor" />
                    {t("mockPredict")}
                  </button>

                </div>
              </div>
            </div>
          </div>

          {/* ── Gold divider ───────────────────────────────────────────── */}
          <div className="relative h-px my-7">
            <div className="absolute inset-0" style={{ background: `linear-gradient(to right, transparent, ${GOLD}99, transparent)` }} />
          </div>

          {/* ── Result ────────────────────────────────────────────── */}
          <div>

            {/* Accordion header */}
            <button
              onClick={() => setResultOpen((o) => !o)}
              className="w-full flex items-center justify-between py-0.5 group"
            >
              <div className="flex items-center gap-1.5">
                <ChartBar size={10} className="text-gold/60" />
                <span className="text-[11px] text-text-muted font-medium uppercase tracking-wider group-hover:text-text-primary transition-colors">Result Chart</span>
              </div>
              <ChevronDown size={12} className={`text-text-faint transition-transform duration-300 ${resultOpen ? "rotate-180" : ""}`} />
            </button>

            {/* Collapsible content */}
            <div className={`grid transition-all duration-300 ease-in-out ${resultOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
              <div className="overflow-hidden">
                <div className="space-y-3 pt-3">

                  {/* Results */}
                  {result !== null ? (
                    <div className="space-y-3 border-border/40">
                      <div className="flex items-end justify-between">
                        <div>
                          <div className="text-[10px] text-text-faint uppercase tracking-wider mb-1">{t("mockTotalUsage")}</div>
                          <div className="text-3xl font-display font-bold text-white leading-none tabular-nums">
                            {result.total.toFixed(1)}<span className="text-base text-text-muted ml-1">Ah</span>
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
                          <div className="text-xs font-semibold font-mono mt-0.5 text-text-primary tabular-nums">{result.daily.toFixed(1)} Ah</div>
                        </div>
                        <div className="bg-zinc-900/60 rounded-md px-2.5 py-2 border border-border/30">
                          <div className="text-[9px] text-text-faint uppercase tracking-wider">{t("mockMonthlyAvg")}</div>
                          <div className="text-xs font-semibold font-mono mt-0.5 text-text-primary tabular-nums">{result.perMonth.toFixed(1)} Ah</div>
                        </div>
                      </div>

                      <AreaChart pts={result.pts} months={predMonths} liveLabel={t("mockLive")} trendLabel={t("mockPerMonth")} />
                    </div>
                  ) : (
                    <div className="h-12 flex items-center justify-center rounded-lg border border-dashed border-border/30">
                      <span className="text-[10px] text-text-faint italic">
                        {isReady ? "Configure inputs and run prediction" : "Generate training data to enable prediction"}
                      </span>
                    </div>
                  )}

                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}