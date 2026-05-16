import { CheckCircle2, ShieldCheck, Code2 } from "lucide-react";

export default function Proof({ t }: { t: any }) {
  return (
    <div className="mt-14 flex flex-wrap justify-center gap-10 text-sm font-medium text-text-muted">
      <div className="flex items-center gap-2">
        <CheckCircle2 size={16} className="text-gold" strokeWidth={1.5} />
        <span>{t("proofOpenSource")}</span>
      </div>
      <div className="flex items-center gap-2">
        <ShieldCheck size={16} className="text-gold" strokeWidth={1.5} />
        <span>{t("proofAccuracy")}</span>
      </div>
      <div className="flex items-center gap-2">
        <Code2 size={16} className="text-gold" strokeWidth={1.5} />
        <span>{t("proofNextjs")}</span>
      </div>
    </div>
  );
}
