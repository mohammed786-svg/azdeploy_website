"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { hqFetch } from "@/lib/hq-client";
import type { StaffEmployee } from "@/lib/staff-types";
import { HR_DOC_TYPE_LABELS, type HrDocType } from "@/lib/hr-letter-templates";

type HrDoc = {
  id: string;
  docType: HrDocType;
  refNo: string;
  gstNo: string;
  issueDate: string;
  title: string;
  updatedAt?: number | null;
};

export default function HqEmployeeHrDocsPage() {
  const params = useParams();
  const employeeId = typeof params.id === "string" ? params.id : "";
  const [employee, setEmployee] = useState<StaffEmployee | null>(null);
  const [items, setItems] = useState<HrDoc[]>([]);
  const [err, setErr] = useState("");

  const load = useCallback(async () => {
    const [emp, docs] = await Promise.all([
      hqFetch<{ item: StaffEmployee }>(`/api/hq/employees/${employeeId}`),
      hqFetch<{ items: HrDoc[] }>(`/api/hq/employees/${employeeId}/hr-documents`),
    ]);
    setEmployee(emp.item);
    setItems(docs.items || []);
  }, [employeeId]);

  useEffect(() => {
    void load().catch((e) => setErr(e instanceof Error ? e.message : "Failed"));
  }, [load]);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <Link href="/hq/employees" className="text-xs text-[#a78bfa] hover:underline">
            ← Employees
          </Link>
          <h1 className="mt-1 text-2xl font-bold">HR Documents</h1>
          <p className="text-sm text-white/50">
            {employee?.fullName || "…"} — Offer / Appointment / Experience on company letterhead
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {(Object.keys(HR_DOC_TYPE_LABELS) as HrDocType[]).map((t) => (
            <Link
              key={t}
              href={`/hq/employees/${employeeId}/documents?type=${t}`}
              className="rounded-xl border border-[#7c3aed]/40 bg-[#7c3aed]/15 px-3 py-2 text-xs font-semibold text-[#c4b5fd]"
            >
              + {HR_DOC_TYPE_LABELS[t]}
            </Link>
          ))}
        </div>
      </div>

      {err ? <p className="text-sm text-red-300">{err}</p> : null}

      <div className="overflow-x-auto rounded-2xl border border-white/10">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-white/[0.04] text-xs uppercase tracking-wider text-white/45">
            <tr>
              <th className="px-3 py-2">Type</th>
              <th className="px-3 py-2">Ref No</th>
              <th className="px-3 py-2">GSTIN</th>
              <th className="px-3 py-2">Date</th>
              <th className="px-3 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((d) => (
              <tr key={d.id} className="border-t border-white/10">
                <td className="px-3 py-2.5">{d.title || HR_DOC_TYPE_LABELS[d.docType] || d.docType}</td>
                <td className="px-3 py-2.5">{d.refNo || "—"}</td>
                <td className="px-3 py-2.5">{d.gstNo || "—"}</td>
                <td className="px-3 py-2.5">{d.issueDate || "—"}</td>
                <td className="px-3 py-2.5">
                  <Link
                    href={`/hq/employees/${employeeId}/documents?docId=${d.id}`}
                    className="text-xs text-[#a78bfa] hover:underline"
                  >
                    Edit / PDF
                  </Link>
                </td>
              </tr>
            ))}
            {items.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-3 py-6 text-sm text-white/45">
                  No HR letters yet. Create an Offer, Appointment, or Experience certificate.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
