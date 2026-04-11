export type ListQuery = {
  page: number;
  pageSize: number;
  search: string;
  sortField: string;
  sortDir: "asc" | "desc";
  dateFromMs: number | null;
  dateToMs: number | null;
  /** When set, only rows for this student (invoices / receipts). */
  studentId: string | null;
};

const SORT_FIELDS = new Set([
  "createdAt",
  "updatedAt",
  "name",
  "email",
  "fullName",
  "invoiceNumber",
  "total",
  "code",
  "receivedAt",
  "totalAmount",
  "studentName",
  "serial",
  "spentAt",
  "publishedAt",
  "title",
]);

function startOfDayMs(iso: string): number {
  const [y, m, d] = iso.split("-").map(Number);
  if (!y || !m || !d) return NaN;
  return new Date(y, m - 1, d, 0, 0, 0, 0).getTime();
}

function endOfDayMs(iso: string): number {
  const [y, m, d] = iso.split("-").map(Number);
  if (!y || !m || !d) return NaN;
  return new Date(y, m - 1, d, 23, 59, 59, 999).getTime();
}

/** Parse ?page=&pageSize=&search=&sort=field_dir&dateFrom=&dateTo= */
export function parseListQuery(searchParams: URLSearchParams, defaultSort = "createdAt_desc"): ListQuery {
  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10) || 1);
  const pageSize = Math.min(100, Math.max(5, parseInt(searchParams.get("pageSize") || "20", 10) || 20));
  const search = (searchParams.get("search") || "").trim();
  const rawSort = (searchParams.get("sort") || defaultSort).split("_");
  let sortField = rawSort[0] || "createdAt";
  if (!SORT_FIELDS.has(sortField)) sortField = "createdAt";
  const sortDir = rawSort[1] === "asc" ? "asc" : "desc";
  const df = searchParams.get("dateFrom") || "";
  const dt = searchParams.get("dateTo") || "";
  const dateFromMs = df ? startOfDayMs(df) : null;
  const dateToMs = dt ? endOfDayMs(dt) : null;
  const studentIdRaw = (searchParams.get("studentId") || "").trim();
  return {
    page,
    pageSize,
    search: search.toLowerCase(),
    sortField,
    sortDir,
    dateFromMs: dateFromMs != null && !Number.isNaN(dateFromMs) ? dateFromMs : null,
    dateToMs: dateToMs != null && !Number.isNaN(dateToMs) ? dateToMs : null,
    studentId: studentIdRaw || null,
  };
}

export function createdMs(v: unknown): number {
  if (typeof v === "number" && !Number.isNaN(v)) return v;
  return 0;
}

export type PaginatedResult<T> = {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

export function paginateSlice<T>(all: T[], q: ListQuery): PaginatedResult<T> {
  const total = all.length;
  const totalPages = Math.max(1, Math.ceil(total / q.pageSize));
  const page = Math.min(q.page, totalPages);
  const start = (page - 1) * q.pageSize;
  const items = all.slice(start, start + q.pageSize);
  return { items, total, page, pageSize: q.pageSize, totalPages };
}
