import crypto from "crypto";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export const ACADEMY_SESSION_COOKIE = "academy_session";
export const ACADEMY_SESSION_MAX_AGE_SEC = 60 * 60 * 12;

type AcademySessionPayload = {
  email: string;
  exp: number;
};

function secret(): string {
  const s =
    process.env.ACADEMY_COMPILER_SESSION_SECRET?.trim() ||
    process.env.HQ_COOKIE_SECRET?.trim() ||
    "";
  if (!s) throw new Error("ACADEMY_COMPILER_SESSION_SECRET not configured");
  return s;
}

export function signAcademySession(email: string): string {
  const payload: AcademySessionPayload = {
    email: email.trim().toLowerCase(),
    exp: Math.floor(Date.now() / 1000) + ACADEMY_SESSION_MAX_AGE_SEC,
  };
  const body = Buffer.from(JSON.stringify(payload), "utf8").toString("base64url");
  const sig = crypto.createHmac("sha256", secret()).update(body).digest("base64url");
  return `${body}.${sig}`;
}

export function verifyAcademySession(raw: string | undefined | null): AcademySessionPayload | null {
  if (!raw) return null;
  try {
    const [body, sig] = raw.split(".");
    if (!body || !sig) return null;
    const expected = crypto.createHmac("sha256", secret()).update(body).digest("base64url");
    const a = Buffer.from(sig);
    const b = Buffer.from(expected);
    if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;
    const payload = JSON.parse(Buffer.from(body, "base64url").toString("utf8")) as AcademySessionPayload;
    if (!payload.email || Number(payload.exp) < Math.floor(Date.now() / 1000)) return null;
    return payload;
  } catch {
    return null;
  }
}

export function academyServerSecret(): string {
  const s = process.env.ACADEMY_COMPILER_SERVER_SECRET?.trim();
  if (!s) throw new Error("ACADEMY_COMPILER_SERVER_SECRET not configured");
  return s;
}

export function academyUnauthorized(): NextResponse {
  return NextResponse.json({ success: false, message: "Unauthorized", data: {} }, { status: 401 });
}

export function requireAcademySession(request: NextRequest): { email: string } | NextResponse {
  try {
    secret();
  } catch {
    return NextResponse.json(
      { success: false, message: "Academy session secret not configured", data: {} },
      { status: 500 }
    );
  }
  const token = request.cookies.get(ACADEMY_SESSION_COOKIE)?.value;
  const payload = verifyAcademySession(token);
  if (!payload) return academyUnauthorized();
  return { email: payload.email };
}

export async function readAcademySessionFromCookies(): Promise<{ email: string } | null> {
  try {
    secret();
  } catch {
    return null;
  }
  const jar = await cookies();
  const payload = verifyAcademySession(jar.get(ACADEMY_SESSION_COOKIE)?.value);
  return payload ? { email: payload.email } : null;
}
