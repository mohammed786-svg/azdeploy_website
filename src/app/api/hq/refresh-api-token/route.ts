import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { HQ_SESSION_COOKIE } from "@/lib/hq-auth";
import { makeHqApiToken } from "@/lib/hq-api-token";

/** Re-issue apiSession for Django when Next hq_session cookie is valid but sessionStorage was cleared. */
export async function GET() {
  const secret = process.env.HQ_COOKIE_SECRET?.trim();
  if (!secret) {
    return NextResponse.json({ error: "HQ_COOKIE_SECRET not configured" }, { status: 500 });
  }
  const jar = await cookies();
  if (jar.get(HQ_SESSION_COOKIE)?.value !== secret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json({ apiSession: makeHqApiToken(secret) });
}
