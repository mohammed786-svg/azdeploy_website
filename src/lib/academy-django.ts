import "server-only";

import { resolveApiDbName, resolveApiOriginForServer } from "@/lib/api-http";
import { academyServerSecret } from "@/lib/academy-session";

export async function academyDjangoFetch<T>(
  path: string,
  email: string,
  init?: RequestInit
): Promise<T> {
  const origin = resolveApiOriginForServer();
  const url = `${origin}/api/v1${path.startsWith("/") ? path : `/${path}`}`;
  const headers: Record<string, string> = {
    Accept: "application/json",
    "X-Database-Name": resolveApiDbName(),
    "X-Academy-Email": email.trim().toLowerCase(),
    "X-Academy-Server-Secret": academyServerSecret(),
    ...(init?.headers as Record<string, string> | undefined),
  };
  if (init?.body && !headers["Content-Type"]) {
    headers["Content-Type"] = "application/json";
  }
  const res = await fetch(url, { ...init, headers, cache: "no-store" });
  const text = await res.text();
  let data: unknown = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = { message: text };
  }
  if (!res.ok) {
    const msg =
      (data as { message?: string })?.message ||
      (data as { error?: string })?.error ||
      text ||
      res.statusText;
    throw new Error(msg);
  }
  if (data && typeof data === "object" && "success" in (data as Record<string, unknown>)) {
    const wrapped = data as { success?: boolean; message?: string; data?: T };
    if (!wrapped.success) throw new Error(wrapped.message || "Request failed");
    return (wrapped.data ?? ({} as T)) as T;
  }
  return data as T;
}
