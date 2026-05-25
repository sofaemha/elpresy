// filepath: src/components/landing/section/navbar/mobile.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import { useTranslations } from "next-intl";
import { Globe, Menu, X, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type NavLink = {
  label: string;
  href: string;
};

/* ─── Trigger Button ──────────────────────────────────────────────────────── */
function Trigger({ onOpen }: { onOpen: () => void }) {
  return (
    <button
      aria-label="Open navigation menu"
      onClick={onOpen}
      className={cn(
        "md:hidden relative flex items-center justify-center",
        "w-9 h-9 rounded-md border border-border",
        "text-text-muted hover:text-gold hover:border-gold/40",
        "motion-safe:transition-all motion-safe:duration-200",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30"
      )}
    >
      <Menu size={18} strokeWidth={1.8} />
    </button>
  );
}

/* ─── Overlay ─────────────────────────────────────────────────────────────── */
function Overlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <div
      aria-hidden="true"
      onClick={onClose}
      className={cn(
        "fixed inset-0 z-40 bg-black/60 md:hidden",
        "motion-safe:transition-opacity motion-safe:duration-300",
        open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      )}
    />
  );
}

/* ─── Nav Items ───────────────────────────────────────────────────────────── */
function NavItems({
  Links,
  activeSection,
  onClose,
}: {
  Links: NavLink[];
  activeSection: string;
  onClose: () => void;
}) {
  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
      e.preventDefault();
      onClose();
      // small delay lets the drawer close first, then scrolls smoothly
      setTimeout(() => {
        const target = document.getElementById(sectionId);
        if (target) target.scrollIntoView({ behavior: "smooth" });
      }, 240);
    },
    [onClose]
  );

  return (
    <nav aria-label="Mobile navigation">
      <ul className="flex flex-col">
        {Links.map((link, i) => {
          const sectionId = link.href.replace(/^#/, "");
          const isActive = activeSection === sectionId;

          return (
            <li key={link.label}>
              <a
                href={link.href}
                onClick={(e) => handleClick(e, sectionId)}
                aria-current={isActive ? "location" : undefined}
                style={{ transitionDelay: `${i * 30}ms` }}
                className={cn(
                  "group flex items-center gap-3 px-2 py-3",
                  "border-b border-border/40 last:border-0",
                  "text-sm font-medium motion-safe:transition-colors motion-safe:duration-200",
                  isActive ? "text-gold" : "text-text-muted hover:text-text-primary"
                )}
              >
                {/* Active indicator dot */}
                <span
                  className={cn(
                    "shrink-0 w-1 h-1 rounded-full",
                    "motion-safe:transition-all motion-safe:duration-200",
                    isActive
                      ? "bg-gold scale-125"
                      : "bg-text-faint group-hover:bg-text-muted"
                  )}
                />
                {link.label}

                {/* Active shimmer underline */}
                {isActive && (
                  <span className="ml-auto w-6 h-px bg-gradient-to-r from-gold/60 to-transparent" />
                )}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

/* ─── Drawer Footer Actions ───────────────────────────────────────────────── */
function DrawerActions({
  toggleLocale,
  locale,
  t,
  onClose,
}: {
  toggleLocale: () => void;
  locale: string;
  t: ReturnType<typeof useTranslations>;
  onClose: () => void;
}) {
  return (
    <div className="mt-auto pt-6 flex flex-col gap-3">
      {/* Locale toggle */}
      <button
        onClick={() => { toggleLocale(); onClose(); }}
        className={cn(
          "flex items-center gap-2 text-sm font-medium",
          "text-text-muted hover:text-gold",
          "motion-safe:transition-colors motion-safe:duration-200"
        )}
      >
        <Globe size={15} strokeWidth={1.8} />
        <span>
          {locale === "en" ? "Ganti ke Bahasa Indonesia" : "Switch to English"}
        </span>
      </button>

      {/* CTA */}
      <Button
        variant="outline"
        className={cn(
          "w-full justify-center rounded-full",
          "border-gold/30 text-gold",
          "hover:bg-gold hover:text-black hover:border-gold",
          "motion-safe:transition-all motion-safe:duration-300"
        )}
      >
        {t("getStarted")}
      </Button>
    </div>
  );
}

/* ─── Drawer Panel ────────────────────────────────────────────────────────── */
function Drawer({
  open,
  onClose,
  Links,
  activeSection,
  toggleLocale,
  locale,
  t,
}: {
  open: boolean;
  onClose: () => void;
  Links: NavLink[];
  activeSection: string;
  toggleLocale: () => void;
  locale: string;
  t: ReturnType<typeof useTranslations>;
}) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Navigation menu"
      className={cn(
        // positioning & size
        "fixed top-0 right-0 bottom-0 z-50 w-72 md:hidden",
        // surface & border
        "bg-surface/95 border-l border-border",
        "supports-backdrop-filter:backdrop-blur-xl",
        // layout
        "flex flex-col",
        // slide animation
        "motion-safe:transition-transform motion-safe:duration-300 motion-safe:ease-in-out",
        open ? "translate-x-0" : "translate-x-full"
      )}
    >
      {/* Gold accent top-line */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-gold/50 to-transparent" />

      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4">
        {/* Brand mark */}
        <div className="flex items-center gap-2 text-gold">
          <Zap size={15} fill="currentColor" strokeWidth={0} />
          <span className="font-display font-bold text-sm tracking-wide">ELPRESY</span>
        </div>

        {/* Close */}
        <button
          aria-label="Close navigation menu"
          onClick={onClose}
          className={cn(
            "flex items-center justify-center w-8 h-8 rounded-md",
            "text-text-muted hover:text-text-primary hover:bg-surface-2",
            "motion-safe:transition-all motion-safe:duration-200",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30"
          )}
        >
          <X size={16} strokeWidth={1.8} />
        </button>
      </div>

      {/* Divider */}
      <div className="mx-5 h-px bg-border/60" />

      {/* Scrollable body */}
      <div className="flex flex-col flex-1 overflow-y-auto px-5 py-4">
        <NavItems Links={Links} activeSection={activeSection} onClose={onClose} />
        <DrawerActions
          toggleLocale={toggleLocale}
          locale={locale}
          t={t}
          onClose={onClose}
        />
      </div>

      {/* Bottom accent line */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-gold/20 to-transparent" />
    </div>
  );
}

/* ─── Root Export ─────────────────────────────────────────────────────────── */
export default function Mobile({
  Links,
  toggleLocale,
  locale,
  t,
}: {
  Links: NavLink[];
  toggleLocale: () => void;
  locale: string;
  t: ReturnType<typeof useTranslations>;
}) {
  const [open, setOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");

  /* Lock body scroll when drawer is open */
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  /* Close on Escape key */
  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open]);

  /* IntersectionObserver — same approach as Desktop */
  useEffect(() => {
    const sectionIds = Links.map((l) => l.href.replace(/^#/, "")).filter(Boolean);
    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        }
      },
      { rootMargin: "-40% 0px -50% 0px", threshold: 0 }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [Links]);

  const handleClose = useCallback(() => setOpen(false), []);
  const handleOpen  = useCallback(() => setOpen(true),  []);

  return (
    <div className="md:hidden flex items-center">
      <Trigger onOpen={handleOpen} />
      <Overlay open={open} onClose={handleClose} />
      <Drawer
        open={open}
        onClose={handleClose}
        Links={Links}
        activeSection={activeSection}
        toggleLocale={toggleLocale}
        locale={locale}
        t={t}
      />
    </div>
  );
}