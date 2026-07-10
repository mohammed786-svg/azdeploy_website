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
  phones: ["+91 82965 65587", "+91 73383 60607"],
  state: "Karnataka",
  stateCode: "29",
  placeOfSupply: "Karnataka",
  defaultSac: process.env.NEXT_PUBLIC_INVOICE_DEFAULT_SAC?.trim() || "999293",
  gstin: process.env.NEXT_PUBLIC_INVOICE_GSTIN?.trim() || "",
  pan: process.env.NEXT_PUBLIC_INVOICE_PAN?.trim() || "",
  website:
    process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/^https?:\/\//, "").replace(/\/$/, "") || "www.azdeploy.com",
} as const;

/** IT services invoices (websites, apps, AI, ERP/CRM). */
export const SERVICE_ORG = {
  legalName:
    process.env.NEXT_PUBLIC_SERVICE_LEGAL_NAME?.trim() ||
    process.env.NEXT_PUBLIC_INVOICE_LEGAL_NAME?.trim() ||
    "AZ Deploy",
  addressLines: INVOICE_ORG.addressLines,
  phones: ["+91 82965 65587"],
  state: INVOICE_ORG.state,
  stateCode: INVOICE_ORG.stateCode,
  placeOfSupply: INVOICE_ORG.placeOfSupply,
  defaultSac: process.env.NEXT_PUBLIC_SERVICE_DEFAULT_SAC?.trim() || "998314",
  gstin: INVOICE_ORG.gstin,
  pan: INVOICE_ORG.pan,
  website: INVOICE_ORG.website,
  servicesTagline: "Websites · Mobile Apps · AI Automation · ERP · CRM",
} as const;
