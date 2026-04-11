import { NextRequest, NextResponse } from "next/server";
import { requireHqSession } from "@/lib/hq-auth";
import { isFirebaseAdminConfigured } from "@/lib/firebase-admin";
import { utcYmd, type PublicStudentCountSettings } from "@/lib/public-student-count";
import {
  computePublicPayload,
  DEFAULT_BATCH_CAPACITY,
  getOrInitPublicStudentCountSettings,
  savePublicStudentCountSettings,
} from "@/lib/public-student-count-rtdb";

function okPayload(merged: PublicStudentCountSettings, today: string) {
  const payload = computePublicPayload(merged, today);
  return {
    ok: true as const,
    today,
    displayCount: payload.count,
    seatsLeft: payload.seatsLeft,
    batchCapacity: payload.batchCapacity,
    totalAvailableSeats: payload.totalAvailableSeats,
    totalSeatsRemaining: payload.totalSeatsRemaining,
    anchorDate: merged.anchorDate,
    countAtAnchor: merged.countAtAnchor,
  };
}

export async function GET(request: NextRequest) {
  const denied = requireHqSession(request);
  if (denied) return denied;
  const today = utcYmd();
  const defaultTotal = DEFAULT_BATCH_CAPACITY * 3;
  if (!isFirebaseAdminConfigured()) {
    return NextResponse.json({
      configured: false,
      today,
      displayCount: 1,
      seatsLeft: 29,
      batchCapacity: DEFAULT_BATCH_CAPACITY,
      totalAvailableSeats: defaultTotal,
      totalSeatsRemaining: defaultTotal - 1,
      anchorDate: today,
      countAtAnchor: 1,
    });
  }
  try {
    const settings = await getOrInitPublicStudentCountSettings();
    if (!settings) {
      return NextResponse.json({ error: "Failed to load settings" }, { status: 500 });
    }
    const payload = computePublicPayload(settings, today);
    return NextResponse.json({
      configured: true,
      today,
      displayCount: payload.count,
      seatsLeft: payload.seatsLeft,
      batchCapacity: payload.batchCapacity,
      totalAvailableSeats: payload.totalAvailableSeats,
      totalSeatsRemaining: payload.totalSeatsRemaining,
      anchorDate: settings.anchorDate,
      countAtAnchor: settings.countAtAnchor,
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

type PatchBody = {
  /** Sets the number shown **today**; anchor date becomes today (UTC). Increases by 1 each calendar day after. */
  displayCountToday?: number;
  countAtAnchor?: number;
  anchorDate?: string;
  batchCapacity?: number;
  totalAvailableSeats?: number;
};

export async function PATCH(request: NextRequest) {
  const denied = requireHqSession(request);
  if (denied) return denied;
  if (!isFirebaseAdminConfigured()) {
    return NextResponse.json({ error: "Firebase not configured" }, { status: 503 });
  }
  let body: PatchBody;
  try {
    body = (await request.json()) as PatchBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const today = utcYmd();

  if (
    body.displayCountToday == null &&
    body.countAtAnchor == null &&
    body.anchorDate == null &&
    (body.batchCapacity != null || body.totalAvailableSeats != null)
  ) {
    const existing = await getOrInitPublicStudentCountSettings();
    if (!existing) {
      return NextResponse.json({ error: "Failed to load settings" }, { status: 500 });
    }
    const merged: PublicStudentCountSettings = { ...existing };
    if (body.batchCapacity != null) {
      const bc = Math.floor(Number(body.batchCapacity));
      if (!Number.isFinite(bc) || bc < 1 || bc > 10000) {
        return NextResponse.json({ error: "batchCapacity must be between 1 and 10000" }, { status: 400 });
      }
      merged.batchCapacity = bc;
    }
    if (body.totalAvailableSeats != null) {
      const ta = Math.floor(Number(body.totalAvailableSeats));
      if (!Number.isFinite(ta) || ta < 0 || ta > 100000) {
        return NextResponse.json(
          { error: "totalAvailableSeats must be between 0 and 100000" },
          { status: 400 }
        );
      }
      merged.totalAvailableSeats = ta;
    }
    try {
      await savePublicStudentCountSettings(merged);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Save failed";
      return NextResponse.json({ error: msg }, { status: 500 });
    }
    return NextResponse.json(okPayload(merged, today));
  }

  let next: PublicStudentCountSettings;

  if (body.displayCountToday != null) {
    const n = Number(body.displayCountToday);
    if (!Number.isFinite(n) || n < 0) {
      return NextResponse.json({ error: "displayCountToday must be a non-negative number" }, { status: 400 });
    }
    next = {
      anchorDate: today,
      countAtAnchor: Math.floor(n),
      batchCapacity: body.batchCapacity != null ? Math.floor(Number(body.batchCapacity)) : undefined,
      totalAvailableSeats:
        body.totalAvailableSeats != null ? Math.floor(Number(body.totalAvailableSeats)) : undefined,
    };
  } else if (body.countAtAnchor != null) {
    const ca = Math.floor(Number(body.countAtAnchor));
    if (!Number.isFinite(ca) || ca < 0) {
      return NextResponse.json({ error: "countAtAnchor must be a non-negative number" }, { status: 400 });
    }
    const ad =
      typeof body.anchorDate === "string" && /^\d{4}-\d{2}-\d{2}$/.test(body.anchorDate)
        ? body.anchorDate
        : today;
    next = {
      anchorDate: ad,
      countAtAnchor: ca,
      batchCapacity: body.batchCapacity != null ? Math.floor(Number(body.batchCapacity)) : undefined,
      totalAvailableSeats:
        body.totalAvailableSeats != null ? Math.floor(Number(body.totalAvailableSeats)) : undefined,
    };
  } else {
    return NextResponse.json(
      { error: "Send displayCountToday (recommended), countAtAnchor (+ optional anchorDate), or batch/total seat settings" },
      { status: 400 }
    );
  }

  if (next.batchCapacity != null && (next.batchCapacity < 1 || next.batchCapacity > 10000)) {
    return NextResponse.json({ error: "batchCapacity must be between 1 and 10000" }, { status: 400 });
  }
  if (next.totalAvailableSeats != null && (next.totalAvailableSeats < 0 || next.totalAvailableSeats > 100000)) {
    return NextResponse.json(
      { error: "totalAvailableSeats must be between 0 and 100000" },
      { status: 400 }
    );
  }

  const existing = await getOrInitPublicStudentCountSettings();
  const merged: PublicStudentCountSettings = {
    anchorDate: next.anchorDate,
    countAtAnchor: next.countAtAnchor,
    batchCapacity: next.batchCapacity ?? existing?.batchCapacity ?? DEFAULT_BATCH_CAPACITY,
    totalAvailableSeats: next.totalAvailableSeats ?? existing?.totalAvailableSeats,
  };

  try {
    await savePublicStudentCountSettings(merged);
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Save failed";
    return NextResponse.json({ error: msg }, { status: 500 });
  }

  return NextResponse.json(okPayload(merged, today));
}
