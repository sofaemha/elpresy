import Navbar from "@/components/landing/layout/navbar";
import Hero from "@/components/landing/hero";
import Features from "@/components/landing/features";
import Workflow from "@/components/landing/workflow";
import PreviewSection from "@/components/landing/PreviewSection";
import ResearchSection from "@/components/landing/ResearchSection";
import Author from "@/components/landing/author";
import Footer from "@/components/landing/layout/footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-bg text-text-primary flex flex-col">
      <Navbar />

      <div className="flex-1 flex flex-col">
        <Hero />
        <Features />
        <Workflow />
        <PreviewSection />
        <ResearchSection />
        <Author />
      </div>

      <Footer />
    </main>
  );
}
