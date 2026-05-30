// filepath: src/app/[locale]/(auth)/login/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/navigation";
import { signIn, useSession } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  const t = useTranslations("auth");
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { data: session, isPending } = useSession();

  useEffect(() => {
    if (!isPending && session?.user) {
      router.push("/dashboard");
    }
  }, [isPending, session, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error: signInError } = await signIn.email({
      email,
      password,
      callbackURL: "/dashboard"
    });

    if (signInError) {
      setError(t("error_invalid"));
      setLoading(false);
    } else {
      router.push("/dashboard");
    }
  };

  if (isPending || session?.user) {
    return (
      <main className="flex min-h-[100dvh] items-center justify-center bg-bg p-6">
        <div className="size-6 border-2 border-gold border-t-transparent rounded-full animate-spin" />
      </main>
    );
  }

  return (
    <main className="flex min-h-[100dvh] items-center justify-center bg-bg p-6">
      <div className="w-full max-w-md space-y-8 rounded-2xl border border-border bg-surface p-8 shadow-lg">
        <div className="space-y-2 text-center">
          <h1 className="font-display text-3xl font-bold text-foreground">
            {t("login_title")}
          </h1>
          <p className="text-xs/relaxed text-text-muted">
            {t("login_subtitle")}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="rounded-md border border-destructive/20 bg-destructive/10 p-3 text-xs/relaxed text-destructive text-center">
              {error}
            </div>
          )}
          
          <div className="space-y-2">
            <label className="text-xs font-medium text-foreground" htmlFor="email">
              {t("field_email")}
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex h-9 w-full rounded-md border border-border bg-transparent px-3 py-1 text-xs shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-xs font-medium text-foreground" htmlFor="password">
              {t("field_password")}
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="flex h-9 w-full rounded-md border border-border bg-transparent px-3 py-1 text-xs shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "..." : t("btn_login")}
          </Button>
        </form>

        <div className="text-center text-xs/relaxed text-text-muted">
          <Link href="/register" className="hover:text-primary transition-colors hover:underline underline-offset-4">
            {t("link_register")}
          </Link>
        </div>
      </div>
    </main>
  );
}
