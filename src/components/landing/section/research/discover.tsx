// filepath: src/components/landing/section/research/discover.tsx
"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { ChevronDown, ZoomIn, ZoomOut, Maximize2, Bookmark } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

type TabKey = "students" | "administrators" | "operators" | "engineers";

const TAB_SEEDS: Record<TabKey, string> = {
  students: "elpresy-students",
  administrators: "elpresy-admin",
  operators: "elpresy-ops",
  engineers: "elpresy-eng",
};

export default function Discover() {
  const t = useTranslations("research");

  const TABS: { value: TabKey; label: string }[] = [
    { value: "administrators", label: t("tabAdministrators") },
    { value: "operators", label: t("tabOperators") },
    { value: "engineers", label: t("tabEngineers") },
    { value: "students", label: t("tabStudents") },
  ];

  const LINKS = [t("link1"), t("link2"), t("link3")];

  return (
    <div>
      {/* Section heading */}
      <h2 className="font-display text-[2rem] md:text-[2.25rem] font-bold text-white mb-6 tracking-tight">
        {t("discoverHeading")}
      </h2>

      {/* Base UI Tabs — variant="line" for flat text-tab style */}
      <Tabs defaultValue="students" orientation="horizontal" className="w-full flex flex-col">
        <TabsList
          id="research-discover-tabs"
          variant="line"
          className="w-full justify-start gap-0 rounded-none bg-transparent p-0 h-auto border-b border-[rgba(201,168,76,0.15)] overflow-x-auto [&::-webkit-scrollbar]:hidden"
        >
          {TABS.map(({ value, label }) => (
            <TabsTrigger
              key={value}
              value={value}
              id={`research-tab-${value}`}
              className="
                flex items-center gap-1.5 rounded-none bg-transparent
                px-4 py-3 h-auto flex-none
                font-sans text-sm font-normal text-text-muted
                whitespace-nowrap cursor-pointer
                border-b-[3px] border-transparent -mb-px
                transition-colors duration-[180ms]
                hover:text-white
                data-active:border-gold data-active:text-white
                data-active:font-display data-active:font-bold
                focus-visible:outline-none
                after:hidden
              "
            >
              {label}
              <ChevronDown className="size-3.5 shrink-0" strokeWidth={2} aria-hidden="true" />
            </TabsTrigger>
          ))}
        </TabsList>

        {/* Tab panels */}
        {TABS.map(({ value }) => {
          const tab = value as TabKey;
          return (
            <TabsContent
              key={value}
              value={value}
              className="mt-0 text-base focus-visible:outline-none"
            >
              {/* Bento grid */}
              <div className="grid grid-cols-1 lg:grid-cols-[40%_60%] rounded-b-2xl overflow-hidden border-x border-b border-[rgba(201,168,76,0.15)]">

                {/* ── LEFT CARD — Gold ── */}
                <div className="flex flex-col bg-gold">
                  {/* Image block */}
                  <div className="relative h-[220px] lg:h-[260px] w-full overflow-hidden">
                    <Image
                      src={`https://picsum.photos/seed/${TAB_SEEDS[tab]}/800/520`}
                      alt={`ELPRESY ${value} interface preview`}
                      fill
                      sizes="(max-width: 1024px) 100vw, 40vw"
                      className="object-cover"
                      priority={value === "students"}
                    />
                    {/* Bottom-left icon trio */}
                    <div className="absolute bottom-3 left-3 flex items-center gap-1.5">
                      {([ZoomIn, ZoomOut, Maximize2] as const).map((Icon, i) => (
                        <button
                          key={i}
                          type="button"
                          aria-label={["Zoom in", "Zoom out", "Maximize"][i]}
                          className="flex items-center justify-center size-7 rounded-sm bg-black/60 text-white backdrop-blur-sm hover:bg-black/80 transition-colors duration-[180ms]"
                        >
                          <Icon className="size-3.5" strokeWidth={1.5} />
                        </button>
                      ))}
                    </div>
                    {/* Bottom-right save button */}
                    <button
                      type="button"
                      className="absolute bottom-3 right-3 flex items-center gap-1.5 bg-black/60 text-white backdrop-blur-sm px-2.5 py-1.5 rounded-sm text-xs font-sans font-medium hover:bg-black/80 transition-colors duration-[180ms]"
                    >
                      <Bookmark className="size-3" strokeWidth={1.5} />
                      Save to Workspace
                    </button>
                  </div>

                  {/* Text block */}
                  <div className="flex flex-col flex-1 px-7 pt-7 pb-0 lg:px-8 lg:pt-8">
                    <p className="font-display text-[1.35rem] lg:text-[1.5rem] font-bold text-[#09090B] leading-snug mb-4">
                      {t(`${tab}.cardHeading` as Parameters<typeof t>[0])}
                    </p>
                    <p className="font-sans text-sm text-[#09090B]/75 leading-relaxed flex-1">
                      {t(`${tab}.cardBody` as Parameters<typeof t>[0])}
                    </p>
                  </div>
                  {/* CTA row */}
                  <div className="mx-7 lg:mx-8 mt-6 py-4 border-t border-[#09090B]/20">
                    <a
                      href="#"
                      className="font-sans text-sm font-bold text-[#09090B] hover:underline underline-offset-2 transition-all duration-[180ms]"
                    >
                      {t("cardCta")}
                    </a>
                  </div>
                </div>

                {/* ── RIGHT COLUMN — two stacked cards ── */}
                <div className="flex flex-col lg:border-l border-[rgba(201,168,76,0.15)]">
                  {/* Card 1 — Resources (surface-2 / zinc-900) */}
                  <div className="flex-1 bg-surface-2 px-7 pt-7 pb-0 lg:px-8 lg:pt-8 border-b border-[rgba(201,168,76,0.15)]">
                    <h3 className="font-display text-[1.1rem] lg:text-[1.25rem] font-semibold text-white mb-2 tracking-tight">
                      {t(`${tab}.resourcesHeading` as Parameters<typeof t>[0])}
                    </h3>
                    <div className="flex flex-col">
                      {LINKS.map((link, idx) => (
                        <a
                          key={idx}
                          href="#"
                          className="flex items-center justify-between w-full py-4 font-sans text-[0.9375rem] font-bold text-white border-b border-[rgba(201,168,76,0.15)] last:border-b-0 -mx-2 px-2 rounded-sm hover:bg-[rgba(201,168,76,0.05)] transition-colors duration-[180ms]"
                        >
                          {link}
                          <span aria-hidden="true" className="text-gold ml-4 shrink-0">→</span>
                        </a>
                      ))}
                    </div>
                  </div>

                  {/* Card 2 — Access (zinc-800) */}
                  <div className="bg-[#27272A] px-7 py-7 lg:px-8 lg:py-8">
                    <p className="font-display text-[1.2rem] lg:text-[1.4rem] font-bold text-white leading-snug mb-3">
                      {t(`${tab}.accessHeading` as Parameters<typeof t>[0])}
                    </p>
                    <p className="font-sans text-sm text-white/80 leading-relaxed mb-5">
                      {t(`${tab}.accessBody` as Parameters<typeof t>[0])}
                    </p>
                    <a
                      href="#"
                      className="font-sans text-sm font-bold text-gold hover:underline underline-offset-2 transition-all duration-[180ms]"
                    >
                      {t("accessCta")}
                    </a>
                  </div>
                </div>
              </div>
            </TabsContent>
          );
        })}
      </Tabs>
    </div>
  );
}
