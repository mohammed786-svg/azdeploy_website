import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

import { resolveApiOriginForServer } from "@/lib/api-http";
import { HQ_SESSION_COOKIE, HQ_SESSION_MAX_AGE_SEC } from "@/lib/hq-auth";

/**
 * Proxies HQ login to Django and sets the httpOnly Next.js `hq_session` cookie on success.
 * Avoids session-bridge HMAC mismatches when Django and Next load different `.env` files or whitespace.
 */
export async function POST(req: NextRequest) {
  const secret = process.env.HQ_COOKIE_SECRET?.trim();
  if (!secret) {
    return NextResponse.json(
      { success: false, message: "HQ_COOKIE_SECRET not configured", data: {} },
      { status: 500 }
    );
  }

  let body: string;
  try {
    body = await req.text();
  } catch {
    return NextResponse.json({ success: false, message: "Bad request", data: {} }, { status: 400 });
  }

  const origin = resolveApiOriginForServer();
  const url = `${origin}/api/v1/hq/auth`;

  const dbName = req.headers.get("x-database-name");
  const upstreamHeaders: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };
  if (dbName) upstreamHeaders["X-Database-Name"] = dbName;

  let upstream: Response;
  try {
    upstream = await fetch(url, {
      method: "POST",
      headers: upstreamHeaders,
      body: body || "{}",
    });
  } catch {
    return NextResponse.json(
      { success: false, message: "Cannot reach Django API. Check NEXT_PUBLIC_DJANGO_API_ORIGIN_DEV.", data: {} },
      { status: 502 }
    );
  }

  const text = await upstream.text();

  if (!upstream.ok) {
    return new NextResponse(text, {
      status: upstream.status,
      headers: { "Content-Type": upstream.headers.get("Content-Type") || "application/json" },
    });
  }

  const jar = await cookies();
  jar.set(HQ_SESSION_COOKIE, secret, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: HQ_SESSION_MAX_AGE_SEC,
  });

  return new NextResponse(text, {
    status: 200,
    headers: { "Content-Type": upstream.headers.get("Content-Type") || "application/json" },
  });
}
