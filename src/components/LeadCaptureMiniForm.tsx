"use client";

import { useState } from "react";
import { resolveApiOrigin } from "@/lib/api-http";

type Props = {
  source: string;
  compact?: boolean;
  stacked?: boolean;
  onSubmitted?: () => void;
};

const COUNTRY_CODES = [
  { code: "+91", min: 10, max: 10 },
  { code: "+1", min: 10, max: 10 },
  { code: "+44", min: 10, max: 10 },
  { code: "+61", min: 9, max: 9 },
  { code: "+65", min: 8, max: 8 },
  { code: "+971", min: 9, max: 9 },
  { code: "+974", min: 8, max: 8 },
  { code: "+966", min: 9, max: 9 },
  { code: "+60", min: 9, max: 10 },
  { code: "+49", min: 10, max: 11 },
];

export default function LeadCaptureMiniForm({ source, compact = false, stacked = false, onSubmitted }: Props) {
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [countryCode, setCountryCode] = useState("+91");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  function hasInvalidNameChars(v: string): boolean {
    // Reject emojis and special characters; allow letters and spaces.
    return /[^A-Za-z\s]/.test(v);
  }

  function normalizeInternationalPhone(code: string, raw: string): string | null {
    const digits = raw.replace(/\D+/g, "");
    if (!digits) return null;
    const cfg = COUNTRY_CODES.find((c) => c.code === code);
    if (!cfg) return null;
    if (!new RegExp(`^\\d{${cfg.min},${cfg.max}}$`).test(digits)) return null;
    return `${code}${digits}`;
  }

  function phoneHint(code: string): string {
    const cfg = COUNTRY_CODES.find((c) => c.code === code);
    if (!cfg) return "Enter valid digits";
    return cfg.min === cfg.max ? `${cfg.min} digits` : `${cfg.min}-${cfg.max} digits`;
  }

  function maxDigitsFor(code: string): number {
    const cfg = COUNTRY_CODES.find((c) => c.code === code);
    return cfg ? cfg.max : 14;
  }

  const nameTrim = name.trim();
  const mobileTrim = mobile.trim();
  const nameError =
    !nameTrim
      ? ""
      : hasInvalidNameChars(nameTrim)
        ? "Special characters and emojis are not allowed in name."
        : "";
  const phoneE164 = normalizeInternationalPhone(countryCode, mobileTrim);
  const mobileError = mobileTrim && !phoneE164 ? "Enter a valid mobile number for selected country code." : "";

  const gridClass = stacked
    ? "grid grid-cols-1 gap-2"
    : compact
      ? "grid gap-2 sm:grid-cols-3"
      : "grid gap-2 sm:grid-cols-4";
  const msgSpanClass = stacked ? "" : compact ? "sm:col-span-3" : "sm:col-span-4";

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const fullName = name.trim();
    const phone = mobile.trim();
    const mail = email.trim();
    if (!fullName || !phone) {
      setMsg("Name and mobile number are required.");
      return;
    }
    if (hasInvalidNameChars(fullName)) {
      setMsg("Special characters and emojis are not allowed in name.");
      return;
    }
    if (!phoneE164) {
      setMsg("Enter a valid mobile number for selected country code.");
      return;
    }
    setLoading(true);
    setMsg("");
    try {
      const base = resolveApiOrigin().replace(/\/$/, "");
      const res = await fetch(`${base}/api/v1/public/enquiry`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName,
          phone: phoneE164,
          email: mail || "NA",
          degree: "NA",
          degreeOther: "NA",
          college: "NA",
          passoutYear: "-1",
          city: "NA",
          preferredBatch: "NA",
          message: "NA",
          source,
        }),
      });
      const text = await res.text();
      if (!res.ok) throw new Error(text || "Failed");
      setMsg("Thanks! Your details are submitted.");
      setName("");
      setMobile("");
      setEmail("");
      onSubmitted?.();
    } catch {
      setMsg("Submission failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className={gridClass}
    >
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Name *"
        className="rounded border border-white/15 bg-black/40 px-3 py-2 text-white text-sm"
        required
      />
      <div className={`${stacked ? "grid grid-cols-1" : "grid grid-cols-[84px_1fr]"} gap-2 min-w-0`}>
        <select
          value={countryCode}
          onChange={(e) => setCountryCode(e.target.value)}
          className="rounded border border-white/15 bg-black/40 px-2 py-2 text-white text-sm min-w-0"
        >
          {COUNTRY_CODES.map((c) => (
            <option key={c.code} value={c.code}>
              {c.code}
            </option>
          ))}
        </select>
        <input
          value={mobile}
          onChange={(e) => setMobile(e.target.value)}
          placeholder="Mobile *"
          className="rounded border border-white/15 bg-black/40 px-3 py-2 text-white text-sm min-w-0"
          inputMode="numeric"
          title="Enter a valid mobile number"
          maxLength={maxDigitsFor(countryCode)}
          required
        />
      </div>
      <p className={`${msgSpanClass} text-[10px] text-[#94a3b8] break-words`}>Selected {countryCode} · {phoneHint(countryCode)}</p>
      <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email (optional)" className="rounded border border-white/15 bg-black/40 px-3 py-2 text-white text-sm min-w-0" />
      <button type="submit" disabled={loading} className="rounded border border-[#00d4ff]/55 bg-[#00d4ff]/20 px-3 py-2 text-[#bff3ff] text-sm font-semibold hover:bg-[#00d4ff]/30 disabled:opacity-50">
        {loading ? "Submitting..." : "Submit"}
      </button>
      {nameError ? (
        <p className={`${msgSpanClass} text-xs text-amber-300/90 break-words`}>{nameError}</p>
      ) : null}
      {mobileError ? (
        <p className={`${msgSpanClass} text-xs text-amber-300/90 break-words`}>{mobileError}</p>
      ) : null}
      {msg ? (
        <p className={`${msgSpanClass} text-xs text-white/80 break-words`}>
          {msg}
        </p>
      ) : null}
    </form>
  );
}
