import { Download, Search, Filter } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const HISTORY_DATA = [
  { id: "PRD-0041", date: "2025-04-28", ampere: "8.0 A", hours: "9.0", result: "71.7 Ah" },
  { id: "PRD-0040", date: "2025-04-27", ampere: "7.5 A", hours: "8.0", result: "60.5 Ah" },
  { id: "PRD-0039", date: "2025-04-26", ampere: "9.0 A", hours: "10.0", result: "90.3 Ah" },
  { id: "PRD-0038", date: "2025-04-25", ampere: "8.5 A", hours: "9.0", result: "76.3 Ah" },
  { id: "PRD-0037", date: "2025-04-24", ampere: "6.5 A", hours: "7.0", result: "45.5 Ah" },
  { id: "PRD-0036", date: "2025-04-23", ampere: "9.5 A", hours: "11.0", result: "104.5 Ah" },
];

export default function HistoryArea({ t }: { t: any }) {
  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-display font-semibold text-white">Prediction History</h3>
          <p className="text-[11px] text-text-faint mt-0.5">Browse and export all past prediction logs</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="h-7 px-3 bg-[#111113] border border-white/[0.08] rounded-lg text-[10px] text-text-muted flex items-center gap-1.5 hover:text-gold transition-colors">
            <Download size={10} /> CSV
          </button>
          <button className="h-7 px-3 bg-[#111113] border border-white/[0.08] rounded-lg text-[10px] text-text-muted flex items-center gap-1.5 hover:text-gold transition-colors">
            <Download size={10} /> PDF
          </button>
        </div>
      </div>

      {/* Search + Filter */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-8 bg-[#111113] border border-white/[0.06] rounded-lg flex items-center px-3 gap-2">
          <Search size={11} className="text-text-faint shrink-0" />
          <span className="text-[11px] text-text-faint font-mono">Search by ID or date…</span>
        </div>
        <div className="h-8 px-3 bg-[#111113] border border-white/[0.06] rounded-lg flex items-center gap-1.5 text-[11px] text-text-faint">
          <Filter size={11} /> Filter
        </div>
      </div>

      {/* Table */}
      <Card className="bg-[#111113] border-white/[0.06] rounded-xl overflow-hidden flex-1">
        <div className="grid grid-cols-6 gap-2 px-4 py-2.5 text-[9px] text-text-faint uppercase tracking-wider font-semibold border-b border-white/[0.04] bg-black/20">
          <span>{t("tableId")}</span><span>{t("tableDate")}</span><span>{t("tableInputA")}</span>
          <span>{t("tableHours")}</span><span>{t("tableResult")}</span><span className="text-right">{t("tableStatus")}</span>
        </div>
        <div className="divide-y divide-white/[0.03]">
          {HISTORY_DATA.map((row) => (
            <div key={row.id} className="grid grid-cols-6 gap-2 px-4 py-2.5 text-[11px] items-center hover:bg-white/[0.02] transition-colors">
              <span className="text-text-muted font-mono">{row.id}</span>
              <span className="text-text-muted font-mono text-[10px]">{row.date}</span>
              <span className="text-white font-mono">{row.ampere}</span>
              <span className="text-white font-mono">{row.hours}</span>
              <span className="text-gold font-mono font-semibold">{row.result}</span>
              <span className="text-right">
                <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-[8px] px-1.5 py-0 rounded-full font-medium">
                  {t("statusDone")}
                </Badge>
              </span>
            </div>
          ))}
        </div>
        {/* Pagination */}
        <div className="px-4 py-3 border-t border-white/[0.04] flex items-center justify-between">
          <span className="text-[10px] text-text-faint">Showing 1–6 of 1,248</span>
          <div className="flex items-center gap-1">
            {[1, 2, 3].map((p) => (
              <div key={p} className={`w-6 h-6 rounded flex items-center justify-center text-[10px] font-mono cursor-default ${p === 1 ? "bg-gold/10 text-gold border border-gold/20" : "text-text-faint"}`}>
                {p}
              </div>
            ))}
            <span className="text-[10px] text-text-faint ml-1">…</span>
          </div>
        </div>
      </Card>
    </>
  );
}
