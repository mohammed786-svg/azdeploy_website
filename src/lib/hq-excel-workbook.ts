import * as XLSX from "xlsx";

/** Millisecond timestamps stored as numbers in RTDB — export as ISO for Excel. */
const ISO_NUMBER_KEYS = new Set([
  "createdAt",
  "updatedAt",
  "receivedAt",
  "enrolledAt",
  "leftAt",
  "paidAt",
  "spentAt",
]);

function serializeCell(key: string, value: unknown): string | number | boolean {
  if (value === undefined || value === null) return "";
  if (typeof value === "boolean") return value;
  if (typeof value === "number") {
    if (ISO_NUMBER_KEYS.has(key)) {
      try {
        return new Date(value).toISOString();
      } catch {
        return value;
      }
    }
    return value;
  }
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
}

function orderedKeys(rows: Record<string, unknown>[], preferred: string[]): string[] {
  const present = new Set<string>();
  for (const r of rows) {
    for (const k of Object.keys(r)) present.add(k);
  }
  if (present.size === 0) return [...preferred];
  const head = preferred.filter((k) => present.has(k));
  const tail = [...present].filter((k) => !head.includes(k)).sort();
  return [...head, ...tail];
}

function toSheetRows(rows: Record<string, unknown>[], preferred: string[]): Record<string, string | number | boolean>[] {
  if (rows.length === 0) return [];
  const keys = orderedKeys(rows, preferred);
  return rows.map((r) => {
    const out: Record<string, string | number | boolean> = {};
    for (const k of keys) {
      out[k] = serializeCell(k, r[k]);
    }
    return out;
  });
}

export function appendHqSheet(
  wb: XLSX.WorkBook,
  sheetName: string,
  rawRows: Record<string, unknown>[],
  preferredColumns: string[]
) {
  const safeName = sheetName.slice(0, 31);
  const data = toSheetRows(rawRows, preferredColumns);
  let ws: XLSX.WorkSheet;
  if (data.length === 0) {
    const keys = orderedKeys(rawRows, preferredColumns);
    ws = XLSX.utils.aoa_to_sheet([keys]);
  } else {
    ws = XLSX.utils.json_to_sheet(data);
  }
  XLSX.utils.book_append_sheet(wb, ws, safeName);
}

const PREFERRED = {
  students: [
    "id",
    "serial",
    "fullName",
    "email",
    "phone",
    "gender",
    "degree",
    "college",
    "passoutYear",
    "city",
    "status",
    "currentBatchId",
    "currentBatchName",
    "feeStructureId",
    "enquiryId",
    "createdAt",
    "updatedAt",
    "batchHistory",
  ],
  invoices: [
    "id",
    "invoiceNumber",
    "studentId",
    "studentName",
    "subtotal",
    "taxPercent",
    "taxAmount",
    "total",
    "currency",
    "status",
    "dueDate",
    "feeStructureId",
    "notes",
    "lineItems",
    "installments",
    "createdAt",
    "updatedAt",
  ],
  receipts: [
    "id",
    "receiptNumber",
    "studentId",
    "studentName",
    "amount",
    "currency",
    "purpose",
    "paymentMethod",
    "invoiceId",
    "installmentId",
    "notes",
    "receivedAt",
    "createdAt",
  ],
  onboarding: [
    "id",
    "fullName",
    "email",
    "phone",
    "gender",
    "batchId",
    "feeStructureId",
    "degree",
    "college",
    "notes",
    "status",
    "studentId",
    "createdAt",
    "updatedAt",
  ],
  enquiries: [
    "id",
    "fullName",
    "email",
    "phone",
    "degree",
    "degreeOther",
    "college",
    "passoutYear",
    "city",
    "preferredBatch",
    "message",
    "createdAt",
  ],
  batches: [
    "id",
    "name",
    "code",
    "startDate",
    "endDate",
    "capacity",
    "notes",
    "createdAt",
    "updatedAt",
  ],
  feeStructures: ["id", "name", "code", "description", "currency", "totalAmount", "installments", "createdAt", "updatedAt"],
  expenses: [
    "id",
    "expenseNumber",
    "title",
    "amount",
    "currency",
    "category",
    "vendor",
    "notes",
    "spentAt",
    "createdAt",
    "updatedAt",
  ],
  reportSummary: ["metric", "value"],
  feesPending: ["invoiceId", "invoiceNumber", "studentName", "installmentLabel", "dueDate", "outstanding", "currency"],
  invoicesNormal: [
    "id",
    "invoiceNumber",
    "invoiceDate",
    "studentId",
    "studentName",
    "currency",
    "subtotal",
    "taxPercent",
    "taxAmount",
    "total",
    "status",
    "amountCollected",
    "balanceOutstanding",
    "dueDate",
    "lineItemsSummary",
    "notes",
    "feeStructureId",
    "createdAt",
    "updatedAt",
  ],
  invoicesCa: [
    "invoiceNumber",
    "invoiceDate",
    "partyName",
    "studentId",
    "supplyType",
    "placeOfSupply",
    "stateCode",
    "sac",
    "gstinSupplier",
    "panSupplier",
    "taxableValue",
    "gstPercentTotal",
    "cgstRatePercent",
    "sgstRatePercent",
    "cgstAmount",
    "sgstAmount",
    "igstAmount",
    "totalTaxAmount",
    "invoiceTotal",
    "amountReceived",
    "balanceDue",
    "invoiceStatus",
    "currency",
    "notes",
    "createdAt",
  ],
} as const;

