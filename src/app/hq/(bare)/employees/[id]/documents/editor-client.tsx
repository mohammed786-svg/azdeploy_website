"use client";

import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { hqFetch } from "@/lib/hq-client";
import type { StaffEmployee } from "@/lib/staff-types";
import LetterheadSheet from "@/components/hq/LetterheadSheet";
import {
  HR_COMPANY,
  HR_DOC_TYPE_LABELS,
  type HrDocType,
  type HrFormFieldConfig,
  type HrLetterFields,
  buildDefaultBodyHtml,
  buildDefaultSubject,
  emptyHrFields,
  formFieldsForDocType,
  normalizeLegacyHrFields,
  salaryAmountToWords,
} from "@/lib/hr-letter-templates";
import { sanitizeForPdfFilename } from "@/lib/hq-print-pdf-title";

type HrDoc = {
  id: string;
  employeeId: string;
  docType: HrDocType;
  refNo: string;
  gstNo: string;
  issueDate: string;
  title: string;
  bodyHtml: string;
  fields: Partial<HrLetterFields> & Record<string, unknown>;
};

function formatDisplayDate(iso: string): string {
  if (!iso) return "";
  const d = new Date(`${iso}T12:00:00`);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-IN", { day: "2-digit", month: "2-digit", year: "numeric" });
}

function fieldValue(fields: HrLetterFields, key: HrFormFieldConfig["key"], docType: HrDocType): string {
  if (key === "docType") return docType;
  return fields[key as keyof HrLetterFields] ?? "";
}

