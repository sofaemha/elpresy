import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";

export default function Actions({ toggleLocale, t }: { toggleLocale: () => void, t: any }) {
  return (
    <div className="hidden md:flex items-center gap-4">
      <button
        onClick={toggleLocale}
        className="flex items-center gap-1.5 text-sm font-medium text-text-muted hover:text-gold transition-colors"
      >
        <Globe size={16} />
        <span>{t("language")}</span>
      </button>

      <Button
        variant="outline"
        className="border-gold text-gold dark:hover:bg-gold hover:text-black transition-all duration-300 rounded-full px-6"
      >
        {t("getStarted")}
      </Button>
    </div>
  )
}