"use client";

import { useState, useMemo, useCallback } from "react";
import { useTranslations } from "next-intl";
import { Activity, Zap, Clock, Database, RefreshCw, BarChart3, Play, ChevronDown, ChartBar, LayoutTemplate, Sparkles } from "lucide-react";
import { DecisionTreeRegression } from "ml-cart";
import { NumericStepper } from "@/components/ui/numeric-stepper";
import { AreaChart } from "@/components/ui/area-chart";
import PredictionChart from "@/components/predict/result/chart";
import type { PredictionResult } from "@/lib/ml/predict";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { savePrediction } from "@/app/actions/predictions";

// ── Constants ─────────────────────────────────────────────────────────────
const WORKING_DAYS_PER_MONTH = 22;
const TRAIN_MONTHS = [1, 2, 3] as const;
type TrainMonth = (typeof TRAIN_MONTHS)[number];
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

// ── Main Component ────────────────────────────────────────────────────────
export default function PredictPage() {
  const t = useTranslations("predict");

  // Training Model State
  const [modelType, setModelType] = useState<"pretrained" | "simulated">("pretrained");
  const [trainMonths, setTrainMonths] = useState<TrainMonth>(1);
  const [trainData, setTrainData] = useState<{ x: number[][]; y: number[] } | null>(null);
  const [simulatedModel, setSimulatedModel] = useState<DecisionTreeRegression | null>(null);

  // Prediction Inputs State
  const [ampere, setAmpere] = useState<number>(8.0);
  const [hours, setHours] = useState<number>(9);
  const [periodType, setPeriodType] = useState<"1mo" | "3mo" | "6mo" | "custom">("1mo");
  const [customDays, setCustomDays] = useState<number>(30);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Result State
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [chartType, setChartType] = useState<"premium" | "interactive">("premium");

  // Accordion States
  const [trainOpen, setTrainOpen] = useState(false);
  const [predOpen, setPredOpen] = useState(true);
  const [resultOpen, setResultOpen] = useState(false);

  const avgY = useMemo(() => {
    if (!trainData) return null;
    return trainData.y.reduce((a, b) => a + b, 0) / trainData.y.length;
  }, [trainData]);

  const handleGenerate = useCallback(() => {
    const data = generateData(trainMonths);
    const m = new DecisionTreeRegression({ maxDepth: 5, minNumSamples: 2 });
    m.train(data.x, data.y);
    setTrainData(data);
    setSimulatedModel(m);
    setResult(null); 
  }, [trainMonths]);

  const handlePredict = useCallback(async () => {
    setLoading(true);
    setError("");
    setResult(null);

    let periodVal = 22;
    if (periodType === "3mo") periodVal = 66;
    else if (periodType === "6mo") periodVal = 132;
    else if (periodType === "custom") periodVal = customDays;

    if (isNaN(ampere) || ampere <= 0 || ampere > 50) {
      toast.error(t("error_ampere"));
      setError(t("error_ampere"));
      setLoading(false);
      return;
    }
    if (isNaN(hours) || hours <= 0 || hours > 24) {
      toast.error(t("error_hours"));
      setError(t("error_hours"));
      setLoading(false);
      return;
    }
    if (isNaN(periodVal) || periodVal < 1 || periodVal > 365) {
      toast.error(t("error_period"));
      setError(t("error_period"));
      setLoading(false);
      return;
    }

    const toastId = toast.loading("Processing prediction data...");

    if (modelType === "simulated") {
      if (!simulatedModel || !trainData) {
        toast.error(t("mock_status_unready"), { id: toastId });
        setError(t("mock_status_unready"));
        setLoading(false);
        return;
      }
      
      if (trainData.x.length < 50) {
        toast.warning("Warning: Model might be inaccurate due to low sample size", { id: toastId, duration: 4000 });
      }

      const daily = Math.max(0, simulatedModel.predict([[ampere, hours]])[0]);
      
      const pts = Array.from({ length: periodVal }, (_, d) => {
         const val = daily + (Math.sin(d * 0.9) * 0.07 + Math.cos(d * 1.5) * 0.04) * daily;
         return { day: d + 1, ampere: parseFloat(val.toFixed(3)) };
      });
      
      const min = Math.min(...pts.map(p => p.ampere));
      const max = Math.max(...pts.map(p => p.ampere));
      const resultLower = parseFloat((min * 0.9).toFixed(3));
      const resultUpper = parseFloat((max * 1.1).toFixed(3));
      
      try {
        await savePrediction({
           amperePerCycle: ampere,
           dailyUsageHours: hours,
           predictionPeriod: periodVal,
           resultLower,
           resultUpper,
           chartData: pts
        });
        toast.success("Prediction processed and saved successfully", { id: toastId });
      } catch (e: any) {
        toast.error("Failed to save prediction to history", { id: toastId });
      }

      setResult({
         chartData: pts,
         resultLower,
         resultUpper
      });
      setResultOpen(true);
      setPredOpen(false);
      setLoading(false);
    } else {
      try {
        const res = await fetch("/api/predict", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amperePerCycle: ampere,
            dailyUsageHours: hours,
            predictionPeriod: periodVal,
          }),
        });
  
        if (!res.ok) {
          throw new Error(t("error_required"));
        }
  
        const data: PredictionResult = await res.json();
        setResult(data);
        setResultOpen(true);
        setPredOpen(false);
        toast.success("Prediction processed successfully", { id: toastId });
      } catch (err: any) {
        setError(err.message || t("error_required"));
        toast.error(err.message || "Failed to generate prediction", { id: toastId });
      } finally {
        setLoading(false);
      }
    }
  }, [ampere, hours, periodType, customDays, modelType, simulatedModel, trainData, t]);

  const resultStats = useMemo(() => {
    if (!result) return null;
    const pts = result.chartData.map(c => c.ampere);
    const total = pts.reduce((a, b) => a + b, 0);
    const workingDays = pts.length;
    const avgDaily = total / workingDays;
    const perMonth = avgDaily * 22; 
    
    let monthsLabel = Math.ceil(workingDays / 22);
    if (periodType === "1mo") monthsLabel = 1;
    else if (periodType === "3mo") monthsLabel = 3;
    else if (periodType === "6mo") monthsLabel = 6;
    
    return { total, workingDays, avgDaily, perMonth, pts, monthsLabel };
  }, [result, periodType]);

  const isReady = modelType === "pretrained" || simulatedModel !== null;

  return (
    <main className="container mx-auto px-6 py-12 md:py-20 min-h-[100dvh]">
      <div className="max-w-[500px] mx-auto space-y-8">
        
        <div className="space-y-2 text-center">
          <h1 className="font-display text-3xl font-bold text-foreground flex items-center justify-center gap-2">
            <Zap className="text-gold fill-gold" size={24} />
            {t("title")}
          </h1>
          <p className="text-sm text-text-muted">{t("subtitle")}</p>
        </div>

        <div className="relative w-full bg-surface border border-border rounded-2xl shadow-2xl overflow-hidden backdrop-blur-xl">
          
          <div className="px-5 py-3 border-b border-border/50 bg-surface-2/30 flex items-center justify-between">
            <div className="flex items-center gap-2 text-text-primary font-display font-semibold text-sm">
              <Activity className="text-gold" size={14} /><span>PREDICTOR CORE</span>
            </div>
          </div>

          <div className="p-5 space-y-4">
            
            {/* ── Training Data ─────────────────────────────────────────── */}
            <div>
              <button
                onClick={() => setTrainOpen((o) => !o)}
                className="w-full flex items-center justify-between py-0.5 group"
              >
                <div className="flex items-center gap-1.5">
                  <Database size={10} className="text-gold/60" />
                  <span className="text-[11px] text-text-muted font-medium uppercase tracking-wider group-hover:text-text-primary transition-colors">
                    {t("accordion_training")}
                  </span>
                </div>
                <ChevronDown size={12} className={cn("text-text-faint transition-transform duration-300", trainOpen && "rotate-180")} />
              </button>

              <div className={cn("grid transition-all duration-300 ease-in-out", trainOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]")}>
                <div className="overflow-hidden">
                  <div className="space-y-4 pt-3">
                    
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => { setModelType("pretrained"); setResult(null); }}
                        className={cn("h-10 rounded-lg border text-[10px] font-semibold flex items-center justify-center gap-1.5 transition-all duration-200", 
                          modelType === "pretrained" ? "bg-gold/15 border-gold/50 text-gold shadow-[0_0_8px_rgba(201,168,76,0.15)]" : "bg-zinc-900/60 border-border/40 text-text-faint hover:border-gold/30 hover:text-text-muted"
                        )}
                      >
                        <Sparkles size={11} />
                        {t("model_pretrained")}
                      </button>
                      <button
                        onClick={() => { setModelType("simulated"); setResult(null); }}
                        className={cn("h-10 rounded-lg border text-[10px] font-semibold flex items-center justify-center gap-1.5 transition-all duration-200", 
                          modelType === "simulated" ? "bg-gold/15 border-gold/50 text-gold shadow-[0_0_8px_rgba(201,168,76,0.15)]" : "bg-zinc-900/60 border-border/40 text-text-faint hover:border-gold/30 hover:text-text-muted"
                        )}
                      >
                        <RefreshCw size={11} />
                        {t("model_simulated")}
                      </button>
                    </div>

                    {modelType === "simulated" && (
                      <div className="space-y-3 animate-in fade-in duration-300">
                        <div className={cn("grid grid-cols-2 gap-2 transition-opacity duration-500", trainData ? "opacity-100" : "opacity-35 pointer-events-none")}>
                          <div className="bg-zinc-900/60 rounded-md px-2.5 py-2 border border-border/30">
                            <div className="text-[9px] text-white uppercase tracking-wider">{t("stat_samples")}</div>
                            <div className={cn("text-sm font-bold font-mono mt-0.5 tabular-nums", trainData ? "text-emerald-400" : "text-white")}>
                              {trainData ? trainData.x.length : "—"}
                            </div>
                          </div>
                          <div className="bg-zinc-900/60 rounded-md px-2.5 py-2 border border-border/30">
                            <div className="text-[9px] text-white uppercase tracking-wider">{t("stat_avg_target")}</div>
                            <div className={cn("text-sm font-bold font-mono mt-0.5 tabular-nums", trainData ? "text-emerald-400" : "text-white")}>
                              {avgY !== null ? `${avgY.toFixed(1)} Ah` : "—"}
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-2">
                          {TRAIN_MONTHS.map((m) => (
                            <button key={m} onClick={() => setTrainMonths(m)}
                              className={cn("h-10 rounded-lg border flex flex-col items-center justify-center gap-0.5 transition-all duration-200", 
                                trainMonths === m ? "bg-gold/15 border-gold/50 text-gold shadow-[0_0_8px_rgba(201,168,76,0.15)]" : "bg-zinc-900/60 border-border/40 text-text-faint hover:border-gold/30 hover:text-text-muted"
                              )}>
                              <span className="text-[11px] font-bold font-mono">{m} mo</span>
                              <span className="text-[8px] font-normal opacity-60">{m * WORKING_DAYS_PER_MONTH} samples</span>
                            </button>
                          ))}
                        </div>

                        <button onClick={handleGenerate}
                          className="w-full h-9 bg-zinc-800/80 hover:bg-gold/10 border border-border/50 hover:border-gold/40 text-text-muted hover:text-gold text-[11px] font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-2">
                          <RefreshCw size={11} />{t("btn_generate_data")}
                        </button>
                      </div>
                    )}
                    
                    {modelType === "pretrained" && (
                      <div className="h-20 flex items-center justify-center rounded-lg border border-dashed border-border/30 bg-zinc-900/40">
                         <span className="text-[10px] text-text-faint italic px-8 text-center">
                            Using the server-side robust CART model trained on 10,000+ real-world appliance cycles.
                         </span>
                      </div>
                    )}

                  </div>
                </div>
              </div>
            </div>

            <div className="relative h-px my-7">
              <div className="absolute inset-0" style={{ background: `linear-gradient(to right, transparent, ${GOLD}99, transparent)` }} />
            </div>

            {/* ── Prediction Inputs ─────────────────────────────────────── */}
            <div>
              <button
                onClick={() => setPredOpen((o) => !o)}
                className="w-full flex items-center justify-between py-0.5 group"
              >
                <div className="flex items-center gap-2">
                  <div className={cn("w-1.5 h-1.5 rounded-full transition-colors duration-500", isReady ? "bg-emerald-500 animate-pulse" : "bg-zinc-600")} />
                  <span className={cn("text-[10px] font-medium uppercase tracking-wider transition-colors duration-500", isReady ? "text-emerald-400/80" : "text-zinc-600")}>
                    {isReady ? t("mock_status_ready") : t("mock_status_unready")}
                  </span>
                </div>
                <ChevronDown size={12} className={cn("text-text-faint transition-transform duration-300", predOpen && "rotate-180")} />
              </button>

              <div className={cn("grid transition-all duration-300 ease-in-out", predOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]")}>
                <div className="overflow-hidden">
                  <div className="space-y-4 pt-3">

                    {error && (
                      <div className="rounded-md border border-destructive/20 bg-destructive/10 p-2.5 text-xs text-destructive text-center font-medium">
                        {error}
                      </div>
                    )}

                    <div className="space-y-3">
                      <div className="space-y-1.5">
                        <label className="text-[11px] text-text-muted font-medium uppercase tracking-wider flex items-center justify-between">
                          <span className="flex items-center gap-1.5"><Activity size={10} className="text-gold/60" />{t("field_ampere")}</span>
                          <span className="text-[9px] text-text-faint lowercase">{t("field_ampere_hint").substring(0, 30)}...</span>
                        </label>
                        <NumericStepper id="predict-ampere" value={ampere} min={0.1} max={50} step={0.1} unit="A" onChange={setAmpere} />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[11px] text-text-muted font-medium uppercase tracking-wider flex items-center justify-between">
                          <span className="flex items-center gap-1.5"><Clock size={10} className="text-gold/60" />{t("field_hours")}</span>
                        </label>
                        <NumericStepper id="predict-hours" value={hours} min={1} max={24} step={0.5} unit="hrs" onChange={setHours} />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[11px] text-text-muted font-medium uppercase tracking-wider flex items-center gap-1.5">
                          <BarChart3 size={10} className="text-gold/60" />{t("field_period")}
                        </label>
                        <div className="grid grid-cols-4 gap-2">
                          {[
                             { id: "1mo", label: t("period_1mo") },
                             { id: "3mo", label: t("period_3mo") },
                             { id: "6mo", label: t("period_6mo") },
                             { id: "custom", label: t("period_custom") }
                          ].map((p) => (
                            <button key={p.id} onClick={() => setPeriodType(p.id as any)}
                              className={cn("h-9 rounded-lg border text-[11px] font-semibold font-mono transition-all duration-200", 
                                periodType === p.id ? "bg-gold/15 border-gold/50 text-gold shadow-[0_0_8px_rgba(201,168,76,0.15)]" : "bg-zinc-900/60 border-border/40 text-text-faint hover:border-gold/30 hover:text-text-muted"
                              )}>
                              {p.label}
                            </button>
                          ))}
                        </div>
                        {periodType === "custom" && (
                           <div className="pt-1.5 animate-in slide-in-from-top-2 fade-in duration-300">
                             <NumericStepper id="predict-custom-days" value={customDays} min={1} max={365} step={1} unit="days" onChange={setCustomDays} />
                           </div>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={handlePredict}
                      disabled={!isReady || loading}
                      className="w-full h-10 bg-gold/90 hover:bg-gold disabled:bg-zinc-800 disabled:border disabled:border-border/40 disabled:text-zinc-600 disabled:cursor-not-allowed text-black text-[12px] font-bold rounded-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(201,168,76,0.15)] hover:shadow-[0_0_25px_rgba(201,168,76,0.3)]"
                    >
                      {loading ? (
                         <RefreshCw size={12} className="animate-spin" />
                      ) : (
                         <Play size={12} fill="currentColor" />
                      )}
                      {loading ? t("btn_loading") : t("btn_submit")}
                    </button>

                  </div>
                </div>
              </div>
            </div>

            <div className="relative h-px my-7">
              <div className="absolute inset-0" style={{ background: `linear-gradient(to right, transparent, ${GOLD}99, transparent)` }} />
            </div>

            {/* ── Result ────────────────────────────────────────────── */}
            <div>
              <button
                onClick={() => setResultOpen((o) => !o)}
                className="w-full flex items-center justify-between py-0.5 group"
              >
                <div className="flex items-center gap-1.5">
                  <ChartBar size={10} className="text-gold/60" />
                  <span className="text-[11px] text-text-muted font-medium uppercase tracking-wider group-hover:text-text-primary transition-colors">
                     {t("accordion_result")}
                  </span>
                </div>
                <ChevronDown size={12} className={cn("text-text-faint transition-transform duration-300", resultOpen && "rotate-180")} />
              </button>

              <div className={cn("grid transition-all duration-300 ease-in-out", resultOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]")}>
                <div className="overflow-hidden">
                  <div className="space-y-4 pt-4">

                    {resultStats !== null ? (
                      <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
                        
                        <div className="flex items-end justify-between px-1">
                          <div>
                            <div className="text-[10px] text-text-faint uppercase tracking-wider mb-1">{t("stat_total_usage")}</div>
                            <div className="text-3xl font-display font-bold text-white leading-none tabular-nums">
                              {resultStats.total.toFixed(1)}<span className="text-base text-text-muted ml-1">Ah</span>
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-1 pb-0.5">
                            <div className="text-[9px] text-text-faint uppercase tracking-wider">{t("stat_working_days")}</div>
                            <div className="text-sm font-bold text-gold font-mono">{resultStats.workingDays}d</div>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div className="bg-zinc-900/60 rounded-md px-2.5 py-2 border border-border/30">
                            <div className="text-[9px] text-text-faint uppercase tracking-wider">{t("stat_avg_daily")}</div>
                            <div className="text-xs font-semibold font-mono mt-0.5 text-text-primary tabular-nums">{resultStats.avgDaily.toFixed(1)} Ah</div>
                          </div>
                          <div className="bg-zinc-900/60 rounded-md px-2.5 py-2 border border-border/30">
                            <div className="text-[9px] text-text-faint uppercase tracking-wider">{t("stat_monthly_avg")}</div>
                            <div className="text-xs font-semibold font-mono mt-0.5 text-text-primary tabular-nums">{resultStats.perMonth.toFixed(1)} Ah</div>
                          </div>
                        </div>

                        {/* Chart Toggle */}
                        <div className="flex bg-zinc-900/80 rounded-lg p-1 border border-border/50">
                           <button 
                              onClick={() => setChartType("premium")}
                              className={cn("flex-1 text-[10px] font-semibold py-1.5 rounded-md transition-all", chartType === "premium" ? "bg-surface border border-border/50 shadow-sm text-gold" : "text-text-muted hover:text-text-primary")}
                           >
                              <Sparkles size={10} className="inline mr-1 mb-0.5" />
                              {t("tab_premium")}
                           </button>
                           <button 
                              onClick={() => setChartType("interactive")}
                              className={cn("flex-1 text-[10px] font-semibold py-1.5 rounded-md transition-all", chartType === "interactive" ? "bg-surface border border-border/50 shadow-sm text-gold" : "text-text-muted hover:text-text-primary")}
                           >
                              <LayoutTemplate size={10} className="inline mr-1 mb-0.5" />
                              {t("tab_interactive")}
                           </button>
                        </div>

                        {chartType === "premium" ? (
                           <AreaChart 
                              pts={resultStats.pts} 
                              months={resultStats.monthsLabel} 
                              liveLabel={t("chart_live")} 
                              trendLabel={t("chart_trend")} 
                           />
                        ) : (
                           <div className="rounded-lg border border-border/30 overflow-hidden bg-zinc-950/80 p-2">
                              <PredictionChart data={result!.chartData} />
                           </div>
                        )}

                      </div>
                    ) : (
                      <div className="h-16 flex items-center justify-center rounded-lg border border-dashed border-border/30">
                        <span className="text-[10px] text-text-faint italic px-6 text-center">
                          {isReady ? "Configure inputs and run prediction to view results" : "Generate training data to enable prediction"}
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
    </main>
  );
}