export default function HqEmployeeHrDocumentEditorPage() {
  const params = useParams();
  const search = useSearchParams();
  const router = useRouter();
  const employeeId = typeof params.id === "string" ? params.id : "";
  const docId = search.get("docId") || "";
  const initialType = (search.get("type") as HrDocType) || "offer_letter";

  const [employee, setEmployee] = useState<StaffEmployee | null>(null);
  const [docType, setDocType] = useState<HrDocType>(initialType);
  const [refNo, setRefNo] = useState("");
  const [gstNo, setGstNo] = useState(HR_COMPANY.gstNo);
  const [issueDate, setIssueDate] = useState(new Date().toISOString().slice(0, 10));
  const [title, setTitle] = useState("");
  const [fields, setFields] = useState<HrLetterFields>(emptyHrFields());
  const [bodyHtml, setBodyHtml] = useState("");
  const [savedId, setSavedId] = useState(docId);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [previewMode, setPreviewMode] = useState(false);
  const bodyTouched = useRef(false);

  const formFields = useMemo(() => formFieldsForDocType(docType), [docType]);

  const loadEmployee = useCallback(async () => {
    const d = await hqFetch<{ item: StaffEmployee }>(`/api/hq/employees/${employeeId}`);
    setEmployee(d.item);
    return d.item;
  }, [employeeId]);

  useEffect(() => {
    if (!employeeId) return;
    void (async () => {
      try {
        const emp = await loadEmployee();
        bodyTouched.current = false;

        if (docId) {
          const d = await hqFetch<{ item: HrDoc }>(`/api/hq/hr-documents/${docId}`);
          const item = d.item;
          setSavedId(item.id);
          setDocType(item.docType);
          setRefNo(item.refNo || "");
          setGstNo(item.gstNo || HR_COMPANY.gstNo);
          setIssueDate(item.issueDate || new Date().toISOString().slice(0, 10));
          setTitle(item.title || HR_DOC_TYPE_LABELS[item.docType]);
          const legacy = normalizeLegacyHrFields(item.fields || {});
          const f = emptyHrFields({
            employeeName: emp.fullName,
            designation: emp.jobTitle || "",
            department: emp.department || "",
            employeeEmail: emp.email || "",
            employeeMobile: emp.phone || "",
            companyGstin: item.gstNo || HR_COMPANY.gstNo,
            ...legacy,
          });
          setFields(f);
          setBodyHtml(item.bodyHtml || buildDefaultBodyHtml(item.docType, f));
          bodyTouched.current = Boolean(item.bodyHtml);
        } else {
          const f = emptyHrFields({
            employeeName: emp.fullName,
            designation: emp.jobTitle || "",
            department: emp.department || "",
            employeeEmail: emp.email || "",
            employeeMobile: emp.phone || "",
            companyGstin: HR_COMPANY.gstNo,
            subject: buildDefaultSubject(initialType, emp.jobTitle || ""),
          });
          setFields(f);
          setTitle(HR_DOC_TYPE_LABELS[initialType]);
          setBodyHtml(buildDefaultBodyHtml(initialType, f));
          setRefNo(`AZD/HR/${new Date().getFullYear()}/`);
        }
      } catch (e) {
        setErr(e instanceof Error ? e.message : "Failed to load");
      }
    })();
  }, [employeeId, docId, initialType, loadEmployee]);

  function setField(key: keyof HrLetterFields, value: string) {
    setFields((prev) => {
      let next: HrLetterFields = { ...prev, [key]: value };
      if (key === "salaryAmount") {
        next = { ...next, salaryInWords: salaryAmountToWords(value) };
      }
      if (key === "designation") {
        next = { ...next, subject: buildDefaultSubject(docType, next) };
      }
      if (!bodyTouched.current) {
        setBodyHtml(buildDefaultBodyHtml(docType, next));
      }
      return next;
    });
  }

  function onDocTypeChange(nextType: HrDocType) {
    bodyTouched.current = false;
    setDocType(nextType);
    setTitle(HR_DOC_TYPE_LABELS[nextType]);
    setFields((prev) => {
      const next = {
        ...prev,
        subject: buildDefaultSubject(nextType, prev),
      };
      setBodyHtml(buildDefaultBodyHtml(nextType, next));
      return next;
    });
  }

  function regenerateBody() {
    bodyTouched.current = false;
    const next = {
      ...fields,
      salaryInWords: fields.salaryInWords || salaryAmountToWords(fields.salaryAmount),
      subject: fields.subject || buildDefaultSubject(docType, fields),
    };
    setFields(next);
    setBodyHtml(buildDefaultBodyHtml(docType, next));
  }

  async function save() {
    setBusy(true);
    setErr("");
    try {
      const payload = {
        docType,
        refNo,
        gstNo,
        issueDate,
        title: title || HR_DOC_TYPE_LABELS[docType],
        bodyHtml,
        fields: { ...fields, companyGstin: gstNo },
      };
      if (savedId) {
        await hqFetch(
          `/api/hq/hr-documents/${savedId}`,
          { method: "PATCH", body: JSON.stringify(payload) },
          { successMessage: "Document saved" },
        );
      } else {
        const res = await hqFetch<{ item: HrDoc }>(
          `/api/hq/employees/${employeeId}/hr-documents/create`,
          { method: "POST", body: JSON.stringify(payload) },
          { successMessage: "Document created" },
        );
        setSavedId(res.item.id);
        router.replace(`/hq/employees/${employeeId}/documents?docId=${res.item.id}`);
      }
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Save failed");
    } finally {
      setBusy(false);
    }
  }

  const dateLabel = useMemo(() => formatDisplayDate(issueDate), [issueDate]);

  useEffect(() => {
    if (!employee) return;
    const prev = document.title;
    document.title = `${sanitizeForPdfFilename(employee.fullName)} — ${sanitizeForPdfFilename(title || HR_DOC_TYPE_LABELS[docType])}`;
    return () => {
      document.title = prev;
    };
  }, [employee, title, docType]);

  if (err && !employee) {
    return (
      <div className="p-6 text-red-300">
        {err}{" "}
        <Link href="/hq/employees" className="underline">
          Back
        </Link>
      </div>
    );
  }

  const letterInner = (
    <>
      {title ? (
        <p className="mb-1 text-center text-[12pt] font-bold uppercase tracking-wide">{title}</p>
      ) : null}
      {gstNo ? (
        <p className="mb-1 text-[10.5pt]">
          <strong>GSTIN: {gstNo}</strong>
        </p>
      ) : null}
      <div dangerouslySetInnerHTML={{ __html: bodyHtml }} />
    </>
  );

  function renderFormField(cfg: HrFormFieldConfig) {
    const label = cfg.required ? `${cfg.label} *` : cfg.label;
    const commonClass = "mt-1 w-full rounded-lg border border-white/15 bg-black/40 px-3 py-2 text-sm";

    if (cfg.key === "docType") {
      return (
        <div key={cfg.key}>
          <label className="text-xs text-white/50">{label}</label>
          <select value={docType} onChange={(e) => onDocTypeChange(e.target.value as HrDocType)} className={commonClass}>
            {(Object.keys(HR_DOC_TYPE_LABELS) as HrDocType[]).map((k) => (
              <option key={k} value={k}>
                {HR_DOC_TYPE_LABELS[k]}
              </option>
            ))}
          </select>
        </div>
      );
    }

    if (cfg.key === "issueDate") {
      return (
        <div key={cfg.key}>
          <label className="text-xs text-white/50">{label}</label>
          <input type="date" value={issueDate} onChange={(e) => setIssueDate(e.target.value)} className={commonClass} />
        </div>
      );
    }

    if (cfg.key === "refNo") {
      return (
        <div key={cfg.key}>
          <label className="text-xs text-white/50">{label}</label>
          <input value={refNo} onChange={(e) => setRefNo(e.target.value)} className={commonClass} placeholder="AZD/HR/2026/001" />
        </div>
      );
    }

    if (cfg.key === "companyGstin") {
      return (
        <div key={cfg.key}>
          <label className="text-xs text-white/50">{label}</label>
          <input value={gstNo} onChange={(e) => setGstNo(e.target.value)} className={commonClass} placeholder="29XXXXXXXXXX1Z5" />
        </div>
      );
    }

    const fieldKey = cfg.key as keyof HrLetterFields;
    const value = fieldValue(fields, cfg.key, docType);
    const spanFull = cfg.type === "textarea" || cfg.key === "salaryInWords" || cfg.key === "employeeAddress";

    if (cfg.type === "textarea") {
      return (
        <div key={cfg.key} className={spanFull ? "sm:col-span-2" : ""}>
          <label className="text-xs text-white/50">{label}</label>
          <textarea
            value={value}
            onChange={(e) => setField(fieldKey, e.target.value)}
            rows={2}
            className={commonClass}
          />
        </div>
      );
    }

    return (
      <div key={cfg.key} className={spanFull ? "sm:col-span-2" : ""}>
        <label className="text-xs text-white/50">{label}</label>
        <input
          value={value}
          readOnly={cfg.readOnly}
          onChange={(e) => setField(fieldKey, e.target.value)}
          className={`${commonClass}${cfg.readOnly ? " text-white/45" : ""}`}
          placeholder={cfg.placeholder}
        />
      </div>
    );
  }

  if (previewMode) {
    return (
      <div>
        <div className="print:hidden sticky top-0 z-40 flex flex-wrap gap-2 border-b border-neutral-300 bg-white px-4 py-3 text-sm text-neutral-900">
          <button type="button" onClick={() => setPreviewMode(false)} className="rounded border px-3 py-1.5">
            ← Edit
          </button>
          <button type="button" onClick={() => void save()} disabled={busy} className="rounded bg-violet-700 px-3 py-1.5 text-white disabled:opacity-50">
            Save
          </button>
          <button type="button" onClick={() => window.print()} className="rounded bg-neutral-900 px-3 py-1.5 text-white">
            Print / Save as PDF
          </button>
          <Link href={`/hq/employees/${employeeId}/hr-docs`} className="rounded border px-3 py-1.5">
            All documents
          </Link>
        </div>
        <LetterheadSheet refNo={refNo} dateLabel={dateLabel} editableMeta onRefNoChange={setRefNo}>
          {letterInner}
        </LetterheadSheet>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl space-y-4 bg-[#07070c] p-4 text-[#e8eef5] sm:p-6 min-h-screen">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <Link href={`/hq/employees/${employeeId}/hr-docs`} className="text-xs text-[#a78bfa] hover:underline">
            ← Documents for {employee?.fullName || "employee"}
          </Link>
          <h1 className="mt-1 text-2xl font-bold">HR Letter on Letterhead</h1>
          <p className="text-sm text-white/50">Fill in the fields — salary in words updates automatically. Preview on letterhead, then Print / Save as PDF.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={() => void save()} disabled={busy} className="rounded-xl bg-[#7c3aed] px-4 py-2 text-sm font-semibold disabled:opacity-50">
            {busy ? "Saving…" : savedId ? "Save" : "Create & save"}
          </button>
          <button type="button" onClick={() => setPreviewMode(true)} className="rounded-xl border border-white/20 px-4 py-2 text-sm">
            Preview / PDF
          </button>
        </div>
      </div>

      {err ? <p className="text-sm text-red-300">{err}</p> : null}

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="space-y-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
          <div className="grid gap-3 sm:grid-cols-2">
            {formFields.map(renderFormField)}
          </div>

          <div>
            <label className="text-xs text-white/50">Title on letter</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 w-full rounded-lg border border-white/15 bg-black/40 px-3 py-2 text-sm"
              placeholder="Offer Letter"
            />
          </div>

          <button type="button" onClick={regenerateBody} className="rounded-xl border border-[#0ea5e9]/40 px-4 py-2 text-sm text-[#7dd3fc]">
            Regenerate letter body from fields
          </button>

          <div>
            <label className="text-xs text-white/50">Letter body (HTML — fully editable)</label>
            <textarea
              value={bodyHtml}
              onChange={(e) => {
                bodyTouched.current = true;
                setBodyHtml(e.target.value);
              }}
              rows={14}
              className="mt-1 w-full rounded-lg border border-white/15 bg-black/40 px-3 py-2 font-mono text-xs leading-relaxed"
            />
          </div>
        </div>

        <div className="overflow-auto rounded-2xl border border-white/10 bg-neutral-300/20 p-2">
          <p className="mb-2 px-2 text-xs text-white/45">Live letterhead preview (scaled) — Ref No / Date sit on the printed lines</p>
          <div className="mx-auto overflow-hidden" style={{ width: "calc(210mm * 0.58)", height: "calc(297mm * 0.58)" }}>
            <div className="origin-top-left scale-[0.58]" style={{ width: "210mm", height: "297mm" }}>
              <LetterheadSheet refNo={refNo} dateLabel={dateLabel} embedded>
                {letterInner}
              </LetterheadSheet>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
