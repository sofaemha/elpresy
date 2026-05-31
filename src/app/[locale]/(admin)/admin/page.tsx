// filepath: src/app/[locale]/(admin)/admin/page.tsx
import type { Metadata } from "next";
import { headers } from "next/headers";
import { desc, eq } from "drizzle-orm";
import { getTranslations } from "next-intl/server";
import { db } from "@/lib/db";
import { users, predictions, sessions } from "@/lib/db/schema";
import { auth } from "@/lib/auth";

import { UsersTable } from "@/components/dashboard/section/admin/users-table";
import { PredictionsTable } from "@/components/dashboard/section/admin/predictions-table";
import { SessionsTable } from "@/components/dashboard/section/admin/sessions-table";

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
  const allUsers = await db.select().from(users).orderBy(desc(users.createdAt)).limit(50);

  // All predictions with user name
  const allPredictions = await db
    .select({ prediction: predictions, userName: users.name })
    .from(predictions)
    .leftJoin(users, eq(predictions.userId, users.id))
    .orderBy(desc(predictions.createdAt))
    .limit(50);

  // All sessions with user name
  const allSessions = await db
    .select({ session: sessions, userName: users.name })
    .from(sessions)
    .leftJoin(users, eq(sessions.userId, users.id))
    .orderBy(desc(sessions.createdAt))
    .limit(50);

  return (
    <main className="container mx-auto px-6 py-12 md:py-20 min-h-[100dvh]">
      <div className="space-y-8">
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground">{t("title")}</h1>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="min-w-0">
            <UsersTable users={allUsers} />
          </div>
          <div className="min-w-0">
            <PredictionsTable predictions={allPredictions} />
          </div>
        </div>
        
        <div className="pt-4 min-w-0">
          <SessionsTable sessions={allSessions} />
        </div>
      </div>
    </main>
  );
}
