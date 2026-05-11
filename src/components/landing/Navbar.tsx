"use client";

import { useState, useEffect } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter, usePathname } from "@/i18n/navigation";

import Logo from "@/components/landing/section/navbar/Logo";
import Desktop from "@/components/landing/section/navbar/Desktop";
import Actions from "@/components/landing/section/navbar/Actions";
import Mobile from "@/components/landing/section/navbar/Mobile";

export default function Navbar() {
  const t = useTranslations("nav");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  const Links = [
    { label: t("features"), href: "#features" },
    { label: t("howItWorks"), href: "#how-it-works" },
    { label: t("research"), href: "#research" },
    { label: t("about"), href: "#about" },
  ];


  const toggleLocale = () => {
    const next = locale === "en" ? "id" : "en";
    router.replace(pathname, { locale: next });
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-surface/80 backdrop-blur-md border-b border-border/50 py-3" : "bg-transparent py-5"
        }`}
    >
      <div className="container mx-auto px-6 flex items-center justify-between">
        <Logo />
        <Desktop Links={Links} />
        <Actions toggleLocale={toggleLocale} t={t} />
        <Mobile Links={Links} toggleLocale={toggleLocale} locale={locale} t={t} />
      </div>
    </header>
  );
}
