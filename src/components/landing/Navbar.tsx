"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, Zap, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const NAV_LINKS = [
  { label: "Features", href: "#features" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Research", href: "#research" },
  { label: "About", href: "#about" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [lang, setLang] = useState<"ID" | "EN">("EN");

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-surface/80 backdrop-blur-md border-b border-border/50 py-3" : "bg-transparent py-5"
      }`}
    >
      <div className="container mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="text-gold group-hover:text-gold-light transition-colors">
            <Zap size={24} fill="currentColor" />
          </div>
          <span className="font-display font-bold text-xl tracking-tight">ELPRESY</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-sm font-medium text-text-muted hover:text-text-primary transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Actions (Desktop) */}
        <div className="hidden md:flex items-center gap-4">
          <button 
            onClick={() => setLang(lang === "EN" ? "ID" : "EN")}
            className="flex items-center gap-1.5 text-sm font-medium text-text-muted hover:text-gold transition-colors"
          >
            <Globe size={16} />
            <span>{lang}</span>
          </button>
          
          <Button 
            variant="outline" 
            className="border-gold text-gold hover:bg-gold hover:text-black transition-all duration-300 rounded-full px-6"
          >
            Get Started
          </Button>
        </div>

        {/* Mobile Nav */}
        <div className="md:hidden flex items-center gap-4">
          <Sheet>
            <SheetTrigger className="text-text-primary hover:bg-surface-2 p-2 rounded-md inline-flex items-center justify-center transition-colors">
              <Menu size={24} />
            </SheetTrigger>
            <SheetContent side="right" className="bg-surface border-border flex flex-col gap-8 pt-16">
              <nav className="flex flex-col gap-6">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="text-lg font-medium text-text-primary hover:text-gold transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
              
              <div className="flex flex-col gap-4 mt-auto pb-8">
                <button 
                  onClick={() => setLang(lang === "EN" ? "ID" : "EN")}
                  className="flex items-center gap-2 text-text-muted hover:text-gold transition-colors"
                >
                  <Globe size={20} />
                  <span>Language: {lang === "EN" ? "English" : "Indonesia"}</span>
                </button>
                <Button className="w-full bg-gold text-black hover:bg-gold-light transition-all rounded-full">
                  Get Started
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
