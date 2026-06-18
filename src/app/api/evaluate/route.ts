// filepath: src/app/api/evaluate/route.ts
import { NextResponse } from "next/server";
import { evaluateModel } from "@/lib/ml/evaluate";

export async function GET() {
  try {
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
