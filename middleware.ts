import { NextRequest, NextResponse } from "next/server";

const DOC_ROUTES = [
  { path: "/python-doc", cookie: "doc_python_access", secretEnv: "DOC_COOKIE_SECRET_PYTHON" },
  { path: "/android-doc", cookie: "doc_android_access", secretEnv: "DOC_COOKIE_SECRET_ANDROID" },
] as const;

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // HQ /hq/* auth is enforced in Server Component layouts (see requireHqSession) so HQ_COOKIE_SECRET
  // is read at request time on the Node server. Edge middleware would inline env at `next build` and
  // often miss secrets that only exist in .env.production on the VPS.

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
  matcher: ["/python-doc", "/python-doc/:path*", "/android-doc", "/android-doc/:path*"],
};
