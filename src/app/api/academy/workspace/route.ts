import { NextRequest, NextResponse } from "next/server";

import { academyDjangoFetch } from "@/lib/academy-django";
import { requireAcademySession } from "@/lib/academy-session";

export async function GET(req: NextRequest) {
  const session = requireAcademySession(req);
  if (session instanceof NextResponse) return session;
  const courseSlug = req.nextUrl.searchParams.get("courseSlug") || "";
  if (!courseSlug) {
    return NextResponse.json({ success: false, message: "courseSlug is required", data: {} }, { status: 400 });
  }
  try {
    const data = await academyDjangoFetch<{ course: unknown; items: unknown[] }>(
      `/academy/compiler/workspace?courseSlug=${encodeURIComponent(courseSlug)}`,
      session.email
    );
    return NextResponse.json({ success: true, data });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Failed";
    const status = /not found|not enrolled/i.test(msg) ? 404 : 500;
    return NextResponse.json({ success: false, message: msg, data: {} }, { status });
  }
}
