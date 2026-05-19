// filepath: src/components/landing/section/navbar/desktop.tsx
"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

type NavLink = {
  label: string;
  href: string;
};

export default function Desktop({ Links }: { Links: NavLink[] }) {
  const [activeSection, setActiveSection] = useState<string>("");

  useEffect(() => {
    // Extract section IDs from anchor hrefs (e.g. "#research" → "research")
    const sectionIds = Links
      .map((link) => link.href.replace(/^#/, ""))
      .filter(Boolean);

    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    if (elements.length === 0) return;

    // Observe a ~10% window centered in the upper-middle of the viewport.
    // When a section scrolls into this window it becomes the "active" one.
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        }
      },
      { rootMargin: "-40% 0px -50% 0px", threshold: 0 }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [Links]);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    e.preventDefault();
    const target = document.getElementById(sectionId);
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <nav className="hidden md:flex items-center gap-8">
      {Links.map((link) => {
        const sectionId = link.href.replace(/^#/, "");
        const isActive = activeSection === sectionId;

        return (
          <a
            key={link.label}
            href={link.href}
            onClick={(e) => handleClick(e, sectionId)}
            aria-current={isActive ? "location" : undefined}
            className={cn(
              "text-sm font-medium motion-safe:transition-colors motion-safe:duration-300",
              isActive
                ? "text-gold"
                : "text-text-muted hover:text-text-primary"
            )}
          >
            {link.label}
          </a>
        );
      })}
    </nav>
  );
}