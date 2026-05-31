"use client";

import { useState, useMemo, useCallback } from "react";
import { useTranslations } from "next-intl";
import { Activity, Zap } from "lucide-react";
import { DecisionTreeRegression } from "ml-cart";
import { PredictTraining, type TrainMonth, WORKING_DAYS_PER_MONTH } from "@/components/dashboard/section/predict/predict-training";
import { PredictInput } from "@/components/dashboard/section/predict/predict-input";
import { PredictResult } from "@/components/dashboard/section/predict/predict-result";
import type { PredictionResult } from "@/lib/ml/predict";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { savePrediction } from "@/app/actions/predictions";

// ── Constants ─────────────────────────────────────────────────────────────
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
    <main className="container mx-auto px-6 py-12 md:py-20 lg:py-24 min-h-[100dvh]">
      <div className="w-full max-w-[500px] lg:max-w-6xl mx-auto space-y-8">
        
        <div className="space-y-2 text-center">
          <h1 className="font-display text-3xl lg:text-4xl font-bold text-foreground flex items-center justify-center gap-2">
            <Zap className="text-gold fill-gold" size={24} />
            {t("title")}
          </h1>
          <p className="text-sm lg:text-base text-text-muted">{t("subtitle")}</p>
        </div>

        <div className="relative w-full bg-surface border border-border rounded-2xl shadow-2xl overflow-hidden backdrop-blur-xl lg:bg-transparent lg:border-none lg:shadow-none lg:overflow-visible lg:backdrop-blur-none">
          
          <div className="lg:hidden px-5 py-3 border-b border-border/50 bg-surface-2/30 flex items-center justify-between">
            <div className="flex items-center gap-2 text-text-primary font-display font-semibold text-sm">
              <Activity className="text-gold" size={14} /><span>PREDICTOR CORE</span>
            </div>
          </div>

          <div className="p-5 space-y-4 lg:p-0 lg:space-y-0 lg:grid lg:grid-cols-12 lg:gap-6 lg:items-start">
            
            {/* Left Column: Controls (Training + Input) */}
            <div className="lg:col-span-5 lg:flex lg:flex-col lg:gap-6 min-w-0">
                
                {/* Training Data Card */}
                <div className="lg:bg-surface lg:border lg:border-border lg:rounded-2xl lg:p-6 lg:shadow-xl">
                    <PredictTraining
                        open={trainOpen}
                        onToggle={() => setTrainOpen((o) => !o)}
                        modelType={modelType}
                        onChangeModelType={(type) => { setModelType(type); setResult(null); }}
                        trainMonths={trainMonths}
                        onChangeTrainMonths={setTrainMonths}
                        trainData={trainData}
                        avgY={avgY}
                        onGenerate={handleGenerate}
                    />
                </div>

                <div className="relative h-px my-7 lg:hidden">
                    <div className="absolute inset-0" style={{ background: `linear-gradient(to right, transparent, ${GOLD}99, transparent)` }} />
                </div>

                {/* Predict Input Card */}
                <div className="lg:bg-surface lg:border lg:border-border lg:rounded-2xl lg:p-6 lg:shadow-xl">
                    <PredictInput
                        open={predOpen}
                        onToggle={() => setPredOpen((o) => !o)}
                        isReady={isReady}
                        error={error}
                        loading={loading}
                        ampere={ampere}
                        onChangeAmpere={setAmpere}
                        hours={hours}
                        onChangeHours={setHours}
                        periodType={periodType}
                        onChangePeriodType={setPeriodType}
                        customDays={customDays}
                        onChangeCustomDays={setCustomDays}
                        onPredict={handlePredict}
                    />
                </div>
            </div>

            <div className="relative h-px my-7 lg:hidden">
              <div className="absolute inset-0" style={{ background: `linear-gradient(to right, transparent, ${GOLD}99, transparent)` }} />
            </div>

            {/* Right Column: Results */}
            <div className="lg:col-span-7 lg:bg-surface lg:border lg:border-border lg:rounded-2xl lg:p-6 lg:shadow-xl lg:sticky lg:top-8 min-w-0">
                <PredictResult
                open={resultOpen}
                onToggle={() => setResultOpen((o) => !o)}
                result={result}
                resultStats={resultStats}
                isReady={isReady}
                />
            </div>

          </div>
        </div>
      </div>
    </main>
  );
}
