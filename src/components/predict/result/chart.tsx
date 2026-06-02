// filepath: src/components/predict/result/chart.tsx
"use client";
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid } from "recharts";
import type { ChartDataPoint } from "@/lib/ml/predict";
import { useTranslations } from "next-intl";

export default function PredictionChart({ data, height }: { data: ChartDataPoint[]; height?: number }) {
  const t = useTranslations("predict");

  const maxDay = data.length > 0 ? data[data.length - 1].day : 0;
  const ticks = [];
  if (maxDay >= 7) {
    for (let i = 7; i <= maxDay; i += 7) {
      ticks.push(i);
    }
  }

  return (
    <ResponsiveContainer width="100%" height={ height || 160 }>
      <AreaChart data={data} margin={{ top: 16, right: 16, left: -24, bottom: 0 }}>
        <defs>
          <linearGradient id="colorAmpere" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#C9A84C" stopOpacity={0.45} />
            <stop offset="75%" stopColor="#C9A84C" stopOpacity={0.08} />
            <stop offset="100%" stopColor="#C9A84C" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
        <XAxis 
          dataKey="day" 
          stroke="rgba(201,168,76,0.18)" 
          tick={{ fill: "#52525B", fontSize: 9, fontFamily: "monospace" }}
          ticks={ticks.length > 0 ? ticks : undefined}
          tickFormatter={(value) => {
            if (value % 7 === 0) return `M${value / 7}`;
            return value;
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
          labelFormatter={(label) => `${t("chart_day")} ${label}`}
        />
        <Area 
          type="monotone" 
          dataKey="ampere" 
          stroke="#C9A84C" 
          strokeWidth={5}
          fillOpacity={1} 
          fill="url(#colorAmpere)"
          activeDot={{ r: 7, fill: "#C9A84C", stroke: "#C9A84C", strokeWidth: 7, strokeOpacity: 0.5 }} 
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
