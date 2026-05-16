// filepath: src/components/landing/research.tsx
import { Separator } from "@/components/ui/separator";
import Discover from "@/components/landing/section/research/discover";
import Explore from "@/components/landing/section/research/explore";

export default function Research() {
  return (
    <section id="research" className="bg-bg relative">
      {/* Explore — Accordion panel */}
      <div className="mx-auto max-w-[1200px] px-6 md:px-12 lg:px-16 py-16">
        <Explore />
      </div>
      
      {/* Discover — Tabbed bento panel */}
      <div className="mx-auto max-w-[1200px] px-6 md:px-12 lg:px-16 py-16">
        <Discover />
      </div>

    </section>
  );
}
