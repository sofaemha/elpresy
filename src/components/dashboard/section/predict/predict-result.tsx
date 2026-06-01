"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { ChartBar, ChevronDown, Sparkles, LayoutTemplate, TrendingDown, TrendingUp, Minus } from "lucide-react";
import { cn } from "@/lib/utils";
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
  historyAvgs?: { min: number; max: number } | null;
  isReady: boolean;
}

export function PredictResult({
  open,
  onToggle,
  result,
  resultStats,
  historyAvgs,
  isReady,
}: PredictResultProps) {
  const t = useTranslations("predict");

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

                  <div className="flex flex-col items-center pb-0.5">
                    <div className="text-[9px] text-text-faint uppercase tracking-wider mb-1">Avg Ampere</div>
                    {(() => {
                      const avg = resultStats.total / resultStats.workingDays;
                      let colorClass = "text-white";
                      let Icon = Minus;
                      if (historyAvgs) {
                        if (avg < historyAvgs.min) {
                          colorClass = "text-green-500";
                          Icon = TrendingDown;
                        } else if (avg > historyAvgs.max) {
                          colorClass = "text-red-500";
                          Icon = TrendingUp;
                        }
                      }
                      return (
                        <div className={`flex items-center gap-1 text-xl font-display font-bold tabular-nums ${colorClass}`}>
                          {avg.toFixed(2)} Ah <Icon size={14} />
                        </div>
                      );
                    })()}
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

                <div className="rounded-lg border border-border/30 overflow-hidden p-2 mt-4">
                  <PredictionChart data={result!.chartData} height={400}/>
                </div>

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
