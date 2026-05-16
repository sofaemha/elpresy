import Navbar from "@/components/landing/layout/navbar";
import Hero from "@/components/landing/hero";
import Features from "@/components/landing/features";
import Workflow from "@/components/landing/workflow";
import Preview from "@/components/landing/preview";
import Research from "@/components/landing/research";
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
        <Preview />
        <Research />
        <Author />
      </div>

      <Footer />
    </main>
  );
}
