import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { firebaseData } from "@/lib/db/schema";

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const { current, voltage, power_watt, last_updated } = data;

    if (
      current === undefined ||
      voltage === undefined ||
      power_watt === undefined ||
      last_updated === undefined
    ) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    await db.insert(firebaseData).values({
      current: Number(current),
      voltage: Number(voltage),
      powerWatt: Number(power_watt),
      lastUpdated: Number(last_updated)
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to sync firebase data:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
