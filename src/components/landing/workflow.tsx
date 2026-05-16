import { useTranslations } from "next-intl";
import Header from "@/components/landing/section/workflow/header";
import Steps from "@/components/landing/section/workflow/steps";
import Powered from "@/components/landing/section/workflow/powered";

export default function Workflow() {
  const t = useTranslations("howItWorks");

  return (
    <section id="how-it-works" className="py-24 bg-bg relative">
      <div className="container mx-auto px-6">
        <Header t={t} />
        <Steps t={t} />
        <Powered t={t} />
      </div>
    </section>
  );
}
