// filepath: src/components/dashboard/section/stats.tsx
import { useTranslations } from "next-intl";
import { Hash, Zap, Activity } from "lucide-react";

interface StatsData {
  total: number;
  lastRange: string;
  overallAvg: string;
}

interface StatsProps {
  t: ReturnType<typeof useTranslations>;
  stats: StatsData;
}

interface StatCardProps {
  label: string;
  value: string;
  icon: React.ElementType;
  accent?: boolean;
}

function StatCard({ label, value, icon: Icon, accent = false }: StatCardProps) {
  return (
    <article className="relative flex flex-col gap-3 bg-surface border border-border-gold rounded-lg p-5 overflow-hidden group transition-all duration-300 hover:border-border-gold-hover">
      {/* Subtle gold glow on hover */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gold/[0.02] opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"
      />

      {/* Icon + label row */}
      <div className="flex items-center gap-2.5 relative z-10">
        <div
          className={`flex items-center justify-center size-7 rounded-md border ${
            accent
              ? "bg-gold/10 border-gold/25 text-gold"
              : "bg-surface-2 border-border-gold text-text-faint"
          }`}
        >
          <Icon size={13} aria-hidden="true" />
        </div>
        <p className="text-[11px] font-medium uppercase tracking-widest text-text-faint">
          {label}
        </p>
      </div>

      {/* Value */}
      <p
        className={`font-display text-2xl font-bold relative z-10 leading-tight ${
          accent ? "text-gold" : "text-text-primary"
        }`}
      >
        {value}
      </p>
    </article>
  );
}

export default function Stats({ t, stats }: StatsProps) {
  const cards: StatCardProps[] = [
    {
      label: t("totalPredictions"),
      value: stats.total === 0 ? "—" : stats.total.toString(),
      icon: Hash,
      accent: false,
    },
    {
      label: t("lastRange"),
      value: stats.lastRange || "—",
      icon: Zap,
      accent: true,
    },
    {
      label: t("avgDailyAmpere"),
      value: stats.overallAvg,
      icon: Activity,
      accent: false,
    },
  ];

  return (
    <section aria-labelledby="stats-heading">
      <h2 id="stats-heading" className="sr-only">
        {t("totalPredictions")} overview
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {cards.map((card) => (
          <StatCard key={card.label} {...card} />
        ))}
      </div>
    </section>
  );
}
