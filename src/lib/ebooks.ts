import { resolveApiDbName, resolveApiOriginForServer } from "@/lib/api-http";

export type WorkbookStyle = "handwriting" | "drawing" | "practice" | "mixed";

export type EbookCatalogItem = {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  category: string;
  description: string;
  workbookStyle: WorkbookStyle;
  pricePaise: number;
  priceInr: number;
  currency: string;
  coverAccent: string;
  highlights: string[];
  roadmapTopics: string[];
  isPurchasable: boolean;
  hasPdf: boolean;
  delivery?: "frontend" | "file" | "preparing" | "library";
  libraryOnly?: boolean;
};

export type EbookCatalogResponse = {
  items: EbookCatalogItem[];
  defaultPriceInr: number;
};

export type CreateOrderResponse = {
  orderRef: string;
  razorpayOrderId: string;
  amountPaise: number;
  amountInr: number;
  currency: string;
  keyId: string;
  ebookTitle: string;
  prefill: {
    name: string;
    email: string;
    contact: string;
  };
};

export type VerifyOrderResponse = {
  orderRef: string;
  status: string;
  ebookSlug: string;
  ebookTitle: string;
  hasPdf: boolean;
  downloadToken?: string;
  downloadExpiresAt?: string;
  downloadReady: boolean;
  libraryReady?: boolean;
  buyerEmail?: string;
  buyerName?: string;
  amountInr?: number;
  alreadyPaid?: boolean;
  delivery?: "frontend" | "file" | "preparing" | "library";
};

export const WORKBOOK_STYLE_LABELS: Record<WorkbookStyle, string> = {
  handwriting: "Handwriting sheets",
  drawing: "Drawing & diagrams",
  practice: "Practice workbook",
  mixed: "Mixed workbook",
};

export const CATEGORY_LABELS: Record<string, string> = {
  ai: "AI & ML",
  data: "Data",
  security: "Security",
  platform: "Platform",
  mobile: "Mobile",
  web: "Web",
  fundamentals: "Fundamentals",
};

export async function fetchEbookCatalog(): Promise<EbookCatalogResponse> {
  const base = resolveApiOriginForServer();
  const dbName = resolveApiDbName();
  try {
    const res = await fetch(`${base}/api/v1/public/ebooks`, {
      headers: { "X-Database-Name": dbName },
      next: { revalidate: 300 },
    });
    if (!res.ok) return { items: [], defaultPriceInr: 2999 };
    const json = await res.json();
    return (json?.data as EbookCatalogResponse) ?? { items: [], defaultPriceInr: 2999 };
  } catch {
    return { items: [], defaultPriceInr: 2999 };
  }
}

export function formatInr(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}