export type HqExportSnapshots = {
  students: Record<string, unknown>[];
  invoices: Record<string, unknown>[];
  receipts: Record<string, unknown>[];
  onboarding: Record<string, unknown>[];
  enquiries: Record<string, unknown>[];
  batches: Record<string, unknown>[];
  feeStructures: Record<string, unknown>[];
  expenses: Record<string, unknown>[];
};

export function buildHqExportWorkbook(snap: HqExportSnapshots): Buffer {
  const wb = XLSX.utils.book_new();
  appendHqSheet(wb, "Students", snap.students, [...PREFERRED.students]);
  appendHqSheet(wb, "Invoices", snap.invoices, [...PREFERRED.invoices]);
  appendHqSheet(wb, "Receipts", snap.receipts, [...PREFERRED.receipts]);
  appendHqSheet(wb, "Onboarding", snap.onboarding, [...PREFERRED.onboarding]);
  appendHqSheet(wb, "Enquiries", snap.enquiries, [...PREFERRED.enquiries]);
  appendHqSheet(wb, "Batches", snap.batches, [...PREFERRED.batches]);
  appendHqSheet(wb, "Fee structures", snap.feeStructures, [...PREFERRED.feeStructures]);
  appendHqSheet(wb, "Expenses", snap.expenses, [...PREFERRED.expenses]);
  return XLSX.write(wb, { bookType: "xlsx", type: "buffer" }) as Buffer;
}

export type ReportExportSheets = {
  summary?: Record<string, unknown>[];
  onboarding?: Record<string, unknown>[];
  studentsNew?: Record<string, unknown>[];
  feesPending?: Record<string, unknown>[];
  invoicesNormal?: Record<string, unknown>[];
  invoicesCa?: Record<string, unknown>[];
  receipts?: Record<string, unknown>[];
  expenses?: Record<string, unknown>[];
  notEnrolled?: Record<string, unknown>[];
};

/** Filtered multi-sheet workbook for HQ Reports (`parts` only contains selected sections). */
export function buildReportExportWorkbook(parts: Partial<ReportExportSheets>): Buffer {
  const wb = XLSX.utils.book_new();
  let any = false;
  if (parts.summary !== undefined) {
    appendHqSheet(wb, "Summary", parts.summary, [...PREFERRED.reportSummary]);
    any = true;
  }
  if (parts.onboarding !== undefined) {
    appendHqSheet(wb, "Onboarding", parts.onboarding, [...PREFERRED.onboarding]);
    any = true;
  }
  if (parts.studentsNew !== undefined) {
    appendHqSheet(wb, "Students (new)", parts.studentsNew, [...PREFERRED.students]);
    any = true;
  }
  if (parts.feesPending !== undefined) {
    appendHqSheet(wb, "Fees pending", parts.feesPending, [...PREFERRED.feesPending]);
    any = true;
  }
  if (parts.invoicesNormal !== undefined) {
    appendHqSheet(wb, "Invoices", parts.invoicesNormal, [...PREFERRED.invoicesNormal]);
    any = true;
  }
  if (parts.invoicesCa !== undefined) {
    appendHqSheet(wb, "Invoices CA (GST)", parts.invoicesCa, [...PREFERRED.invoicesCa]);
    any = true;
  }
  if (parts.receipts !== undefined) {
    appendHqSheet(wb, "Receipts", parts.receipts, [...PREFERRED.receipts]);
    any = true;
  }
  if (parts.expenses !== undefined) {
    appendHqSheet(wb, "Expenses", parts.expenses, [...PREFERRED.expenses]);
    any = true;
  }
  if (parts.notEnrolled !== undefined) {
    appendHqSheet(wb, "Not enrolled", parts.notEnrolled, [...PREFERRED.students]);
    any = true;
  }
  if (!any) {
    appendHqSheet(wb, "Summary", [{ metric: "Note", value: "No sections selected" }], [...PREFERRED.reportSummary]);
  }
  return XLSX.write(wb, { bookType: "xlsx", type: "buffer" }) as Buffer;
}
