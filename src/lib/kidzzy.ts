import { resolveApiDbName, resolveApiOrigin } from "@/lib/api-http";

export type KidzzyProduct = {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  productType: "printable" | "storybook";
  description: string;
  ageMin: number;
  ageMax: number;
  ageLabel: string;
  tags: string[];
  primaryTag: string;
  pageCount: number;
  pricePaise: number;
  priceInr: number;
  currency: string;
  coverImageUrl: string;
  coverAccent: string;
  downloadCount: number;
  hasPdf: boolean;
  hasSample?: boolean;
  samplePdfUrl?: string;
  previewImages?: string[];
  isPurchasable: boolean;
};

export type KidzzyCreateOrderResponse = {
  orderRef: string;
  razorpayOrderId: string;
  amountPaise: number;
  amountInr: number;
  currency: string;
  keyId: string;
  productTitle: string;
  buyerName: string;
  buyerEmail: string;
  items?: Array<{
    productSlug: string;
    productTitle: string;
    quantity: number;
    amountInr: number;
  }>;
};

export type KidzzyPaidLineItem = {
  productId?: string;
  productSlug: string;
  productTitle: string;
  quantity: number;
  amountInr: number;
  downloadToken: string;
};

export type KidzzyVerifyOrderResponse = {
  orderRef: string;
  status: string;
  downloadToken: string;
  items?: KidzzyPaidLineItem[];
  productSlug: string;
  productTitle: string;
  buyerName: string;
  buyerEmail: string;
  amountInr: number;
  alreadyPaid?: boolean;
  buyerSession?: string;
  hasInvoice?: boolean;
  invoicePath?: string;
};

export type KidzzyOrderItem = {
  orderRef: string;
  amountInr: number;
  orderTotalInr?: number;
  currency: string;
  paidAt?: string;
  createdAt?: string;
  productSlug: string;
  productTitle: string;
  productType: string;
  quantity?: number;
  ageLabel: string;
  coverAccent: string;
  coverImageUrl: string;
  downloadToken: string;
  hasInvoice?: boolean;
  status: string;
};

const BUYER_SESSION_COOKIE = "kidzzy_buyer_session";
const BUYER_EMAIL_COOKIE = "kidzzy_buyer_email";
const SESSION_MAX_AGE_SEC = 180 * 24 * 60 * 60;

function apiBase() {
  return resolveApiOrigin().replace(/\/$/, "");
}

