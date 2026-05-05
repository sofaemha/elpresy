import { Network, LineChart, History, Download, Languages } from "lucide-react";
import { Card } from "@/components/ui/card";

export default function FeaturesSection() {
  return (
    <section id="features" className="py-24 bg-surface-2 relative">
      <div className="container mx-auto px-6">
        <div className="mb-16 max-w-2xl">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">
            Everything You Need to Analyze AC Energy Consumption
          </h2>
          <p className="text-lg text-text-muted">
            A comprehensive suite of tools built for rigorous academic analysis and practical energy monitoring.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[250px]">
          
          {/* Large Card - Prediction Engine */}
          <Card className="lg:col-span-2 row-span-1 bg-bg border-border/50 hover:border-gold/35 transition-all duration-300 hover:-translate-y-1 p-8 flex flex-col justify-between group overflow-hidden relative">
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-gold/10 rounded-full blur-3xl pointer-events-none group-hover:bg-gold/20 transition-all duration-500" />
            
            <div className="w-12 h-12 rounded-xl bg-surface-2 border border-border flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <Network className="text-gold" size={24} />
            </div>
            <div>
              <h3 className="text-xl font-display font-semibold text-white mb-2">CART Decision Tree Regression</h3>
              <p className="text-text-muted">
                Powered by the <span className="text-gold-light">ml-cart</span> algorithm, our prediction engine provides high-accuracy estimations based on robust machine learning models designed for continuous variables.
              </p>
            </div>
          </Card>

          {/* Medium Card - Charts */}
          <Card className="col-span-1 row-span-1 bg-bg border-border/50 hover:border-gold/35 transition-all duration-300 hover:-translate-y-1 p-8 flex flex-col justify-between group">
            <div className="w-12 h-12 rounded-xl bg-surface-2 border border-border flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <LineChart className="text-gold" size={24} />
            </div>
            <div>
              <h3 className="text-xl font-display font-semibold text-white mb-2">Charts & Visualization</h3>
              <p className="text-text-muted text-sm">
                Interactive charts that map out your predictions over time, making it easy to spot trends and anomalies.
              </p>
            </div>
          </Card>

          {/* Medium Card - History */}
          <Card className="col-span-1 row-span-1 bg-bg border-border/50 hover:border-gold/35 transition-all duration-300 hover:-translate-y-1 p-8 flex flex-col justify-between group">
            <div className="w-12 h-12 rounded-xl bg-surface-2 border border-border flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <History className="text-gold" size={24} />
            </div>
            <div>
              <h3 className="text-xl font-display font-semibold text-white mb-2">History & Log</h3>
              <p className="text-text-muted text-sm">
                Keep a detailed repository of all your past predictions. Filter, search, and review historical data with ease.
              </p>
            </div>
          </Card>

          {/* Small Card - Export */}
          <Card className="col-span-1 row-span-1 bg-bg border-border/50 hover:border-gold/35 transition-all duration-300 hover:-translate-y-1 p-8 flex flex-col justify-between group">
            <div className="w-12 h-12 rounded-xl bg-surface-2 border border-border flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <Download className="text-gold" size={24} />
            </div>
            <div>
              <h3 className="text-xl font-display font-semibold text-white mb-2">Export Data</h3>
              <p className="text-text-muted text-sm">
                Export your findings instantly to CSV and PDF formats for academic reporting and further analysis.
              </p>
            </div>
          </Card>

          {/* Small Card - Multi-lang */}
          <Card className="col-span-1 row-span-1 bg-bg border-border/50 hover:border-gold/35 transition-all duration-300 hover:-translate-y-1 p-8 flex flex-col justify-between group">
            <div className="w-12 h-12 rounded-xl bg-surface-2 border border-border flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <Languages className="text-gold" size={24} />
            </div>
            <div>
              <h3 className="text-xl font-display font-semibold text-white mb-2">Multi-language</h3>
              <p className="text-text-muted text-sm">
                Fully localized interface supporting both Indonesian (ID) and English (EN) to suit your audience.
              </p>
            </div>
          </Card>

        </div>
      </div>
    </section>
  );
}
