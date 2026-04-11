/** Indian mobile in E.164: +91 followed by 10 digits starting with 6–9. */
export const INDIA_MOBILE_E164_RE = /^\+91[6-9]\d{9}$/;

/**
 * Normalize input to +91 E.164 for **India mobile only** (country code fixed).
 * Accepts: 10-digit mobile, 91XXXXXXXXXX, +91XXXXXXXXXX (spaces allowed).
 */
export function normalizeToE164India(raw: string): string | null {
  const d = raw.replace(/[\s\-().]/g, "").trim();
  if (!d) return null;
  if (d.startsWith("+")) {
    return INDIA_MOBILE_E164_RE.test(d) ? d : null;
  }
  let n = d;
  if (n.startsWith("0")) n = n.slice(1);
  if (n.length === 10 && /^[6-9]\d{9}$/.test(n)) {
    return `+91${n}`;
  }
  if (n.length === 12 && n.startsWith("91") && /^91[6-9]\d{9}$/.test(n)) {
    return `+${n}`;
  }
  return null;
}

export type IndiaPhoneValidation = {
  ok: boolean;
  e164: string | null;
  /** User-facing message when ok is false */
  error?: string;
};

/** Strict validation for enquiry / OTP: India (+91) mobile only. */
export function validateIndiaMobileForEnquiry(raw: string): IndiaPhoneValidation {
  const stripped = raw.replace(/[\s\-().]/g, "").trim();
  if (!stripped) {
    return { ok: false, e164: null, error: "Enter your mobile number." };
  }
  if (stripped.startsWith("+") && !stripped.startsWith("+91")) {
    return {
      ok: false,
      e164: null,
      error: "Only Indian numbers (+91) are accepted. Enter 10 digits or +91 and your 10-digit mobile.",
    };
  }
  const e164 = normalizeToE164India(raw);
  if (!e164) {
    return {
      ok: false,
      e164: null,
      error: "Enter a valid Indian mobile: 10 digits starting with 6–9, or +91 followed by 10 digits.",
    };
  }
  return { ok: true, e164 };
}
