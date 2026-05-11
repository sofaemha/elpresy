import { Zap } from "lucide-react";
import { Link } from "@/i18n/navigation";

export default function Logo() {
    return (
        <Link href="/" className="flex items-center gap-2 group">
            <div className="text-gold group-hover:text-gold-light transition-colors">
                <Zap size={24} fill="currentColor" />
            </div>
            <span className="font-display font-bold text-xl tracking-tight">ELPRESY</span>
        </Link>
    )
}