import { NextResponse } from "next/server";

/** Extract HQ password from JSON body (edit/delete confirmations). */
export function getConfirmPassword(body: unknown): string {
  if (!body || typeof body !== "object") return "";
  return String((body as { confirmPassword?: string }).confirmPassword ?? "");
}

/** Returns 400/403/500 NextResponse if password missing or wrong; otherwise null. */
export function requireConfirmPassword(body: unknown): NextResponse | null {
  const p = getConfirmPassword(body);
  const expected = process.env.HQ_PASSWORD;
  if (!expected) {
    return NextResponse.json({ error: "HQ_PASSWORD not configured on server" }, { status: 500 });
  }
  if (!p) {
    return NextResponse.json({ error: "Password required (confirmPassword)" }, { status: 400 });
  }
  if (p !== expected) {
    return NextResponse.json({ error: "Invalid password" }, { status: 403 });
  }
  return null;
}
