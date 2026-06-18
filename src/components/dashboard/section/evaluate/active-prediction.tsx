// filepath: src/components/dashboard/section/evaluate/active-prediction.tsx
"use client";

import { useTranslations } from "next-intl";
import { Zap, Activity, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Prediction } from "@/lib/db/schema";
import Link from "next/link";
import { useState } from "react";
import { PredictionSelectorDialog } from "./prediction-selector-dialog";

export interface ActivePredictionStats {
  totalAmpere: number;
  avgAmpere: number;
  rangeMin: number;
  rangeMax: number;
  executedAt: string;
  predictionPeriod: number;
  amperePerCycle: number;
  dailyUsageHours: number;
}

interface ActivePredictionProps {
  predictions: Prediction[];
  activePredictionId: string | null;
  onSelect: (id: string | null) => void;
  activeStats: ActivePredictionStats | null;
}

export function ActivePrediction({
  predictions,
  activePredictionId,
  onSelect,
  activeStats,
}: ActivePredictionProps) {
  const t = useTranslations("evaluate.activePrediction");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  if (predictions.length === 0) {
    return (
      <div className="bg-surface rounded-4xl border border-border-gold p-8 flex flex-col items-center justify-center text-center">
        <div className="bg-gold/10 p-4 rounded-full mb-4">
          <Zap className="text-gold" size={32} />
        </div>
        <h3 className="font-display text-2xl font-bold text-text-primary mb-2">
          {t("emptyTitle")}
        </h3>
        <p className="font-sans text-text-muted max-w-md mb-6">
          {t("emptyDescription")}
        </p>
        <Button asChild className="bg-gold hover:bg-gold-hover text-surface font-semibold rounded-full px-8">
          <Link href="/predict">{t("emptyAction")}</Link>
        </Button>
      </div>
    );
  }

  const hasActive = activeStats !== null;

  return (
    <>
      <div className="bg-surface rounded-4xl border border-border-gold p-6 lg:p-8 relative overflow-hidden mb-12">
        {hasActive && (
          <div className="absolute top-0 right-0 -mt-16 -mr-16 w-64 h-64 bg-gold/5 rounded-full blur-3xl pointer-events-none" />
        )}
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h3 className="font-display text-2xl font-semibold text-text-primary">
                {t("title")}
              </h3>
              <div className={`px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider ${hasActive ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-muted text-muted-foreground border border-border'}`}>
                {hasActive ? t("statusActive") : t("statusNotSelected")}
              </div>
            </div>
            <p className="font-sans text-text-muted text-sm max-w-lg">
              {t("description")}
            </p>
          </div>
          <Button 
            onClick={() => setIsDialogOpen(true)}
            variant={hasActive ? "outline" : "default"}
            className={!hasActive ? "bg-gold hover:bg-gold-hover text-surface font-semibold rounded-full px-6" : "rounded-full px-6 border-border-gold text-gold hover:bg-gold/10"}
          >
            {hasActive ? t("btnChange") : t("btnSelect")}
          </Button>
        </div>

        {hasActive ? (
          <div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div className="bg-background rounded-2xl p-4 border border-border-gold/30">
                <p className="text-text-muted text-xs font-sans mb-1">{t("statsTotal")}</p>
                <p className="font-display text-2xl font-bold text-text-primary">{activeStats.totalAmpere.toFixed(3)}<span className="text-sm font-sans font-normal text-text-muted ml-1">A</span></p>
              </div>
              <div className="bg-background rounded-2xl p-4 border border-border-gold/30">
                <p className="text-text-muted text-xs font-sans mb-1">{t("statsAvg")}</p>
                <p className="font-display text-2xl font-bold text-text-primary">{activeStats.avgAmpere.toFixed(3)}<span className="text-sm font-sans font-normal text-text-muted ml-1">A</span></p>
              </div>
              <div className="bg-background rounded-2xl p-4 border border-border-gold/30">
                <p className="text-text-muted text-xs font-sans mb-1">{t("statsRange")}</p>
                <p className="font-display text-lg sm:text-xl font-bold text-text-primary">{activeStats.rangeMin} - {activeStats.rangeMax}<span className="text-xs font-sans font-normal text-text-muted ml-1">A</span></p>
              </div>
              <div className="bg-background rounded-2xl p-4 border border-border-gold/30 flex flex-col justify-center">
                <p className="text-text-muted text-xs font-sans mb-1">{t("statsExecuted")}</p>
                <div className="flex items-center gap-1.5 text-text-primary">
                  <Calendar size={14} className="text-gold shrink-0" />
                  <p className="font-sans text-sm font-medium leading-tight">{activeStats.executedAt}</p>
                </div>
              </div>
            </div>
            <div className="text-center font-sans text-xs text-text-muted/80 bg-background/50 rounded-xl py-2 border border-border-gold/10">
              {t("statsMeta", {
                period: activeStats.predictionPeriod,
                ampere: activeStats.amperePerCycle,
                hours: activeStats.dailyUsageHours
              })}
            </div>
          </div>
        ) : (
          <div className="bg-background/50 rounded-2xl border border-dashed border-border-gold/30 p-8 flex items-center justify-center">
            <p className="font-sans text-text-muted text-sm flex items-center gap-2">
              <Activity size={16} />
              {t("description")}
            </p>
          </div>
        )}
      </div>

      <PredictionSelectorDialog 
        open={isDialogOpen} 
        onOpenChange={setIsDialogOpen}
        predictions={predictions}
        activePredictionId={activePredictionId}
        onConfirm={(id) => {
          onSelect(id);
          setIsDialogOpen(false);
        }}
      />
    </>
  );
}
