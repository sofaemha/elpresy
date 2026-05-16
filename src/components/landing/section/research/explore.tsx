// filepath: src/components/landing/section/research/explore.tsx
"use client";

import { useTranslations } from "next-intl";
import { ChevronDown } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

type AccordionKey = "engine" | "dataManagement" | "analytics" | "config";

const ACCORDION_KEYS: AccordionKey[] = [
  "engine",
  "dataManagement",
  "analytics",
  "config",
];

export default function Explore() {
  const t = useTranslations("research");

  return (
    <div>
      {/* Section heading */}
      <h2 className="font-display text-[1.875rem] md:text-[2.25rem] font-bold text-white mb-6 tracking-tight">
        {t("exploreHeading")}
      </h2>

      {/* Gold divider before accordion */}
      <div className="w-full h-px bg-border-gold mb-0" />

      {/*
        Base UI Accordion:
        - defaultValue is string[] (not string)
        - openMultiple={false} for single-open behavior
        - Override default border/rounded from the component wrapper
      */}
      <Accordion
        id="research-explore-accordion"
        defaultValue={["item-engine"]}
        className="border-0 rounded-none divide-y divide-border-gold overflow-hidden"
      >
        {ACCORDION_KEYS.map((key) => (
          <AccordionItem
            key={key}
            value={`item-${key}`}
            id={`research-accordion-${key}`}
            className="border-0 bg-transparent data-open:bg-transparent"
          >
            <AccordionTrigger
              className="
                group/accordion-trigger
                flex w-full items-center justify-between
                py-5 text-left bg-transparent border-0
                font-sans text-base md:text-[1.0625rem] font-bold text-white
                hover:opacity-80 transition-opacity duration-180
                focus-visible:outline-none
                hover:no-underline
                **:data-[slot='accordion-trigger-icon']:hidden
              "
            >
              {t(`${key}.label` as Parameters<typeof t>[0])}
              {/* Custom chevron replaces the built-in Base UI icons */}
              <ChevronDown
                className="size-4 shrink-0 text-white transition-transform duration-200 group-aria-expanded/accordion-trigger:rotate-180"
                strokeWidth={2}
                aria-hidden="true"
              />
            </AccordionTrigger>

            <AccordionContent className="px-0">
              <p className="font-sans text-sm md:text-[0.9375rem] text-text-muted leading-[1.6] max-w-[520px] mb-4">
                {t(`${key}.body` as Parameters<typeof t>[0])}
              </p>
              <a
                href="#"
                className="font-sans text-sm font-bold text-gold hover:underline underline-offset-2 transition-all duration-180"
              >
                {t(`${key}.cta` as Parameters<typeof t>[0])}
              </a>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
