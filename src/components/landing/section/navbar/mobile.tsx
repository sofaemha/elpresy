import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Globe, Menu } from "lucide-react";

function Container({ children }: { children: React.ReactNode }) {
    return (
        <Sheet>
            <SheetTrigger className="text-text-primary hover:bg-surface-2 p-2 rounded-md inline-flex items-center justify-center transition-colors">
                <Menu size={24} />
            </SheetTrigger>
            <SheetContent side="right" className="bg-surface border-border flex flex-col gap-8 pt-16">
                {children}
            </SheetContent>
        </Sheet>
    )
}

function Items({ Links }: { Links: any[] }) {
    return (
        <nav className="flex flex-col gap-6">
            {Links.map((link) => (
                <a
                    key={link.label}
                    href={link.href}
                    className="text-lg font-medium text-text-primary hover:text-gold transition-colors"
                >
                    {link.label}
                </a>
            ))}
        </nav>
    )
}

function Actions({ toggleLocale, locale, t }: { toggleLocale: () => void, locale: string, t: any }) {
    return (
        <div className="flex flex-col gap-4 mt-auto pb-8">
            <button
                onClick={toggleLocale}
                className="flex items-center gap-2 text-text-muted hover:text-gold transition-colors"
            >
                <Globe size={20} />
                <span>{locale === "en" ? "Switch to Indonesian" : "Ganti ke Inggris"}</span>
            </button>
            <Button className="w-full bg-gold text-black hover:bg-gold-light transition-all rounded-full">
                {t("getStarted")}
            </Button>
        </div>
    )
}

export default function Mobile({ Links, toggleLocale, locale, t }: { Links: any[], toggleLocale: () => void, locale: string, t: any }) {
    return (
        <div className="md:hidden flex items-center gap-4">
            <Container>
                <Items Links={Links} />
                <Actions toggleLocale={toggleLocale} locale={locale} t={t} />
            </Container>
        </div>
    )
}