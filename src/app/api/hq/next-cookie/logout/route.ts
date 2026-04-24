import { NextResponse } from "next/server";

import { HQ_SESSION_COOKIE } from "@/lib/hq-auth";

/**
 * Clears the Next.js httpOnly HQ cookie only. Use this path in production: `/api/hq/logout` is served by
 * Django under the same host, so Nginx must route this URL to Next (see azdeploy.conf).
 */
export async function POST() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(HQ_SESSION_COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
  return res;
}
