import { readFile } from "fs/promises";
import path from "path";
import { NextRequest, NextResponse } from "next/server";
import { isCompanyProfileToken } from "@/lib/company-profile";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ token: string }> };

const DOCS: Record<string, string> = {
  g: "gst.pdf",
  u: "udyam.pdf",
};

export async function GET(request: NextRequest, ctx: Ctx) {
  const { token } = await ctx.params;
  if (!isCompanyProfileToken(token)) {
    return new NextResponse(null, { status: 404 });
  }

  const kind = request.nextUrl.searchParams.get("k") || "";
  const fileName = DOCS[kind];
  if (!fileName) {
    return new NextResponse(null, { status: 404 });
  }

  const filePath = path.join(process.cwd(), "private", "certs", fileName);
  try {
    const buf = await readFile(filePath);
    return new NextResponse(buf, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Length": String(buf.byteLength),
        "Content-Disposition": 'inline; filename="document.pdf"',
        "Cache-Control": "no-store, no-cache, must-revalidate, private",
        "X-Content-Type-Options": "nosniff",
        "X-Robots-Tag": "noindex, nofollow, noarchive",
        "Referrer-Policy": "no-referrer",
      },
    });
  } catch {
    return new NextResponse(null, { status: 404 });
  }
}
