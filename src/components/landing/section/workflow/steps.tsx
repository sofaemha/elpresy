export default function Steps({ t }: { t: any }) {
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
  );
}
