"use client";

import { useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { LayoutDashboard, BarChart3, History, Settings, Zap, Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import DashboardArea from "@/components/landing/section/preview/app/dashboard";
import PredictionArea from "@/components/landing/section/preview/app/prediction";
import HistoryArea from "@/components/landing/section/preview/app/history";
import SettingsArea from "@/components/landing/section/preview/app/settings";

type Tab = "dashboard" | "predictions" | "history" | "settings";

export default function App() {
  const t = useTranslations("preview");
  const [activeTab, setActiveTab] = useState<Tab>("dashboard");
  const containerRef = useRef<HTMLDivElement>(null);

  const NAV_ITEMS: { icon: React.ElementType; key: Tab; label: string }[] = [
    { icon: LayoutDashboard, key: "dashboard",   label: t("dashboard") },
    { icon: BarChart3,       key: "predictions", label: t("predictions") },
    { icon: History,         key: "history",     label: t("history") },
    { icon: Settings,        key: "settings",    label: t("settings") },
  ];

  return (
    <div ref={containerRef} className="relative overflow-hidden flex flex-col md:flex-row min-h-[520px]">
      {/* Mobile Top Bar */}
      <div className="md:hidden flex items-center justify-between border-b border-white/[0.06] bg-[#0e0e10] p-4 shrink-0">
        <div className="flex items-center gap-2 text-gold font-display font-bold text-base">
          <Zap size={16} fill="currentColor" />
          <span>ELPRESY</span>
        </div>
        <Sheet>
          <SheetTrigger render={<button className="text-text-muted hover:text-text-primary p-1" />}>
            <Menu size={20} />
            <span className="sr-only">Toggle Menu</span>
          </SheetTrigger>
          <SheetContent container={() => containerRef.current} side="left" className="w-64 bg-[#0e0e10] border-r border-white/[0.06] p-4 flex flex-col">
            <SheetTitle className="sr-only">Menu</SheetTitle>
            <div className="flex items-center gap-2 text-gold font-display font-bold text-base mb-8 px-2">
              <Zap size={16} fill="currentColor" />
              <span>ELPRESY</span>
            </div>
            <nav className="flex flex-col gap-1">
              {NAV_ITEMS.map((item) => (
                <SheetTrigger
                  key={item.key}
                  render={
                    <button
                      onClick={() => setActiveTab(item.key)}
                      className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-left w-full ${
                        activeTab === item.key
                          ? "bg-gold/10 text-gold"
                          : "text-text-muted hover:text-text-primary hover:bg-white/[0.03]"
                      }`}
                    />
                  }
                >
                  <item.icon size={15} strokeWidth={1.8} />
                  <span>{item.label}</span>
                </SheetTrigger>
              ))}
            </nav>
            <div className="mt-auto pt-4 border-t border-white/[0.06]">
              <div className="px-3 py-2 text-[11px] text-text-faint font-mono">v1.0.0 • CART Model</div>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Sidebar */}
      <div className="w-52 border-r border-white/[0.06] bg-[#0e0e10] p-4 hidden md:flex flex-col shrink-0">
        <div className="flex items-center gap-2 text-gold font-display font-bold text-base mb-8 px-2">
          <Zap size={16} fill="currentColor" />
          <span>ELPRESY</span>
        </div>

        <nav className="flex flex-col gap-1">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.key}
              onClick={() => setActiveTab(item.key)}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-left w-full ${
                activeTab === item.key
                  ? "bg-gold/10 text-gold"
                  : "text-text-muted hover:text-text-primary hover:bg-white/[0.03]"
              }`}
            >
              <item.icon size={15} strokeWidth={1.8} />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="mt-auto pt-4 border-t border-white/[0.06]">
          <div className="px-3 py-2 text-[11px] text-text-faint font-mono">v1.0.0 • CART Model</div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 p-5 lg:p-6 flex flex-col gap-5 overflow-hidden bg-[#0a0a0c]">
        {activeTab === "dashboard"   && <DashboardArea  t={t} />}
        {activeTab === "predictions" && <PredictionArea t={t} />}
        {activeTab === "history"     && <HistoryArea    t={t} />}
        {activeTab === "settings"    && <SettingsArea   t={t} />}
      </div>
    </div>
  );
}
