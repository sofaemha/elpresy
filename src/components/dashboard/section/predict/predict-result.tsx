"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { ChartBar, ChevronDown, Sparkles, LayoutTemplate } from "lucide-react";
import { cn } from "@/lib/utils";
import { AreaChart } from "@/components/ui/area-chart";
import PredictionChart from "@/components/predict/result/chart";
import type { PredictionResult } from "@/lib/ml/predict";

export interface PredictResultProps {
  open: boolean;
  onToggle: () => void;
  result: PredictionResult | null;
  resultStats: {
    total: number;
    workingDays: number;
    avgDaily: number;
    perMonth: number;
    pts: number[];
    monthsLabel: number;
  } | null;
  isReady: boolean;
}

export function PredictResult({
  open,
  onToggle,
  result,
  resultStats,
  isReady,
}: PredictResultProps) {
  const t = useTranslations("predict");
  const [chartType, setChartType] = useState<"premium" | "interactive">("premium");

  return (
    <div>
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between py-0.5 group lg:hidden"
      >
        <div className="flex items-center gap-1.5">
          <ChartBar size={10} className="text-gold/60" />
          <span className="text-[11px] text-text-muted font-medium uppercase tracking-wider group-hover:text-text-primary transition-colors">
             {t("accordion_result")}
          </span>
        </div>
        <ChevronDown size={12} className={cn("text-text-faint transition-transform duration-300", open && "rotate-180")} />
      </button>

      <div className={cn("grid transition-all duration-300 ease-in-out lg:grid-rows-[1fr]", open ? "grid-rows-[1fr]" : "grid-rows-[0fr]")}>
        <div className="overflow-hidden">
          <div className="space-y-4 pt-4 lg:pt-0 lg:h-full lg:flex lg:flex-col">
            
            <div className="hidden lg:flex items-center gap-2 mb-4 pb-4 border-b border-border/50">
                <ChartBar size={14} className="text-gold" />
                <h2 className="text-sm font-display font-semibold text-text-primary tracking-wider">{t("accordion_result")}</h2>
            </div>

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
  );
}
