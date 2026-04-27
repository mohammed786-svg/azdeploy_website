import { showToast } from "@/lib/toast";
import { normalizeHttpError, resolveApiDbName, resolveApiOrigin } from "@/lib/api-http";
import { HQ_API_LOCAL_STORAGE_KEY, HQ_API_SESSION_STORAGE_KEY } from "@/lib/hq-session-keys";

type ApiVersion = "v1" | "v2";

type HqClientOptions = {
  /** Override API version for specific calls (default: v1). */
  apiVersion?: ApiVersion;
  /** If true, redirects to /hq/login on 401. Default false (stay on same screen). */
  redirectOn401?: boolean;
  /** Optional custom success toast for write operations. */
  successMessage?: string;
  /** Disable automatic success toast for write operations. */
  suppressSuccessToast?: boolean;
};

function normalizeApiPath(path: string, apiVersion: ApiVersion): string {
  if (/^https?:\/\//i.test(path)) return path;
  if (!path.startsWith("/")) return path;

  // Already versioned (e.g. /api/v1/* or /api/v2/*) -> keep as-is.
  if (/^\/api\/v\d+\//.test(path)) return path;

  // Unversioned API path -> prepend configured version.
  if (path.startsWith("/api/")) {
    return `/api/${apiVersion}/${path.slice("/api/".length)}`;
  }
  return path;
}

/** Client-side fetch for HQ API routes (session cookie). */
function apiUrl(path: string, options?: HqClientOptions): string {
  const apiVersion = options?.apiVersion ?? "v1";
  const normalizedPath = normalizeApiPath(path, apiVersion);
  const base = resolveApiOrigin();
  if (!base) return normalizedPath;
  if (/^https?:\/\//i.test(normalizedPath)) return normalizedPath;
  return `${base.replace(/\/$/, "")}${normalizedPath.startsWith("/") ? "" : "/"}${normalizedPath}`;
}

function isHqAuthPath(path: string, apiVersion: ApiVersion): boolean {
  const n = normalizeApiPath(path, apiVersion);
  return /\/hq\/(auth|logout)(?:\?|$)/.test(n);
}

/** Client-side fetch for HQ API routes (session cookie). */
export async function hqFetch<T>(path: string, init?: RequestInit, options?: HqClientOptions): Promise<T> {
  const dbName = resolveApiDbName();
  const apiVersion = options?.apiVersion ?? "v1";
  const method = (init?.method || "GET").toUpperCase();
  const isWrite = method !== "GET" && method !== "HEAD";
  const skipWriteSuccessToast =
    Boolean(options?.suppressSuccessToast) || isHqAuthPath(path, apiVersion);
  const isFormData = typeof FormData !== "undefined" && init?.body instanceof FormData;
  const mergedHeaders: HeadersInit = {
    "X-Database-Name": dbName,
    ...(init?.headers ?? {}),
  };
  if (!isFormData) {
    (mergedHeaders as Record<string, string>)["Content-Type"] = "application/json";
  }
  const getBearer = () => {
    if (typeof window === "undefined") return null;
    const s = window.sessionStorage.getItem(HQ_API_SESSION_STORAGE_KEY);
    if (s) return s;
    const l = window.localStorage.getItem(HQ_API_LOCAL_STORAGE_KEY);
    if (l) {
      window.sessionStorage.setItem(HQ_API_SESSION_STORAGE_KEY, l);
      return l;
    }
    return null;
  };
  const persistBearer = (token: string) => {
    if (typeof window === "undefined" || !token) return;
    window.sessionStorage.setItem(HQ_API_SESSION_STORAGE_KEY, token);
    window.localStorage.setItem(HQ_API_LOCAL_STORAGE_KEY, token);
  };

  const bearer = getBearer();
  if (bearer) {
    (mergedHeaders as Record<string, string>)["Authorization"] = `Bearer ${bearer}`;
  }
  let res = await fetch(apiUrl(path, options), {
    ...init,
    credentials: "include",
    headers: mergedHeaders,
  });

  // Auto-recover missing bearer in new tabs and retry once.
  if (!res.ok && res.status === 401 && typeof window !== "undefined") {
    try {
      const r = await fetch("/api/hq/refresh-api-token", { credentials: "include" });
      if (r.ok) {
        const j = (await r.json()) as { apiSession?: string };
        if (j.apiSession) {
          persistBearer(j.apiSession);
          const retryHeaders: HeadersInit = { ...mergedHeaders, Authorization: `Bearer ${j.apiSession}` };
          res = await fetch(apiUrl(path, options), {
            ...init,
            credentials: "include",
            headers: retryHeaders,
          });
        }
      }
    } catch {
      /* fall through with original 401 handling */
    }
  }
  const text = await res.text();
  let data: unknown = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = { error: text };
  }
  if (!res.ok) {
    if (
      options?.redirectOn401 &&
      res.status === 401 &&
      typeof window !== "undefined" &&
      window.location.pathname.startsWith("/hq") &&
      window.location.pathname !== "/hq/login"
    ) {
      window.location.assign("/hq/login");
    }
    const rawErr =
      (data as { error?: string; message?: string })?.error ??
      (data as { message?: string })?.message ??
      text ??
      res.statusText;
    const err = normalizeHttpError(res.status, rawErr);
    if (typeof window !== "undefined") showToast(err, "error");
    throw new Error(err);
  }
  if (data && typeof data === "object" && "success" in (data as Record<string, unknown>)) {
    const wrapped = data as {
      success?: boolean;
      message?: string;
      data?: unknown;
      error_code?: number;
    };
    if (!wrapped.success) {
      if (typeof window !== "undefined") showToast(wrapped.message || "Request failed", "error");
      throw new Error(wrapped.message || "Request failed");
    }
    if (isWrite && !skipWriteSuccessToast && typeof window !== "undefined") {
      showToast(options?.successMessage || "Saved successfully.", "success");
    }
    return (wrapped.data ?? {}) as T;
  }
  if (isWrite && !skipWriteSuccessToast && typeof window !== "undefined") {
    showToast(options?.successMessage || "Saved successfully.", "success");
  }
  return data as T;
}

/** Download a binary file from an HQ API route (session cookie). Does not parse JSON. */
export async function hqDownloadBlob(
  path: string,
  fallbackFilename: string,
  options?: HqClientOptions
): Promise<void> {
  const dbName = resolveApiDbName();
  const bearer =
    typeof window !== "undefined"
      ? window.sessionStorage.getItem(HQ_API_SESSION_STORAGE_KEY) || window.localStorage.getItem(HQ_API_LOCAL_STORAGE_KEY)
      : null;
  const res = await fetch(apiUrl(path, options), {
    credentials: "include",
    headers: {
      "X-Database-Name": dbName,
      ...(bearer ? { Authorization: `Bearer ${bearer}` } : {}),
    },
  });
  if (!res.ok) {
    const text = await res.text();
    let msg = text;
    try {
      const j = JSON.parse(text) as { error?: string };
      if (j?.error) msg = j.error;
    } catch {
      /* use raw text */
    }
    if (
      options?.redirectOn401 &&
      res.status === 401 &&
      typeof window !== "undefined" &&
      window.location.pathname.startsWith("/hq") &&
      window.location.pathname !== "/hq/login"
    ) {
      window.location.assign("/hq/login");
    }
    if (typeof window !== "undefined") showToast(msg || res.statusText, "error");
    throw new Error(normalizeHttpError(res.status, msg || res.statusText));
  }
  const blob = await res.blob();
  const cd = res.headers.get("Content-Disposition");
  let filename = fallbackFilename;
  const m = cd?.match(/filename\*?=(?:UTF-8''|")?([^";\n]+)/i);
  if (m?.[1]) {
    try {
      filename = decodeURIComponent(m[1].replace(/"/g, "").trim());
    } catch {
      filename = m[1].replace(/"/g, "").trim();
    }
  }
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.rel = "noopener";
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
