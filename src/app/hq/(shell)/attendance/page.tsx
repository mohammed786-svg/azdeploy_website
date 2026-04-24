"use client";

import { Fragment, useCallback, useEffect, useMemo, useState } from "react";
import { hqDownloadBlob, hqFetch } from "@/lib/hq-client";
import { hqListUrl } from "@/lib/hq-list-url";

type Batch = { id: string; name: string; code: string };
type BatchTiming = { id: string; batchId: string; label: string; startTime: string; endTime: string };
type Student = { id: string; fullName: string; currentBatchId?: string; batchTimingId?: string; status?: string };
type SessionRow = {
  id: string;
  attendanceDate: string;
  batchId: string;
  batchCode: string;
  batchName: string;
  batchTimingId?: string;
  batchTimingLabel?: string;
  presentCount: number;
  absentCount: number;
  excusedCount?: number;
  notes?: string;
  createdBy?: string;
  createdAt?: string;
  updatedAt?: string;
};

type SessionDetailRecord = {
  id: string;
  studentId: string;
  studentName: string;
  email: string;
  phone: string;
  status: string;
  remarks: string;
};

type SessionDetail = {
  id: string;
  attendanceDate: string;
  batchId: string;
  batchCode: string;
  batchName: string;
  batchTimingId: string;
  batchTimingLabel: string;
  notes: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  presentCount: number;
  absentCount: number;
  excusedCount: number;
  lateCount: number;
  records: SessionDetailRecord[];
};

type DateGroupRow = {
  attendanceDate: string;
  sessionCount: number;
  presentTotal: number;
  absentTotal: number;
  excusedTotal: number;
  sessions: SessionRow[];
};

