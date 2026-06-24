// filepath: src/app/api/evaluate/route.ts
import { NextResponse } from "next/server";
import { evaluateModel, evaluateModelWithPrediction } from "@/lib/ml/evaluate";
import { getPredictionById } from "@/app/actions/predictions";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const predictionId = searchParams.get("predictionId");

    if (predictionId) {
      const prediction = await getPredictionById(predictionId);
      if (!prediction) {
        return NextResponse.json({ error: "Prediction not found" }, { status: 404 });
      }

      const actualValues = (prediction.chartData as { day: number; ampere: number }[]).map(d => d.ampere);
      const result = evaluateModelWithPrediction(
        prediction.amperePerCycle,
        prediction.dailyUsageHours,
        prediction.predictionPeriod,
        actualValues
      );
      return NextResponse.json(result);
    }

    // Fallback if no predictionId is provided
    const result = evaluateModel();
    return NextResponse.json(result);
  } catch (error) {
    console.error("Evaluation error:", error);
    return NextResponse.json(
      { error: "Failed to evaluate the model." },
      { status: 500 }
    );
  }
}
