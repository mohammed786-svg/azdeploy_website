/** Build `/api/hq/...?page=1&search=...` query strings for list endpoints. */
export function hqListUrl(
  path: string,
  q: Record<string, string | number | boolean | undefined | null>
): string {
  const sp = new URLSearchParams();
  Object.entries(q).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== "") sp.set(k, String(v));
  });
  const qs = sp.toString();
  return qs ? `${path}?${qs}` : path;
}