type HistoryResponse = {
  items: DateGroupRow[];
  groupBy?: "date" | "session";
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

type StudentAttendanceReport = {
  report: string;
  columns: string[];
  items: Record<string, unknown>[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

function formatLocalDate(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function initials(name: string) {
  const p = name.trim().split(/\s+/).filter(Boolean);
  if (p.length === 0) return "?";
  if (p.length === 1) return p[0].slice(0, 2).toUpperCase();
  return (p[0][0] + p[p.length - 1][0]).toUpperCase();
}

function isPresentStatus(status: string) {
  return status === "present" || status === "late";
}

function isPresentTabStatus(status: string) {
  return status === "present" || status === "late" || status === "excused";
}

type SessionMix = "any" | "with_absences" | "perfect";
type DetailRecordFilter = "all" | "present" | "absent";

export default function HqAttendancePage() {
  const [batches, setBatches] = useState<Batch[]>([]);
  const [timings, setTimings] = useState<BatchTiming[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [batchId, setBatchId] = useState("");
  const [batchTimingId, setBatchTimingId] = useState("");
  const [attendanceDate, setAttendanceDate] = useState(() => formatLocalDate(new Date()));
  const [selectedIds, setSelectedIds] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);
  const [syncingRoll, setSyncingRoll] = useState(false);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");
  const [existingSessionId, setExistingSessionId] = useState<string | null>(null);

  const today = useMemo(() => formatLocalDate(new Date()), []);
  const [histDateFrom, setHistDateFrom] = useState(() => {
    const t = new Date();
    t.setDate(t.getDate() - 13);
    return formatLocalDate(t);
  });
  const [histDateTo, setHistDateTo] = useState(today);
  const [histBatchId, setHistBatchId] = useState("");
  const [histTimingId, setHistTimingId] = useState("");
  const [histSearch, setHistSearch] = useState("");
  const [histSearchDebounced, setHistSearchDebounced] = useState("");
  const [sessionMix, setSessionMix] = useState<SessionMix>("any");
  const [histPage, setHistPage] = useState(1);
  const [histPageSize, setHistPageSize] = useState(20);
  const [historyGroups, setHistoryGroups] = useState<DateGroupRow[]>([]);
  const [histMeta, setHistMeta] = useState({ total: 0, totalPages: 1, page: 1, pageSize: 20 });
  const [histLoading, setHistLoading] = useState(false);
  const [expandedDate, setExpandedDate] = useState<string | null>(null);
  const [expandedSessionId, setExpandedSessionId] = useState<string | null>(null);
  const [detail, setDetail] = useState<SessionDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailErr, setDetailErr] = useState("");
  const [detailRecordFilter, setDetailRecordFilter] = useState<DetailRecordFilter>("all");

  const [stuRepDateFrom, setStuRepDateFrom] = useState(() => {
    const t = new Date();
    t.setDate(t.getDate() - 29);
    return formatLocalDate(t);
  });
  const [stuRepDateTo, setStuRepDateTo] = useState(() => formatLocalDate(new Date()));
  const [stuRepBatchId, setStuRepBatchId] = useState("");
  const [stuRepStatus, setStuRepStatus] = useState("");
  const [stuRepSearch, setStuRepSearch] = useState("");
  const [stuRepSearchDebounced, setStuRepSearchDebounced] = useState("");
  const [stuRepPage, setStuRepPage] = useState(1);
  const [stuRepPageSize] = useState(15);
  const [stuRepData, setStuRepData] = useState<StudentAttendanceReport | null>(null);
  const [stuRepLoading, setStuRepLoading] = useState(false);
  const [stuRepExporting, setStuRepExporting] = useState(false);

  const timingOptions = useMemo(() => timings.filter((t) => t.batchId === batchId), [timings, batchId]);
  const histTimingOptions = useMemo(() => timings.filter((t) => t.batchId === histBatchId), [timings, histBatchId]);
  const filteredStudents = useMemo(
    () =>
      students.filter(
        (s) =>
          s.status === "active" &&
          (s.currentBatchId || "") === batchId &&
          (!batchTimingId || (s.batchTimingId || "") === batchTimingId)
      ),
    [students, batchId, batchTimingId]
  );

  const rosterKey = useMemo(() => filteredStudents.map((s) => s.id).sort().join(","), [filteredStudents]);

  const presentPreview = useMemo(
    () => filteredStudents.filter((s) => selectedIds[s.id]).length,
    [filteredStudents, selectedIds]
  );
  const absentPreview = filteredStudents.length - presentPreview;

  useEffect(() => {
    const t = setTimeout(() => setHistSearchDebounced(histSearch.trim().toLowerCase()), 350);
    return () => clearTimeout(t);
  }, [histSearch]);

  useEffect(() => {
    const t = setTimeout(() => setStuRepSearchDebounced(stuRepSearch.trim().toLowerCase()), 350);
    return () => clearTimeout(t);
  }, [stuRepSearch]);

  const loadStudentReport = useCallback(async () => {
    setStuRepLoading(true);
    try {
      const data = await hqFetch<StudentAttendanceReport>(
        hqListUrl("/api/hq/reports/table", {
          report: "attendance_students",
          page: stuRepPage,
          pageSize: stuRepPageSize,
          dateFrom: stuRepDateFrom || undefined,
          dateTo: stuRepDateTo || undefined,
          search: stuRepSearchDebounced || undefined,
          status: stuRepStatus || undefined,
          batchId: stuRepBatchId || undefined,
        })
      );
      setStuRepData(data);
      const p = data.page ?? 1;
      setStuRepPage((prev) => (prev !== p ? p : prev));
    } catch {
      setStuRepData(null);
    } finally {
      setStuRepLoading(false);
    }
  }, [
    stuRepPage,
    stuRepPageSize,
    stuRepDateFrom,
    stuRepDateTo,
    stuRepBatchId,
    stuRepStatus,
    stuRepSearchDebounced,
  ]);

  useEffect(() => {
    if (loading) return;
    void loadStudentReport();
  }, [loading, loadStudentReport]);

  useEffect(() => {
    setStuRepPage(1);
  }, [stuRepSearchDebounced]);

  const loadRefs = useCallback(async () => {
    const [b, t, s] = await Promise.all([
      hqFetch<{ items: Batch[] }>(hqListUrl("/api/hq/batches", { page: 1, pageSize: 500, sort: "code_asc" })),
      hqFetch<{ items: BatchTiming[] }>(hqListUrl("/api/hq/batch-timings", { page: 1, pageSize: 1000, sort: "label_asc" })),
      hqFetch<{ items: Student[] }>(hqListUrl("/api/hq/students", { page: 1, pageSize: 1000, sort: "fullName_asc" })),
    ]);
    setBatches(b.items ?? []);
    setTimings(t.items ?? []);
    setStudents(s.items ?? []);
  }, []);

  const loadHistory = useCallback(async () => {
    setHistLoading(true);
    try {
      const data = await hqFetch<HistoryResponse>(
        hqListUrl("/api/hq/attendance/sessions", {
          page: histPage,
          pageSize: histPageSize,
          sort: "attendanceDate_desc",
          dateFrom: histDateFrom,
          dateTo: histDateTo,
          batchId: histBatchId || undefined,
          batchTimingId: histTimingId || undefined,
          sessionMix: sessionMix === "any" ? undefined : sessionMix,
          search: histSearchDebounced || undefined,
          groupBy: "date",
        })
      );
      setHistoryGroups(data.items ?? []);
      const serverPage = data.page ?? 1;
      setHistMeta({
        total: data.total ?? 0,
        totalPages: data.totalPages ?? 1,
        page: serverPage,
        pageSize: data.pageSize ?? histPageSize,
      });
      setHistPage((prev) => (prev !== serverPage ? serverPage : prev));
    } catch {
      setHistoryGroups([]);
    } finally {
      setHistLoading(false);
    }
  }, [
    histPage,
    histPageSize,
    histDateFrom,
    histDateTo,
    histBatchId,
    histTimingId,
    sessionMix,
    histSearchDebounced,
  ]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      setErr("");
      try {
        await loadRefs();
      } catch (e) {
        setErr(e instanceof Error ? e.message : "Failed to load");
      } finally {
        setLoading(false);
      }
    })();
  }, [loadRefs]);

  useEffect(() => {
    void loadHistory();
  }, [loadHistory]);

  useEffect(() => {
    setHistPage(1);
  }, [histSearchDebounced]);

  useEffect(() => {
    let cancelled = false;
    async function syncRoll() {
      if (!batchId || !attendanceDate) {
        setSelectedIds({});
        setExistingSessionId(null);
        return;
      }
      const defaultSel: Record<string, boolean> = {};
      for (const s of filteredStudents) defaultSel[s.id] = true;

      setSyncingRoll(true);
      setExistingSessionId(null);
      try {
        const list = await hqFetch<HistoryResponse>(
          hqListUrl("/api/hq/attendance/sessions", {
            page: 1,
            pageSize: 30,
            batchId,
            dateFrom: attendanceDate,
            dateTo: attendanceDate,
            sort: "attendanceDate_desc",
          })
        );
        const wantTiming = batchTimingId || "";
        let row: SessionRow | undefined;
        for (const g of list.items ?? []) {
          row = (g.sessions ?? []).find((s) => (s.batchTimingId || "") === wantTiming);
          if (row) break;
        }
        if (row && !cancelled) {
          setExistingSessionId(row.id);
          const d = await hqFetch<{ item: SessionDetail }>(`/api/hq/attendance/sessions/${row.id}`);
          const next: Record<string, boolean> = { ...defaultSel };
          for (const r of d.item.records) {
            next[r.studentId] = isPresentStatus(r.status);
          }
          for (const s of filteredStudents) {
            if (!(s.id in next)) next[s.id] = true;
          }
          if (!cancelled) setSelectedIds(next);
          return;
        }
      } catch {
        /* keep defaults */
      } finally {
        if (!cancelled) setSyncingRoll(false);
      }
      if (!cancelled) {
        setSelectedIds(defaultSel);
        setExistingSessionId(null);
      }
    }
    void syncRoll();
    return () => {
      cancelled = true;
    };
  }, [batchId, batchTimingId, attendanceDate, rosterKey]);

  useEffect(() => {
    if (!expandedSessionId) {
      setDetail(null);
      setDetailErr("");
      return;
    }
    let cancelled = false;
    setDetail(null);
    setDetailLoading(true);
    setDetailErr("");
    setDetailRecordFilter("all");
    (async () => {
      try {
        const d = await hqFetch<{ item: SessionDetail }>(`/api/hq/attendance/sessions/${expandedSessionId}`);
        if (!cancelled) setDetail(d.item);
      } catch (e) {
        if (!cancelled) {
          setDetailErr(e instanceof Error ? e.message : "Failed to load details");
          setDetail(null);
        }
      } finally {
        if (!cancelled) setDetailLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [expandedSessionId]);

  function applyPreset(days: number) {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - (days - 1));
    setHistDateFrom(formatLocalDate(start));
    setHistDateTo(formatLocalDate(end));
    setHistPage(1);
  }

  function applyMonthPreset(months: number) {
    const end = new Date();
    const start = new Date();
    start.setMonth(start.getMonth() - months);
    setHistDateFrom(formatLocalDate(start));
    setHistDateTo(formatLocalDate(end));
    setHistPage(1);
  }

  async function submitAttendance(e: React.FormEvent) {
    e.preventDefault();
    if (!batchId || !attendanceDate) {
      setErr("Batch and date are required.");
      return;
    }
    setSaving(true);
    setErr("");
    try {
      const presentStudentIds = Object.entries(selectedIds)
        .filter(([, v]) => v)
        .map(([id]) => id);
      await hqFetch("/api/hq/attendance/sessions", {
        method: "POST",
        body: JSON.stringify({ batchId, batchTimingId: batchTimingId || null, attendanceDate, presentStudentIds }),
      });
      await loadHistory();
      setExistingSessionId(null);
      const list = await hqFetch<HistoryResponse>(
        hqListUrl("/api/hq/attendance/sessions", {
          page: 1,
          pageSize: 10,
          batchId,
          dateFrom: attendanceDate,
          dateTo: attendanceDate,
        })
      );
      const wantTiming = batchTimingId || "";
      let row: SessionRow | undefined;
      for (const g of list.items ?? []) {
        row = (g.sessions ?? []).find((s) => (s.batchTimingId || "") === wantTiming);
        if (row) break;
      }
      if (row) setExistingSessionId(row.id);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Attendance save failed");
    } finally {
      setSaving(false);
    }
  }

  function setAllPresent(on: boolean) {
    setSelectedIds((prev) => {
      const next = { ...prev };
      for (const s of filteredStudents) next[s.id] = on;
      return next;
    });
  }

  function toggleDateExpand(dateKey: string) {
    setExpandedDate((cur) => {
      if (cur === dateKey) {
        setExpandedSessionId(null);
        return null;
      }
      setExpandedSessionId(null);
      return dateKey;
    });
  }

  function toggleSessionExpand(id: string) {
    setExpandedSessionId((cur) => (cur === id ? null : id));
  }

  async function exportStudentReport(format: "csv" | "excel") {
    setStuRepExporting(true);
    try {
      const q = hqListUrl("/api/hq/reports/export", {
        report: "attendance_students",
        format,
        dateFrom: stuRepDateFrom || undefined,
        dateTo: stuRepDateTo || undefined,
        search: stuRepSearchDebounced || undefined,
        status: stuRepStatus || undefined,
        batchId: stuRepBatchId || undefined,
      });
      await hqDownloadBlob(q, `hq-attendance-students.${format === "excel" ? "xls" : "csv"}`);
    } finally {
      setStuRepExporting(false);
    }
  }

  const selectedBatch = batches.find((b) => b.id === batchId);

  const filteredDetailRecords = useMemo(() => {
    if (!detail) return [];
    if (detailRecordFilter === "all") return detail.records;
    if (detailRecordFilter === "present") return detail.records.filter((r) => isPresentTabStatus(r.status));
    return detail.records.filter((r) => r.status === "absent");
  }, [detail, detailRecordFilter]);

  return (
    <div className="space-y-8">
      <header className="relative overflow-hidden rounded-3xl border border-violet-500/20 bg-gradient-to-br from-violet-950/80 via-[#0a0a12] to-cyan-950/40 px-6 py-8 sm:px-8">
        <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-16 left-1/3 h-48 w-48 rounded-full bg-violet-500/15 blur-3xl" />
        <p className="relative text-[10px] font-mono tracking-[0.4em] uppercase text-violet-300/80">Roll call</p>
        <h1 className="relative mt-3 text-2xl font-bold tracking-tight text-white sm:text-3xl">Attendance</h1>
        <p className="relative mt-2 max-w-xl text-sm leading-relaxed text-slate-400">
          One mark per learner per day for this batch. Saving again updates the same session—no duplicate entries across timings.
        </p>
      </header>

      {err ? (
        <p className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-200/90">{err}</p>
      ) : null}
      {loading ? (
        <p className="text-slate-500 font-mono text-sm">Loading…</p>
      ) : (
        <>
          <form
            onSubmit={submitAttendance}
            className="rounded-3xl border border-white/[0.07] bg-[#06060b]/90 shadow-[0_0_0_1px_rgba(255,255,255,0.03)] backdrop-blur-sm"
          >
            <div className="border-b border-white/[0.06] px-5 py-4 sm:px-6">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-sm font-semibold text-white">Mark session</h2>
                  <p className="mt-0.5 text-xs text-slate-500">Present is pre-selected for quick entry.</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {existingSessionId ? (
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/35 bg-emerald-500/10 px-3 py-1 text-[11px] font-medium text-emerald-300">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                      Saved for this date — edits overwrite the same session
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-600/50 bg-slate-800/50 px-3 py-1 text-[11px] text-slate-400">
                      New session for selected day
                    </span>
                  )}
                  {syncingRoll ? (
                    <span className="text-[11px] font-mono text-slate-500">Syncing roll…</span>
                  ) : null}
                </div>
              </div>
            </div>

            <div className="space-y-5 p-5 sm:p-6">
              <div className="grid gap-4 sm:grid-cols-3">
                <label className="block">
                  <span className="text-[10px] font-mono uppercase text-slate-500">Batch *</span>
                  <select
                    value={batchId}
                    onChange={(e) => setBatchId(e.target.value)}
                    className="mt-1.5 w-full rounded-xl border border-white/10 bg-black/60 px-3 py-2.5 text-sm text-white outline-none focus:border-violet-500/50"
                    required
                  >
                    <option value="">Select batch</option>
                    {batches.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.code} — {b.name}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="block">
                  <span className="text-[10px] font-mono uppercase text-slate-500">Batch timing</span>
                  <select
                    value={batchTimingId}
                    onChange={(e) => setBatchTimingId(e.target.value)}
                    className="mt-1.5 w-full rounded-xl border border-white/10 bg-black/60 px-3 py-2.5 text-sm text-white outline-none focus:border-violet-500/50"
                  >
                    <option value="">All timings</option>
                    {timingOptions.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.label} ({t.startTime} - {t.endTime})
                      </option>
                    ))}
                  </select>
                </label>
                <label className="block">
                  <span className="text-[10px] font-mono uppercase text-slate-500">Date *</span>
                  <input
                    type="date"
                    value={attendanceDate}
                    onChange={(e) => setAttendanceDate(e.target.value)}
                    className="mt-1.5 w-full rounded-xl border border-white/10 bg-black/60 px-3 py-2.5 text-sm text-white outline-none focus:border-violet-500/50"
                    required
                  />
                </label>
              </div>

              {batchId ? (
                <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-white/[0.06] bg-white/[0.02] px-4 py-3">
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold tabular-nums text-white">{presentPreview}</span>
                    <span className="text-xs uppercase tracking-wide text-emerald-400/90">present</span>
                  </div>
                  <div className="h-8 w-px bg-white/10" />
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold tabular-nums text-amber-200/90">{absentPreview}</span>
                    <span className="text-xs uppercase tracking-wide text-amber-400/80">absent</span>
                  </div>
                  <div className="h-8 w-px bg-white/10 hidden sm:block" />
                  <span className="text-xs text-slate-500">
                    {selectedBatch ? `${selectedBatch.code} · ${filteredStudents.length} on roll` : ""}
                  </span>
                  <div className="ml-auto flex gap-2">
                    <button
                      type="button"
                      onClick={() => setAllPresent(true)}
                      className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-[11px] font-medium text-slate-300 hover:bg-white/10"
                    >
                      All present
                    </button>
                    <button
                      type="button"
                      onClick={() => setAllPresent(false)}
                      className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-[11px] font-medium text-slate-300 hover:bg-white/10"
                    >
                      All absent
                    </button>
                  </div>
                </div>
              ) : null}

              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {filteredStudents.length === 0 ? (
                  <div className="col-span-full rounded-2xl border border-dashed border-white/10 py-14 text-center text-sm text-slate-500">
                    No active students for this batch{batchTimingId ? " and timing" : ""}.
                  </div>
                ) : (
                  filteredStudents.map((s) => {
                    const on = Boolean(selectedIds[s.id]);
                    return (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => setSelectedIds((prev) => ({ ...prev, [s.id]: !on }))}
                        className={`group flex items-center gap-3 rounded-2xl border px-3 py-3 text-left transition-all ${
                          on
                            ? "border-emerald-500/35 bg-emerald-500/[0.07] shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]"
                            : "border-white/[0.08] bg-black/20 hover:border-amber-500/25 hover:bg-amber-500/[0.04]"
                        }`}
                      >
                        <span
                          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-xs font-bold ${
                            on ? "bg-emerald-500/20 text-emerald-200" : "bg-slate-800 text-slate-400"
                          }`}
                        >
                          {initials(s.fullName)}
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium text-white">{s.fullName}</p>
                          <p className={`text-[11px] font-mono uppercase ${on ? "text-emerald-400/80" : "text-amber-400/70"}`}>
                            {on ? "Present" : "Absent"}
                          </p>
                        </div>
                        <span
                          className={`h-5 w-5 shrink-0 rounded-md border-2 ${
                            on ? "border-emerald-400 bg-emerald-400" : "border-slate-600 bg-transparent"
                          }`}
                        />
                      </button>
                    );
                  })
                )}
              </div>

              <div className="flex justify-end border-t border-white/[0.06] pt-5">
                <button
                  type="submit"
                  disabled={saving || !batchId || syncingRoll}
                  className="rounded-xl bg-gradient-to-r from-violet-600 to-cyan-600 px-6 py-2.5 text-xs font-semibold uppercase tracking-wide text-white shadow-lg shadow-violet-900/30 disabled:opacity-50"
                >
                  {saving ? "Saving…" : existingSessionId ? "Update attendance" : "Save attendance"}
                </button>
              </div>
            </div>
          </form>

          <section className="rounded-3xl border border-white/[0.07] bg-[#06060b]/90 overflow-hidden">
            <div className="border-b border-white/[0.06] px-5 py-4 sm:px-6">
              <h2 className="text-sm font-semibold text-white">Attendance history</h2>
              <p className="mt-0.5 text-xs text-slate-500">
                Records are grouped by calendar date. Open a day to see each batch/timing session, then open a session for
                learner-level detail.
              </p>
            </div>

            <div className="space-y-4 p-5 sm:p-6">
              <div className="flex flex-wrap gap-2">
                <span className="mr-1 self-center text-[10px] font-mono uppercase text-slate-500">Quick</span>
                <button
                  type="button"
                  onClick={() => applyPreset(7)}
                  className="rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] text-slate-300 hover:bg-violet-500/10 hover:border-violet-500/30"
                >
                  Last 7 days
                </button>
                <button
                  type="button"
                  onClick={() => applyPreset(14)}
                  className="rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] text-slate-300 hover:bg-violet-500/10 hover:border-violet-500/30"
                >
                  Last 14 days
                </button>
                <button
                  type="button"
                  onClick={() => applyMonthPreset(1)}
                  className="rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] text-slate-300 hover:bg-violet-500/10 hover:border-violet-500/30"
                >
                  1 month
                </button>
                <button
                  type="button"
                  onClick={() => applyMonthPreset(2)}
                  className="rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] text-slate-300 hover:bg-violet-500/10 hover:border-violet-500/30"
                >
                  2 months
                </button>
              </div>

              <div className="grid gap-3 lg:grid-cols-6">
                <label className="lg:col-span-1">
                  <span className="text-[10px] font-mono uppercase text-slate-500">From</span>
                  <input
                    type="date"
                    value={histDateFrom}
                    onChange={(e) => {
                      setHistDateFrom(e.target.value);
                      setHistPage(1);
                    }}
                    className="mt-1 w-full rounded-xl border border-white/10 bg-black/60 px-3 py-2 text-sm text-white"
                  />
                </label>
                <label className="lg:col-span-1">
                  <span className="text-[10px] font-mono uppercase text-slate-500">To</span>
                  <input
                    type="date"
                    value={histDateTo}
                    onChange={(e) => {
                      setHistDateTo(e.target.value);
                      setHistPage(1);
                    }}
                    className="mt-1 w-full rounded-xl border border-white/10 bg-black/60 px-3 py-2 text-sm text-white"
                  />
                </label>
                <label className="lg:col-span-1">
                  <span className="text-[10px] font-mono uppercase text-slate-500">Batch</span>
                  <select
                    value={histBatchId}
                    onChange={(e) => {
                      setHistBatchId(e.target.value);
                      setHistTimingId("");
                      setHistPage(1);
                    }}
                    className="mt-1 w-full rounded-xl border border-white/10 bg-black/60 px-3 py-2 text-sm text-white"
                  >
                    <option value="">All batches</option>
                    {batches.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.code}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="lg:col-span-1">
                  <span className="text-[10px] font-mono uppercase text-slate-500">Timing</span>
                  <select
                    value={histTimingId}
                    onChange={(e) => {
                      setHistTimingId(e.target.value);
                      setHistPage(1);
                    }}
                    disabled={!histBatchId}
                    className="mt-1 w-full rounded-xl border border-white/10 bg-black/60 px-3 py-2 text-sm text-white disabled:opacity-40"
                  >
                    <option value="">All timings</option>
                    {histTimingOptions.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.label}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="lg:col-span-1">
                  <span className="text-[10px] font-mono uppercase text-slate-500">Session type</span>
                  <select
                    value={sessionMix}
                    onChange={(e) => {
                      setSessionMix(e.target.value as SessionMix);
                      setHistPage(1);
                    }}
                    className="mt-1 w-full rounded-xl border border-white/10 bg-black/60 px-3 py-2 text-sm text-white"
                  >
                    <option value="any">All sessions</option>
                    <option value="with_absences">With absences</option>
                    <option value="perfect">100% present</option>
                  </select>
                </label>
                <label className="lg:col-span-1">
                  <span className="text-[10px] font-mono uppercase text-slate-500">Search</span>
                  <input
                    type="search"
                    value={histSearch}
                    onChange={(e) => setHistSearch(e.target.value)}
                    placeholder="Batch code, name, timing…"
                    className="mt-1 w-full rounded-xl border border-white/10 bg-black/60 px-3 py-2 text-sm text-white placeholder:text-slate-600"
                  />
                </label>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
                <span>
                  {histLoading
                    ? "Loading…"
                    : `${histMeta.total} day${histMeta.total === 1 ? "" : "s"} with attendance in range`}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono uppercase">Rows</span>
                  <select
                    value={histPageSize}
                    onChange={(e) => {
                      setHistPageSize(Number(e.target.value));
                      setHistPage(1);
                    }}
                    className="rounded-lg border border-white/10 bg-black/60 px-2 py-1 text-xs text-white"
                  >
                    {[10, 20, 50, 100].map((n) => (
                      <option key={n} value={n}>
                        {n}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="overflow-x-auto rounded-2xl border border-white/[0.06]">
                <table className="w-full min-w-[720px] text-sm">
                  <thead>
                    <tr className="border-b border-white/[0.06] text-left text-[10px] font-mono uppercase text-slate-500">
                      <th className="w-8 px-3 py-2.5" aria-hidden />
                      <th className="px-3 py-2.5">Date</th>
                      <th className="px-3 py-2.5">Sessions</th>
                      <th className="px-3 py-2.5 text-right">Present</th>
                      <th className="px-3 py-2.5 text-right">Absent</th>
                      <th className="px-3 py-2.5 text-right">Excused</th>
                      <th className="px-3 py-2.5 text-right">%</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.04]">
                    {!histLoading && historyGroups.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="px-4 py-10 text-center text-slate-500">
                          No attendance matches your filters.
                        </td>
                      </tr>
                    ) : null}
                    {historyGroups.map((group) => {
                      const exc = group.excusedTotal ?? 0;
                      const total = group.presentTotal + group.absentTotal + exc;
                      const pct = total > 0 ? Math.round((group.presentTotal / total) * 100) : 0;
                      const dateOpen = expandedDate === group.attendanceDate;
                      return (
                        <Fragment key={group.attendanceDate}>
                          <tr
                            role="button"
                            tabIndex={0}
                            onClick={() => toggleDateExpand(group.attendanceDate)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" || e.key === " ") {
                                e.preventDefault();
                                toggleDateExpand(group.attendanceDate);
                              }
                            }}
                            className={`cursor-pointer transition-colors hover:bg-white/[0.03] ${dateOpen ? "bg-violet-500/[0.07]" : ""}`}
                          >
                            <td className="px-3 py-2.5 text-slate-500">
                              <span className={`inline-block transition-transform ${dateOpen ? "rotate-90" : ""}`}>▸</span>
                            </td>
                            <td className="px-3 py-2.5 font-mono text-xs text-violet-200/90">{group.attendanceDate}</td>
                            <td className="px-3 py-2.5 text-slate-300">
                              <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[11px] tabular-nums">
                                {group.sessionCount} session{group.sessionCount === 1 ? "" : "s"}
                              </span>
                            </td>
                            <td className="px-3 py-2.5 text-right tabular-nums text-emerald-300">{group.presentTotal}</td>
                            <td className="px-3 py-2.5 text-right tabular-nums text-amber-300">{group.absentTotal}</td>
                            <td className="px-3 py-2.5 text-right tabular-nums text-cyan-300/90">{exc}</td>
                            <td className="px-3 py-2.5 text-right tabular-nums text-white">{pct}%</td>
                          </tr>
                          {dateOpen ? (
                            <tr className="bg-black/35">
                              <td colSpan={7} className="px-3 py-3">
                                <div className="rounded-xl border border-white/[0.06] bg-[#050508]/80">
                                  <p className="border-b border-white/[0.06] px-3 py-2 text-[10px] font-mono uppercase text-slate-500">
                                    Sessions on {group.attendanceDate}
                                  </p>
                                  <div className="overflow-x-auto">
                                    <table className="w-full min-w-[640px] text-sm">
                                      <thead>
                                        <tr className="text-left text-[10px] font-mono uppercase text-slate-500">
                                          <th className="w-8 px-3 py-2" aria-hidden />
                                          <th className="px-3 py-2">Batch</th>
                                          <th className="px-3 py-2">Timing</th>
                                          <th className="px-3 py-2 text-right">Present</th>
                                          <th className="px-3 py-2 text-right">Absent</th>
                                          <th className="px-3 py-2 text-right">Excused</th>
                                          <th className="px-3 py-2 text-right">%</th>
                                        </tr>
                                      </thead>
                                      <tbody className="divide-y divide-white/[0.04]">
                                        {group.sessions.map((row) => {
                                          const e = row.excusedCount ?? 0;
                                          const t = row.presentCount + row.absentCount + e;
                                          const p = t > 0 ? Math.round((row.presentCount / t) * 100) : 0;
                                          const sessOpen = expandedSessionId === row.id;
                                          return (
                                            <Fragment key={row.id}>
                                              <tr
                                                role="button"
                                                tabIndex={0}
                                                className={`cursor-pointer hover:bg-white/[0.04] ${sessOpen ? "bg-violet-500/10" : ""}`}
                                                onClick={(ev) => {
                                                  ev.stopPropagation();
                                                  toggleSessionExpand(row.id);
                                                }}
                                                onKeyDown={(e) => {
                                                  if (e.key === "Enter" || e.key === " ") {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    toggleSessionExpand(row.id);
                                                  }
                                                }}
                                              >
                                                <td className="px-3 py-2 text-slate-500">
                                                  <span className={`inline-block text-xs transition-transform ${sessOpen ? "rotate-90" : ""}`}>
                                                    ▸
                                                  </span>
                                                </td>
                                                <td className="px-3 py-2 text-white">
                                                  <span className="font-medium">{row.batchCode}</span>
                                                  <span className="text-slate-500"> · {row.batchName}</span>
                                                </td>
                                                <td className="px-3 py-2 text-slate-400">{row.batchTimingLabel || "—"}</td>
                                                <td className="px-3 py-2 text-right tabular-nums text-emerald-300">{row.presentCount}</td>
                                                <td className="px-3 py-2 text-right tabular-nums text-amber-300">{row.absentCount}</td>
                                                <td className="px-3 py-2 text-right tabular-nums text-cyan-300/90">{e}</td>
                                                <td className="px-3 py-2 text-right tabular-nums text-white">{p}%</td>
                                              </tr>
                                              {sessOpen ? (
                                                <tr className="bg-black/50">
                                                  <td colSpan={7} className="px-3 py-4">
                                                    {detailLoading ? (
                                                      <p className="text-sm text-slate-500">Loading session detail…</p>
                                                    ) : detailErr ? (
                                                      <p className="text-sm text-amber-400">{detailErr}</p>
                                                    ) : detail && detail.id === row.id ? (
                                                      <div className="space-y-4 text-left">
                                                        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                                                          <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3">
                                                            <p className="text-[10px] font-mono uppercase text-slate-500">Recorded</p>
                                                            <p className="mt-1 text-sm text-white">{detail.createdAt || "—"}</p>
                                                            {detail.updatedAt && detail.updatedAt !== detail.createdAt ? (
                                                              <p className="mt-0.5 text-xs text-slate-500">Updated {detail.updatedAt}</p>
                                                            ) : null}
                                                          </div>
                                                          <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3">
                                                            <p className="text-[10px] font-mono uppercase text-slate-500">Source</p>
                                                            <p className="mt-1 text-sm text-white">{detail.createdBy || "—"}</p>
                                                          </div>
                                                          <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3 sm:col-span-2">
                                                            <p className="text-[10px] font-mono uppercase text-slate-500">Notes</p>
                                                            <p className="mt-1 text-sm text-slate-300">{detail.notes?.trim() || "—"}</p>
                                                          </div>
                                                        </div>
                                                        <div className="flex flex-wrap items-center gap-2">
                                                          <span className="text-[10px] font-mono uppercase text-slate-500">Learners</span>
                                                          {(
                                                            [
                                                              ["all", "All"],
                                                              ["present", "Present & excused"],
                                                              ["absent", "Absent only"],
                                                            ] as const
                                                          ).map(([k, label]) => (
                                                            <button
                                                              key={k}
                                                              type="button"
                                                              onClick={(ev) => {
                                                                ev.stopPropagation();
                                                                setDetailRecordFilter(k);
                                                              }}
                                                              className={`rounded-lg px-2.5 py-1 text-[11px] font-medium ${
                                                                detailRecordFilter === k
                                                                  ? "bg-violet-500/25 text-violet-200 ring-1 ring-violet-500/40"
                                                                  : "bg-white/5 text-slate-400 hover:bg-white/10"
                                                              }`}
                                                            >
                                                              {label}
                                                            </button>
                                                          ))}
                                                          <span className="ml-auto text-xs text-slate-500">
                                                            {filteredDetailRecords.length} of {detail.records.length} shown · Present{" "}
                                                            {detail.presentCount} · Absent {detail.absentCount}
                                                            {detail.excusedCount ? ` · Excused ${detail.excusedCount}` : ""}
                                                            {detail.lateCount ? ` · Late ${detail.lateCount}` : ""}
                                                          </span>
                                                        </div>
                                                        <div className="overflow-x-auto rounded-xl border border-white/[0.06]">
                                                          <table className="w-full min-w-[640px] text-xs">
                                                            <thead>
                                                              <tr className="border-b border-white/[0.06] text-left text-[10px] font-mono uppercase text-slate-500">
                                                                <th className="px-3 py-2">Student</th>
                                                                <th className="px-3 py-2">Status</th>
                                                                <th className="px-3 py-2">Email</th>
                                                                <th className="px-3 py-2">Phone</th>
                                                                <th className="px-3 py-2">Remarks</th>
                                                              </tr>
                                                            </thead>
                                                            <tbody className="divide-y divide-white/[0.04]">
                                                              {filteredDetailRecords.length === 0 ? (
                                                                <tr>
                                                                  <td colSpan={5} className="px-3 py-6 text-center text-slate-500">
                                                                    No rows for this filter.
                                                                  </td>
                                                                </tr>
                                                              ) : (
                                                                filteredDetailRecords.map((r) => (
                                                                  <tr key={r.id} className="hover:bg-white/[0.02]">
                                                                    <td className="px-3 py-2">
                                                                      <span className="flex items-center gap-2">
                                                                        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-800 text-[10px] font-bold text-slate-300">
                                                                          {initials(r.studentName)}
                                                                        </span>
                                                                        <span className="text-sm text-white">{r.studentName}</span>
                                                                      </span>
                                                                    </td>
                                                                    <td className="px-3 py-2">
                                                                      <span
                                                                        className={`rounded-md px-2 py-0.5 font-mono uppercase ${
                                                                          r.status === "absent"
                                                                            ? "bg-amber-500/15 text-amber-300"
                                                                            : r.status === "excused"
                                                                              ? "bg-cyan-500/15 text-cyan-200"
                                                                              : "bg-emerald-500/15 text-emerald-300"
                                                                        }`}
                                                                      >
                                                                        {r.status}
                                                                      </span>
                                                                    </td>
                                                                    <td className="max-w-[180px] truncate px-3 py-2 text-slate-400">
                                                                      {r.email || "—"}
                                                                    </td>
                                                                    <td className="px-3 py-2 text-slate-400">{r.phone || "—"}</td>
                                                                    <td className="max-w-[200px] truncate px-3 py-2 text-slate-500">
                                                                      {r.remarks || "—"}
                                                                    </td>
                                                                  </tr>
                                                                ))
                                                              )}
                                                            </tbody>
                                                          </table>
                                                        </div>
                                                      </div>
                                                    ) : null}
                                                  </td>
                                                </tr>
                                              ) : null}
                                            </Fragment>
                                          );
                                        })}
                                      </tbody>
                                    </table>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          ) : null}
                        </Fragment>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {histMeta.totalPages > 1 ? (
                <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/[0.06] pt-4">
                  <p className="text-xs text-slate-500">
                    Page {histMeta.page} of {histMeta.totalPages}
                  </p>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      disabled={histPage <= 1 || histLoading}
                      onClick={() => setHistPage((p) => Math.max(1, p - 1))}
                      className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-slate-300 disabled:opacity-40"
                    >
                      Previous
                    </button>
                    <button
                      type="button"
                      disabled={histPage >= histMeta.totalPages || histLoading}
                      onClick={() => setHistPage((p) => p + 1)}
                      className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-slate-300 disabled:opacity-40"
                    >
                      Next
                    </button>
                  </div>
                </div>
              ) : null}
            </div>
          </section>

          <section className="rounded-3xl border border-white/[0.07] bg-[#06060b]/90 overflow-hidden">
            <div className="border-b border-white/[0.06] px-5 py-4 sm:px-6">
              <h2 className="text-sm font-semibold text-white">Student-wise attendance</h2>
              <p className="mt-0.5 text-xs text-slate-500">
                Totals per learner for the range (marks = attendance records). Attnd % = present ÷ (present + absent). Same
                data as Reports → Attendance (by student).
              </p>
            </div>
            <div className="space-y-4 p-5 sm:p-6">
              <div className="flex flex-wrap items-end gap-3">
                <label className="block">
                  <span className="text-[10px] font-mono uppercase text-slate-500">From</span>
                  <input
                    type="date"
                    value={stuRepDateFrom}
                    onChange={(e) => {
                      setStuRepDateFrom(e.target.value);
                      setStuRepPage(1);
                    }}
                    className="mt-1 block rounded-xl border border-white/10 bg-black/60 px-3 py-2 text-sm text-white"
                  />
                </label>
                <label className="block">
                  <span className="text-[10px] font-mono uppercase text-slate-500">To</span>
                  <input
                    type="date"
                    value={stuRepDateTo}
                    onChange={(e) => {
                      setStuRepDateTo(e.target.value);
                      setStuRepPage(1);
                    }}
                    className="mt-1 block rounded-xl border border-white/10 bg-black/60 px-3 py-2 text-sm text-white"
                  />
                </label>
                <label className="block min-w-[180px]">
                  <span className="text-[10px] font-mono uppercase text-slate-500">Batch</span>
                  <select
                    value={stuRepBatchId}
                    onChange={(e) => {
                      setStuRepBatchId(e.target.value);
                      setStuRepPage(1);
                    }}
                    className="mt-1 block w-full rounded-xl border border-white/10 bg-black/60 px-3 py-2 text-sm text-white"
                  >
                    <option value="">All batches</option>
                    {batches.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.code} — {b.name}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="block min-w-[140px]">
                  <span className="text-[10px] font-mono uppercase text-slate-500">Student status</span>
                  <select
                    value={stuRepStatus}
                    onChange={(e) => {
                      setStuRepStatus(e.target.value);
                      setStuRepPage(1);
                    }}
                    className="mt-1 block w-full rounded-xl border border-white/10 bg-black/60 px-3 py-2 text-sm text-white"
                  >
                    <option value="">All</option>
                    <option value="active">Active</option>
                    <option value="paused">Paused</option>
                    <option value="completed">Completed</option>
                    <option value="dropped">Dropped</option>
                  </select>
                </label>
                <label className="block min-w-[200px] flex-1">
                  <span className="text-[10px] font-mono uppercase text-slate-500">Search</span>
                  <input
                    value={stuRepSearch}
                    onChange={(e) => setStuRepSearch(e.target.value)}
                    placeholder="Name, email, phone, batch…"
                    className="mt-1 block w-full rounded-xl border border-white/10 bg-black/60 px-3 py-2 text-sm text-white placeholder:text-slate-600"
                  />
                </label>
                <button
                  type="button"
                  onClick={() => void loadStudentReport()}
                  className="rounded-xl border border-violet-500/30 bg-violet-500/10 px-4 py-2 text-xs font-mono uppercase text-violet-200 hover:bg-violet-500/20"
                >
                  Refresh
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  disabled={stuRepExporting}
                  onClick={() => void exportStudentReport("csv")}
                  className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-[11px] text-slate-300 hover:bg-white/10 disabled:opacity-50"
                >
                  {stuRepExporting ? "…" : "Export CSV"}
                </button>
                <button
                  type="button"
                  disabled={stuRepExporting}
                  onClick={() => void exportStudentReport("excel")}
                  className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-[11px] text-slate-300 hover:bg-white/10 disabled:opacity-50"
                >
                  Export Excel
                </button>
              </div>
              <div className="overflow-x-auto rounded-2xl border border-white/[0.06]">
                {stuRepLoading ? (
                  <p className="px-4 py-8 text-sm text-slate-500">Loading student report…</p>
                ) : !stuRepData?.items?.length ? (
                  <p className="px-4 py-8 text-sm text-slate-500">No rows for these filters.</p>
                ) : (
                  <table className="w-full min-w-[900px] text-sm">
                    <thead>
                      <tr className="border-b border-white/[0.06] text-left text-[10px] font-mono uppercase text-slate-500">
                        {stuRepData.columns.map((col) => (
                          <th key={col} className="whitespace-nowrap px-3 py-2.5">
                            {col}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.04]">
                      {stuRepData.items.map((row, idx) => (
                        <tr key={idx} className="hover:bg-white/[0.02]">
                          {stuRepData.columns.map((col) => (
                            <td key={col} className="whitespace-nowrap px-3 py-2 text-slate-200">
                              {String(row[col] ?? "")}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
              {stuRepData && stuRepData.totalPages > 1 ? (
                <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/[0.06] pt-4">
                  <p className="text-xs text-slate-500">
                    {stuRepData.total} students · Page {stuRepData.page} of {stuRepData.totalPages}
                  </p>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      disabled={stuRepPage <= 1 || stuRepLoading}
                      onClick={() => setStuRepPage((p) => Math.max(1, p - 1))}
                      className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-slate-300 disabled:opacity-40"
                    >
                      Previous
                    </button>
                    <button
                      type="button"
                      disabled={stuRepPage >= stuRepData.totalPages || stuRepLoading}
                      onClick={() => setStuRepPage((p) => p + 1)}
                      className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-slate-300 disabled:opacity-40"
                    >
                      Next
                    </button>
                  </div>
                </div>
              ) : stuRepData ? (
                <p className="text-xs text-slate-500">{stuRepData.total} students in range</p>
              ) : null}
            </div>
          </section>
        </>
      )}
    </div>
  );
}
