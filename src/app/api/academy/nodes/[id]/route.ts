import { NextRequest, NextResponse } from "next/server";

import { academyDjangoFetch } from "@/lib/academy-django";
import { requireAcademySession } from "@/lib/academy-session";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(req: NextRequest, { params }: Params) {
  const session = requireAcademySession(req);
  if (session instanceof NextResponse) return session;
  const { id } = await params;
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ success: false, message: "Bad request", data: {} }, { status: 400 });
  }
  try {
    const data = await academyDjangoFetch<{ item: unknown }>(
      `/academy/compiler/nodes/${encodeURIComponent(id)}`,
      session.email,
      {
        method: "PATCH",
        body: JSON.stringify(body),
      }
    );
    return NextResponse.json({ success: true, data });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Failed";
    const status = /not found/i.test(msg) ? 404 : 400;
    return NextResponse.json({ success: false, message: msg, data: {} }, { status });
  }
}

export async function DELETE(req: NextRequest, { params }: Params) {
  const session = requireAcademySession(req);
  if (session instanceof NextResponse) return session;
  const { id } = await params;
  try {
    const data = await academyDjangoFetch<{ ok: boolean }>(
      `/academy/compiler/nodes/${encodeURIComponent(id)}`,
      session.email,
      { method: "DELETE" }
    );
    return NextResponse.json({ success: true, data });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Failed";
    const status = /not found/i.test(msg) ? 404 : 400;
    return NextResponse.json({ success: false, message: msg, data: {} }, { status });
  }
}
