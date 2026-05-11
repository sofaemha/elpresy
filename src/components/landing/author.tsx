import { GitBranch, Mail } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useTranslations } from "next-intl";

export default function Author() {
  const t = useTranslations("author");

  return (
    <section id="about" className="py-32 bg-surface-2 relative overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.02]">
        <div className="w-[800px] h-[800px] rounded-full border-[100px] border-white" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-3xl mx-auto text-center flex flex-col items-center">
          
          <Badge className="bg-gold/10 text-gold border-gold/20 hover:bg-gold/20 mb-8 px-4 py-1.5 rounded-full uppercase tracking-wider text-xs font-semibold">
            {t("badge")}
          </Badge>
          
          <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-8">
            {t("heading")}
          </h2>
          
          <div className="bg-surface border border-border rounded-2xl p-8 md:p-12 w-full shadow-2xl relative group">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-[1px] bg-gradient-to-r from-transparent via-gold to-transparent opacity-50" />
            
            <h3 className="text-2xl md:text-3xl font-display font-semibold text-white mb-2">
              {t("name")}
            </h3>
            <p className="text-gold-light font-medium mb-8">
              {t("affiliation")}
            </p>
            
            <div className="text-text-muted leading-relaxed mb-10 max-w-2xl mx-auto">
              <p>
                {t("bio")}
              </p>
            </div>
            
            <div className="flex items-center justify-center gap-4">
              <a 
                href="#" 
                className="w-12 h-12 rounded-full bg-surface-2 border border-border flex items-center justify-center text-text-muted hover:text-gold hover:border-gold/50 hover:bg-gold/5 transition-all duration-300"
                aria-label="GitHub Profile"
              >
                <GitBranch size={20} />
              </a>
              <a 
                href="mailto:#" 
                className="w-12 h-12 rounded-full bg-surface-2 border border-border flex items-center justify-center text-text-muted hover:text-gold hover:border-gold/50 hover:bg-gold/5 transition-all duration-300"
                aria-label="Email Contact"
              >
                <Mail size={20} />
              </a>
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
}
