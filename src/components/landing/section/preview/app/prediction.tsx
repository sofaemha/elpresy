import { Activity, Clock, Play, CheckCircle2, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const RECENT_RUNS = [
  { id: "PRD-0041", ampere: "8.0 A", hours: "9.0 hrs", result: "71.7 Ah", trend: "up" as const },
  { id: "PRD-0040", ampere: "7.5 A", hours: "8.0 hrs", result: "60.5 Ah", trend: "down" as const },
  { id: "PRD-0039", ampere: "9.0 A", hours: "10.0 hrs", result: "90.3 Ah", trend: "up" as const },
];

function TrendIcon({ trend }: { trend: "up" | "down" | "neutral" }) {
  if (trend === "up") return <TrendingUp size={11} className="text-emerald-400" />;
  if (trend === "down") return <TrendingDown size={11} className="text-red-400" />;
  return <Minus size={11} className="text-text-faint" />;
}

export default function PredictionArea({ t }: { t: any }) {
  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-display font-semibold text-white">Run Prediction</h3>
          <p className="text-[11px] text-text-faint mt-0.5">Enter inputs to generate a CART model forecast</p>
        </div>
        <Badge variant="outline" className="border-gold/30 text-gold bg-gold/5 text-[10px] px-2.5 py-0.5 rounded-full">
          CART Active
        </Badge>
      </div>

      {/* Input + Result */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Input Card */}
        <Card className="bg-[#111113] border-white/[0.06] p-4 rounded-xl">
          <div className="text-[10px] text-text-faint uppercase tracking-wider mb-4 font-semibold">Input Parameters</div>
          <div className="space-y-3">
            <div>
              <label className="text-[10px] text-text-muted uppercase tracking-wider flex items-center gap-1.5 mb-1.5">
                <Activity size={10} className="text-gold/60" /> Ampere Per Cycle
              </label>
              <div className="h-9 bg-black/40 rounded-lg border border-white/[0.08] flex items-center px-3 justify-between">
                <span className="text-sm font-mono text-white">8.0</span>
                <span className="text-[10px] text-text-faint font-mono">A</span>
              </div>
            </div>
            <div>
              <label className="text-[10px] text-text-muted uppercase tracking-wider flex items-center gap-1.5 mb-1.5">
                <Clock size={10} className="text-gold/60" /> Daily Usage Hours
              </label>
              <div className="h-9 bg-black/40 rounded-lg border border-white/[0.08] flex items-center px-3 justify-between">
                <span className="text-sm font-mono text-white">9.0</span>
                <span className="text-[10px] text-text-faint font-mono">hrs/day</span>
              </div>
            </div>
            <button className="w-full h-9 bg-gold/90 text-black text-[11px] font-bold rounded-lg flex items-center justify-center gap-2 mt-1">
              <Play size={11} fill="currentColor" /> Run Prediction
            </button>
          </div>
        </Card>

        {/* Result Card */}
        <Card className="bg-[#111113] border-white/[0.06] p-4 rounded-xl flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div className="text-[10px] text-text-faint uppercase tracking-wider font-semibold">Latest Result</div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 size={10} className="text-emerald-400" />
              <span className="text-[9px] text-emerald-400 font-medium">Complete</span>
            </div>
          </div>
          <div className="flex-1 flex flex-col justify-center gap-3">
            <div>
              <div className="text-[9px] text-text-faint uppercase tracking-wider mb-1">Predicted Daily Usage</div>
              <div className="text-3xl font-display font-bold text-white tabular-nums">
                71.7<span className="text-lg text-text-muted ml-1">Ah</span>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: "Working Days", value: "22d" },
                { label: "Per Month", value: "71.7 Ah" },
                { label: "Confidence", value: "94%" },
              ].map((s) => (
                <div key={s.label} className="bg-black/30 rounded-md px-2 py-1.5 border border-white/[0.05]">
                  <div className="text-[8px] text-text-faint uppercase tracking-wider">{s.label}</div>
                  <div className="text-[11px] font-semibold font-mono text-white mt-0.5 tabular-nums">{s.value}</div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      {/* Recent Runs */}
      <Card className="bg-[#111113] border-white/[0.06] rounded-xl overflow-hidden">
        <div className="px-4 pt-3.5 pb-3 flex items-center justify-between border-b border-white/[0.04]">
          <div className="flex items-center gap-2 text-sm font-medium text-white">
            <TrendingUp size={13} className="text-gold" /> Recent Runs
          </div>
          <span className="text-[10px] text-gold font-medium cursor-default">View All →</span>
        </div>
        <div className="grid grid-cols-4 gap-2 px-4 py-2 text-[9px] text-text-faint uppercase tracking-wider font-semibold border-b border-white/[0.03]">
          <span>{t("tableId")}</span><span>{t("tableInputA")}</span><span>{t("tableHours")}</span><span>{t("tableResult")}</span>
        </div>
        <div className="divide-y divide-white/[0.03]">
          {RECENT_RUNS.map((row) => (
            <div key={row.id} className="grid grid-cols-4 gap-2 px-4 py-2.5 text-[11px] items-center">
              <span className="text-text-muted font-mono">{row.id}</span>
              <span className="text-white font-mono">{row.ampere}</span>
              <span className="text-white font-mono">{row.hours}</span>
              <span className="text-gold font-mono font-semibold flex items-center gap-1.5">{row.result}<TrendIcon trend={row.trend} /></span>
            </div>
          ))}
        </div>
      </Card>
    </>
  );
}
