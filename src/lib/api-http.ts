export function resolveApiOrigin(): string {
  const explicit = process.env.NEXT_PUBLIC_DJANGO_API_ORIGIN?.trim();
  if (explicit) return explicit;

  const devMode = Number(process.env.NEXT_PUBLIC_API_DEV_MODE ?? "1");
  if (devMode === 1) {
    const configured = process.env.NEXT_PUBLIC_DJANGO_API_ORIGIN_DEV?.trim() || "http://127.0.0.1:8000";
    if (typeof window !== "undefined") {
      try {
        const u = new URL(configured);
        const browserHost = window.location.hostname;
        const isLoopback = u.hostname === "127.0.0.1" || u.hostname === "localhost";
        const browserIsLanLike = browserHost !== "127.0.0.1" && browserHost !== "localhost";
        if (isLoopback && browserIsLanLike) {
          u.hostname = browserHost;
          return u.toString().replace(/\/$/, "");
        }
      } catch {
        /* fallback */
      }
    }
    return configured;
  }
  return process.env.NEXT_PUBLIC_DJANGO_API_ORIGIN_PROD?.trim() || "https://azdeploy.com";
}

export function resolveApiDbName(): string {
  const devMode = Number(process.env.NEXT_PUBLIC_API_DEV_MODE ?? "1");
  if (devMode === 1) return process.env.NEXT_PUBLIC_API_DB_NAME_DEV?.trim() || "azdeploy_db";
  return process.env.NEXT_PUBLIC_API_DB_NAME_PROD?.trim() || "azdeploy_db";
}

export function normalizeHttpError(status: number, fallback?: string): string {
  const map: Record<number, string> = {
    400: "Bad request. Please check the form data.",
    401: "Unauthorized. Please login again.",
    403: "Access denied for this action.",
    404: "Requested API endpoint was not found.",
    409: "Conflict: duplicate or stale update detected.",
    422: "Validation failed. Please review your input.",
    429: "Too many requests. Please retry shortly.",
    500: "Internal server error. Please try again in a moment.",
    502: "Bad gateway. Server upstream error.",
    503: "Service unavailable. Please try again later.",
    504: "Gateway timeout. Server took too long to respond.",
  };
  return map[status] || fallback || `Request failed (${status}).`;
}
