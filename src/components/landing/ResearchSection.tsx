import { Card } from "@/components/ui/card";

export default function ResearchSection() {
  return (
    <section id="research" className="py-24 bg-bg relative border-t border-border/30">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Text Content */}
          <div>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-6">
              The Research Behind ELPRESY
            </h2>
            <div className="space-y-6 text-lg text-text-muted font-light leading-relaxed">
              <p>
                Predicting Air Conditioner ampere usage is crucial for optimizing energy consumption in both residential and commercial environments. ELPRESY was developed to bridge the gap between complex machine learning algorithms and practical, daily energy monitoring.
              </p>
              
              <div className="space-y-3">
                <h3 className="text-white font-medium text-xl mb-4">Core Objectives:</h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <span className="text-gold mt-1">•</span>
                    <span>Predict daily AC ampere usage with high reliability based on minimal input variables.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-gold mt-1">•</span>
                    <span>Visualize consumption trends to identify inefficiencies.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-gold mt-1">•</span>
                    <span>Provide a robust, exportable data logging system for continuous analysis.</span>
                  </li>
                </ul>
              </div>

              <div className="pt-6 border-t border-border/50">
                <p className="text-sm text-text-faint font-mono">
                  Methodology Note: Built using the CART (Classification and Regression Trees) decision tree algorithm via the <span className="text-gold/80">ml-cart</span> library, specifically tuned for regression on continuous variables.
                </p>
              </div>
            </div>
          </div>

          {/* Right Highlights Card */}
          <div className="relative">
            {/* Background Accent */}
            <div className="absolute inset-0 bg-gold/5 transform rotate-3 rounded-3xl" />
            
            <Card className="relative bg-surface border-gold/20 p-8 md:p-10 rounded-3xl shadow-2xl backdrop-blur-sm">
              <h3 className="text-2xl font-display font-semibold text-white mb-8 border-b border-border/50 pb-4">
                Research Highlights
              </h3>
              
              <div className="space-y-8">
                <div>
                  <div className="text-sm text-text-muted uppercase tracking-wider mb-1 font-medium">Algorithm</div>
                  <div className="text-xl text-white font-medium">CART Decision Tree Regression</div>
                </div>
                
                <div>
                  <div className="text-sm text-text-muted uppercase tracking-wider mb-1 font-medium">Input Variables</div>
                  <div className="text-xl text-white font-medium flex items-center gap-3">
                    <span className="bg-surface-2 px-3 py-1 rounded-md border border-border/50">Ampere/Cycle</span>
                    <span className="text-gold">+</span>
                    <span className="bg-surface-2 px-3 py-1 rounded-md border border-border/50">Usage Hours</span>
                  </div>
                </div>

                <div>
                  <div className="text-sm text-text-muted uppercase tracking-wider mb-1 font-medium">Output</div>
                  <div className="text-xl text-white font-medium text-gold-light">Daily Ampere Prediction</div>
                </div>

                <div>
                  <div className="text-sm text-text-muted uppercase tracking-wider mb-1 font-medium">Language Support</div>
                  <div className="text-lg text-white font-medium">Indonesian (ID) & English (EN)</div>
                </div>
              </div>
            </Card>
          </div>

        </div>
      </div>
    </section>
  );
}
