import { useTranslations } from "next-intl";

export default function HowItWorksSection() {
  const t = useTranslations("howItWorks");

  const steps = [
    {
      number: "01",
      title: t("step1.title"),
      description: t("step1.description")
    },
    {
      number: "02",
      title: t("step2.title"),
      description: t("step2.description")
    },
    {
      number: "03",
      title: t("step3.title"),
      description: t("step3.description")
    }
  ];

  return (
    <section id="how-it-works" className="py-24 bg-bg relative">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-20">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">
            {t("heading")}
          </h2>
          <p className="text-lg text-text-muted">
            {t("subheading")}
          </p>
        </div>

        <div className="relative max-w-5xl mx-auto">
          {/* Connecting Line (Desktop) */}
          <div className="hidden md:block absolute top-12 left-[10%] right-[10%] h-[2px] border-t-2 border-dashed border-gold/30 -z-10" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
            {steps.map((step, index) => (
              <div key={index} className="relative flex flex-col items-center text-center group">
                <div className="w-24 h-24 rounded-full bg-surface-2 border-2 border-gold/30 flex items-center justify-center mb-6 group-hover:border-gold transition-colors duration-300 shadow-[0_0_30px_rgba(201,168,76,0.1)] group-hover:shadow-[0_0_40px_rgba(201,168,76,0.2)]">
                  <span className="text-3xl font-display font-bold text-gold">{step.number}</span>
                </div>
                <h3 className="text-xl font-display font-semibold text-white mb-3">{step.title}</h3>
                <p className="text-text-muted leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-20 text-center">
          <p className="inline-block px-6 py-2 rounded-full bg-surface-2 border border-border text-sm text-text-faint font-mono">
            {t("poweredBy")}
          </p>
        </div>
      </div>
    </section>
  );
}
