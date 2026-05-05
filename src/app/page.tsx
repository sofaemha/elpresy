import Navbar from "@/components/landing/Navbar";
import HeroSection from "@/components/landing/HeroSection";
import FeaturesSection from "@/components/landing/FeaturesSection";
import HowItWorksSection from "@/components/landing/HowItWorksSection";
import PreviewSection from "@/components/landing/PreviewSection";
import ResearchSection from "@/components/landing/ResearchSection";
import AuthorSection from "@/components/landing/AuthorSection";
import Footer from "@/components/landing/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-bg text-text-primary flex flex-col">
      <Navbar />
      
      {/* 
        Wrap sections in a container if needed or let them span full width.
        They are individually responsible for their inner containers.
      */}
      <div className="flex-1 flex flex-col">
        <HeroSection />
        <FeaturesSection />
        <HowItWorksSection />
        <PreviewSection />
        <ResearchSection />
        <AuthorSection />
      </div>

      <Footer />
    </main>
  );
}
