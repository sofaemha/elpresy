"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Search, Filter, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { deletePrediction, deletePredictions, deleteAllPredictions } from "@/app/actions/predictions";
import type { Prediction } from "@/lib/db/schema";

export default function HistoryClient({ initialPredictions }: { initialPredictions: Prediction[] }) {
  const t = useTranslations("history");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isDeleting, setIsDeleting] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedColumns, setSelectedColumns] = useState<string[]>(["date", "ampere", "hours", "period", "range"]);

  const filteredPredictions = initialPredictions.filter((p) => {
    const q = search.toLowerCase();
    if (!q) return true;

    return selectedColumns.some((col) => {
      if (col === "date") {
        return new Date(p.createdAt).toLocaleDateString().includes(q) || 
               new Date(p.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}).includes(q);
      }
      if (col === "ampere") {
        return `${p.amperePerCycle} a`.toLowerCase().includes(q) || `${p.amperePerCycle}`.includes(q);
      }
      if (col === "hours") {
        return `${p.dailyUsageHours} h`.toLowerCase().includes(q) || `${p.dailyUsageHours}`.includes(q);
      }
      if (col === "period") {
        return `${p.predictionPeriod} d`.toLowerCase().includes(q) || `${p.predictionPeriod}`.includes(q);
      }
      if (col === "range") {
        return `${p.resultLower} - ${p.resultUpper} a`.toLowerCase().includes(q) || 
               `${p.resultLower}`.includes(q) || `${p.resultUpper}`.includes(q);
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

  const toggleSelect = (id: string) => {
    const newSet = new Set(selectedIds);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setSelectedIds(newSet);
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === filteredPredictions.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredPredictions.map(p => p.id)));
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm(t("confirm_delete"))) return;
    setIsDeleting(true);
    await deletePrediction(id);
    setIsDeleting(false);
  };

  const handleDeleteSelected = async () => {
    if (!confirm(t("confirm_delete_selected"))) return;
    setIsDeleting(true);
    await deletePredictions(Array.from(selectedIds));
    setSelectedIds(new Set());
    setIsDeleting(false);
  };

  const handleDeleteAll = async () => {
    if (!confirm(t("confirm_delete_all"))) return;
    setIsDeleting(true);
    await deleteAllPredictions();
    setSelectedIds(new Set());
    setIsDeleting(false);
  };

  return (
    <main className="flex-1 p-6 lg:p-10 max-w-6xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-500 min-w-0">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground">{t("title")}</h1>
          <p className="text-text-muted mt-1">{t("subtitle")} ({filteredPredictions.length})</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="flex flex-1 md:flex-none items-center gap-2 max-w-sm w-full">
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={14} className="text-text-faint" />
              </div>
              <input
                type="text"
                className="w-full h-9 bg-surface border border-border rounded-lg pl-9 pr-3 text-sm text-foreground focus:outline-none focus:border-gold transition-colors placeholder:text-text-faint"
                placeholder={t("search") || "Search..."}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger className="h-9 px-3 border border-border bg-surface rounded-lg text-sm flex items-center gap-2 text-text-muted hover:text-text-primary transition-colors whitespace-nowrap outline-none">
                <Filter size={14} /> Filter
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 bg-surface border border-border">
                <DropdownMenuGroup>
                  <DropdownMenuLabel className="text-text-primary">Search Columns</DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-border" />
                  {["date", "ampere", "hours", "period", "range"].map((col) => (
                    <DropdownMenuCheckboxItem
                      key={col}
                      checked={selectedColumns.includes(col)}
                      onCheckedChange={(checked) => toggleColumn(col, checked)}
                      className="text-foreground focus:bg-surface-2 focus:text-text-primary"
                    >
                      {t(`col_${col}`)}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {selectedIds.size > 0 && (
            <Button variant="destructive" size="sm" onClick={handleDeleteSelected} disabled={isDeleting} className="h-9">
              <Trash2 className="w-4 h-4 mr-2" />
              {t("btn_delete_selected")} ({selectedIds.size})
            </Button>
          )}
          {initialPredictions.length > 0 && (
            <Button variant="outline" size="sm" onClick={handleDeleteAll} disabled={isDeleting} className="text-destructive hover:bg-destructive/10 hover:text-destructive border-destructive/20 h-9">
              <Trash2 className="w-4 h-4 mr-2" />
              {t("btn_delete_all")}
            </Button>
          )}
        </div>
      </div>

      <div className="rounded-xl border border-border bg-surface overflow-hidden shadow-lg">
        {initialPredictions.length === 0 ? (
          <div className="p-12 text-center text-text-muted">
            {t("empty_state")}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-text-muted uppercase bg-bg/50 border-b border-border">
                <tr>
                  <th scope="col" className="p-4 w-4">
                    <div className="flex items-center">
                      <input 
                        type="checkbox" 
                        className="w-4 h-4 rounded border-border bg-transparent text-primary focus:ring-primary focus:ring-offset-surface cursor-pointer"
                        checked={selectedIds.size === filteredPredictions.length && filteredPredictions.length > 0}
                        onChange={toggleSelectAll}
                      />
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-4 font-medium">{t("col_date")}</th>
                  <th scope="col" className="px-6 py-4 font-medium">{t("col_ampere")}</th>
                  <th scope="col" className="px-6 py-4 font-medium">{t("col_hours")}</th>
                  <th scope="col" className="px-6 py-4 font-medium">{t("col_period")}</th>
                  <th scope="col" className="px-6 py-4 font-medium">{t("col_range")}</th>
                  <th scope="col" className="px-6 py-4 font-medium text-right">{t("col_actions")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredPredictions.map((prediction) => (
                  <tr key={prediction.id} className="hover:bg-bg/30 transition-colors">
                    <td className="w-4 p-4">
                      <div className="flex items-center">
                        <input 
                          type="checkbox" 
                          className="w-4 h-4 rounded border-border bg-transparent text-primary focus:ring-primary focus:ring-offset-surface cursor-pointer"
                          checked={selectedIds.has(prediction.id)}
                          onChange={() => toggleSelect(prediction.id)}
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-foreground">
                      {new Date(prediction.createdAt).toLocaleDateString()} {new Date(prediction.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </td>
                    <td className="px-6 py-4 text-text-muted">
                      {prediction.amperePerCycle} A
                    </td>
                    <td className="px-6 py-4 text-text-muted">
                      {prediction.dailyUsageHours} h
                    </td>
                    <td className="px-6 py-4 text-text-muted">
                      {prediction.predictionPeriod} d
                    </td>
                    <td className="px-6 py-4 font-medium text-gold whitespace-nowrap">
                      {prediction.resultLower} - {prediction.resultUpper} A
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        className="h-8 w-8 text-text-muted hover:text-destructive hover:bg-destructive/10"
                        onClick={() => handleDelete(prediction.id)}
                        disabled={isDeleting}
                        title={t("btn_delete")}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}
