"use client";

import { useState, useEffect } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link, useRouter, usePathname } from "@/i18n/navigation";
import { Menu, Zap, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export default function Navbar() {
  const t = useTranslations("nav");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  const NAV_LINKS = [
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
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-surface/80 backdrop-blur-md border-b border-border/50 py-3" : "bg-transparent py-5"
      }`}
    >
      <div className="container mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="text-gold group-hover:text-gold-light transition-colors">
            <Zap size={24} fill="currentColor" />
          </div>
          <span className="font-display font-bold text-xl tracking-tight">ELPRESY</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-sm font-medium text-text-muted hover:text-text-primary transition-colors"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Actions (Desktop) */}
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

        {/* Mobile Nav */}
        <div className="md:hidden flex items-center gap-4">
          <Sheet>
            <SheetTrigger className="text-text-primary hover:bg-surface-2 p-2 rounded-md inline-flex items-center justify-center transition-colors">
              <Menu size={24} />
            </SheetTrigger>
            <SheetContent side="right" className="bg-surface border-border flex flex-col gap-8 pt-16">
              <nav className="flex flex-col gap-6">
                {NAV_LINKS.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    className="text-lg font-medium text-text-primary hover:text-gold transition-colors"
                  >
                    {link.label}
                  </a>
                ))}
              </nav>

              <div className="flex flex-col gap-4 mt-auto pb-8">
                <button
                  onClick={toggleLocale}
                  className="flex items-center gap-2 text-text-muted hover:text-gold transition-colors"
                >
                  <Globe size={20} />
                  <span>{locale === "en" ? "Switch to Indonesian" : "Ganti ke Inggris"}</span>
                </button>
                <Button className="w-full bg-gold text-black hover:bg-gold-light transition-all rounded-full">
                  {t("getStarted")}
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
