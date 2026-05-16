import {
  LineChart as ChartIcon,
  Zap,
  LayoutDashboard,
  History,
  Settings,
  BarChart3,
  TrendingUp,
  TrendingDown,
  Minus,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const PREDICTIONS_DATA = [
  {
    id: "PRD-0041",
    date: "2025-04-28",
    ampPerCycle: "1.2 A",
    hours: "8.5 hrs",
    result: "8.4 A",
    trend: "up" as const,
    status: "completed" as const,
  },
  {
    id: "PRD-0040",
    date: "2025-04-27",
    ampPerCycle: "0.9 A",
    hours: "6.0 hrs",
    result: "6.2 A",
    trend: "down" as const,
    status: "completed" as const,
  },
  {
    id: "PRD-0039",
    date: "2025-04-26",
    ampPerCycle: "1.1 A",
    hours: "7.0 hrs",
    result: "7.1 A",
    trend: "neutral" as const,
    status: "completed" as const,
  },
  {
    id: "PRD-0038",
    date: "2025-04-25",
    ampPerCycle: "1.3 A",
    hours: "9.0 hrs",
    result: "9.6 A",
    trend: "up" as const,
    status: "completed" as const,
  },
];

function TrendIcon({ trend }: { trend: "up" | "down" | "neutral" }) {
  if (trend === "up") return <TrendingUp size={12} className="text-emerald-400" />;
  if (trend === "down") return <TrendingDown size={12} className="text-red-400" />;
  return <Minus size={12} className="text-text-faint" />;
}

export default function Mockup({ t }: { t: any }) {
  const NAV_ITEMS = [
    { icon: LayoutDashboard, label: t("dashboard"), active: true },
    { icon: BarChart3, label: t("predictions"), active: false },
    { icon: History, label: t("history"), active: false },
    { icon: Settings, label: t("settings"), active: false },
  ];

  return (
    <div className="relative max-w-5xl mx-auto">
      {/* Gold glow behind frame */}
      <div className="absolute -inset-4 bg-gold/[0.04] blur-[60px] rounded-[3rem] pointer-events-none" />

      <div
        className="relative rounded-2xl border border-white/[0.08] bg-[#0a0a0c] overflow-hidden"
        style={{ boxShadow: "0 0 80px rgba(201,168,76,0.08), 0 25px 50px rgba(0,0,0,0.5)" }}
      >
        {/* ── Browser Chrome ── */}
        <div className="h-11 bg-[#111113] border-b border-white/[0.06] flex items-center px-4 gap-4 shrink-0">
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
            <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
            <div className="w-3 h-3 rounded-full bg-[#28c840]" />
          </div>
          <div className="flex-1 flex justify-center">
            <div className="w-72 h-[26px] bg-black/40 rounded-md border border-white/[0.06] flex items-center justify-center gap-1.5 px-3">
              <div className="w-3 h-3 rounded-full border border-white/10 flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              </div>
              <span className="text-[11px] text-text-muted font-mono">elpresy.app/dashboard</span>
            </div>
          </div>
          <div className="w-14" />
        </div>

        {/* ── App Content ── */}
        <div className="flex min-h-[520px]">
          {/* Sidebar */}
          <div className="w-52 border-r border-white/[0.06] bg-[#0e0e10] p-4 hidden md:flex flex-col shrink-0">
            {/* Logo */}
            <div className="flex items-center gap-2 text-gold font-display font-bold text-base mb-8 px-2">
              <Zap size={16} fill="currentColor" />
              <span>ELPRESY</span>
            </div>

            {/* Nav Items */}
            <nav className="flex flex-col gap-1">
              {NAV_ITEMS.map((item) => (
                <div
                  key={item.label}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    item.active
                      ? "bg-gold/10 text-gold"
                      : "text-text-muted"
                  }`}
                >
                  <item.icon size={15} strokeWidth={1.8} />
                  <span>{item.label}</span>
                </div>
              ))}
            </nav>

            {/* Sidebar Bottom */}
            <div className="mt-auto pt-4 border-t border-white/[0.06]">
              <div className="px-3 py-2 text-[11px] text-text-faint font-mono">
                v1.0.0 • CART Model
              </div>
            </div>
          </div>

          {/* Main Dashboard Area */}
          <div className="flex-1 p-5 lg:p-6 flex flex-col gap-5 overflow-hidden bg-[#0a0a0c]">
            {/* Page Header */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-display font-semibold text-white">{t("pageTitle")}</h3>
                <p className="text-[11px] text-text-faint mt-0.5">{t("pageSubtitle")}</p>
              </div>
              <Badge variant="outline" className="border-emerald-500/30 text-emerald-400 bg-emerald-500/5 text-[10px] px-2.5 py-0.5 rounded-full">
                {t("modelActive")}
              </Badge>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: t("totalPredictions"), value: "1,248", change: "+12%", up: true },
                { label: t("latestAmpere"), value: "8.4 A", change: "+2.4%", up: true },
                { label: t("averageDaily"), value: "7.9 A", change: "-0.3%", up: false },
              ].map((stat) => (
                <Card
                  key={stat.label}
                  className="bg-[#111113] border-white/[0.06] p-4 rounded-xl"
                >
                  <div className="text-[10px] text-text-faint uppercase tracking-wider mb-2 font-medium">
                    {stat.label}
                  </div>
                  <div className="flex items-end justify-between">
                    <span className="text-xl font-display font-bold text-white">{stat.value}</span>
                    <span className={`text-[10px] font-semibold font-mono ${stat.up ? "text-emerald-400" : "text-red-400"}`}>
                      {stat.change}
                    </span>
                  </div>
                </Card>
              ))}
            </div>

            {/* Chart + Table Row */}
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-5 gap-4 min-h-0">
              {/* Chart */}
              <Card className="lg:col-span-2 bg-[#111113] border-white/[0.06] p-4 rounded-xl flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2 text-sm font-medium text-white">
                    <ChartIcon size={14} className="text-gold" />
                    <span>{t("usageTrend")}</span>
                  </div>
                  <span className="text-[9px] text-text-faint font-mono uppercase tracking-wider">7 DAYS</span>
                </div>
                <div className="flex-1 min-h-[120px] relative">
                  <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 60">
                    <defs>
                      <linearGradient id="previewChartFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#C9A84C" stopOpacity="0.25" />
                        <stop offset="100%" stopColor="#C9A84C" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    {/* Horizontal grid */}
                    {[15, 30, 45].map((y) => (
                      <line key={y} x1="0" y1={y} x2="100" y2={y} stroke="#ffffff" strokeOpacity="0.04" strokeWidth="0.3" />
                    ))}
                    {/* Area */}
                    <path
                      d="M0,48 C6,45 10,38 16,35 C22,32 28,42 34,38 C40,34 46,22 52,25 C58,28 64,30 70,24 C76,18 82,20 88,14 C94,8 97,10 100,12 L100,60 L0,60 Z"
                      fill="url(#previewChartFill)"
                    />
                    {/* Line */}
                    <path
                      d="M0,48 C6,45 10,38 16,35 C22,32 28,42 34,38 C40,34 46,22 52,25 C58,28 64,30 70,24 C76,18 82,20 88,14 C94,8 97,10 100,12"
                      fill="none"
                      stroke="#C9A84C"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                    <circle cx="100" cy="12" r="2" fill="#C9A84C" />
                    <circle cx="100" cy="12" r="3.5" fill="#C9A84C" fillOpacity="0.2" />
                  </svg>
                  {/* X-axis labels */}
                  <div className="absolute -bottom-1 left-0 right-0 flex justify-between text-[7px] text-text-faint font-mono">
                    {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
                      <span key={d}>{d}</span>
                    ))}
                  </div>
                </div>
              </Card>

              {/* Predictions Table */}
              <Card className="lg:col-span-3 bg-[#111113] border-white/[0.06] rounded-xl flex flex-col overflow-hidden">
                <div className="px-4 pt-4 pb-3 flex items-center justify-between border-b border-white/[0.04]">
                  <div className="flex items-center gap-2 text-sm font-medium text-white">
                    <History size={14} className="text-gold" />
                    <span>{t("recentPredictions")}</span>
                  </div>
                  <span className="text-[10px] text-gold font-medium cursor-default">{t("viewAll")}</span>
                </div>

                {/* Table Header */}
                <div className="grid grid-cols-6 gap-2 px-4 py-2.5 text-[9px] text-text-faint uppercase tracking-wider font-semibold border-b border-white/[0.03]">
                  <span>{t("tableId")}</span>
                  <span>{t("tableDate")}</span>
                  <span>{t("tableInputA")}</span>
                  <span>{t("tableHours")}</span>
                  <span>{t("tableResult")}</span>
                  <span className="text-right">{t("tableStatus")}</span>
                </div>

                {/* Table Rows */}
                <div className="flex-1 flex flex-col">
                  {PREDICTIONS_DATA.map((row, i) => (
                    <div
                      key={row.id}
                      className={`grid grid-cols-6 gap-2 px-4 py-2.5 text-[11px] items-center ${
                        i < PREDICTIONS_DATA.length - 1 ? "border-b border-white/[0.03]" : ""
                      }`}
                    >
                      <span className="text-text-muted font-mono">{row.id}</span>
                      <span className="text-text-muted font-mono">{row.date}</span>
                      <span className="text-white font-mono">{row.ampPerCycle}</span>
                      <span className="text-white font-mono">{row.hours}</span>
                      <span className="text-gold font-mono font-semibold flex items-center gap-1.5">
                        {row.result}
                        <TrendIcon trend={row.trend} />
                      </span>
                      <span className="text-right">
                        <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-[8px] px-1.5 py-0 rounded-full font-medium">
                          {t("statusDone")}
                        </Badge>
                      </span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
