// filepath: src/components/dashboard/section/evaluate/prediction-selector-dialog.tsx
"use client";

import { useState, useMemo, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Search, CheckCircle2, Circle } from "lucide-react";
import { Prediction } from "@/lib/db/schema";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface PredictionSelectorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  predictions: Prediction[];
  activePredictionId: string | null;
  onConfirm: (id: string | null) => void;
}

export function PredictionSelectorDialog({
  open,
  onOpenChange,
  predictions,
  activePredictionId,
  onConfirm,
}: PredictionSelectorDialogProps) {
  const t = useTranslations("evaluate.selector");
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(activePredictionId);

  useEffect(() => {
    if (open) {
      setSelectedId(activePredictionId);
      setSearch("");
    }
  }, [open, activePredictionId]);

  const filteredPredictions = useMemo(() => {
    return predictions.filter((p) => {
      const searchLower = search.toLowerCase();
      const dateStr = new Date(p.createdAt).toLocaleDateString("id-ID", {
        day: "2-digit", month: "short", year: "numeric"
      }).toLowerCase();
      
      return (
        dateStr.includes(searchLower) ||
        p.totalAmpere.toString().includes(searchLower)
      );
    });
  }, [predictions, search]);

  const handleToggle = (id: string) => {
    if (selectedId === id) {
      setSelectedId(null);
    } else {
      setSelectedId(id);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl bg-surface border-border-gold p-0 gap-0 overflow-hidden flex flex-col max-h-[85dvh]">
        <div className="p-6 pb-4 border-b border-border">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl text-text-primary">
              {t("title")}
            </DialogTitle>
            <DialogDescription className="font-sans text-text-muted">
              {t("description")}
            </DialogDescription>
          </DialogHeader>
          <div className="mt-6 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
            <input 
              type="text" 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t("searchPlaceholder")}
              className="w-full bg-background border border-border rounded-lg pl-10 pr-4 py-2.5 text-sm font-sans text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-gold transition-shadow"
            />
          </div>
        </div>

        <div className="overflow-y-auto p-6 flex-1 max-h-[50dvh]">
          {predictions.length === 0 ? (
            <div className="text-center py-12 text-text-muted font-sans">
              <p>{t("emptyList")}</p>
            </div>
          ) : filteredPredictions.length === 0 ? (
            <div className="text-center py-12 text-text-muted font-sans">
              <p>{t("emptySearch")}</p>
            </div>
          ) : (
            <div className="border border-border rounded-lg overflow-hidden flex flex-col bg-background">
              {filteredPredictions.map((p, idx) => {
                const isActive = selectedId === p.id;
                const isLast = idx === filteredPredictions.length - 1;
                
                const avgAmpere = (p.totalAmpere / p.predictionPeriod).toFixed(3);
                const dateObj = new Date(p.createdAt);
                const dateStr = dateObj.toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" });
                const timeStr = dateObj.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });

                return (
                  <div 
                    key={p.id}
                    onClick={() => handleToggle(p.id)}
                    className={`group flex items-center gap-4 p-4 cursor-pointer transition-all duration-200 border-l-2 ${
                      isActive 
                        ? "bg-[#0d2218] border-l-[#22c55e]" 
                        : "border-l-transparent hover:bg-surface"
                    } ${!isLast ? "border-b border-border" : ""}`}
                  >
                    <div className="shrink-0 flex items-center justify-center w-8">
                      {isActive ? (
                        <CheckCircle2 className="text-[#22c55e]" size={20} />
                      ) : (
                        <Circle className="text-text-muted group-hover:text-gold/50 transition-colors" size={20} />
                      )}
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 flex-1 items-center">
                      <div className="col-span-2 sm:col-span-1">
                        <p className="font-sans text-sm font-medium text-text-primary leading-tight">{dateStr}</p>
                        <p className="font-sans text-xs text-text-muted mt-0.5">{timeStr}</p>
                      </div>
                      
                      <div>
                        <p className="font-display text-sm font-semibold text-text-primary leading-tight">{p.totalAmpere.toFixed(3)}</p>
                        <p className="font-sans text-xs text-text-muted mt-0.5">{t("colTotal")}</p>
                      </div>

                      <div>
                        <p className="font-display text-sm font-semibold text-text-primary leading-tight">{avgAmpere}</p>
                        <p className="font-sans text-xs text-text-muted mt-0.5">{t("colAvg")}</p>
                      </div>

                      <div className="hidden sm:block">
                        <p className="font-display text-sm font-semibold text-text-primary leading-tight">{p.resultLower} - {p.resultUpper}</p>
                        <p className="font-sans text-xs text-text-muted mt-0.5">{t("colRange")}</p>
                      </div>

                      <div className="hidden sm:block">
                        <p className="font-display text-sm font-semibold text-text-primary leading-tight">{p.predictionPeriod} days</p>
                        <p className="font-sans text-xs text-text-muted mt-0.5">{t("colPeriod")}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="p-6 border-t border-border bg-surface/50">
          <DialogFooter className="flex flex-col sm:flex-row gap-3 sm:justify-between w-full">
            <div className="w-full sm:w-auto">
              {selectedId && (
                <Button 
                  type="button"
                  variant="ghost" 
                  onClick={() => setSelectedId(null)}
                  className="w-full sm:w-auto text-text-muted hover:text-destructive hover:bg-destructive/10"
                >
                  {t("btnClear")}
                </Button>
              )}
            </div>
            <Button 
              type="button"
              onClick={() => onConfirm(selectedId)}
              className="w-full sm:w-auto bg-gold hover:bg-gold-hover text-surface font-semibold rounded-full px-8"
            >
              {t("btnConfirm")}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
