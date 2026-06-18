// filepath: src/app/[locale]/(app)/evaluate/page.tsx
"use client";

import { useEffect, useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import { CheckCircle2, XCircle, Database, Activity, Info } from "lucide-react";
import { EvaluationResult } from "@/lib/ml/evaluate";
import { getPredictions } from "@/app/actions/predictions";
import { Prediction } from "@/lib/db/schema";
import { ActivePrediction, ActivePredictionStats } from "@/components/dashboard/section/evaluate/active-prediction";

export default function EvaluatePage() {
  const t = useTranslations("evaluate");
  
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [activePredictionId, setActivePredictionId] = useState<string | null>(null);
  const [evalData, setEvalData] = useState<EvaluationResult | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    getPredictions()
      .then(setPredictions)
      .catch((e) => console.error(e));
  }, []);

  useEffect(() => {
    if (activePredictionId) {
      setEvalData(null);
      fetch('/api/evaluate')
        .then(r => r.json())
        .then(setEvalData)
        .catch(() => setError(true));
    } else {
      setEvalData(null);
    }
  }, [activePredictionId]);

  const activeStats = useMemo<ActivePredictionStats | null>(() => {
    if (!activePredictionId || !predictions.length) return null;
    const p = predictions.find(pred => pred.id === activePredictionId);
    if (!p) return null;
    return {
      totalAmpere: p.totalAmpere,
      avgAmpere: parseFloat((p.totalAmpere / p.predictionPeriod).toFixed(3)),
      rangeMin: p.resultLower,
      rangeMax: p.resultUpper,
      executedAt: new Date(p.createdAt).toLocaleString("id-ID", {
        day: "2-digit", month: "short", year: "numeric",
        hour: "2-digit", minute: "2-digit"
      }),
      predictionPeriod: p.predictionPeriod,
      amperePerCycle: p.amperePerCycle,
      dailyUsageHours: p.dailyUsageHours,
    };
  }, [activePredictionId, predictions]);

  return (
    <main className="container mx-auto px-6 pt-20 pb-20 min-h-[100dvh]">
      <header className="mb-12">
        <h1 className="font-display text-4xl lg:text-5xl font-bold tracking-tight text-text-primary mb-4">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-light via-gold to-gold-dark gold-shimmer">
            {t("title")}
          </span>
        </h1>
        <p className="text-text-muted text-lg max-w-2xl font-sans">
          {t("description")}
        </p>
      </header>

      <ActivePrediction 
        predictions={predictions}
        activePredictionId={activePredictionId}
        onSelect={setActivePredictionId}
        activeStats={activeStats}
      />

      {!activePredictionId ? (
        <div className="bg-surface rounded-4xl border border-dashed border-border-gold/30 p-12 flex flex-col items-center justify-center text-center">
          <Info className="text-gold mb-4" size={32} />
          <p className="font-sans text-text-muted text-lg max-w-md">
            {t("noActiveCallout")}
          </p>
        </div>
      ) : error ? (
        <div className="bg-surface rounded-4xl border border-border-gold p-12 flex justify-center">
          <p className="text-destructive font-sans">{t("error_load")}</p>
        </div>
      ) : evalData ? (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          {/* Criteria Section */}
          <section className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              <CheckCircle2 className="text-gold" size={24} aria-hidden="true" />
              <h2 className="font-display text-2xl font-semibold text-text-primary">
                {t("criteriaTitle")}
              </h2>
            </div>
            <div className="grid lg:grid-cols-2 gap-6">
              {/* R2 Criteria Card */}
              <div className="bg-surface rounded-4xl border border-border-gold p-6 flex items-start gap-4 hover:border-border-gold-hover transition-colors">
                <div className={`p-3 rounded-full shrink-0 ${evalData.r2 >= 0.85 ? 'bg-green-500/10 text-green-500' : 'bg-destructive/10 text-destructive'}`}>
                  {evalData.r2 >= 0.85 ? <CheckCircle2 size={24} /> : <XCircle size={24} />}
                </div>
                <div>
                  <h3 className="font-sans font-medium text-text-primary mb-1">
                    {t("criteria_r2")}
                  </h3>
                  <p className="font-display text-3xl font-bold text-text-primary mb-2">
                    {evalData.r2.toFixed(4)}
                  </p>
                  <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider ${evalData.r2 >= 0.85 ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-destructive/10 text-destructive border border-destructive/20'}`}>
                    {evalData.r2 >= 0.85 ? t("pass") : t("fail")}
                  </div>
                </div>
              </div>

              {/* MAE Criteria Card */}
              <div className="bg-surface rounded-4xl border border-border-gold p-6 flex items-start gap-4 hover:border-border-gold-hover transition-colors">
                <div className={`p-3 rounded-full shrink-0 ${evalData.mae <= (evalData.meanActual * 0.1) ? 'bg-green-500/10 text-green-500' : 'bg-destructive/10 text-destructive'}`}>
                  {evalData.mae <= (evalData.meanActual * 0.1) ? <CheckCircle2 size={24} /> : <XCircle size={24} />}
                </div>
                <div>
                  <h3 className="font-sans font-medium text-text-primary mb-1">
                    {t("criteria_mae")}
                  </h3>
                  <p className="font-display text-3xl font-bold text-text-primary mb-2">
                    {evalData.mae.toFixed(4)} <span className="text-text-muted text-sm font-sans font-normal ml-2">(Threshold: {(evalData.meanActual * 0.1).toFixed(4)})</span>
                  </p>
                  <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider ${evalData.mae <= (evalData.meanActual * 0.1) ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-destructive/10 text-destructive border border-destructive/20'}`}>
                    {evalData.mae <= (evalData.meanActual * 0.1) ? t("pass") : t("fail")}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Metrics Section */}
          <section className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              <Activity className="text-gold" size={24} aria-hidden="true" />
              <h2 className="font-display text-2xl font-semibold text-text-primary">
                {t("metricsTitle")}
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { label: t("mse"), value: evalData.mse },
                { label: t("mae"), value: evalData.mae },
                { label: t("rmse"), value: evalData.rmse },
                { label: t("r2"), value: evalData.r2 }
              ].map((metric, idx) => (
                <div key={idx} className="bg-surface rounded-2xl border border-border-gold p-6 flex flex-col justify-between group hover:border-border-gold-hover transition-colors duration-300">
                  <span className="font-sans text-sm text-text-muted mb-4 group-hover:text-gold transition-colors duration-300">{metric.label}</span>
                  <span className="font-display text-4xl font-bold text-text-primary">{metric.value.toFixed(4)}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Dataset Info Section */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <Database className="text-gold" size={24} aria-hidden="true" />
              <h2 className="font-display text-2xl font-semibold text-text-primary">
                {t("datasetInfo")}
              </h2>
            </div>
            <div className="grid lg:grid-cols-3 gap-6">
              {[
                { label: t("totalSamples"), value: evalData.sampleCount },
                { label: t("trainSize"), value: evalData.trainSize },
                { label: t("testSize"), value: evalData.testSize }
              ].map((info, idx) => (
                <div key={idx} className="bg-surface rounded-2xl border border-border-gold p-6 flex items-center justify-between">
                  <span className="font-sans text-text-muted">{info.label}</span>
                  <span className="font-display text-2xl font-bold text-text-primary bg-background px-4 py-1.5 rounded-lg border border-border-gold/50">{info.value}</span>
                </div>
              ))}
            </div>
          </section>
        </div>
      ) : (
        <div className="bg-surface rounded-4xl border border-border-gold p-12 flex justify-center items-center gap-3">
          <Activity className="text-gold animate-pulse" size={20} />
          <p className="text-text-muted font-sans animate-pulse">Computing metrics...</p>
        </div>
      )}
    </main>
  );
}
