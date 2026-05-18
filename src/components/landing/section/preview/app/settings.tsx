import { Database, Globe, FileDown, User, ChevronRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function SettingsArea({ t }: { t: any }) {
  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-display font-semibold text-white">System Configuration</h3>
          <p className="text-[11px] text-text-faint mt-0.5">Customize model parameters and preferences</p>
        </div>
        <Badge variant="outline" className="border-gold/30 text-gold bg-gold/5 text-[10px] px-2.5 py-0.5 rounded-full">
          v1.0.0
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Model Config */}
        <Card className="bg-[#111113] border-white/[0.06] p-4 rounded-xl">
          <div className="flex items-center gap-2 text-sm font-medium text-white mb-4">
            <Database size={13} className="text-gold" /> CART Model
          </div>
          <div className="space-y-1">
            {[
              { label: "Algorithm", value: "CART Decision Tree" },
              { label: "Max Depth", value: "5" },
              { label: "Min Samples", value: "2" },
              { label: "Gain Function", value: "Regression" },
              { label: "Split Function", value: "Mean" },
            ].map((cfg) => (
              <div key={cfg.label} className="flex items-center justify-between py-2 border-b border-white/[0.04] last:border-0">
                <span className="text-[11px] text-text-muted">{cfg.label}</span>
                <span className="text-[11px] font-mono text-gold">{cfg.value}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Language + Export */}
        <div className="flex flex-col gap-4">
          <Card className="bg-[#111113] border-white/[0.06] p-4 rounded-xl">
            <div className="flex items-center gap-2 text-sm font-medium text-white mb-3">
              <Globe size={13} className="text-gold" /> Language
            </div>
            <div className="grid grid-cols-2 gap-2">
              {["English", "Indonesian"].map((lang, i) => (
                <div key={lang} className={`h-8 rounded-lg border text-[11px] font-medium flex items-center justify-center cursor-default transition-all ${i === 0 ? "bg-gold/10 border-gold/30 text-gold" : "border-white/[0.06] text-text-faint"}`}>
                  {lang}
                </div>
              ))}
            </div>
          </Card>

          <Card className="bg-[#111113] border-white/[0.06] p-4 rounded-xl">
            <div className="flex items-center gap-2 text-sm font-medium text-white mb-3">
              <FileDown size={13} className="text-gold" /> Export Format
            </div>
            <div className="grid grid-cols-2 gap-2">
              {["CSV", "PDF"].map((fmt, i) => (
                <div key={fmt} className={`h-8 rounded-lg border text-[11px] font-medium flex items-center justify-center cursor-default ${i === 0 ? "bg-gold/10 border-gold/30 text-gold" : "border-white/[0.06] text-text-faint"}`}>
                  {fmt}
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Profile */}
      <Card className="bg-[#111113] border-white/[0.06] rounded-xl overflow-hidden">
        <div className="px-4 py-3 border-b border-white/[0.04] flex items-center gap-2 text-sm font-medium text-white">
          <User size={13} className="text-gold" /> Researcher Profile
        </div>
        <div className="divide-y divide-white/[0.03]">
          {[
            { label: "Name", value: "Researcher" },
            { label: "Institution", value: "Pancasakti University Tegal" },
            { label: "Program", value: "Informatics" },
            { label: "Year", value: "2026" },
          ].map((item) => (
            <div key={item.label} className="flex items-center justify-between px-4 py-2.5">
              <span className="text-[11px] text-text-muted">{item.label}</span>
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-white font-mono">{item.value}</span>
                <ChevronRight size={10} className="text-text-faint" />
              </div>
            </div>
          ))}
        </div>
      </Card>
    </>
  );
}
