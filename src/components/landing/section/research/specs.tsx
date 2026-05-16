export default function Specs({ t }: { t: any }) {
  const SPECS = [
    { label: t("specAlgorithm"), value: "CART Decision Tree Regression" },
    { label: t("specLibrary"), value: "ml-cart" },
    { label: t("specInputs"), value: t("specInputsValue") },
    { label: t("specOutput"), value: t("specOutputValue") },
    { label: t("specModelType"), value: t("specModelTypeValue") },
    { label: t("specLanguage"), value: t("specLanguageValue") },
  ];

  return (
    <div className="pl-0 lg:pl-14 pt-12 lg:pt-0 border-t border-white/[0.06] lg:border-t-0">
      <div
        className="rounded-2xl border border-white/[0.06] bg-[#0e0e10] overflow-hidden"
        style={{ boxShadow: "0 0 60px rgba(201,168,76,0.04)" }}
      >
        {/* Card Header */}
        <div className="px-7 py-5 border-b border-white/[0.06] bg-[#111113]">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-display font-semibold text-white tracking-tight">
              {t("specTitle")}
            </h3>
            <span className="text-[9px] text-text-faint font-mono uppercase tracking-widest">
              {t("specDataSheet")}
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
                {spec.value === "ml-cart" ? (
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
                {t("specFooter")}
              </span>
            </div>
            <span className="text-[10px] text-text-faint font-mono">
              v1.0.0
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
