"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Search, Filter, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type PredictionItem = {
  prediction: {
    id: string;
    amperePerCycle: number;
    dailyUsageHours: number;
    predictionPeriod: number;
    resultLower: number;
    resultUpper: number;
    totalAmpere: number;
    createdAt: Date;
  };
  userName: string | null;
};

export function PredictionsTable({ predictions }: { predictions: PredictionItem[] }) {
  const t = useTranslations("admin");
  const [search, setSearch] = useState("");
  const [selectedColumns, setSelectedColumns] = useState<string[]>(["userName", "inputs", "range", "date"]);
  const [page, setPage] = useState(1);
  const pageSize = 5;

  const filteredPredictions = predictions.filter((p) => {
    const q = search.toLowerCase();
    if (!q) return true;

    return selectedColumns.some((col) => {
      if (col === "userName") {
        return (p.userName || "unknown").toLowerCase().includes(q);
      }
      if (col === "inputs") {
        const str = `${p.prediction.amperePerCycle}A, ${p.prediction.dailyUsageHours}h, ${p.prediction.predictionPeriod}d`;
        return str.toLowerCase().includes(q);
      }
      if (col === "range") {
        const str = `${p.prediction.resultLower.toFixed(1)} - ${p.prediction.resultUpper.toFixed(1)} A`;
        return str.toLowerCase().includes(q);
      }
      if (col === "date") {
        return new Date(p.prediction.createdAt).toISOString().split("T")[0].includes(q);
      }
      return false;
    });
  });

  const toggleColumn = (col: string, checked: boolean) => {
    if (checked) {
      setSelectedColumns([...selectedColumns, col]);
    } else {
      if (selectedColumns.length > 1) {
        setSelectedColumns(selectedColumns.filter((c) => c !== col));
      }
    }
  };

  const totalPages = Math.max(1, Math.ceil(filteredPredictions.length / pageSize));
  const from = (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, filteredPredictions.length);
  const slice = filteredPredictions.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-xl font-bold text-foreground">
          {t("tab_predictions")} ({filteredPredictions.length})
        </h2>
        <div className="flex items-center gap-2 max-w-sm w-full">
          <div className="relative w-full">
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
          <DropdownMenu>
            <DropdownMenuTrigger className="h-9 px-3 border border-border bg-surface-2 rounded-lg text-sm flex items-center gap-2 text-text-muted hover:text-text-primary transition-colors whitespace-nowrap outline-none">
              <Filter size={14} /> Filter
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 bg-surface border border-border">
              <DropdownMenuGroup>
                <DropdownMenuLabel className="text-text-primary">Search Columns</DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-border" />
                <DropdownMenuCheckboxItem
                  checked={selectedColumns.includes("userName")}
                  onCheckedChange={(checked) => toggleColumn("userName", checked)}
                  className="text-foreground focus:bg-surface-2 focus:text-text-primary"
                >
                  {t("col_user")}
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={selectedColumns.includes("inputs")}
                  onCheckedChange={(checked) => toggleColumn("inputs", checked)}
                  className="text-foreground focus:bg-surface-2 focus:text-text-primary"
                >
                  Inputs
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={selectedColumns.includes("range")}
                  onCheckedChange={(checked) => toggleColumn("range", checked)}
                  className="text-foreground focus:bg-surface-2 focus:text-text-primary"
                >
                  Range
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={selectedColumns.includes("date")}
                  onCheckedChange={(checked) => toggleColumn("date", checked)}
                  className="text-foreground focus:bg-surface-2 focus:text-text-primary"
                >
                  Date
                </DropdownMenuCheckboxItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-surface overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-surface-2 text-text-muted text-xs border-b border-border">
            <tr>
              <th className="px-4 py-3">{t("col_user")}</th>
              <th className="px-4 py-3">Inputs</th>
              <th className="px-4 py-3">Total / Avg Ampere</th>
              <th className="px-4 py-3">Range</th>
              <th className="px-4 py-3">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {slice.map(({ prediction, userName }) => (
              <tr key={prediction.id} className="text-foreground">
                <td className="px-4 py-3">{userName || "Unknown"}</td>
                <td className="px-4 py-3 text-text-muted text-xs">
                  {prediction.amperePerCycle}A, {prediction.dailyUsageHours}h, {prediction.predictionPeriod}d
                </td>
                <td className="px-4 py-3 text-text-muted text-xs">
                  {prediction.totalAmpere?.toFixed(1) || 0} A / {(prediction.totalAmpere / prediction.predictionPeriod || 0).toFixed(1)} A
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
        {filteredPredictions.length > 0 && (
          <div className="flex items-center justify-between px-5 py-3 border-t border-border bg-surface-2 shrink-0 gap-4 flex-wrap rounded-b-xl">
            <p className="text-[11px] text-text-faint font-mono">
              Showing {from} to {to} of {filteredPredictions.length} entries
            </p>
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="icon-sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
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
                      ? "bg-primary/10 border-primary/40 text-primary font-semibold"
                      : "border-border text-text-faint hover:border-primary/30 hover:text-text-muted"
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
              >
                <ChevronRight size={13} aria-hidden="true" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
