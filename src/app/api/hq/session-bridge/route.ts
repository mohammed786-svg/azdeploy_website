import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

import { HQ_SESSION_COOKIE, HQ_SESSION_MAX_AGE_SEC } from "@/lib/hq-auth";
import { verifyHqApiToken } from "@/lib/hq-api-token";

/**
 * After Django HQ login, the browser stores apiSession in sessionStorage and POSTs here so Next.js
 * can set the httpOnly hq_session cookie for requireHqSession() (same host as the Next app).
 */
export async function POST(req: NextRequest) {
  const secret = process.env.HQ_COOKIE_SECRET?.trim();
  if (!secret) {
    return NextResponse.json({ error: "HQ_COOKIE_SECRET not configured" }, { status: 500 });
  }
  let body: { apiSession?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }
  const raw = typeof body.apiSession === "string" ? body.apiSession.trim() : "";
  if (!raw || !verifyHqApiToken(raw, secret)) {
    return NextResponse.json({ error: "Invalid or expired session" }, { status: 401 });
  }
  const jar = await cookies();
  jar.set(HQ_SESSION_COOKIE, secret, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: HQ_SESSION_MAX_AGE_SEC,
  });
  return NextResponse.json({ ok: true });
}
