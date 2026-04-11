/** Client-side fetch for HQ API routes (session cookie). */
export async function hqFetch<T>(path: string, init?: RequestInit): Promise<T> {
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
    data = { error: text };
  }
  if (!res.ok) {
    if (
      res.status === 401 &&
      typeof window !== "undefined" &&
      window.location.pathname.startsWith("/hq") &&
      window.location.pathname !== "/hq/login"
    ) {
      window.location.assign("/hq/login");
    }
    const err = (data as { error?: string })?.error ?? text ?? res.statusText;
    throw new Error(err);
  }
  return data as T;
}

/** Download a binary file from an HQ API route (session cookie). Does not parse JSON. */
export async function hqDownloadBlob(path: string, fallbackFilename: string): Promise<void> {
  const res = await fetch(path, { credentials: "include" });
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
      res.status === 401 &&
      typeof window !== "undefined" &&
      window.location.pathname.startsWith("/hq") &&
      window.location.pathname !== "/hq/login"
    ) {
      window.location.assign("/hq/login");
    }
    throw new Error(msg || res.statusText);
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
