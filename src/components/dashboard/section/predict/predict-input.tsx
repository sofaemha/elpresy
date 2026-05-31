"use client";

import { useTranslations } from "next-intl";
import { Activity, Clock, BarChart3, ChevronDown, RefreshCw, Play } from "lucide-react";
import { cn } from "@/lib/utils";
import { NumericStepper } from "@/components/ui/numeric-stepper";

export interface PredictInputProps {
  open: boolean;
  onToggle: () => void;
  isReady: boolean;
  error: string;
  loading: boolean;
  ampere: number;
  onChangeAmpere: (val: number) => void;
  hours: number;
  onChangeHours: (val: number) => void;
  periodType: "1mo" | "3mo" | "6mo" | "custom";
  onChangePeriodType: (type: "1mo" | "3mo" | "6mo" | "custom") => void;
  customDays: number;
  onChangeCustomDays: (val: number) => void;
  onPredict: () => void;
}

export function PredictInput({
  open,
  onToggle,
  isReady,
  error,
  loading,
  ampere,
  onChangeAmpere,
  hours,
  onChangeHours,
  periodType,
  onChangePeriodType,
  customDays,
  onChangeCustomDays,
  onPredict,
}: PredictInputProps) {
  const t = useTranslations("predict");

  return (
    <div>
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between py-0.5 group lg:hidden"
      >
        <div className="flex items-center gap-2">
          <div className={cn("w-1.5 h-1.5 rounded-full transition-colors duration-500", isReady ? "bg-emerald-500 animate-pulse" : "bg-zinc-600")} />
          <span className={cn("text-[10px] font-medium uppercase tracking-wider transition-colors duration-500", isReady ? "text-emerald-400/80" : "text-zinc-600")}>
            {isReady ? t("mock_status_ready") : t("mock_status_unready")}
          </span>
        </div>
        <ChevronDown size={12} className={cn("text-text-faint transition-transform duration-300", open && "rotate-180")} />
      </button>

      <div className={cn("grid transition-all duration-300 ease-in-out lg:grid-rows-[1fr]", open ? "grid-rows-[1fr]" : "grid-rows-[0fr]")}>
        <div className="overflow-hidden">
          <div className="space-y-4 pt-3 lg:pt-0">
            
            <div className="hidden lg:flex items-center gap-2 mb-4 pb-4 border-b border-border/50 justify-between">
                <div className="flex items-center gap-2">
                    <Activity size={14} className="text-gold" />
                    <h2 className="text-sm font-display font-semibold text-text-primary tracking-wider">{t("accordion_inputs")}</h2>
                </div>
                <div className="flex items-center gap-2">
                    <div className={cn("w-1.5 h-1.5 rounded-full transition-colors duration-500", isReady ? "bg-emerald-500 animate-pulse" : "bg-zinc-600")} />
                    <span className={cn("text-[10px] font-medium uppercase tracking-wider transition-colors duration-500", isReady ? "text-emerald-400/80" : "text-zinc-600")}>
                        {isReady ? t("mock_status_ready") : t("mock_status_unready")}
                    </span>
                </div>
            </div>
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
                <NumericStepper id="predict-ampere" value={ampere} min={0.1} max={50} step={0.1} unit="A" onChange={onChangeAmpere} />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] text-text-muted font-medium uppercase tracking-wider flex items-center justify-between">
                  <span className="flex items-center gap-1.5"><Clock size={10} className="text-gold/60" />{t("field_hours")}</span>
                </label>
                <NumericStepper id="predict-hours" value={hours} min={1} max={24} step={0.5} unit="hrs" onChange={onChangeHours} />
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
                    <button key={p.id} onClick={() => onChangePeriodType(p.id as any)}
                      className={cn("h-9 rounded-lg border text-[11px] font-semibold font-mono transition-all duration-200", 
                        periodType === p.id ? "bg-gold/15 border-gold/50 text-gold shadow-[0_0_8px_rgba(201,168,76,0.15)]" : "bg-zinc-900/60 border-border/40 text-text-faint hover:border-gold/30 hover:text-text-muted"
                      )}>
                      {p.label}
                    </button>
                  ))}
                </div>
                {periodType === "custom" && (
                   <div className="pt-1.5 animate-in slide-in-from-top-2 fade-in duration-300">
                     <NumericStepper id="predict-custom-days" value={customDays} min={1} max={365} step={1} unit="days" onChange={onChangeCustomDays} />
                   </div>
                )}
              </div>
            </div>

            <button
              onClick={onPredict}
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
  );
}
