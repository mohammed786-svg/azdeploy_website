import { NextRequest, NextResponse } from "next/server";

import { academyDjangoFetch } from "@/lib/academy-django";
import {
  ACADEMY_SESSION_COOKIE,
  ACADEMY_SESSION_MAX_AGE_SEC,
  signAcademySession,
} from "@/lib/academy-session";
import { verifyFirebaseIdToken, isFirebaseAuthAdminConfigured } from "@/lib/firebase-auth-admin";

export async function POST(req: NextRequest) {
  if (!isFirebaseAuthAdminConfigured()) {
    return NextResponse.json(
      { success: false, message: "Firebase Admin is not configured on the server.", data: {} },
      { status: 503 }
    );
  }
  let body: { idToken?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ success: false, message: "Bad request", data: {} }, { status: 400 });
  }
  const idToken = typeof body.idToken === "string" ? body.idToken.trim() : "";
  if (!idToken) {
    return NextResponse.json({ success: false, message: "Missing idToken", data: {} }, { status: 400 });
  }
  try {
    const decoded = await verifyFirebaseIdToken(idToken);
    const email = (decoded.email || "").trim().toLowerCase();
    if (!email) {
      return NextResponse.json(
        { success: false, message: "Google account must include a verified email.", data: {} },
        { status: 400 }
      );
    }
    const login = await academyDjangoFetch<{ item: { email: string; fullName: string } }>(
      "/academy/compiler/login",
      email,
      {
        method: "POST",
        body: JSON.stringify({
          firebaseUid: decoded.uid || "",
          fullName: decoded.name || "",
        }),
      }
    );
    const token = signAcademySession(email);
    const res = NextResponse.json({
      success: true,
      message: "Signed in",
      data: { item: login.item },
    });
    res.cookies.set(ACADEMY_SESSION_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: ACADEMY_SESSION_MAX_AGE_SEC,
    });
    return res;
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Login failed";
    const status = /access denied|not enrolled|contact/i.test(msg) ? 403 : 401;
    return NextResponse.json({ success: false, message: msg, data: {} }, { status });
  }
}
