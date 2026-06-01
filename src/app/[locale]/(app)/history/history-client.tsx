"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Search, Filter, Trash2, AlertTriangle, Download, ChevronLeft, ChevronRight } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
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
  
  type ConfirmAction = "delete" | "delete_selected" | "delete_all" | null;
  const [confirmState, setConfirmState] = useState<{ type: ConfirmAction; id?: string } | null>(null);

  const [search, setSearch] = useState("");
  const [selectedColumns, setSelectedColumns] = useState<string[]>(["date", "ampere", "hours", "period", "range"]);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

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

  useEffect(() => {
    setCurrentPage(1);
  }, [search, selectedColumns]);

  const totalPages = Math.max(1, Math.ceil(filteredPredictions.length / itemsPerPage));
  const paginatedPredictions = filteredPredictions.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

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

  const handleDelete = (id: string) => setConfirmState({ type: "delete", id });
  const handleDeleteSelected = () => setConfirmState({ type: "delete_selected" });
  const handleDeleteAll = () => setConfirmState({ type: "delete_all" });

  const executeConfirm = async () => {
    if (!confirmState) return;
    setIsDeleting(true);
    
    if (confirmState.type === "delete" && confirmState.id) {
      await deletePrediction(confirmState.id);
    } else if (confirmState.type === "delete_selected") {
      await deletePredictions(Array.from(selectedIds));
      setSelectedIds(new Set());
    } else if (confirmState.type === "delete_all") {
      await deleteAllPredictions();
      setSelectedIds(new Set());
    }
    
    setIsDeleting(false);
    setConfirmState(null);
  };

  const handleDownload = (format: "csv" | "pdf") => {
    const dataToDownload = selectedIds.size > 0 
      ? filteredPredictions.filter(p => selectedIds.has(p.id)) 
      : filteredPredictions;
    
    if (dataToDownload.length === 0) return;

    const dates = dataToDownload.map(p => {
      const d = new Date(p.createdAt);
      return `${d.getFullYear()}${String(d.getMonth()+1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}`;
    });
    
    const minDate = dates.reduce((a, b) => a < b ? a : b);
    const maxDate = dates.reduce((a, b) => a > b ? a : b);
    
    let filename = "";
    if (minDate === maxDate) {
      filename = `Prediction - [${minDate}]`;
    } else {
      filename = `Predictions - [${minDate}-${maxDate}]`;
    }

    if (format === "csv") {
      const headers = ["Date", "Time", "Ampere Per Cycle (A)", "Daily Usage (h)", "Prediction Period (d)", "Total Ampere (A)", "Avg Ampere (A)", "Lower Range (A)", "Upper Range (A)"];
      const rows = dataToDownload.map(p => {
        const d = new Date(p.createdAt);
        return [
          d.toLocaleDateString(),
          d.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
          p.amperePerCycle,
          p.dailyUsageHours,
          p.predictionPeriod,
          p.totalAmpere,
          (p.totalAmpere / p.predictionPeriod).toFixed(3),
          p.resultLower,
          p.resultUpper
        ].join(",");
      });
      const csvContent = [headers.join(","), ...rows].join("\n");
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${filename}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else if (format === "pdf") {
      const doc = new jsPDF();
      doc.text(filename, 14, 15);
      autoTable(doc, {
        head: [["Date", "Time", "Ampere (A)", "Hours", "Period (d)", "Total (A)", "Avg (A)", "Result Range"]],
        body: dataToDownload.map(p => {
          const d = new Date(p.createdAt);
          return [
            d.toLocaleDateString(),
            d.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
            p.amperePerCycle.toString(),
            p.dailyUsageHours.toString(),
            p.predictionPeriod.toString(),
            p.totalAmpere.toFixed(1),
            (p.totalAmpere / p.predictionPeriod).toFixed(2),
            `${p.resultLower} - ${p.resultUpper}`
          ];
        }),
        startY: 20,
      });
      doc.save(`${filename}.pdf`);
    }
  };

  return (
    <main className="flex-1 p-6 lg:p-10 max-w-6xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-500 min-w-0">
      <div className="mb-8 flex flex-col gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground">{t("title")}</h1>
          <p className="text-text-muted mt-1">{t("subtitle")} ({filteredPredictions.length})</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3 w-full">
          <div className="relative flex-1 min-w-[200px]">
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
            
            <DropdownMenu>
              <DropdownMenuTrigger className="h-9 px-3 border border-border bg-surface rounded-lg text-sm flex items-center gap-2 text-text-muted hover:text-text-primary transition-colors whitespace-nowrap outline-none">
                <Download size={14} /> Download
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40 bg-surface border border-border">
                <DropdownMenuItem onClick={() => handleDownload("csv")} className="text-foreground focus:bg-surface-2 focus:text-text-primary cursor-pointer">
                  Comma-Separated Values (CSV)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleDownload("pdf")} className="text-foreground focus:bg-surface-2 focus:text-text-primary cursor-pointer">
                  Portable Document Format (PDF)
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
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
                  <th scope="col" className="px-6 py-4 font-medium">Total Ampere</th>
                  <th scope="col" className="px-6 py-4 font-medium">Avg Ampere</th>
                  <th scope="col" className="px-6 py-4 font-medium">{t("col_range")}</th>
                  <th scope="col" className="px-6 py-4 font-medium text-right">{t("col_actions")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {paginatedPredictions.map((prediction) => (
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
                    <td className="px-6 py-4 text-text-muted">
                      {prediction.totalAmpere.toFixed(1)} A
                    </td>
                    <td className="px-6 py-4 text-text-muted">
                      {(prediction.totalAmpere / prediction.predictionPeriod).toFixed(1)} A
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

      {totalPages > 1 && (
        <div className="mt-4 flex flex-col sm:flex-row items-center justify-between text-sm text-text-muted px-2 gap-4">
          <div>
            Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredPredictions.length)} of {filteredPredictions.length} entries
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="h-8"
            >
              <ChevronLeft className="h-4 w-4 mr-1" /> Previous
            </Button>
            <div className="font-medium text-foreground px-2">
              Page {currentPage} of {totalPages}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="h-8"
            >
              Next <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      )}

      <AlertDialog open={confirmState !== null} onOpenChange={(open) => !open && setConfirmState(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              Confirmation
            </AlertDialogTitle>
            <AlertDialogDescription>
              {confirmState?.type === "delete" && t("confirm_delete")}
              {confirmState?.type === "delete_selected" && t("confirm_delete_selected")}
              {confirmState?.type === "delete_all" && t("confirm_delete_all")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={(e) => {
                e.preventDefault();
                executeConfirm();
              }}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? "..." : t("btn_delete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </main>
  );
}
