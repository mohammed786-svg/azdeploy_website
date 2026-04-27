import { NextRequest, NextResponse } from "next/server";
import { verifyHqApiToken } from "@/lib/hq-api-token";

const COOKIE = "hq_session";

/** Browser cookie max-age for HQ login (12 hours). */
export const HQ_SESSION_MAX_AGE_SEC = 60 * 60 * 12;

export function isHqSessionValid(request: NextRequest): boolean {
  const secret = (process.env.HQ_COOKIE_SECRET || "").trim();
  if (!secret) return false;
  const val = request.cookies.get(COOKIE)?.value;
  if (val && val === secret) return true;
  const auth = (request.headers.get("authorization") || "").trim();
  if (auth.toLowerCase().startsWith("bearer ")) {
    return verifyHqApiToken(auth.slice(7).trim(), secret);
  }
  return false;
}

export function hqUnauthorized(): NextResponse {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

export function requireHqSession(request: NextRequest): NextResponse | null {
  if (!(process.env.HQ_COOKIE_SECRET || "").trim()) {
    return NextResponse.json({ error: "HQ_COOKIE_SECRET not configured" }, { status: 500 });
  }
  if (!isHqSessionValid(request)) {
    return hqUnauthorized();
  }
  return null;
}

export { COOKIE as HQ_SESSION_COOKIE };
