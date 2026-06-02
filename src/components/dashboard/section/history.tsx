// filepath: src/components/dashboard/section/history.tsx
"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { History, ChevronLeft, ChevronRight, Inbox, TrendingDown, TrendingUp, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface MockPrediction {
  id: string;
  amperePerCycle: number;
  dailyUsageHours: number;
  predictionPeriod: number;
  resultLower: number;
  resultUpper: number;
  totalAmpere: number;
  createdAt: string;
  chartData?: any;
}

interface HistoryProps {
  t: ReturnType<typeof useTranslations>;
  predictions: MockPrediction[];
  pageSize?: number;
}

const PAGE_SIZE = 15;

function formatRange(lower: number, upper: number, unit: string): string {
  return `${lower.toFixed(3)} ${unit} — ${upper.toFixed(3)} ${unit}`;
}

export default function HistoryTable({
  t,
  predictions,
  pageSize = PAGE_SIZE,
}: HistoryProps) {
  const [page, setPage] = useState(1);
  const unit = t("unit");

  const totalPages = Math.max(1, Math.ceil(predictions.length / pageSize));
  const from = (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, predictions.length);
  const slice = predictions.slice((page - 1) * pageSize, page * pageSize);

  const sumAmpere = predictions.reduce((acc, p) => acc + (p.totalAmpere || 0), 0);
  const sumDays = predictions.reduce((acc, p) => acc + (p.predictionPeriod || 0), 0);
  const overallAvg = sumDays > 0 ? sumAmpere / sumDays : 0;

  const isEmpty = predictions.length === 0;

  const columns = [
    t("colDate"),
    t("colAmpere"),
    t("colHours"),
    t("colPeriod"),
    "Total Ampere",
    "Avg Ampere",
    t("colRange"),
  ] as const;

  return (
    <section aria-labelledby="history-heading" className="flex flex-col bg-surface border border-border-gold rounded-lg overflow-hidden h-full">
      {/* Section header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-border-gold shrink-0">
        <div className="flex items-center gap-2">
          <History size={14} className="text-gold" aria-hidden="true" />
          <h2
            id="history-heading"
            className="text-sm font-display font-semibold text-text-primary"
          >
            {t("historyTitle")}
          </h2>
        </div>
        {!isEmpty && (
          <span className="text-[10px] font-mono text-text-faint">
            {predictions.length} total
          </span>
        )}
      </div>

      {/* Table wrapper */}
      <div className="flex-1 overflow-x-auto">
        {isEmpty ? (
          <div className="flex flex-col items-center justify-center gap-3 h-48 text-center px-6">
            <Inbox size={28} className="text-text-faint" aria-hidden="true" />
            <p className="text-sm text-text-muted">{t("empty")}</p>
          </div>
        ) : (
          <table className="w-full text-sm" aria-label={t("historyTitle")}>
            <thead>
              <tr className="border-b border-border-gold">
                {columns.map((col) => (
                  <th
                    key={col}
                    scope="col"
                    className="px-4 py-3 text-center text-[10px] font-semibold uppercase tracking-widest text-text-faint whitespace-nowrap"
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {slice.map((row, i) => (
                <tr
                  key={row.id}
                  className={`transition-colors hover:bg-gold/[0.025] ${
                    i < slice.length - 1 ? "border-b border-border-gold" : ""
                  }`}
                >
                  <td className="px-4 py-3 font-mono text-center text-text-muted text-xs whitespace-nowrap">
                    {row.createdAt}
                  </td>
                  <td className="px-4 py-3 font-mono text-center text-text-primary text-xs whitespace-nowrap">
                    {row.amperePerCycle.toFixed(1)}&thinsp;{unit}
                  </td>
                  <td className="px-4 py-3 font-mono text-center text-text-primary text-xs whitespace-nowrap">
                    {row.dailyUsageHours.toFixed(1)}&thinsp;h
                  </td>
                  <td className="px-4 py-3 font-mono text-center text-text-primary text-xs whitespace-nowrap">
                    {row.predictionPeriod}&thinsp;d
                  </td>
                  <td className="px-4 py-3 font-mono text-center text-text-primary text-xs whitespace-nowrap">
                    {row.totalAmpere?.toFixed(1) || 0}&thinsp;{unit}
                  </td>
                  <td className="px-4 py-3 font-mono text-center text-xs whitespace-nowrap">
                    {(() => {
                      const rowAvg = row.predictionPeriod ? row.totalAmpere / row.predictionPeriod : 0;
                      
                      let colorClass = "text-gold";
                      let Icon = Minus;

                      if (sumDays > 0) {
                         const diff = rowAvg - overallAvg;
                         if (diff < -0.001) {
                           colorClass = "text-red-500";
                           Icon = TrendingDown;
                         } else if (diff > 0.001) {
                           colorClass = "text-green-500";
                           Icon = TrendingUp;
                         }
                      }

                      return (
                        <div className={`flex items-center gap-1 ${colorClass}`}>
                          <span>{rowAvg.toFixed(2)}&thinsp;{unit}</span>
                          <Icon size={12} />
                        </div>
                      );
                    })()}
                  </td>
                  <td className="px-4 py-3 text-center text-xs whitespace-nowrap">
                    <span className="font-mono font-semibold text-gold">
                      {formatRange(row.resultLower, row.resultUpper, unit)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {!isEmpty && (
        <div className="flex items-center justify-between px-5 py-3 border-t border-border-gold shrink-0 gap-4 flex-wrap">
          <p className="text-[11px] text-text-faint font-mono">
            {t("showing", { from, to, total: predictions.length })}
          </p>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon-sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              aria-label={t("pagePrev")}
            >
              <ChevronLeft size={13} aria-hidden="true" />
            </Button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPage(p)}
                aria-current={p === page ? "page" : undefined}
                className={`inline-flex items-center justify-center size-6 rounded text-[11px] font-mono transition-all border ${
                  p === page
                    ? "bg-gold/10 border-gold/40 text-gold font-semibold"
                    : "border-border-gold text-text-faint hover:border-gold/30 hover:text-text-muted"
                }`}
              >
                {p}
              </button>
            ))}

            <Button
              variant="outline"
              size="icon-sm"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              aria-label={t("pageNext")}
            >
              <ChevronRight size={13} aria-hidden="true" />
            </Button>
          </div>
        </div>
      )}
    </section>
  );
}
