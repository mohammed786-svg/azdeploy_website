import { NextRequest, NextResponse } from "next/server";

const DOC_CONFIG: Record<string, { passwordEnv: string; cookieName: string; secretEnv: string }> = {
  "python-doc": {
    passwordEnv: "DOC_PASSWORD_PYTHON",
    cookieName: "doc_python_access",
    secretEnv: "DOC_COOKIE_SECRET_PYTHON",
  },
  "android-doc": {
    passwordEnv: "DOC_PASSWORD_ANDROID",
    cookieName: "doc_android_access",
    secretEnv: "DOC_COOKIE_SECRET_ANDROID",
  },
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { doc, password } = body as { doc?: string; password?: string };
    if (!doc || typeof password !== "string") {
      return NextResponse.json({ ok: false, error: "Missing doc or password" }, { status: 400 });
    }
    const config = DOC_CONFIG[doc];
    if (!config) {
      return NextResponse.json({ ok: false, error: "Invalid doc" }, { status: 400 });
    }
    const expectedPassword = process.env[config.passwordEnv];
    const secret = process.env[config.secretEnv];
    if (!expectedPassword || !secret) {
      return NextResponse.json({ ok: false, error: "Server not configured" }, { status: 500 });
    }
    if (password !== expectedPassword) {
      return NextResponse.json({ ok: false, error: "Invalid password" }, { status: 401 });
    }
    const res = NextResponse.json({ ok: true });
    res.cookies.set(config.cookieName, secret, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });
    return res;
  } catch {
    return NextResponse.json({ ok: false, error: "Bad request" }, { status: 400 });
  }
}
