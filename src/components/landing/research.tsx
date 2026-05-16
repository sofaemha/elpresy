// filepath: src/components/landing/research.tsx
import { Separator } from "@/components/ui/separator";
import Discover from "@/components/landing/section/research/discover";
import Explore from "@/components/landing/section/research/explore";

export default function Research() {
  return (
    <section id="research" className="bg-bg relative">
      {/* Discover — Tabbed bento panel */}
      <div className="mx-auto max-w-[1200px] px-6 md:px-12 lg:px-16 py-16 md:py-24">
        <Discover />
      </div>

      {/* Full-width gold divider between subsections */}
      <Separator className="bg-[rgba(201,168,76,0.15)]" />

      {/* Explore — Accordion panel */}
      <div className="mx-auto max-w-[1200px] px-6 md:px-12 lg:px-16 py-16 md:py-24">
        <Explore />
      </div>
    </section>
  );
}
