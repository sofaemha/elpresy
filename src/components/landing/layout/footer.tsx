"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Zap } from "lucide-react";

export default function Footer() {
  const t = useTranslations("footer");
  const nav = useTranslations("nav");

  const NAV_ITEMS = [
    { label: nav("features"), href: "#features" },
    { label: nav("howItWorks"), href: "#how-it-works" },
    { label: nav("research"), href: "#research" },
    { label: nav("about"), href: "#about" },
  ];

  return (
    <footer className="bg-bg pt-16 pb-8 border-t border-border/30">
      <div className="container mx-auto px-6">

        <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-16">

          <div className="flex flex-col items-center md:items-start gap-3">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="text-gold group-hover:text-gold-light transition-colors">
                <Zap size={24} fill="currentColor" />
              </div>
              <span className="font-display font-bold text-xl tracking-tight text-white">ELPRESY</span>
            </Link>
            <p className="text-text-muted text-sm font-medium">{t("tagline")}</p>
          </div>

          <nav className="flex flex-wrap justify-center gap-x-8 gap-y-4">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="text-sm font-medium text-text-muted hover:text-gold transition-colors"
              >
                {item.label}
              </a>
            ))}
            <a
              href="#"
              className="text-sm font-medium text-gold hover:text-gold-light transition-colors"
            >
              {nav("getStarted")}
            </a>
          </nav>

          <div className="text-sm text-text-faint font-mono">
            {t("darkMode")} • <span className="text-gold/50">{t("active")}</span>
          </div>

        </div>

        <div className="border-t border-border/30 text-center flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-text-faint">
          <p>{t("copyright")}</p>
          <p>{t("thesis")}</p>
        </div>

      </div>
    </footer>
  );
}
