// filepath: src/lib/db/seed-admin.ts
import { db } from "./index";
import { users } from "./schema";
import { eq } from "drizzle-orm";

async function seedAdmin() {
  const adminEmail = "admin@elpresy.com"; // change before running
  await db.update(users).set({ role: "admin" }).where(eq(users.email, adminEmail));
  console.log(`Admin role assigned to: ${adminEmail}`);
  process.exit(0);
}
seedAdmin();