function setCookie(name: string, value: string, maxAge = SESSION_MAX_AGE_SEC) {
  if (typeof document === "undefined") return;
  const secure = typeof window !== "undefined" && window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${name}=${encodeURIComponent(value)}; Path=/; Max-Age=${maxAge}; SameSite=Lax${secure}`;
}

function getCookie(name: string): string {
  if (typeof document === "undefined") return "";
  const match = document.cookie.match(new RegExp(`(?:^|; )${name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : "";
}

function clearCookie(name: string) {
  if (typeof document === "undefined") return;
  document.cookie = `${name}=; Path=/; Max-Age=0; SameSite=Lax`;
}

/** Persist signed buyer session after a successful purchase. */
export function setKidzzyBuyerSession(session: string, email?: string) {
  const token = (session || "").trim();
  if (!token) return;
  setCookie(BUYER_SESSION_COOKIE, token);
  if (typeof window !== "undefined") {
    window.localStorage.setItem(BUYER_SESSION_COOKIE, token);
  }
  const em = (email || "").trim().toLowerCase();
  if (em) {
    setCookie(BUYER_EMAIL_COOKIE, em);
    if (typeof window !== "undefined") window.localStorage.setItem(BUYER_EMAIL_COOKIE, em);
  }
}

export function getKidzzyBuyerSession(): string {
  if (typeof window === "undefined") return "";
  return getCookie(BUYER_SESSION_COOKIE) || window.localStorage.getItem(BUYER_SESSION_COOKIE) || "";
}

export function getKidzzyBuyerEmail(): string {
  if (typeof window === "undefined") return "";
  return getCookie(BUYER_EMAIL_COOKIE) || window.localStorage.getItem(BUYER_EMAIL_COOKIE) || "";
}

export function clearKidzzyBuyerSession() {
  clearCookie(BUYER_SESSION_COOKIE);
  clearCookie(BUYER_EMAIL_COOKIE);
  if (typeof window !== "undefined") {
    window.localStorage.removeItem(BUYER_SESSION_COOKIE);
    window.localStorage.removeItem(BUYER_EMAIL_COOKIE);
    window.localStorage.removeItem("kidzzy_email");
  }
}

/** Resolve /media/... paths against Django origin for thumbnails & samples. */
export function kidzzyMediaUrl(path: string | undefined | null): string {
  const raw = (path || "").trim();
  if (!raw) return "";
  if (/^https?:\/\//i.test(raw)) return raw;
  if (raw.startsWith("/media/")) return `${apiBase()}${raw}`;
  if (raw.startsWith("media/")) return `${apiBase()}/${raw}`;
  return `${apiBase()}/media/${raw.replace(/^\//, "")}`;
}

export function kidzzySampleApiUrl(slug: string) {
  return `${apiBase()}/api/v1/public/kidzzy/products/${encodeURIComponent(slug)}/sample`;
}

function dbHeaders(opts?: { includeKidzzySession?: boolean }): HeadersInit {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "X-Database-Name": resolveApiDbName(),
  };
  // Prefer ?session= for cross-origin GETs so CORS preflight doesn't require
  // Access-Control-Allow-Headers: x-kidzzy-session (still send header when same-origin / allowed).
  if (opts?.includeKidzzySession !== false) {
    const session = getKidzzyBuyerSession();
    if (session) headers["X-Kidzzy-Session"] = session;
  }
  return headers;
}

export function formatInr(n: number) {
  return `₹${n.toLocaleString("en-IN")}`;
}

export function formatDownloads(n: number) {
  if (n >= 1000) return `${(n / 1000).toFixed(n >= 10000 ? 0 : 1).replace(/\.0$/, "")},000+`.replace(",000+", n >= 1000 ? `${Math.floor(n / 100) / 10}k+`.replace(".0", "") : `${n}`);
  return `${n}+`;
}

export function formatDownloadCount(n: number) {
  if (n >= 1000) {
    const k = n / 1000;
    return `${k >= 10 ? Math.round(k) : k.toFixed(1).replace(/\.0$/, "")}k+ downloads`;
  }
  return `${n}+ downloads`;
}

export async function fetchKidzzyProducts(params?: {
  type?: string;
  age?: string;
  tag?: string;
  q?: string;
}): Promise<{ items: KidzzyProduct[]; tags: string[] }> {
  const qs = new URLSearchParams();
  if (params?.type) qs.set("type", params.type);
  if (params?.age && params.age !== "all") qs.set("age", params.age);
  if (params?.tag && params.tag !== "all") qs.set("tag", params.tag);
  if (params?.q) qs.set("q", params.q);
  const res = await fetch(`${apiBase()}/api/v1/public/kidzzy/products?${qs}`, {
    headers: dbHeaders(),
    cache: "no-store",
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok || !json?.success) throw new Error(json?.message || "Failed to load products");
  return { items: json.data?.items ?? [], tags: json.data?.tags ?? [] };
}

export async function fetchKidzzyProduct(slug: string): Promise<{
  item: KidzzyProduct;
  related: KidzzyProduct[];
}> {
  const res = await fetch(`${apiBase()}/api/v1/public/kidzzy/products/${encodeURIComponent(slug)}`, {
    headers: dbHeaders(),
    cache: "no-store",
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok || !json?.success) throw new Error(json?.message || "Product not found");
  return { item: json.data.item, related: json.data.related ?? [] };
}

export async function createKidzzyOrder(body: {
  productSlug?: string;
  quantity?: number;
  items?: Array<{ productSlug: string; quantity: number }>;
  buyerName: string;
  buyerEmail: string;
  buyerPhone?: string;
  clientKey?: string;
}): Promise<KidzzyCreateOrderResponse> {
  const res = await fetch(`${apiBase()}/api/v1/public/kidzzy/orders`, {
    method: "POST",
    headers: dbHeaders(),
    body: JSON.stringify({
      ...body,
      clientKey: body.clientKey || getKidzzyClientKey(),
    }),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok || !json?.success) throw new Error(json?.message || "Could not create order");
  return json.data as KidzzyCreateOrderResponse;
}

export async function verifyKidzzyOrder(body: {
  orderRef: string;
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
}): Promise<KidzzyVerifyOrderResponse> {
  const res = await fetch(`${apiBase()}/api/v1/public/kidzzy/orders/verify`, {
    method: "POST",
    headers: dbHeaders(),
    body: JSON.stringify(body),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok || !json?.success) throw new Error(json?.message || "Payment verification failed");
  const data = json.data as KidzzyVerifyOrderResponse;
  if (data.buyerSession) {
    setKidzzyBuyerSession(data.buyerSession, data.buyerEmail);
  }
  return data;
}

export function kidzzyDownloadUrl(token: string) {
  return `${apiBase()}/api/v1/public/kidzzy/download?token=${encodeURIComponent(token)}`;
}

export function kidzzyInvoiceUrl(orderRef: string) {
  const session = getKidzzyBuyerSession();
  const qs = new URLSearchParams({ orderRef });
  if (session) qs.set("session", session);
  return `${apiBase()}/api/v1/public/kidzzy/invoice?${qs.toString()}`;
}

export async function claimKidzzySession(downloadToken: string): Promise<{ buyerSession: string; buyerEmail: string }> {
  const res = await fetch(`${apiBase()}/api/v1/public/kidzzy/session/claim`, {
    method: "POST",
    headers: dbHeaders(),
    body: JSON.stringify({ downloadToken }),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok || !json?.success) throw new Error(json?.message || "Could not restore session");
  const data = json.data as { buyerSession: string; buyerEmail: string };
  setKidzzyBuyerSession(data.buyerSession, data.buyerEmail);
  return data;
}

/** Fetch invoice with session header (preferred over query alone). */
export async function downloadKidzzyInvoice(orderRef: string) {
  const session = getKidzzyBuyerSession();
  if (!session) throw new Error("Purchase session required to download invoice");
  const qs = new URLSearchParams({ orderRef, session });
  const res = await fetch(`${apiBase()}/api/v1/public/kidzzy/invoice?${qs.toString()}`, {
    headers: dbHeaders({ includeKidzzySession: false }),
    cache: "no-store",
  });
  if (!res.ok) {
    const json = await res.json().catch(() => ({}));
    throw new Error(json?.message || "Invoice download failed");
  }
  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `Kidzzy-Invoice-${orderRef}.pdf`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export async function fetchKidzzyMyOrders(): Promise<{ items: KidzzyOrderItem[]; email: string }> {
  const session = getKidzzyBuyerSession();
  if (!session) {
    throw new Error("NO_SESSION");
  }
  const qs = new URLSearchParams({ session });
  const res = await fetch(`${apiBase()}/api/v1/public/kidzzy/my-orders?${qs.toString()}`, {
    headers: dbHeaders({ includeKidzzySession: false }),
    cache: "no-store",
  });
  const json = await res.json().catch(() => ({}));
  if (res.status === 401) throw new Error("NO_SESSION");
  if (!res.ok || !json?.success) throw new Error(json?.message || "Failed to load orders");
  return { items: json.data?.items ?? [], email: json.data?.email || getKidzzyBuyerEmail() };
}

export async function trackKidzzyCheckoutLead(body: {
  productSlug: string;
  stage: "buy_click" | "checkout_open" | "details_filled" | "pay_click";
  buyerName?: string;
  buyerEmail?: string;
  buyerPhone?: string;
}): Promise<string> {
  let clientKey = "";
  if (typeof window !== "undefined") {
    clientKey = window.localStorage.getItem("kidzzy_client_key") || "";
    if (!clientKey) {
      clientKey = `kdz_${Math.random().toString(36).slice(2)}${Date.now().toString(36)}`;
      window.localStorage.setItem("kidzzy_client_key", clientKey);
    }
  }
  try {
    const res = await fetch(`${apiBase()}/api/v1/public/kidzzy/checkout-lead`, {
      method: "POST",
      headers: dbHeaders(),
      body: JSON.stringify({ ...body, clientKey }),
    });
    const json = await res.json().catch(() => ({}));
    if (json?.data?.clientKey && typeof window !== "undefined") {
      window.localStorage.setItem("kidzzy_client_key", json.data.clientKey);
    }
    return clientKey;
  } catch {
    return clientKey;
  }
}

export function getKidzzyClientKey(): string {
  if (typeof window === "undefined") return "";
  return window.localStorage.getItem("kidzzy_client_key") || "";
}

export const AGE_FILTERS = [
  { value: "all", label: "All" },
  { value: "3-5", label: "3-5" },
  { value: "6-8", label: "6-8" },
  { value: "9-12", label: "9-12" },
] as const;

export const DEFAULT_TAGS = [
  "All",
  "Coloring",
  "Dinosaurs",
  "Vegetables",
  "Fruits",
  "Animals",
  "Alphabet",
  "Tracing",
  "Handwriting",
  "Worksheets",
] as const;
