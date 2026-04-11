/**
 * Supplier / registered office details shown on tax invoices and receipts.
 * GSTIN/PAN can be set via env when applicable.
 */
export const INVOICE_ORG = {
  legalName: process.env.NEXT_PUBLIC_INVOICE_LEGAL_NAME?.trim() || "AZ Deploy Academy",
  addressLines: [
    "Plot no. 516, Main Road, Ramteerth Nagar, Lakshmipuri Layout, Auto Nagar, Belagavi, Karnataka 590016",
    "VFF GROUP Building - First Floor",
  ],
  phones: ["+91 82965 65587", "+91 89712 44513", "+91 73383 60607"],
  state: "Karnataka",
  /** GST state code for Karnataka */
  stateCode: "29",
  placeOfSupply: "Karnataka",
  /** SAC for education / training services (verify with your CA for your supply). */
  defaultSac: process.env.NEXT_PUBLIC_INVOICE_DEFAULT_SAC?.trim() || "999293",
  gstin: process.env.NEXT_PUBLIC_INVOICE_GSTIN?.trim() || "",
  pan: process.env.NEXT_PUBLIC_INVOICE_PAN?.trim() || "",
} as const;
