import { showToast } from "@/lib/toast";

type AcademyOptions = {
  successMessage?: string;
  suppressSuccessToast?: boolean;
};

export async function academyFetch<T>(path: string, init?: RequestInit, options?: AcademyOptions): Promise<T> {
  const method = (init?.method || "GET").toUpperCase();
  const isWrite = method !== "GET" && method !== "HEAD";
  const res = await fetch(path, {
    ...init,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });
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
    if (typeof window !== "undefined") showToast(msg, "error");
    throw new Error(msg);
  }
  if (data && typeof data === "object" && "success" in (data as Record<string, unknown>)) {
    const wrapped = data as { success?: boolean; message?: string; data?: T };
    if (!wrapped.success) {
      if (typeof window !== "undefined") showToast(wrapped.message || "Request failed", "error");
      throw new Error(wrapped.message || "Request failed");
    }
    if (isWrite && !options?.suppressSuccessToast && typeof window !== "undefined") {
      showToast(options?.successMessage || "Saved.", "success");
    }
    return (wrapped.data ?? {}) as T;
  }
  return data as T;
}
