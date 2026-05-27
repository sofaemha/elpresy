// filepath: src/app/[locale]/(admin)/admin/page.tsx
import type { Metadata } from "next";
import { headers } from "next/headers";
import { desc, eq } from "drizzle-orm";
import { getTranslations } from "next-intl/server";
import { db } from "@/lib/db";
import { users, predictions } from "@/lib/db/schema";
import { auth } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Admin Panel — ELPRESY",
};

export default async function AdminPage() {
  const t = await getTranslations("admin");
  const reqHeaders = await headers();
  const session = await auth.api.getSession({ headers: reqHeaders });

  if (session?.user.role !== "admin") {
    return <div className="p-12 text-center text-foreground">Access Denied</div>;
  }

  // All users
  const allUsers = await db.select().from(users).orderBy(desc(users.createdAt)).limit(20);

  // All predictions with user name
  const allPredictions = await db
    .select({ prediction: predictions, userName: users.name })
    .from(predictions)
    .leftJoin(users, eq(predictions.userId, users.id))
    .orderBy(desc(predictions.createdAt))
    .limit(20);

  return (
    <main className="container mx-auto px-6 py-12 md:py-20 min-h-[100dvh]">
      <div className="space-y-8">
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground">{t("title")}</h1>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-foreground">{t("tab_users")} ({allUsers.length})</h2>
            <div className="rounded-xl border border-border bg-surface overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-surface-2 text-text-muted text-xs border-b border-border">
                  <tr>
                    <th className="px-4 py-3">{t("col_name")}</th>
                    <th className="px-4 py-3">{t("col_email")}</th>
                    <th className="px-4 py-3">{t("col_role")}</th>
                    <th className="px-4 py-3">{t("col_registered")}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {allUsers.map(user => (
                    <tr key={user.id} className="text-foreground">
                      <td className="px-4 py-3">{user.name}</td>
                      <td className="px-4 py-3 text-text-muted">{user.email}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-md text-[10px] uppercase font-bold tracking-wider ${user.role === 'admin' ? 'bg-primary/20 text-primary' : 'bg-secondary text-secondary-foreground'}`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-text-muted">{user.createdAt.toISOString().split("T")[0]}</td>
                    </tr>
                  ))}
                  {allUsers.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-4 py-8 text-center text-text-muted">No users found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-bold text-foreground">{t("tab_predictions")} ({allPredictions.length})</h2>
            <div className="rounded-xl border border-border bg-surface overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-surface-2 text-text-muted text-xs border-b border-border">
                  <tr>
                    <th className="px-4 py-3">{t("col_user")}</th>
                    <th className="px-4 py-3">Inputs</th>
                    <th className="px-4 py-3">Range</th>
                    <th className="px-4 py-3">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {allPredictions.map(({ prediction, userName }) => (
                    <tr key={prediction.id} className="text-foreground">
                      <td className="px-4 py-3">{userName || "Unknown"}</td>
                      <td className="px-4 py-3 text-text-muted text-xs">
                        {prediction.amperePerCycle}A, {prediction.dailyUsageHours}h, {prediction.predictionPeriod}d
                      </td>
                      <td className="px-4 py-3 text-primary font-medium">
                        {prediction.resultLower.toFixed(1)} - {prediction.resultUpper.toFixed(1)} A
                      </td>
                      <td className="px-4 py-3 text-text-muted">
                        {prediction.createdAt.toISOString().split("T")[0]}
                      </td>
                    </tr>
                  ))}
                  {allPredictions.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-4 py-8 text-center text-text-muted">No predictions found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
