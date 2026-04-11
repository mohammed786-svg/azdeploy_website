import { NextRequest, NextResponse } from "next/server";

const COOKIE = "hq_session";

/** Browser cookie max-age for HQ login (8 hours). */
export const HQ_SESSION_MAX_AGE_SEC = 60 * 60 * 8;

export function isHqSessionValid(request: NextRequest): boolean {
  const secret = process.env.HQ_COOKIE_SECRET;
  const val = request.cookies.get(COOKIE)?.value;
  return Boolean(secret && val && val === secret);
}

export function hqUnauthorized(): NextResponse {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

export function requireHqSession(request: NextRequest): NextResponse | null {
  if (!process.env.HQ_COOKIE_SECRET) {
    return NextResponse.json({ error: "HQ_COOKIE_SECRET not configured" }, { status: 500 });
  }
  if (!isHqSessionValid(request)) {
    return hqUnauthorized();
  }
  return null;
}

export { COOKIE as HQ_SESSION_COOKIE };
