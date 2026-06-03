import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { multiSession } from "better-auth/plugins";
import { db } from "./db";
import * as schema from "./db/schema";
import { eq } from "drizzle-orm";

export const auth = betterAuth({
  plugins: [multiSession()],
  databaseHooks: {
    session: {
      create: {
        after: async (session: any) => {
          await db.insert(schema.sessionLogs).values({
            session: session.id,
            token: session.token,
            expiresAt: session.expiresAt,
            ipAddress: session.ipAddress,
            userId: session.userId,
            status: "Online",
            createdAt: session.createdAt,
            updatedAt: session.updatedAt,
          });
        }
      },
      update: {
        after: async (session: any) => {
          await db.update(schema.sessionLogs)
            .set({ expiresAt: session.expiresAt, updatedAt: session.updatedAt })
            .where(eq(schema.sessionLogs.session, session.id));
        }
      },
      delete: {
        after: async (session: any) => {
          const sessionId = session?.id || session?.session?.id;
          if (sessionId) {
            await db.update(schema.sessionLogs)
              .set({ status: "Offline", updatedAt: new Date() })
              .where(eq(schema.sessionLogs.session, sessionId));
          }
        }
      }
    }
  },
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      user: schema.users,
      session: schema.sessions,
      account: schema.accounts,
      verification: schema.verifications,
    },
  }),
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: true,
        defaultValue: "user",
      },
    },
  },
  emailAndPassword: { enabled: true, minPasswordLength: 8 },
  trustedOrigins: [
    "https://elpresy.vercel.app",
    ...(process.env.BETTER_AUTH_URL ? [process.env.BETTER_AUTH_URL] : [])
  ],
});
