import Link from "next/link";
import { Zap } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-bg pt-16 pb-8 border-t border-border/30">
      <div className="container mx-auto px-6">
        
        {/* Top Section */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-16">
          
          {/* Logo & Tagline */}
          <div className="flex flex-col items-center md:items-start gap-3">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="text-gold group-hover:text-gold-light transition-colors">
                <Zap size={24} fill="currentColor" />
              </div>
              <span className="font-display font-bold text-xl tracking-tight text-white">ELPRESY</span>
            </Link>
            <p className="text-text-muted text-sm font-medium">Predict. Analyze. Optimize.</p>
          </div>

          {/* Quick Links */}
          <nav className="flex flex-wrap justify-center gap-x-8 gap-y-4">
            {['Features', 'How It Works', 'Research', 'About'].map((item) => (
              <Link 
                key={item} 
                href={`#${item.toLowerCase().replace(/ /g, '-')}`}
                className="text-sm font-medium text-text-muted hover:text-gold transition-colors"
              >
                {item}
              </Link>
            ))}
            <Link 
              href="#"
              className="text-sm font-medium text-gold hover:text-gold-light transition-colors"
            >
              Get Started
            </Link>
          </nav>

          {/* Right Section (Theme Note) */}
          <div className="text-sm text-text-faint font-mono">
            Dark Mode <span className="text-gold/50">Active</span>
          </div>

        </div>

        {/* Bottom Section */}
        <div className="pt-8 border-t border-border/30 text-center flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-text-faint">
          <p>
            © 2025 ELPRESY — Electrical Predictions System.
          </p>
          <p>
            Undergraduate Thesis Project.
          </p>
        </div>

      </div>
    </footer>
  );
}
