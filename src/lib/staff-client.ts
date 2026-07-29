import { showToast } from "@/lib/toast";
import { normalizeHttpError, resolveApiDbName, resolveApiOrigin } from "@/lib/api-http";
import { STAFF_API_LOCAL_STORAGE_KEY, STAFF_API_SESSION_STORAGE_KEY } from "@/lib/staff-session-keys";

type StaffClientOptions = {
  redirectOn401?: boolean;
  successMessage?: string;
  suppressSuccessToast?: boolean;
};

function normalizeApiPath(path: string): string {
  if (/^https?:\/\//i.test(path)) return path;
  if (!path.startsWith("/")) return path;
  if (/^\/api\/v\d+\//.test(path)) return path;
  if (path.startsWith("/api/")) return `/api/v1/${path.slice("/api/".length)}`;
  return path;
}

function apiUrl(path: string): string {
  const normalizedPath = normalizeApiPath(path);
  const base = resolveApiOrigin();
  if (!base) return normalizedPath;
  if (/^https?:\/\//i.test(normalizedPath)) return normalizedPath;
  return `${base.replace(/\/$/, "")}${normalizedPath.startsWith("/") ? "" : "/"}${normalizedPath}`;
}

function getStaffBearer(): string {
  if (typeof window === "undefined") return "";
  return (
    window.sessionStorage.getItem(STAFF_API_SESSION_STORAGE_KEY) ||
    window.localStorage.getItem(STAFF_API_LOCAL_STORAGE_KEY) ||
    ""
  );
}

export async function staffFetch<T = unknown>(
  path: string,
  init?: RequestInit,
  options?: StaffClientOptions
): Promise<T> {
  const method = (init?.method || "GET").toUpperCase();
  const headers = new Headers(init?.headers || {});
  headers.set("Accept", "application/json");
  headers.set("X-Database-Name", resolveApiDbName());
  const bearer = getStaffBearer();
  if (bearer) headers.set("Authorization", `Bearer ${bearer}`);
  if (init?.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const res = await fetch(apiUrl(path), {
    ...init,
    method,
    headers,
    credentials: "include",
  });

  const text = await res.text();
  let data: unknown = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = null;
  }

  if (res.status === 401) {
    if (options?.redirectOn401 !== false && typeof window !== "undefined") {
      window.sessionStorage.removeItem(STAFF_API_SESSION_STORAGE_KEY);
      window.localStorage.removeItem(STAFF_API_LOCAL_STORAGE_KEY);
      if (!window.location.pathname.startsWith("/staff/login")) {
        window.location.href = "/staff/login";
      }
    }
    throw new Error("Unauthorized");
  }

  const wrapped = data as { success?: boolean; message?: string; data?: T; error?: string };
  if (!res.ok || wrapped?.success === false) {
    const msg =
      wrapped?.message ||
      wrapped?.error ||
      normalizeHttpError(res.status, text.slice(0, 120) || undefined) ||
      "Request failed";
    showToast(msg, "error");
    throw new Error(msg);
  }

  if (method !== "GET" && !options?.suppressSuccessToast) {
    showToast(options?.successMessage || wrapped?.message || "Saved", "success");
  }

  return (wrapped?.data ?? data) as T;
}
