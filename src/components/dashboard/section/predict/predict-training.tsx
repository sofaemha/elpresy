"use client";

import { useTranslations } from "next-intl";
import { Database, RefreshCw, Sparkles, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export const TRAIN_MONTHS = [1, 2, 3] as const;
export type TrainMonth = (typeof TRAIN_MONTHS)[number];
export const WORKING_DAYS_PER_MONTH = 22;

export interface PredictTrainingProps {
  open: boolean;
  onToggle: () => void;
  modelType: "pretrained" | "simulated";
  onChangeModelType: (type: "pretrained" | "simulated") => void;
  trainMonths: TrainMonth;
  onChangeTrainMonths: (months: TrainMonth) => void;
  trainData: { x: number[][]; y: number[] } | null;
  avgY: number | null;
  onGenerate: () => void;
}

export function PredictTraining({
  open,
  onToggle,
  modelType,
  onChangeModelType,
  trainMonths,
  onChangeTrainMonths,
  trainData,
  avgY,
  onGenerate,
}: PredictTrainingProps) {
  const t = useTranslations("predict");

  return (
    <div>
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between py-0.5 group lg:hidden"
      >
        <div className="flex items-center gap-1.5">
          <Database size={10} className="text-gold/60" />
          <span className="text-[11px] text-text-muted font-medium uppercase tracking-wider group-hover:text-text-primary transition-colors">
            {t("accordion_training")}
          </span>
        </div>
        <ChevronDown size={12} className={cn("text-text-faint transition-transform duration-300", open && "rotate-180")} />
      </button>

      <div className={cn("grid transition-all duration-300 ease-in-out lg:grid-rows-[1fr]", open ? "grid-rows-[1fr]" : "grid-rows-[0fr]")}>
        <div className="overflow-hidden">
          <div className="space-y-4 pt-3 lg:pt-0">
            
            <div className="hidden lg:flex items-center gap-2 mb-4 pb-4 border-b border-border/50">
                <Database size={14} className="text-gold" />
                <h2 className="text-sm font-display font-semibold text-text-primary tracking-wider">{t("accordion_training")}</h2>
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => onChangeModelType("pretrained")}
                className={cn("h-10 rounded-lg border text-[10px] font-semibold flex items-center justify-center gap-1.5 transition-all duration-200", 
                  modelType === "pretrained" ? "bg-gold/15 border-gold/50 text-gold shadow-[0_0_8px_rgba(201,168,76,0.15)]" : "bg-zinc-900/60 border-border/40 text-text-faint hover:border-gold/30 hover:text-text-muted"
                )}
              >
                <Sparkles size={11} />
                {t("model_pretrained")}
              </button>
              <button
                onClick={() => onChangeModelType("simulated")}
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
                    <button key={m} onClick={() => onChangeTrainMonths(m)}
                      className={cn("h-10 rounded-lg border flex flex-col items-center justify-center gap-0.5 transition-all duration-200", 
                        trainMonths === m ? "bg-gold/15 border-gold/50 text-gold shadow-[0_0_8px_rgba(201,168,76,0.15)]" : "bg-zinc-900/60 border-border/40 text-text-faint hover:border-gold/30 hover:text-text-muted"
                      )}>
                      <span className="text-[11px] font-bold font-mono">{m} mo</span>
                      <span className="text-[8px] font-normal opacity-60">{m * WORKING_DAYS_PER_MONTH} samples</span>
                    </button>
                  ))}
                </div>

                <button onClick={onGenerate}
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
  );
}
