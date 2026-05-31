"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Search } from "lucide-react";

type PredictionItem = {
  prediction: {
    id: string;
    amperePerCycle: number;
    dailyUsageHours: number;
    predictionPeriod: number;
    resultLower: number;
    resultUpper: number;
    createdAt: Date;
  };
  userName: string | null;
};

export function PredictionsTable({ predictions }: { predictions: PredictionItem[] }) {
  const t = useTranslations("admin");
  const [search, setSearch] = useState("");

  const filteredPredictions = predictions.filter((p) => {
    const q = search.toLowerCase();
    const name = p.userName || "unknown";
    return name.toLowerCase().includes(q);
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-xl font-bold text-foreground">
          {t("tab_predictions")} ({filteredPredictions.length})
        </h2>
        <div className="relative max-w-sm w-full">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={14} className="text-text-faint" />
          </div>
          <input
            type="text"
            className="w-full h-9 bg-surface-2 border border-border rounded-lg pl-9 pr-3 text-sm text-foreground focus:outline-none focus:border-gold transition-colors placeholder:text-text-faint"
            placeholder={t("search_predictions")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="rounded-xl border border-border bg-surface overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-surface-2 text-text-muted text-xs border-b border-border">
            <tr>
              <th className="px-4 py-3">{t("col_user")}</th>
              <th className="px-4 py-3">Inputs</th>
              <th className="px-4 py-3">Range</th>
              <th className="px-4 py-3">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filteredPredictions.map(({ prediction, userName }) => (
              <tr key={prediction.id} className="text-foreground">
                <td className="px-4 py-3">{userName || "Unknown"}</td>
                <td className="px-4 py-3 text-text-muted text-xs">
                  {prediction.amperePerCycle}A, {prediction.dailyUsageHours}h, {prediction.predictionPeriod}d
                </td>
                <td className="px-4 py-3 text-primary font-medium">
                  {prediction.resultLower.toFixed(1)} - {prediction.resultUpper.toFixed(1)} A
                </td>
                <td className="px-4 py-3 text-text-muted">
                  {new Date(prediction.createdAt).toISOString().split("T")[0]}
                </td>
              </tr>
            ))}
            {filteredPredictions.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-text-muted">
                  No predictions found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
