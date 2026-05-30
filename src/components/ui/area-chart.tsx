import React, { useMemo } from "react";
import { cn } from "@/lib/utils";

const GOLD = "#C9A84C";
const WORKING_DAYS_PER_MONTH = 22;

function buildPath(pts: number[], W: number, H: number) {
  if (pts.length < 2) return { area: "", line: "", last: null as null | { x: number; y: number } };
  const min = Math.min(...pts);
  const max = Math.max(...pts);
  const range = max - min || 1;
  const pad = 8;
  const coords = pts.map((v, i) => ({
    x: (i / (pts.length - 1)) * W,
    y: pad + ((max - v) / range) * (H - pad * 2),
  }));
  const segs: string[] = [];
  coords.forEach((p, i) => {
    if (i === 0) {
      segs.push(`M${p.x},${p.y}`);
      return;
    }
    const pr = coords[i - 1];
    const mx = (pr.x + p.x) / 2;
    segs.push(`C${mx},${pr.y} ${mx},${p.y} ${p.x},${p.y}`);
  });
  const line = segs.join(" ");
  const last = coords[coords.length - 1];
  return { area: `${line} L${last.x},${H} L0,${H} Z`, line, last };
}

interface AreaChartProps {
  pts: number[];
  months: number;
  liveLabel: string;
  trendLabel: string;
  className?: string;
}

export function AreaChart({ pts, months, liveLabel, trendLabel, className }: AreaChartProps) {
  const W = 400;
  const H = 120;
  const { area, line, last } = useMemo(() => buildPath(pts, W, H), [pts]);
  const seps = useMemo(
    () =>
      Array.from({ length: Math.max(1, months - 1) }, (_, i) => ({
        x: ((i + 1) * WORKING_DAYS_PER_MONTH / pts.length) * W,
        label: `M${i + 2}`,
      })),
    [months, pts.length]
  );

  return (
    <div
      className={cn(
        "rounded-lg border border-border/30 overflow-hidden",
        className
      )}
      style={{ background: "rgba(9,9,11,0.5)" }}
    >
      <div className="flex items-center justify-between px-3 pt-2.5 pb-0">
        <span className="text-[9px] text-text-faint uppercase tracking-wider">
          {trendLabel}
        </span>
        <span className="text-[9px] font-mono" style={{ color: GOLD }}>
          {liveLabel}
        </span>
      </div>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="none"
        width="100%"
        height="120"
        className="block"
      >
        <defs>
          <linearGradient id="ag" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={GOLD} stopOpacity="0.45" />
            <stop offset="75%" stopColor={GOLD} stopOpacity="0.08" />
            <stop offset="100%" stopColor={GOLD} stopOpacity="0" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        {[0.25, 0.5, 0.75].map((f) => (
          <line
            key={f}
            x1={0}
            y1={H * f}
            x2={W}
            y2={H * f}
            stroke="#fff"
            strokeOpacity="0.04"
            strokeWidth="0.6"
          />
        ))}
        {months > 1 && seps.map(({ x, label }) => (
          <line
            key={label}
            x1={x}
            y1={0}
            x2={x}
            y2={H}
            stroke={GOLD}
            strokeOpacity="0.18"
            strokeWidth="0.8"
            strokeDasharray="3,3"
          />
        ))}
        {area && <path d={area} fill="url(#ag)" />}
        {line && (
          <path
            d={line}
            fill="none"
            stroke={GOLD}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#glow)"
          />
        )}
        {last && (
          <>
            <circle
              cx={last.x}
              cy={last.y}
              r={5}
              fill={GOLD}
              fillOpacity="0.2"
            />
            <circle cx={last.x} cy={last.y} r={2.5} fill={GOLD} />
          </>
        )}
      </svg>
      <div className="flex justify-between px-2 pb-2">
        <span className="text-[7px] text-text-faint font-mono">M1</span>
        {months >= 3 && (
          <span className="text-[7px] text-text-faint font-mono">
            M{Math.ceil(months / 2)}
          </span>
        )}
        {months > 1 && (
           <span className="text-[7px] text-text-faint font-mono">M{months}</span>
        )}
      </div>
    </div>
  );
}
