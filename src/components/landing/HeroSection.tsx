import { ArrowRight, Activity, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function HeroSection() {
  return (
    <section className="relative min-h-[100dvh] flex flex-col justify-center pt-20 overflow-hidden">
      {/* Background Subtle Grid */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.03]" 
        style={{
          backgroundImage: "linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)",
          backgroundSize: "4rem 4rem"
        }}
      />
      
      <div className="container mx-auto px-6 relative z-10 grid lg:grid-cols-2 gap-12 items-center">
        {/* Left Content */}
        <div className="flex flex-col items-start max-w-[65ch]">
          <div className="h-[1px] w-12 bg-gold mb-6" />
          <Badge variant="outline" className="border-gold/30 text-gold-light bg-gold/5 mb-6 rounded-full px-4 py-1 font-medium">
            Undergraduate Thesis Project • 2025
          </Badge>
          
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-display font-bold leading-[1.1] tracking-tight mb-6 text-transparent bg-clip-text bg-gradient-to-br from-white to-zinc-500">
            Predict Your AC&apos;s Daily Ampere Usage with Precision.
          </h1>
          
          <p className="text-lg md:text-xl text-text-muted mb-10 leading-relaxed font-light">
            ELPRESY utilizes CART Decision Tree Regression to analyze your air conditioner&apos;s behavior. 
            Optimize energy consumption and track performance with enterprise-grade accuracy.
          </p>
          
          <div className="flex flex-wrap items-center gap-4">
            <Button className="bg-gold hover:bg-gold-light text-black font-semibold rounded-full px-8 py-6 h-auto text-base transition-all duration-300 group">
              Try ELPRESY 
              <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={18} />
            </Button>
            <Button variant="ghost" className="text-text-primary hover:text-gold hover:bg-gold/10 rounded-full px-8 py-6 h-auto text-base transition-all duration-300">
              Learn More
            </Button>
          </div>
        </div>
        
        {/* Right Visualization */}
        <div className="relative lg:h-[600px] flex items-center justify-center lg:justify-end">
          {/* Ambient Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-gold rounded-full blur-[120px] opacity-10 pointer-events-none" />
          
          {/* Mock UI Card */}
          <div className="relative w-full max-w-md bg-surface border border-border rounded-2xl shadow-2xl shadow-black overflow-hidden backdrop-blur-xl transition-transform duration-500 hover:-translate-y-2 group">
            <div className="p-6 border-b border-border/50 bg-surface-2/50 flex justify-between items-center">
              <div className="flex items-center gap-2 text-text-primary font-display font-medium">
                <Activity className="text-gold" size={18} />
                <span>Prediction Engine</span>
              </div>
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
                <div className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
                <div className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs text-text-muted font-medium uppercase tracking-wider">Ampere Per Cycle</label>
                  <div className="h-10 w-full bg-zinc-900 rounded-lg border border-border/50 flex items-center px-4 text-text-primary font-mono text-sm">
                    1.2 A
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs text-text-muted font-medium uppercase tracking-wider">Daily Usage Hours</label>
                  <div className="h-10 w-full bg-zinc-900 rounded-lg border border-border/50 flex items-center px-4 text-text-primary font-mono text-sm">
                    8.5 hrs
                  </div>
                </div>
              </div>
              
              <Button className="w-full bg-zinc-800 text-white hover:bg-zinc-700 transition-colors h-11 border border-border">
                Run Prediction
              </Button>
              
              <div className="pt-4 border-t border-border/50">
                <div className="flex items-end justify-between mb-2">
                  <span className="text-sm text-text-muted">Predicted Daily Usage</span>
                  <div className="flex items-center text-gold gap-1">
                    <TrendingUp size={14} />
                    <span className="text-xs font-medium">+2.4%</span>
                  </div>
                </div>
                <div className="text-4xl font-display font-bold text-white mb-4">
                  8.4<span className="text-xl text-text-muted ml-1">A</span>
                </div>
                
                {/* Mini Line Chart Mockup */}
                <div className="h-16 w-full flex items-end gap-1">
                  {[40, 60, 45, 75, 55, 85, 70, 95].map((h, i) => (
                    <div 
                      key={i} 
                      className="flex-1 bg-gold/20 rounded-t-sm group-hover:bg-gold/40 transition-colors duration-500 delay-100" 
                      style={{ height: `${h}%` }}
                    >
                      <div className="w-full h-0.5 bg-gold" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
