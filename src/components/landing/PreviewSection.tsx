import { CheckCircle2, ShieldCheck, Code2, LineChart as ChartIcon, Zap } from "lucide-react";

export default function PreviewSection() {
  return (
    <section className="py-24 bg-surface relative overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">
            A Research Tool Built for Precision
          </h2>
          <p className="text-lg text-text-muted">
            Experience an interface designed for academic rigor without compromising on modern usability.
          </p>
        </div>

        {/* Mockup Frame */}
        <div className="relative max-w-5xl mx-auto">
          {/* Glow Effect */}
          <div className="absolute inset-0 bg-gold/5 blur-[100px] rounded-[3rem]" />
          
          <div className="relative rounded-2xl border border-border/50 bg-[#0c0c0e] shadow-2xl overflow-hidden ring-1 ring-white/10">
            {/* Browser Header */}
            <div className="h-12 bg-surface-2 border-b border-border/50 flex items-center px-4 gap-4">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <div className="w-3 h-3 rounded-full bg-green-500/80" />
              </div>
              <div className="flex-1 flex justify-center">
                <div className="w-64 h-6 bg-black/50 rounded-md border border-border/30 flex items-center justify-center text-[10px] text-text-muted font-mono">
                  elpresy.app/dashboard
                </div>
              </div>
            </div>

            {/* App Content */}
            <div className="flex h-[500px]">
              {/* Sidebar */}
              <div className="w-48 border-r border-border/50 bg-surface-2/30 p-4 hidden md:flex flex-col gap-2">
                <div className="flex items-center gap-2 text-gold font-display font-bold text-lg mb-6 px-2">
                  <Zap size={18} fill="currentColor" /> ELPRESY
                </div>
                {['Dashboard', 'Predictions', 'History', 'Settings'].map((item, i) => (
                  <div key={item} className={`px-3 py-2 rounded-md text-sm font-medium ${i === 0 ? 'bg-gold/10 text-gold' : 'text-text-muted hover:bg-surface-2'}`}>
                    {item}
                  </div>
                ))}
              </div>

              {/* Main Area */}
              <div className="flex-1 p-6 lg:p-8 overflow-hidden flex flex-col gap-6 bg-[url('/noise.png')] bg-repeat opacity-90 mix-blend-overlay pointer-events-none absolute inset-0 z-0" />
              
              <div className="flex-1 p-6 lg:p-8 flex flex-col gap-6 relative z-10">
                {/* Top Stats */}
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { label: "Total Predictions", value: "1,248" },
                    { label: "Latest Ampere", value: "8.4 A" },
                    { label: "Average Daily", value: "7.9 A" },
                  ].map((stat, i) => (
                    <div key={i} className="bg-surface-2/80 backdrop-blur-sm border border-border/50 rounded-xl p-4">
                      <div className="text-xs text-text-muted mb-1">{stat.label}</div>
                      <div className="text-2xl font-display font-semibold text-white">{stat.value}</div>
                    </div>
                  ))}
                </div>

                {/* Chart Area */}
                <div className="flex-1 bg-surface-2/80 backdrop-blur-sm border border-border/50 rounded-xl p-6 flex flex-col">
                  <div className="flex justify-between items-center mb-6">
                    <div className="font-medium text-white flex items-center gap-2">
                      <ChartIcon size={16} className="text-gold" /> Usage Trends
                    </div>
                  </div>
                  <div className="flex-1 border-b border-l border-border/50 relative flex items-end pt-4 pr-4">
                    {/* Mock Chart Lines */}
                    <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
                      <path d="M0,80 Q10,70 20,75 T40,60 T60,40 T80,50 T100,20" fill="none" stroke="currentColor" className="text-gold" strokeWidth="2" />
                      <path d="M0,80 Q10,70 20,75 T40,60 T60,40 T80,50 T100,20 L100,100 L0,100 Z" fill="url(#goldGradient)" opacity="0.1" />
                      <defs>
                        <linearGradient id="goldGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#C9A84C" />
                          <stop offset="100%" stopColor="transparent" />
                        </linearGradient>
                      </defs>
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Proof Points */}
        <div className="mt-12 flex flex-wrap justify-center gap-8 text-sm font-medium text-text-muted">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={16} className="text-gold" />
            <span>Open Source</span>
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck size={16} className="text-gold" />
            <span>Thesis-Grade Accuracy</span>
          </div>
          <div className="flex items-center gap-2">
            <Code2 size={16} className="text-gold" />
            <span>Built with Next.js 15</span>
          </div>
        </div>
      </div>
    </section>
  );
}
