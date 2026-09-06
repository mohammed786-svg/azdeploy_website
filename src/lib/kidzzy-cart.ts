"use client";

/** Client-side Kidzzy cart (localStorage). Supports multiple books + quantity. */

export type KidzzyCartLine = {
  productSlug: string;
  title: string;
  priceInr: number;
  coverImageUrl?: string;
  coverAccent?: string;
  quantity: number;
};

const CART_KEY = "kidzzy_cart_v1";
const CHECKOUT_KEY = "kidzzy_checkout_items_v1";
export const KIDZZY_CART_EVENT = "kidzzy-cart-changed";

function emit() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(KIDZZY_CART_EVENT));
}

function readCart(): KidzzyCartLine[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(CART_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((x) => x && typeof x.productSlug === "string")
      .map((x) => ({
        productSlug: String(x.productSlug),
        title: String(x.title || x.productSlug),
        priceInr: Number(x.priceInr) || 0,
        coverImageUrl: x.coverImageUrl ? String(x.coverImageUrl) : "",
        coverAccent: x.coverAccent ? String(x.coverAccent) : "#3B82F6",
        quantity: Math.max(1, Math.min(20, Number(x.quantity) || 1)),
      }));
  } catch {
    return [];
  }
}

function writeCart(items: KidzzyCartLine[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(CART_KEY, JSON.stringify(items));
  emit();
}

export function getKidzzyCart(): KidzzyCartLine[] {
  return readCart();
}

export function getKidzzyCartQty(productSlug: string): number {
  const line = readCart().find((i) => i.productSlug === productSlug);
  return line?.quantity || 0;
}

export function getKidzzyCartCount(): number {
  return readCart().reduce((n, i) => n + i.quantity, 0);
}

export function getKidzzyCartTotalInr(): number {
  return readCart().reduce((n, i) => n + i.priceInr * i.quantity, 0);
}

export function addToKidzzyCart(
  line: Omit<KidzzyCartLine, "quantity"> & { quantity?: number },
): KidzzyCartLine[] {
  const qty = Math.max(1, Math.min(20, line.quantity || 1));
  const items = readCart();
  const idx = items.findIndex((i) => i.productSlug === line.productSlug);
  if (idx >= 0) {
    items[idx] = {
      ...items[idx],
      ...line,
      quantity: Math.min(20, items[idx].quantity + qty),
    };
  } else {
    items.push({
      productSlug: line.productSlug,
      title: line.title,
      priceInr: line.priceInr,
      coverImageUrl: line.coverImageUrl || "",
      coverAccent: line.coverAccent || "#3B82F6",
      quantity: qty,
    });
  }
  writeCart(items);
  return items;
}

export function setKidzzyCartQty(productSlug: string, quantity: number): KidzzyCartLine[] {
  const qty = Math.max(0, Math.min(20, quantity));
  let items = readCart();
  if (qty <= 0) {
    items = items.filter((i) => i.productSlug !== productSlug);
  } else {
    items = items.map((i) => (i.productSlug === productSlug ? { ...i, quantity: qty } : i));
  }
  writeCart(items);
  return items;
}

export function removeFromKidzzyCart(productSlug: string): KidzzyCartLine[] {
  const items = readCart().filter((i) => i.productSlug !== productSlug);
  writeCart(items);
  return items;
}

export function clearKidzzyCart() {
  writeCart([]);
}

/** Snapshot used by checkout (Buy Now or Cart checkout). */
export function setKidzzyCheckoutItems(items: KidzzyCartLine[]) {
  if (typeof window === "undefined") return;
  window.sessionStorage.setItem(CHECKOUT_KEY, JSON.stringify(items));
}

export function getKidzzyCheckoutItems(): KidzzyCartLine[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.sessionStorage.getItem(CHECKOUT_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || !parsed.length) return [];
    return parsed
      .filter((x) => x && typeof x.productSlug === "string")
      .map((x) => ({
        productSlug: String(x.productSlug),
        title: String(x.title || x.productSlug),
        priceInr: Number(x.priceInr) || 0,
        coverImageUrl: x.coverImageUrl ? String(x.coverImageUrl) : "",
        coverAccent: x.coverAccent ? String(x.coverAccent) : "#3B82F6",
        quantity: Math.max(1, Math.min(20, Number(x.quantity) || 1)),
      }));
  } catch {
    return [];
  }
}

export function clearKidzzyCheckoutItems() {
  if (typeof window === "undefined") return;
  window.sessionStorage.removeItem(CHECKOUT_KEY);
}
