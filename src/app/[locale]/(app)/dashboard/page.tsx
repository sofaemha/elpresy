// filepath: src/app/[locale]/(app)/dashboard/page.tsx
import type { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "@/i18n/navigation";
import { getLocale } from "next-intl/server";
import { eq, desc } from "drizzle-orm";
import DashboardShell from "@/components/dashboard/dashboard";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Dashboard — ELPRESY",
  description:
    "View your AC ampere prediction history, trend chart, and key metrics.",
};

export default async function DashboardPage() {
  const reqHeaders = await headers();
  const session = await auth.api.getSession({ headers: reqHeaders });
  
  if (!session) {
    const locale = await getLocale();
    return redirect({ href: "/login", locale });
  }

  return <DashboardShell />;
}
