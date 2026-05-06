import { Quote, Target, Eye, FileOutput } from "lucide-react";

const SPECS = [
  { label: "Algorithm", value: "CART Decision Tree Regression" },
  { label: "Library", value: "ml-cart" },
  { label: "Input Variables", value: "2 (Ampere/Cycle, Usage Hours)" },
  { label: "Output", value: "Daily Ampere Prediction (A)" },
  { label: "Model Type", value: "Supervised — Regression" },
  { label: "Language Support", value: "Indonesian (ID) & English (EN)" },
];

const OBJECTIVES = [
  {
    icon: Target,
    text: "Predict daily AC ampere usage with high reliability based on minimal input variables.",
  },
  {
    icon: Eye,
    text: "Visualize consumption trends over time to identify inefficiencies and usage patterns.",
  },
  {
    icon: FileOutput,
    text: "Provide exportable data logging in CSV and PDF formats for continuous academic analysis.",
  },
];

export default function ResearchSection() {
  return (
    <section id="research" className="py-28 bg-bg relative">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="max-w-2xl mb-16">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4 tracking-tight">
            The Research Behind ELPRESY
          </h2>
          <p className="text-lg text-text-muted leading-relaxed">
            Understanding why predicting AC ampere usage matters — and how ELPRESY approaches it.
          </p>
        </div>

        {/* Two-Column Layout with Gold Divider */}
        <div className="grid lg:grid-cols-2 gap-0 items-stretch relative">

          {/* ── Left: Text Content ── */}
          <div className="pr-0 lg:pr-14 pb-12 lg:pb-0">
            {/* Key Finding Quote */}
            <blockquote className="relative mb-10 pl-6 border-l-2 border-gold/40">
              <Quote size={16} className="text-gold/40 mb-2" />
              <p className="text-base text-text-muted leading-relaxed italic">
                &ldquo;AC units account for 40–60% of residential electricity consumption
                in tropical climates.&rdquo;
              </p>
              <cite className="block mt-2 text-xs text-text-faint not-italic font-mono">
                — IEA, The Future of Cooling (2018)
              </cite>
            </blockquote>

            {/* Context Paragraph */}
            <div className="space-y-5 text-base text-text-muted leading-relaxed mb-10">
              <p>
                In Indonesia and other tropical nations, air conditioning is not
                a luxury — it&apos;s a necessity. Yet most households have little
                visibility into how much energy their AC units actually draw on a
                daily basis. ELPRESY was built to close that gap.
              </p>
              <p>
                By applying machine learning to just two easily measurable
                inputs, the system delivers reliable daily ampere forecasts
                without requiring specialized metering equipment or electrical
                expertise.
              </p>
            </div>

            {/* Objectives */}
            <div>
              <h3 className="text-sm text-text-faint uppercase tracking-wider font-semibold mb-5">
                Core Research Objectives
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
                <span className="text-text-muted font-semibold">Methodology:</span>{" "}
                CART (Classification and Regression Trees) via the{" "}
                <span className="text-gold/80">ml-cart</span> library, configured for
                regression on continuous variables with pruning to prevent overfitting.
              </p>
            </div>
          </div>

          {/* ── Gold Vertical Divider (desktop only) ── */}
          <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 -translate-x-1/2">
            <div className="w-[1px] h-full bg-gradient-to-b from-transparent via-gold/30 to-transparent" />
          </div>

          {/* ── Right: Spec Card ── */}
          <div className="pl-0 lg:pl-14 pt-12 lg:pt-0 border-t border-white/[0.06] lg:border-t-0">
            <div
              className="rounded-2xl border border-white/[0.06] bg-[#0e0e10] overflow-hidden"
              style={{ boxShadow: "0 0 60px rgba(201,168,76,0.04)" }}
            >
              {/* Card Header */}
              <div className="px-7 py-5 border-b border-white/[0.06] bg-[#111113]">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-display font-semibold text-white tracking-tight">
                    Technical Specification
                  </h3>
                  <span className="text-[9px] text-text-faint font-mono uppercase tracking-widest">
                    Data Sheet
                  </span>
                </div>
              </div>

              {/* Spec Rows */}
              <div className="divide-y divide-white/[0.04]">
                {SPECS.map((spec) => (
                  <div key={spec.label} className="px-7 py-4 flex flex-col gap-1">
                    <dt className="text-[10px] text-text-faint uppercase tracking-wider font-semibold">
                      {spec.label}
                    </dt>
                    <dd className="text-sm text-white font-medium">
                      {spec.label === "Library" ? (
                        <code className="text-gold font-mono bg-gold/5 px-2 py-0.5 rounded-md border border-gold/10 text-xs">
                          {spec.value}
                        </code>
                      ) : (
                        spec.value
                      )}
                    </dd>
                  </div>
                ))}
              </div>

              {/* Card Footer */}
              <div className="px-7 py-4 border-t border-white/[0.06] bg-[#111113]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <span className="text-[10px] text-text-faint font-medium">
                      Model trained & validated
                    </span>
                  </div>
                  <span className="text-[10px] text-text-faint font-mono">
                    v1.0.0
                  </span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
