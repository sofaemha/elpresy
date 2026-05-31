// filepath: src/components/dashboard/section/trend.tsx
"use client";

import { useTranslations } from "next-intl";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { TrendingUp } from "lucide-react";

export interface TrendDataPoint {
  date: string;
  value: number;
}

interface TrendProps {
  t: ReturnType<typeof useTranslations>;
  data: TrendDataPoint[];
}

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload || payload.length === 0) return null;

  return (
    <div
      role="tooltip"
      className="rounded-lg border border-border-gold-hover bg-surface px-3 py-2 shadow-lg"
    >
      <p className="text-[10px] text-text-faint mb-1 font-mono">{label}</p>
      <p className="text-sm font-display font-bold text-gold">
        {payload[0]?.value?.toFixed(3)} A
      </p>
    </div>
  );
}

export default function Trend({ t, data }: TrendProps) {
  const isEmpty = data.length === 0;

  return (
    <section
      aria-labelledby="trend-heading"
      className="flex flex-col bg-surface border border-border-gold rounded-lg p-5 gap-4"
    >
      {/* Section header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <TrendingUp size={14} className="text-gold" aria-hidden="true" />
          <h2 id="trend-heading" className="text-sm font-display font-semibold text-text-primary">
            {t("trendTitle")}
          </h2>
        </div>
        <span className="text-[10px] font-mono uppercase tracking-widest text-text-faint">
          {t("trendSubtitle")}
        </span>
      </div>

      {/* Chart area */}
      <div className="flex-1 min-h-[280px]" suppressHydrationWarning>
        {isEmpty ? (
          <div className="flex items-center justify-center h-full min-h-[280px] text-sm text-text-faint">
            {t("empty")}
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={data} margin={{ top: 16, right: 16, left: -24, bottom: 0 }}>
              <defs>
                <linearGradient id="colorAmpereTrend" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#C9A84C" stopOpacity={0.45} />
                  <stop offset="75%" stopColor="#C9A84C" stopOpacity={0.08} />
                  <stop offset="100%" stopColor="#C9A84C" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
              <XAxis 
                dataKey="date" 
                stroke="rgba(201,168,76,0.18)" 
                tick={{ fill: "#52525B", fontSize: 9, fontFamily: "monospace" }}
                tickFormatter={(value) => {
                  const d = new Date(value);
                  if (isNaN(d.getTime())) return value;
                  return `${d.getDate()}/${d.getMonth() + 1}`;
                }}
                tickLine={false}
                axisLine={false}
                dy={10}
              />
              <YAxis 
                stroke="none" 
                tick={{ fill: "#52525B", fontSize: 9, fontFamily: "monospace" }}
                tickLine={false}
                axisLine={false}
                dx={-10}
              />
              <Tooltip 
                contentStyle={{ backgroundColor: "rgba(9,9,11,0.9)", border: "1px solid rgba(201,168,76,0.2)", color: "#FAFAFA", borderRadius: "0.5rem", backdropFilter: "blur(4px)" }}
                itemStyle={{ color: "#C9A84C", fontWeight: "bold", fontFamily: "monospace" }}
                labelStyle={{ color: "#A1A1AA", fontSize: "10px", textTransform: "uppercase" }}
              />
              <Area 
                type="monotone" 
                dataKey="value" 
                stroke="#C9A84C" 
                strokeWidth={2}
                fillOpacity={1} 
                fill="url(#colorAmpereTrend)"
                activeDot={{ r: 4, fill: "#C9A84C", stroke: "#09090B", strokeWidth: 2 }} 
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </section>
  );
}
