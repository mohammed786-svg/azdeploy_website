import { NextRequest, NextResponse } from "next/server";

import { academyDjangoFetch } from "@/lib/academy-django";
import { requireAcademySession } from "@/lib/academy-session";

export async function GET(req: NextRequest) {
  const session = requireAcademySession(req);
  if (session instanceof NextResponse) return session;
  try {
    const data = await academyDjangoFetch<{ item: unknown }>("/academy/compiler/me", session.email);
    return NextResponse.json({ success: true, data });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Failed";
    return NextResponse.json({ success: false, message: msg, data: {} }, { status: 500 });
  }
}
