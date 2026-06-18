// filepath: src/components/dashboard/layout/sidebar.tsx
"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { usePathname, useRouter, Link } from "@/i18n/navigation";
import {
  LayoutDashboard,
  Plus,
  Home,
  Menu,
  Zap,
  LogOut,
  ChevronRight,
  History as HistoryIcon,
  Settings as SettingsIcon,
  Shield,
  Activity,
} from "lucide-react";
import { signOut, useSession } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

interface NavItem {
  href: string;
  labelKey: string;
  icon: React.ElementType;
}

const NAV_ITEMS: NavItem[] = [
  { href: "/dashboard", labelKey: "dashboard", icon: LayoutDashboard },
  { href: "/predict", labelKey: "newPrediction", icon: Plus },
  { href: "/evaluate", labelKey: "evaluate", icon: Activity },
  { href: "/history", labelKey: "history", icon: HistoryIcon },
  { href: "/settings", labelKey: "settings", icon: SettingsIcon },
];

function NavLink({
  item,
  pathname,
  t,
  onClick,
}: {
  item: NavItem;
  pathname: string;
  t: ReturnType<typeof useTranslations>;
  onClick?: () => void;
}) {
  const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      onClick={onClick}
      className={cn(
        "group flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-all duration-200 relative",
        isActive
          ? "bg-gold/10 text-gold border border-gold/20"
          : "text-text-muted hover:bg-gold/5 hover:text-text-primary border border-transparent"
      )}
    >
      {isActive && (
        <span
          aria-hidden="true"
          className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-gold rounded-r-full"
        />
      )}
      <Icon
        size={16}
        className={cn(
          "shrink-0 transition-colors",
          isActive ? "text-gold" : "text-text-faint group-hover:text-text-muted"
        )}
        aria-hidden="true"
      />
      <span className="lg:opacity-0 lg:group-hover/sidebar:opacity-100 transition-opacity duration-300 whitespace-nowrap">{t(item.labelKey)}</span>
      {isActive && (
        <ChevronRight size={12} className="ml-auto text-gold/60 lg:opacity-0 lg:group-hover/sidebar:opacity-100 transition-opacity duration-300" aria-hidden="true" />
      )}
    </Link>
  );
}

function SidebarContent({
  t,
  pathname,
  onLogout,
  onNavClick,
  isAdmin,
}: {
  t: ReturnType<typeof useTranslations>;
  pathname: string;
  onLogout: () => void;
  onNavClick?: () => void;
  isAdmin?: boolean;
}) {
  const items = [...NAV_ITEMS];
  if (isAdmin) {
    items.push({ href: "/admin", labelKey: "admin", icon: Shield });
  }

  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-4 py-5 border-b border-border-gold">
        <Link href="/" className="flex items-center gap-2 group" aria-label="ELPRESY home">
          <Zap
            size={20}
            className="text-gold fill-gold shrink-0 transition-colors group-hover:text-gold-light group-hover:fill-gold-light"
            strokeWidth={2.5}
            aria-hidden="true"
          />
          <span className="font-display font-semibold tracking-wide text-text-primary text-base lg:opacity-0 lg:group-hover/sidebar:opacity-100 transition-opacity duration-300 whitespace-nowrap">
            ELPRESY
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1" aria-label="App navigation">
        <p className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-widest text-text-faint lg:opacity-0 lg:group-hover/sidebar:opacity-100 transition-opacity duration-300 whitespace-nowrap">
          Navigation
        </p>
        {items.map((item) => (
          <NavLink
            key={item.href}
            item={item}
            pathname={pathname}
            t={t}
            onClick={onNavClick}
          />
        ))}
      </nav>

      {/* Bottom Actions */}
      <div className="px-3 py-4 border-t border-border-gold space-y-1">
        {/* Log Out */}
        <button
          type="button"
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium text-text-muted hover:bg-red-500/10 hover:text-red-500 border border-transparent transition-all duration-200"
          aria-label="Log Out"
        >
          <LogOut size={16} className="shrink-0 text-red-500/70" aria-hidden="true" />
          <span className="lg:opacity-0 lg:group-hover/sidebar:opacity-100 transition-opacity duration-300 whitespace-nowrap">{t("logout")}</span>
        </button>

        {/* Back to landing */}
        <Link
          href="/"
          onClick={onNavClick}
          className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium text-text-muted hover:bg-gold/5 hover:text-text-primary border border-transparent transition-all duration-200"
        >
          <Home size={16} className="shrink-0 text-text-faint" aria-hidden="true" />
          <span className="lg:opacity-0 lg:group-hover/sidebar:opacity-100 transition-opacity duration-300 whitespace-nowrap">{t("backHome")}</span>
        </Link>
      </div>
    </div>
  );
}

export default function Sidebar() {
  const t = useTranslations("nav");
  const router = useRouter();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  
  const { data: session } = useSession();
  const isAdmin = (session?.user as any)?.role === "admin";

  const handleLogout = async () => {
    await signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/login");
        },
      },
    });
  };

  return (
    <>
      {/* ── Desktop sidebar (lg+) ── */}
      <aside
        aria-label="App sidebar"
        className="fixed inset-y-0 left-0 z-40 w-16 hover:w-64 transition-[width] duration-300 ease-in-out bg-surface border-r border-border-gold hidden lg:flex flex-col group/sidebar overflow-x-hidden"
      >
        <SidebarContent
          t={t}
          pathname={pathname}
          onLogout={handleLogout}
          isAdmin={isAdmin}
        />
      </aside>

      {/* ── Mobile top bar (< lg) ── */}
      <header className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-4 h-14 bg-surface/90 backdrop-blur-md border-b border-border-gold lg:hidden">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2" aria-label="ELPRESY home">
          <Zap
            size={18}
            className="text-gold fill-gold"
            strokeWidth={2.5}
            aria-hidden="true"
          />
          <span className="font-display font-semibold tracking-wide text-text-primary text-sm">
            ELPRESY
          </span>
        </Link>

        {/* Hamburger → Sheet */}
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger
            aria-label="Open navigation menu"
            className="flex items-center justify-center size-9 rounded-md border border-border-gold text-text-muted hover:text-gold hover:border-gold/30 transition-all"
          >
            <Menu size={18} aria-hidden="true" />
          </SheetTrigger>
          <SheetContent side="left" className="w-72 p-0 bg-surface border-r border-border-gold">
            <SheetHeader className="sr-only">
              <SheetTitle>Navigation menu</SheetTitle>
            </SheetHeader>
            <SidebarContent
              t={t}
              pathname={pathname}
              onLogout={() => {
                handleLogout();
                setMobileOpen(false);
              }}
              onNavClick={() => setMobileOpen(false)}
              isAdmin={isAdmin}
            />
          </SheetContent>
        </Sheet>
      </header>
    </>
  );
}
