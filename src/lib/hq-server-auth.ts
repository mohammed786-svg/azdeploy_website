import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { HQ_SESSION_COOKIE } from "@/lib/hq-auth";

/**
 * HQ routes run in the Node server, so process.env is read at request time (after .env.production is loaded).
 * Edge middleware inlines env at `next build` time — if HQ_COOKIE_SECRET was missing during build, auth always fails there.
 */
export async function requireHqSession(): Promise<void> {
  const secret = process.env.HQ_COOKIE_SECRET?.trim();
  if (!secret) {
    redirect("/hq/login");
  }
  const cookieStore = await cookies();
  const session = cookieStore.get(HQ_SESSION_COOKIE)?.value?.trim();
  if (session !== secret) {
    redirect("/hq/login");
  }
}
