import { NextRequest, NextResponse } from "next/server";
import { HQ_SESSION_COOKIE, HQ_SESSION_MAX_AGE_SEC } from "@/lib/hq-auth";


export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const email = typeof body.email === "string" ? body.email.trim() : "";
    const password = typeof body.password === "string" ? body.password : "";
    const secret = process.env.HQ_COOKIE_SECRET;
    const expectedUser = process.env.HQ_USERNAME;
    const expectedPass = process.env.HQ_PASSWORD;
    if (!secret || !expectedUser || !expectedPass) {
      return NextResponse.json({ ok: false, error: "Server not configured (HQ_* env)" }, { status: 500 });
    }
    if (email !== expectedUser || password !== expectedPass) {
      return NextResponse.json({ ok: false, error: "Invalid email or password" }, { status: 401 });
    }
    const res = NextResponse.json({ ok: true });
    res.cookies.set(HQ_SESSION_COOKIE, secret, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: HQ_SESSION_MAX_AGE_SEC,
    });
    return res;
  } catch {
    return NextResponse.json({ ok: false, error: "Bad request" }, { status: 400 });
  }
}
