// filepath: src/app/[locale]/(app)/predict/page.tsx
"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import PredictionChart from "@/components/predict/result/chart";
import type { PredictionResult } from "@/lib/ml/predict";

export default function PredictPage() {
  const t = useTranslations("predict");
  const [ampere, setAmpere] = useState("");
  const [hours, setHours] = useState("");
  const [period, setPeriod] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);

    const ampereVal = parseFloat(ampere);
    const hoursVal = parseFloat(hours);
    const periodVal = parseInt(period, 10);

    if (isNaN(ampereVal) || ampereVal <= 0 || ampereVal > 50) {
      setError(t("error_ampere"));
      setLoading(false);
      return;
    }
    if (isNaN(hoursVal) || hoursVal <= 0 || hoursVal > 24) {
      setError(t("error_hours"));
      setLoading(false);
      return;
    }
    if (isNaN(periodVal) || periodVal < 1 || periodVal > 365) {
      setError(t("error_period"));
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amperePerCycle: ampereVal,
          dailyUsageHours: hoursVal,
          predictionPeriod: periodVal,
        }),
      });

      if (!res.ok) {
        throw new Error(t("error_required"));
      }

      const data: PredictionResult = await res.json();
      setResult(data);
    } catch (err: any) {
      setError(err.message || "Failed to generate prediction");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="container mx-auto px-6 py-12 md:py-20 min-h-[100dvh]">
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="space-y-2">
          <h1 className="font-display text-3xl font-bold text-foreground">{t("title")}</h1>
          <p className="text-sm text-text-muted">{t("subtitle")}</p>
        </div>

        <div className="rounded-2xl border border-border bg-surface p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="rounded-md border border-destructive/20 bg-destructive/10 p-4 text-sm text-destructive">
                {error}
              </div>
            )}
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground" htmlFor="ampere">
                {t("field_ampere")}
              </label>
              <input
                id="ampere"
                type="number"
                step="0.1"
                required
                value={ampere}
                onChange={(e) => setAmpere(e.target.value)}
                className="flex h-10 w-full rounded-md border border-border bg-transparent px-3 py-2 text-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                aria-describedby="ampere-hint"
              />
              <p id="ampere-hint" className="text-xs text-text-muted">{t("field_ampere_hint")}</p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground" htmlFor="hours">
                {t("field_hours")}
              </label>
              <input
                id="hours"
                type="number"
                step="0.1"
                required
                value={hours}
                onChange={(e) => setHours(e.target.value)}
                className="flex h-10 w-full rounded-md border border-border bg-transparent px-3 py-2 text-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                aria-describedby="hours-hint"
              />
              <p id="hours-hint" className="text-xs text-text-muted">{t("field_hours_hint")}</p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground" htmlFor="period">
                {t("field_period")}
              </label>
              <input
                id="period"
                type="number"
                step="1"
                required
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
                className="flex h-10 w-full rounded-md border border-border bg-transparent px-3 py-2 text-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                aria-describedby="period-hint"
              />
              <p id="period-hint" className="text-xs text-text-muted">{t("field_period_hint")}</p>
            </div>

            <Button type="submit" className="w-full h-11 text-base" disabled={loading}>
              {loading ? t("btn_loading") : t("btn_submit")}
            </Button>
          </form>
        </div>

        {result && (
          <div className="space-y-6 mt-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="font-display text-2xl font-bold text-foreground">{t("result_title")}</h2>
            
            <div className="rounded-xl border border-border bg-surface p-6 flex flex-col items-center justify-center space-y-2">
              <span className="text-sm font-medium text-text-muted uppercase tracking-wider">{t("result_range")}</span>
              <span className="text-3xl md:text-4xl font-display font-bold text-primary gold-shimmer">
                {result.resultLower.toFixed(3)} A — {result.resultUpper.toFixed(3)} A
              </span>
            </div>

            <div className="rounded-xl border border-border bg-surface p-6 space-y-6">
              <h3 className="text-lg font-medium text-foreground">{t("result_chart_title")}</h3>
              <PredictionChart data={result.chartData} />
            </div>

            <Button variant="outline" className="w-full" onClick={() => setResult(null)}>
              {t("new_prediction")}
            </Button>
          </div>
        )}
      </div>
    </main>
  );
}
