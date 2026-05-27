// filepath: src/components/dashboard/dashboard.tsx
"use client";

import { useTranslations } from "next-intl";
import Header from "@/components/dashboard/section/header";
import Stats from "@/components/dashboard/section/stats";
import Trend, { type TrendDataPoint } from "@/components/dashboard/section/trend";
import HistoryTable, { type MockPrediction } from "@/components/dashboard/section/history";

interface DashboardShellProps {
  predictions: MockPrediction[];
}

export default function DashboardShell({ predictions }: DashboardShellProps) {
  const t = useTranslations("dashboard");

  // ── Derived stats ──────────────────────────────────────────────────────────
  const totalCount = predictions.length;
  const unit = t("unit");

  const sorted = [...predictions].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const latest = sorted[0];

  const stats = {
    total: totalCount,
    lastRange: latest
      ? `${latest.resultLower.toFixed(3)} ${unit} — ${latest.resultUpper.toFixed(3)} ${unit}`
      : "",
    lastDate: latest ? latest.createdAt : "",
  };

  // ── Trend data: resultUpper sorted ascending by date ──────────────────────
  const trendData: TrendDataPoint[] = [...predictions]
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
    .map((p) => ({
      date: p.createdAt,
      value: p.resultUpper,
    }));

  return (
    <main className="flex-1 flex flex-col gap-6 px-5 md:px-8 py-7 max-w-screen-xl w-full mx-auto">
      {/* Page header */}
      <Header t={t} totalCount={totalCount} />

      {/* Stat cards */}
      <Stats t={t} stats={stats} />

      {/* Chart + History grid */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5 flex-1 min-h-[440px]">
        {/* Trend chart — 2/5 width on lg */}
        <div className="lg:col-span-2 flex flex-col">
          <Trend t={t} data={trendData} />
        </div>

        {/* History table — 3/5 width on lg */}
        <div className="lg:col-span-3 flex flex-col">
          <HistoryTable t={t} predictions={sorted} />
        </div>
      </div>
    </main>
  );
}
