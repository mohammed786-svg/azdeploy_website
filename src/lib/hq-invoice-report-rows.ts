import { INVOICE_ORG } from "@/lib/invoice-org";
import { invoiceCollectedTotal, invoiceOutstandingTotal } from "@/lib/hq-financial-helpers";

function fmtIsoDate(ms: number): string {
  if (!ms) return "";
  try {
    return new Date(ms).toISOString().slice(0, 10);
  } catch {
    return "";
  }
}

/** Operational invoice row: amounts, balance, student, lines summary. */
export function toInvoiceReportRowNormal(inv: Record<string, unknown>): Record<string, unknown> {
  const id = String(inv.id ?? "");
  const createdAt = Number(inv.createdAt) || 0;
  const updatedAt = Number(inv.updatedAt) || 0;
  const lineItems = Array.isArray(inv.lineItems)
    ? (inv.lineItems as { description?: string; amount?: number }[])
    : [];
  const lineSummary = lineItems
    .map((x) => String(x.description ?? "").trim())
    .filter(Boolean)
    .join(" | ")
    .slice(0, 800);
  const subtotal = Number(inv.subtotal) || 0;
  const taxAmount = Number(inv.taxAmount) || 0;
  const total = Number(inv.total) || 0;
  const balance = invoiceOutstandingTotal(inv as Parameters<typeof invoiceOutstandingTotal>[0]);
  const collected = invoiceCollectedTotal(inv as Parameters<typeof invoiceCollectedTotal>[0]);

  return {
    id,
    invoiceNumber: inv.invoiceNumber ?? "",
    invoiceDate: fmtIsoDate(createdAt),
    studentId: inv.studentId ?? "",
    studentName: inv.studentName ?? "",
    currency: String(inv.currency ?? "INR").toUpperCase(),
    subtotal,
    taxPercent: Number(inv.taxPercent) || 0,
    taxAmount,
    total,
    status: inv.status ?? "",
    amountCollected: collected,
    balanceOutstanding: balance,
    dueDate: inv.dueDate ?? "",
    lineItemsSummary: lineSummary,
    notes: inv.notes ?? "",
    feeStructureId: inv.feeStructureId ?? "",
    createdAt,
    updatedAt,
  };
}

/**
 * CA / GST-oriented row: taxable value, CGST/SGST split (intra-state assumption),
 * invoice value, received vs balance. SAC and supplier GSTIN from org config.
 */
export function toInvoiceReportRowCa(inv: Record<string, unknown>): Record<string, unknown> {
  const createdAt = Number(inv.createdAt) || 0;
  const invoiceDate = fmtIsoDate(createdAt);
  const subtotal = Number(inv.subtotal) || 0;
  const taxPct = Number(inv.taxPercent) || 0;
  const taxAmt = Number(inv.taxAmount) || 0;
  const total = Number(inv.total) || 0;
  const balance = invoiceOutstandingTotal(inv as Parameters<typeof invoiceOutstandingTotal>[0]);
  const collected = invoiceCollectedTotal(inv as Parameters<typeof invoiceCollectedTotal>[0]);
  const hasGst = taxAmt > 0 && taxPct > 0;
  const halfRate = hasGst ? taxPct / 2 : 0;
  const halfTax = hasGst ? taxAmt / 2 : 0;

  return {
    invoiceNumber: inv.invoiceNumber ?? "",
    invoiceDate,
    partyName: inv.studentName ?? "",
    studentId: inv.studentId ?? "",
    supplyType: "B2C",
    placeOfSupply: INVOICE_ORG.placeOfSupply,
    stateCode: INVOICE_ORG.stateCode,
    sac: INVOICE_ORG.defaultSac,
    gstinSupplier: INVOICE_ORG.gstin || "",
    panSupplier: INVOICE_ORG.pan || "",
    taxableValue: subtotal,
    gstPercentTotal: taxPct,
    cgstRatePercent: hasGst ? halfRate : 0,
    sgstRatePercent: hasGst ? halfRate : 0,
    cgstAmount: hasGst ? halfTax : 0,
    sgstAmount: hasGst ? halfTax : 0,
    igstAmount: 0,
    totalTaxAmount: taxAmt,
    invoiceTotal: total,
    amountReceived: collected,
    balanceDue: balance,
    invoiceStatus: inv.status ?? "",
    currency: String(inv.currency ?? "INR").toUpperCase(),
    notes: inv.notes ?? "",
    createdAt,
  };
}
