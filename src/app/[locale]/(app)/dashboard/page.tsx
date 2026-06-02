// filepath: src/app/[locale]/(app)/dashboard/page.tsx
import type { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "@/i18n/navigation";
import { getLocale } from "next-intl/server";
import { eq, desc } from "drizzle-orm";
import DashboardShell from "@/components/dashboard/dashboard";
import { db } from "@/lib/db";
import { predictions } from "@/lib/db/schema";
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

  const userPredictions = await db
    .select()
    .from(predictions)
    .where(eq(predictions.userId, session.user.id))
    .orderBy(desc(predictions.createdAt));

  // Convert Date objects to strings for the client component
  const formattedPredictions = userPredictions.map(p => ({
    id: p.id,
    amperePerCycle: p.amperePerCycle,
    dailyUsageHours: p.dailyUsageHours,
    predictionPeriod: p.predictionPeriod,
    resultLower: p.resultLower,
    resultUpper: p.resultUpper,
    totalAmpere: p.totalAmpere,
    chartData: p.chartData,
    createdAt: p.createdAt.toISOString(),
  }));

  return <DashboardShell predictions={formattedPredictions} />;
}
