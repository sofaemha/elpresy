// filepath: src/app/[locale]/(admin)/admin/page.tsx
import type { Metadata } from "next";
import { headers } from "next/headers";
import { desc, eq } from "drizzle-orm";
import { getTranslations } from "next-intl/server";
import { db } from "@/lib/db";
import { users, sessions } from "@/lib/db/schema";
import { auth } from "@/lib/auth";

import { UsersTable } from "@/components/dashboard/section/admin/users-table";

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



  // All sessions with user name
  const allSessions = await db
    .select({ session: sessions, userName: users.name })
    .from(sessions)
    .leftJoin(users, eq(sessions.userId, users.id))
    .orderBy(desc(sessions.createdAt));

  // All users
  const dbUsers = await db.select().from(users).orderBy(desc(users.createdAt));
  const now = new Date();
  const allUsers = dbUsers.map((user) => {
    const userSessions = allSessions.filter((s) => s.session.userId === user.id);
    let status = "Offline";
    if (userSessions.length > 0) {
      const latestSession = userSessions[0].session;
      if (latestSession.expiresAt > now) {
        status = "Online";
      }
    }
    return { ...user, status };
  });

  return (
    <main className="container mx-auto px-6 py-12 md:py-20 min-h-[100dvh]">
      <div className="space-y-8">
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground">{t("title")}</h1>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="min-w-0">
            <SessionsTable sessions={allSessions} />
          </div>

        </div>
        
        <div className="pt-4 min-w-0">
          <UsersTable users={allUsers} />
        </div>
      </div>
    </main>
  );
}
