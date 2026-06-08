import { NextRequest, NextResponse } from "next/server";

import { academyDjangoFetch } from "@/lib/academy-django";
import { requireAcademySession } from "@/lib/academy-session";

export async function POST(req: NextRequest) {
  const session = requireAcademySession(req);
  if (session instanceof NextResponse) return session;
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ success: false, message: "Bad request", data: {} }, { status: 400 });
  }
  try {
    const data = await academyDjangoFetch<{ item: unknown }>(
      "/academy/compiler/nodes/create",
      session.email,
      {
        method: "POST",
        body: JSON.stringify(body),
      }
    );
    return NextResponse.json({ success: true, data });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Failed";
    const status = /not found|not enrolled|invalid/i.test(msg) ? 400 : 500;
    return NextResponse.json({ success: false, message: msg, data: {} }, { status });
  }
}
