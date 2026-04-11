import { NextResponse } from "next/server";
import {
  computePublicPayload,
  getOrInitPublicStudentCountSettings,
} from "@/lib/public-student-count-rtdb";
import { utcYmd } from "@/lib/public-student-count";

export async function GET() {
  const today = utcYmd();
  try {
    const settings = await getOrInitPublicStudentCountSettings();
    if (!settings) {
      const cap = 30;
      const total = cap * 3;
      return NextResponse.json({
        count: 1,
        seatsLeft: 29,
        batchCapacity: cap,
        totalAvailableSeats: total,
        totalSeatsRemaining: total - 1,
        fallback: true,
      });
    }
    const payload = computePublicPayload(settings, today);
    return NextResponse.json({
      ...payload,
      fallback: false,
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json(
      {
        count: 1,
        seatsLeft: 29,
        batchCapacity: 30,
        totalAvailableSeats: 90,
        totalSeatsRemaining: 89,
        fallback: true,
        error: msg,
      },
      { status: 200 }
    );
  }
}
