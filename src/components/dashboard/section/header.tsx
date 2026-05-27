// filepath: src/components/dashboard/section/header.tsx
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Plus, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface HeaderProps {
  t: ReturnType<typeof useTranslations>;
  totalCount: number;
}

export default function Header({ t, totalCount }: HeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      {/* Left — title + subtitle */}
      <div className="space-y-1">
        {/* Decorative gold line */}
        <div className="h-px w-10 bg-gold mb-3" aria-hidden="true" />
        <div className="flex items-center gap-3 flex-wrap">
          <h1 className="font-display text-2xl md:text-3xl font-bold text-text-primary">
            {t("title")}
          </h1>
          <Badge
            variant="outline"
            className="border-emerald-500/30 text-emerald-400 bg-emerald-500/5 text-[10px] px-2.5 py-0.5 rounded-full font-medium"
          >
            <Activity size={9} className="mr-1" aria-hidden="true" />
            {t("modelActive")}
          </Badge>
        </div>
        <p className="text-sm text-text-muted">
          {t("subtitle")}
          {totalCount > 0 && (
            <span className="ml-1 text-text-faint">
              — {totalCount} {t("totalPredictions").toLowerCase()}
            </span>
          )}
        </p>
      </div>

      {/* Right — CTA */}
      <Link href="/predict" className="shrink-0 w-fit">
        <Button
          variant="default"
          size="lg"
          className="gap-2 shadow-[0_0_20px_rgba(201,168,76,0.20)] hover:shadow-[0_0_28px_rgba(201,168,76,0.35)] transition-all"
          aria-label={t("newPrediction")}
        >
          <Plus size={15} aria-hidden="true" />
          {t("newPrediction")}
        </Button>
      </Link>
    </div>
  );
}
