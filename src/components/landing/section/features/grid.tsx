import { Network, LineChart, History, Download, Languages } from "lucide-react";

export default function Grid({ t }: { t: any }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">


      {/* ── Export Data ── */}
      <div className="relative rounded-2xl border border-white/[0.06] bg-bg p-7 flex flex-col overflow-hidden group transition-all duration-500 hover:border-white/[0.1] min-h-[200px]">
        <div className="absolute inset-0 bg-gradient-to-br from-gold/0 to-gold/0 group-hover:from-gold/[0.03] group-hover:to-transparent transition-all duration-700 pointer-events-none rounded-2xl" />

        <div className="relative z-10 flex flex-col h-full">
          <Download className="text-gold mb-5" size={22} strokeWidth={1.5} />
          <h3 className="text-lg font-display font-semibold text-white mb-2 tracking-tight">
            {t("export.title")}
          </h3>
          <p className="text-text-muted text-sm leading-relaxed">
            {t("export.description")}
          </p>
        </div>
      </div>

      {/* ── Multi-language ── */}
      <div className="relative rounded-2xl border border-white/[0.06] bg-bg p-7 flex flex-col overflow-hidden group transition-all duration-500 hover:border-white/[0.1] min-h-[200px]">
        <div className="absolute inset-0 bg-gradient-to-br from-gold/0 to-gold/0 group-hover:from-gold/[0.03] group-hover:to-transparent transition-all duration-700 pointer-events-none rounded-2xl" />

        <div className="relative z-10 flex flex-col h-full">
          <Languages className="text-gold mb-5" size={22} strokeWidth={1.5} />
          <h3 className="text-lg font-display font-semibold text-white mb-2 tracking-tight">
            {t("multiLanguage.title")}
          </h3>
          <p className="text-text-muted text-sm leading-relaxed">
            {t("multiLanguage.description")}
          </p>
        </div>
      </div>
    </div>
  );
}
