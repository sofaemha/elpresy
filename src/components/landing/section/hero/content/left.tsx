import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight } from "lucide-react"

export default function Left({t}: {t: any}) {
  return (
    
        <div className="flex flex-col items-start max-w-[55ch]">
          <div className="h-[1px] w-12 bg-gold mb-6" />

          <Badge
            variant="outline"
            className="border-gold/30 text-gold-light bg-gold/5 mb-6 rounded-full px-4 py-1 font-medium"
          >
            {t("badge")}
          </Badge>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold leading-[1.1] tracking-tight mb-6">
            <span className="text-transparent bg-clip-text bg-gradient-to-br from-white via-zinc-200 to-zinc-500">
              {t("headline1")}
            </span>
            <br />
            <span className="gold-shimmer">{t("headline2")}</span>
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-br from-zinc-300 to-zinc-600">
              {t("headline3")}
            </span>
          </h1>

          <p className="text-lg text-text-muted mb-10 leading-relaxed font-light">
            {t("subheadline")}
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <Button className="bg-gold hover:bg-gold-light text-black font-semibold rounded-full px-8 py-6 h-auto text-base transition-all duration-300 group shadow-[0_0_20px_rgba(201,168,76,0.25)] hover:shadow-[0_0_30px_rgba(201,168,76,0.4)]">
              {t("ctaPrimary")}
              <ArrowRight
                className="ml-2 group-hover:translate-x-1 transition-transform"
                size={18}
              />
            </Button>
            <Button
              variant="ghost"
              className="text-text-primary hover:text-gold hover:bg-gold/10 rounded-full px-8 py-6 h-auto text-base transition-all duration-300"
            >
              {t("ctaSecondary")}
            </Button>
          </div>
        </div>

  )
}