import { NextRequest, NextResponse } from "next/server";

const DOC_ROUTES = [
  { path: "/python-doc", cookie: "doc_python_access", secretEnv: "DOC_COOKIE_SECRET_PYTHON" },
  { path: "/android-doc", cookie: "doc_android_access", secretEnv: "DOC_COOKIE_SECRET_ANDROID" },
] as const;

const HQ_COOKIE = "hq_session";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/hq")) {
    if (pathname === "/hq/login") {
      return NextResponse.next();
    }
    const secret = process.env.HQ_COOKIE_SECRET;
    const cookie = request.cookies.get(HQ_COOKIE)?.value;
    if (!secret || cookie !== secret) {
      return NextResponse.redirect(new URL("/hq/login", request.url));
    }
    return NextResponse.next();
  }

  for (const { path, cookie, secretEnv } of DOC_ROUTES) {
    if (pathname === `${path}/auth` || pathname.startsWith(`${path}/api`)) {
      return NextResponse.next();
    }
    if (pathname === path || pathname.startsWith(`${path}/`)) {
      const secret = process.env[secretEnv];
      const cookieValue = request.cookies.get(cookie)?.value;
      if (!secret || cookieValue !== secret) {
        return NextResponse.redirect(new URL(`${path}/auth`, request.url));
      }
      return NextResponse.next();
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/hq", "/hq/:path*", "/python-doc", "/python-doc/:path*", "/android-doc", "/android-doc/:path*"],
};
