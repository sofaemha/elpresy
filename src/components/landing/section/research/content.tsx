import { Quote, Target, Eye, FileOutput } from "lucide-react";

export default function Content({ t }: { t: any }) {
  const OBJECTIVES = [
    {
      icon: Target,
      text: t("objective1"),
    },
    {
      icon: Eye,
      text: t("objective2"),
    },
    {
      icon: FileOutput,
      text: t("objective3"),
    },
  ];

  return (
    <div className="pr-0 lg:pr-14 pb-12 lg:pb-0">
      {/* Key Finding Quote */}
      <blockquote className="relative mb-10 pl-6 border-l-2 border-gold/40">
        <Quote size={16} className="text-gold/40 mb-2" />
        <p className="text-base text-text-muted leading-relaxed italic">
          &ldquo;{t("quote")}&rdquo;
        </p>
        <cite className="block mt-2 text-xs text-text-faint not-italic font-mono">
          {t("quoteCite")}
        </cite>
      </blockquote>

      {/* Context Paragraph */}
      <div className="space-y-5 text-base text-text-muted leading-relaxed mb-10">
        <p>{t("paragraph1")}</p>
        <p>{t("paragraph2")}</p>
      </div>

      {/* Objectives */}
      <div>
        <h3 className="text-sm text-text-faint uppercase tracking-wider font-semibold mb-5">
          {t("objectivesLabel")}
        </h3>
        <div className="space-y-4">
          {OBJECTIVES.map((obj) => (
            <div key={obj.text} className="flex items-start gap-3">
              <div className="mt-0.5 w-7 h-7 rounded-lg bg-surface-2 border border-white/[0.06] flex items-center justify-center shrink-0">
                <obj.icon size={14} className="text-gold" strokeWidth={1.5} />
              </div>
              <p className="text-sm text-text-muted leading-relaxed">{obj.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Methodology Note */}
      <div className="mt-10 pt-6 border-t border-white/[0.06]">
        <p className="text-xs text-text-faint font-mono leading-relaxed">
          <span className="text-text-muted font-semibold">{t("methodologyLabel")}</span>{" "}
          {t("methodology")}
        </p>
      </div>
    </div>
  );
}
