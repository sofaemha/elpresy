"use server";

import { db } from "@/lib/db";
import { predictions } from "@/lib/db/schema";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { eq, inArray, desc, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";

async function getUserId() {
  const session = await auth.api.getSession({ headers: await headers() });
  return session?.user?.id;
}

export async function getPredictions() {
  const userId = await getUserId();
  if (!userId) throw new Error("Unauthorized");
  
  return db.query.predictions.findMany({
    where: eq(predictions.userId, userId),
    orderBy: [desc(predictions.createdAt)],
  });
}

export async function deletePrediction(id: string) {
  const userId = await getUserId();
  if (!userId) throw new Error("Unauthorized");

  await db.delete(predictions).where(
    and(
      eq(predictions.id, id),
      eq(predictions.userId, userId)
    )
  );
  revalidatePath("/history");
}

export async function deletePredictions(ids: string[]) {
  const userId = await getUserId();
  if (!userId) throw new Error("Unauthorized");
  if (ids.length === 0) return;

  await db.delete(predictions).where(
    and(
      inArray(predictions.id, ids),
      eq(predictions.userId, userId)
    )
  );
  revalidatePath("/history");
}

export async function deleteAllPredictions() {
  const userId = await getUserId();
  if (!userId) throw new Error("Unauthorized");

  await db.delete(predictions).where(eq(predictions.userId, userId));
  revalidatePath("/history");
}

export async function savePrediction(data: {
  amperePerCycle: number;
  dailyUsageHours: number;
  predictionPeriod: number;
  resultLower: number;
  resultUpper: number;
  totalAmpere: number;
  chartData: { day: number; ampere: number }[];
}) {
  const userId = await getUserId();
  if (!userId) throw new Error("Unauthorized");

  const [prediction] = await db.insert(predictions).values({
    userId,
    ...data
  }).returning();

  revalidatePath("/history");
  return prediction;
}
