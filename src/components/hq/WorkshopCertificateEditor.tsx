"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { hqFetch } from "@/lib/hq-client";
import WorkshopCertificateDocument from "@/components/hq/WorkshopCertificateDocument";
import LandscapePrintShell from "@/components/hq/LandscapePrintShell";
import {
  EMPTY_WORKSHOP_CERTIFICATE_FORM,
  type WorkshopCertificate,
  type WorkshopCertificateForm,
} from "@/lib/workshop-certificate-types";

type Props = {
  initialForm?: WorkshopCertificateForm;
  certificateId?: string;
  publicUrl?: string;
};

export function formFromCertificate(item: WorkshopCertificate): WorkshopCertificateForm {
  return {
    studentName: item.studentName,
    workshopTitle: item.workshopTitle,
    workshopSubtitle: item.workshopSubtitle,
    workshopOverview: item.workshopOverview,
    workshopDate: item.workshopDate,
    duration: item.duration,
    durationType: item.durationType,
    venue: item.venue,
    institutionPartnerName: item.institutionPartnerName,
    institutionPartnerLogoUrl: item.institutionPartnerLogoUrl,
    isActive: item.isActive,
  };
}

export default function WorkshopCertificateEditor({ initialForm, certificateId, publicUrl }: Props) {
  const router = useRouter();
  const [form, setForm] = useState<WorkshopCertificateForm>(initialForm ?? { ...EMPTY_WORKSHOP_CERTIFICATE_FORM });
  const [saving, setSaving] = useState(false);
  const [logoUploading, setLogoUploading] = useState(false);
  const [err, setErr] = useState("");
  const [savedPublicUrl, setSavedPublicUrl] = useState(publicUrl ?? "");

  async function uploadLogo(file: File) {
    setLogoUploading(true);
    setErr("");
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await hqFetch<{ url: string }>("/api/hq/workshop-certificates/upload-partner-logo", {
        method: "POST",
        body: fd,
      });
      setForm((f) => ({ ...f, institutionPartnerLogoUrl: res.url }));
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Logo upload failed");
    } finally {
      setLogoUploading(false);
    }
  }

  async function save() {
    if (!form.studentName.trim()) {
      setErr("Student name is required");
      return;
    }
    setSaving(true);
    setErr("");
    try {
      if (certificateId) {
        await hqFetch(`/api/hq/workshop-certificates/${certificateId}`, {
          method: "PATCH",
          body: JSON.stringify(form),
        });
      } else {
        const res = await hqFetch<{ item: WorkshopCertificate }>("/api/hq/workshop-certificates", {
          method: "POST",
          body: JSON.stringify(form),
        });
        setSavedPublicUrl(res.item.publicUrl);
        router.replace(`/hq/workshop-certificates/${res.item.id}/edit`);
      }
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  const linkUrl =
    savedPublicUrl && typeof window !== "undefined"
      ? `${window.location.origin}${savedPublicUrl}`
      : savedPublicUrl || "";

  return (
    <div className="min-h-screen bg-[#050508] text-[#e8eef5]">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-32 -left-32 h-[420px] w-[420px] rounded-full bg-[#7c3aed]/15 blur-[100px]" />
        <div className="absolute top-1/3 -right-24 h-[380px] w-[380px] rounded-full bg-[#00d4ff]/10 blur-[90px]" />
      </div>

      <div className="relative mx-auto max-w-[1600px] px-4 py-6 sm:px-8 sm:py-8">
        <header className="mb-6 flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-[10px] font-mono uppercase tracking-[0.35em] text-[#64748b]">Workshops</p>
            <h1 className="mt-2 text-2xl font-bold text-white sm:text-3xl">
              {certificateId ? "Edit certificate" : "New workshop certificate"}
            </h1>
            <p className="mt-1 max-w-2xl text-sm text-[#94a3b8]">
              Fill in the details on the left. The certificate preview updates live on the right.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              href="/hq/workshop-certificates"
              className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2 text-xs font-mono uppercase tracking-wider text-[#94a3b8] hover:bg-white/[0.08]"
            >
              ← Back to list
            </Link>
            {certificateId ? (
              <Link
                href={`/hq/workshop-certificates/${certificateId}/print`}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xl border border-[#a78bfa]/40 bg-[#a78bfa]/10 px-4 py-2 text-xs font-mono uppercase tracking-wider text-[#c4b5fd] hover:bg-[#a78bfa]/20"
              >
                Open print view
              </Link>
            ) : null}
          </div>
        </header>

        {err ? (
          <p className="mb-4 rounded border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-300" role="alert">
            {err}
          </p>
        ) : null}

        {linkUrl ? (
          <p className="mb-4 rounded border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-200">
            Student link:{" "}
            <a href={savedPublicUrl} target="_blank" rel="noopener noreferrer" className="underline">
              {linkUrl}
            </a>
          </p>
        ) : null}

        <div className="grid gap-6 xl:grid-cols-[380px_1fr]">
          <div className="space-y-3 rounded-2xl border border-white/10 bg-[#07070c]/80 p-5">
            <label className="block text-sm">
              <span className="text-[10px] font-mono uppercase text-[#64748b]">Student name *</span>
              <input
                value={form.studentName}
                onChange={(e) => setForm((f) => ({ ...f, studentName: e.target.value }))}
                className="mt-1 w-full rounded-xl border border-white/10 bg-black/50 px-3 py-2 text-white"
                placeholder="e.g. Aarav Patil"
              />
            </label>
            <label className="block text-sm">
              <span className="text-[10px] font-mono uppercase text-[#64748b]">Workshop date</span>
              <input
                value={form.workshopDate}
                onChange={(e) => setForm((f) => ({ ...f, workshopDate: e.target.value }))}
                className="mt-1 w-full rounded-xl border border-white/10 bg-black/50 px-3 py-2 text-white"
                placeholder="e.g. 25th May, 2025"
              />
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label className="block text-sm">
                <span className="text-[10px] font-mono uppercase text-[#64748b]">Duration</span>
                <input
                  value={form.duration}
                  onChange={(e) => setForm((f) => ({ ...f, duration: e.target.value }))}
                  className="mt-1 w-full rounded-xl border border-white/10 bg-black/50 px-3 py-2 text-white"
                  placeholder="2 Days"
                />
              </label>
              <label className="block text-sm">
                <span className="text-[10px] font-mono uppercase text-[#64748b]">Duration type</span>
                <input
                  value={form.durationType}
                  onChange={(e) => setForm((f) => ({ ...f, durationType: e.target.value }))}
                  className="mt-1 w-full rounded-xl border border-white/10 bg-black/50 px-3 py-2 text-white"
                  placeholder="2 DAYS WORKSHOP"
                />
              </label>
            </div>
            <label className="block text-sm">
              <span className="text-[10px] font-mono uppercase text-[#64748b]">Venue</span>
              <input
                value={form.venue}
                onChange={(e) => setForm((f) => ({ ...f, venue: e.target.value }))}
                className="mt-1 w-full rounded-xl border border-white/10 bg-black/50 px-3 py-2 text-white"
              />
            </label>
            <label className="block text-sm">
              <span className="text-[10px] font-mono uppercase text-[#64748b]">Institution partner name</span>
              <input
                value={form.institutionPartnerName}
                onChange={(e) => setForm((f) => ({ ...f, institutionPartnerName: e.target.value }))}
                className="mt-1 w-full rounded-xl border border-white/10 bg-black/50 px-3 py-2 text-white"
              />
            </label>
            <label className="block text-sm">
              <span className="text-[10px] font-mono uppercase text-[#64748b]">Institution partner logo</span>
              <input
                type="file"
                accept="image/*"
                disabled={logoUploading}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) void uploadLogo(file);
                }}
                className="mt-1 w-full text-sm text-[#cbd5e1]"
              />
              {form.institutionPartnerLogoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={form.institutionPartnerLogoUrl} alt="Partner logo" className="mt-2 h-12 object-contain" />
              ) : null}
            </label>
            <label className="block text-sm">
              <span className="text-[10px] font-mono uppercase text-[#64748b]">Workshop title</span>
              <input
                value={form.workshopTitle}
                onChange={(e) => setForm((f) => ({ ...f, workshopTitle: e.target.value }))}
                className="mt-1 w-full rounded-xl border border-white/10 bg-black/50 px-3 py-2 text-white"
              />
            </label>
            <label className="block text-sm">
              <span className="text-[10px] font-mono uppercase text-[#64748b]">Workshop subtitle</span>
              <input
                value={form.workshopSubtitle}
                onChange={(e) => setForm((f) => ({ ...f, workshopSubtitle: e.target.value }))}
                className="mt-1 w-full rounded-xl border border-white/10 bg-black/50 px-3 py-2 text-white"
              />
            </label>
            <label className="block text-sm">
              <span className="text-[10px] font-mono uppercase text-[#64748b]">Workshop overview</span>
              <textarea
                value={form.workshopOverview}
                onChange={(e) => setForm((f) => ({ ...f, workshopOverview: e.target.value }))}
                rows={4}
                className="mt-1 w-full rounded-xl border border-white/10 bg-black/50 px-3 py-2 text-white"
              />
            </label>
            <label className="flex items-center gap-2 text-sm text-[#cbd5e1]">
              <input
                type="checkbox"
                checked={form.isActive}
                onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.checked }))}
              />
              Active (student link works)
            </label>
            <button
              type="button"
              disabled={saving}
              onClick={() => void save()}
              className="w-full rounded-xl bg-gradient-to-r from-[#7c3aed] to-[#00d4ff] px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
            >
              {saving ? "Saving…" : certificateId ? "Update certificate" : "Create certificate"}
            </button>
          </div>

          <div className="rounded-2xl border border-white/10 bg-neutral-200/95 p-4 overflow-auto">
            <p className="mb-3 text-[10px] font-mono uppercase tracking-wider text-neutral-600">Live preview</p>
            <div className="mx-auto w-full max-w-[297mm]">
              <LandscapePrintShell>
                <WorkshopCertificateDocument data={form} />
              </LandscapePrintShell>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
