// filepath: src/components/predict/result/chart.tsx
"use client";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid } from "recharts";
import type { ChartDataPoint } from "@/lib/ml/predict";
import { useTranslations } from "next-intl";

export default function PredictionChart({ data }: { data: ChartDataPoint[] }) {
  const t = useTranslations("predict");

  const maxDay = data.length > 0 ? data[data.length - 1].day : 0;
  const ticks = [];
  if (maxDay >= 7) {
    for (let i = 7; i <= maxDay; i += 7) {
      ticks.push(i);
    }
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data} margin={{ top: 8, right: 16, left: 0, bottom: 16 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
        <XAxis 
          dataKey="day" 
          stroke="#A1A1AA" 
          tick={{ fill: "#A1A1AA", fontSize: 12 }}
          ticks={ticks.length > 0 ? ticks : undefined}
          tickFormatter={(value) => {
            if (value % 7 === 0) return `${t("chart_week")} ${value / 7}`;
            return value;
          }}
          label={{ value: t("chart_axis_x"), position: "insideBottom", offset: -8, fill: "#A1A1AA" }} 
        />
        <YAxis 
          stroke="#A1A1AA" 
          tick={{ fill: "#A1A1AA", fontSize: 12 }}
          label={{ value: t("chart_axis_y"), angle: -90, position: "insideLeft", fill: "#A1A1AA" }} 
        />
        <Tooltip 
          contentStyle={{ backgroundColor: "#111113", border: "1px solid rgba(201,168,76,0.2)", color: "#FAFAFA", borderRadius: "0.5rem" }}
          labelFormatter={(label) => `${t("chart_day")} ${label}`}
        />
        <Line 
          type="monotone" 
          dataKey="ampere" 
          stroke="#C9A84C" 
          strokeWidth={2}
          dot={false} 
          activeDot={{ r: 4, fill: "#F5C842" }} 
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
