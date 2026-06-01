// filepath: src/app/api/predict/route.ts
import { NextRequest, NextResponse } from "next/server";
import { runPrediction } from "@/lib/ml/predict";
import { db } from "@/lib/db";
import { predictions } from "@/lib/db/schema";
import { auth } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const { amperePerCycle, dailyUsageHours, predictionPeriod } = await req.json();

  if (
    typeof amperePerCycle  !== "number" || amperePerCycle  <= 0  || amperePerCycle  > 50 ||
    typeof dailyUsageHours !== "number" || dailyUsageHours <= 0  || dailyUsageHours > 24 ||
    typeof predictionPeriod !== "number" || !Number.isInteger(predictionPeriod) ||
    predictionPeriod < 1 || predictionPeriod > 365
  ) return NextResponse.json({ error: "Invalid input" }, { status: 400 });

  const result  = runPrediction(amperePerCycle, dailyUsageHours, predictionPeriod);
  const session = await auth.api.getSession({ headers: req.headers });

  if (session?.user?.id) {
    await db.insert(predictions).values({
      userId: session.user.id,
      amperePerCycle, dailyUsageHours, predictionPeriod,
      resultLower: result.resultLower,
      resultUpper: result.resultUpper,
      totalAmpere: result.totalAmpere,
      chartData:   result.chartData,
    });
  }
  return NextResponse.json(result);
}
