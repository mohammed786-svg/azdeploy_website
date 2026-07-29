import { rupeesIntegerInWords } from "@/lib/amount-in-words";

export type HrDocType = "offer_letter" | "appointment_letter" | "experience_letter";

export type HrLetterFields = {
  refNo: string;
  issueDate: string;
  companyGstin: string;
  employeeName: string;
  employeeCode: string;
  designation: string;
  department: string;
  joiningDate: string;
  salaryAmount: string;
  salaryInWords: string;
  probationPeriod: string;
  noticePeriod: string;
  workLocation: string;
  reportingTo: string;
  employeePan: string;
  employeeAddress: string;
  employeeEmail: string;
  employeeMobile: string;
  subject: string;
  bodyHtml: string;
};

export const HR_DOC_LABELS: Record<HrDocType, string> = {
  offer_letter: "Offer Letter",
  appointment_letter: "Appointment Letter",
  experience_letter: "Experience Letter",
};

/** @deprecated Use HR_DOC_LABELS */
export const HR_DOC_TYPE_LABELS = HR_DOC_LABELS;

export const HR_COMPANY = {
  name: "AZDeploy Academy",
  addressLine: "Belagavi, Karnataka, India",
  gstin: "29AAKCA1234A1Z5",
  /** Alias used by editor / API payloads */
  gstNo: "29AAKCA1234A1Z5",
  letterheadSrc: "/company_letter_head_a4.jpg",
  signatureSrc: "/signature.png",
};

/** Standard serif font for formal HR letters (offer / appointment / experience). */
export const HR_LETTER_FONT = '"Times New Roman", Times, serif';

export function emptyHrFields(overrides: Partial<HrLetterFields> = {}): HrLetterFields {
  const base: HrLetterFields = {
    refNo: "",
    issueDate: new Date().toISOString().slice(0, 10),
    companyGstin: HR_COMPANY.gstin,
    employeeName: "",
    employeeCode: "",
    designation: "",
    department: "",
    joiningDate: "",
    salaryAmount: "",
    salaryInWords: "",
    probationPeriod: "3 months",
    noticePeriod: "30 days",
    workLocation: "Belagavi, Karnataka",
    reportingTo: "",
    employeePan: "",
    employeeAddress: "",
    employeeEmail: "",
    employeeMobile: "",
    subject: "",
    bodyHtml: "",
  };
  const merged = { ...base, ...overrides };
  if (merged.salaryAmount && !merged.salaryInWords) {
    merged.salaryInWords = salaryAmountToWords(merged.salaryAmount);
  }
  return merged;
}

const HR_LETTER_FIELD_KEYS: (keyof HrLetterFields)[] = [
  "refNo", "issueDate", "companyGstin", "employeeName", "employeeCode", "designation", "department",
  "joiningDate", "salaryAmount", "salaryInWords", "probationPeriod", "noticePeriod", "workLocation",
  "reportingTo", "employeePan", "employeeAddress", "employeeEmail", "employeeMobile", "subject", "bodyHtml",
];

/** Maps saved JSON from older editor versions into current field names. */
export function normalizeLegacyHrFields(raw: Record<string, unknown>): Partial<HrLetterFields> {
  const out: Partial<HrLetterFields> = {};
  const map: Record<string, keyof HrLetterFields> = {
    companyGstNo: "companyGstin",
    address: "employeeAddress",
  };
  for (const [k, v] of Object.entries(raw)) {
    if (v == null) continue;
    const key = (map[k] || k) as keyof HrLetterFields;
    if (HR_LETTER_FIELD_KEYS.includes(key)) out[key] = String(v);
  }
  if (raw.probationMonths != null && !out.probationPeriod) {
    out.probationPeriod = `${raw.probationMonths} months`;
  }
  if (raw.noticePeriodDays != null && !out.noticePeriod) {
    out.noticePeriod = `${raw.noticePeriodDays} days`;
  }
  return out;
}

export function salaryAmountToWords(amount: string): string {
  const n = parseInt(String(amount).replace(/[^\d]/g, ""), 10);
  if (!n || Number.isNaN(n)) return "";
  return `Rupees ${rupeesIntegerInWords(n)} Only`;
}

function formatSalaryDisplay(amount: string): string {
  const n = parseInt(String(amount).replace(/[^\d]/g, ""), 10);
  if (!n || Number.isNaN(n)) return amount || "—";
  return `₹${n.toLocaleString("en-IN")}/-`;
}

function fmtDate(iso: string): string {
  if (!iso) return "—";
  const d = new Date(`${iso}T12:00:00`);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" });
}

/** Company proprietor signature stamp (black bg removed via screen blend on white paper). */
function companySignatureImgHtml(): string {
  return `<img src="${HR_COMPANY.signatureSrc}" alt="Authorised Signatory — AZDeploy Academy" class="hr-company-signature" style="display:block;height:28mm;width:auto;max-width:88mm;object-fit:contain;object-position:left bottom;mix-blend-mode:screen;" />`;
}

function companySignatoryHtml(): string {
  return `<p style="margin:0 0 2px">Yours sincerely,</p>
<div style="height:28mm;display:flex;align-items:flex-end;overflow:hidden">${companySignatureImgHtml()}</div>`;
}

function offerLetterSignatoryRowHtml(f: HrLetterFields): string {
  return `<div style="margin-top:8px">
  <p style="margin:0 0 3px"><strong>Employee Acceptance</strong></p>
  <p style="margin:0 0 8px;line-height:1.35">I, <strong>${f.employeeName || "[Employee Name]"}</strong>, confirm that I have read, understood and accepted the terms stated in this Offer Letter and agree to comply with the applicable policies and lawful instructions of AZDeploy Academy.</p>
</div>
<div style="margin-top:6px;display:flex;justify-content:space-between;align-items:flex-end;gap:10mm">
  <div style="flex:1;min-width:0">
    ${companySignatoryHtml()}
  </div>
  <div style="flex-shrink:0;width:58mm">
    <p style="margin:0 0 2px;text-align:right"><strong>Employee Signature</strong></p>
    <div style="height:28mm;display:flex;flex-direction:column;justify-content:flex-end;align-items:stretch">
      <p style="margin:0 0 6px;border-bottom:1px solid #111;padding-bottom:2px;min-height:12px">&nbsp;</p>
      <p style="margin:0;text-align:right"><strong>Date:</strong> ________________</p>
    </div>
  </div>
</div>`;
}

function b(text: string, fallback = "—"): string {
  return `<strong>${text || fallback}</strong>`;
}

function buildOfferBodyHtml(f: HrLetterFields): string {
  const salaryWords = f.salaryInWords || salaryAmountToWords(f.salaryAmount);
  const salaryDisplay = formatSalaryDisplay(f.salaryAmount);
  const salaryClause =
    salaryWords && f.salaryAmount
      ? `${salaryDisplay} (${salaryWords}) per month`
      : salaryDisplay;

  return `<p style="text-align:left"><strong>Subject: Offer of Employment – ${f.designation || "[Designation]"}</strong></p>
<p>Dear ${b(f.employeeName, "[Employee Name]")},</p>
<p>We are pleased to offer you the position of ${b(f.designation, "[Designation]")} in the ${b(f.department, "[Department]")} department at <strong>AZDeploy Academy</strong>, located at ${b(f.workLocation, "Belagavi, Karnataka")}.</p>
<p>Your employment will commence from ${b(fmtDate(f.joiningDate))}. You will report to ${b(f.reportingTo, "[Reporting To]")} and will receive a gross salary of ${b(salaryClause)}, subject to applicable statutory deductions and company policies.</p>
<p>You will initially be placed on a probation period of ${b(f.probationPeriod, "3 months")}. During this period, your performance, attendance, discipline, communication, work quality and overall suitability for the role will be evaluated.</p>
<p>As part of your initial employment, you may undergo an intensive training and performance development period to understand AZDeploy Academy's processes, products, services and role-specific responsibilities.</p>
<p>Upon successful completion of probation and satisfactory performance, your employment may be confirmed as a regular employee through a written confirmation from the management. Confirmation is not automatic and will be based on your overall performance and business requirements.</p>
<p>You may be eligible for performance-based bonuses and incentives after successful completion of the probation period and confirmation, subject to the applicable incentive policy, individual performance and achievement of assigned targets. Any statutory benefits or statutory bonus applicable under law will be governed separately by the applicable laws.</p>
<p>During employment, you are required to maintain confidentiality regarding AZDeploy Academy's business information, student/customer information, pricing, processes, software, documents and other confidential information.</p>
<p>Either party may terminate the employment by providing ${b(f.noticePeriod, "30 days' notice")}, or as otherwise applicable under the employment terms and applicable law. The company may take appropriate action in cases of serious misconduct, breach of confidentiality or violation of company policies, subject to applicable law.</p>
<p>You are expected to follow all lawful company policies, maintain professional conduct, and perform your responsibilities diligently.</p>
<p>We are pleased to welcome you to <strong>AZDeploy Academy</strong> and look forward to your contribution and professional growth with us.</p>
${offerLetterSignatoryRowHtml(f)}`;
}

function buildAppointmentBodyHtml(f: HrLetterFields): string {
  const salaryWords = f.salaryInWords || salaryAmountToWords(f.salaryAmount);
  const salaryDisplay = formatSalaryDisplay(f.salaryAmount);
  const salaryClause =
    salaryWords && f.salaryAmount
      ? `${salaryDisplay} (${salaryWords}) per month`
      : salaryDisplay;

  return `<p><strong>Subject:</strong> Appointment Letter – ${f.designation || "[Designation]"}</p>
<p>Dear <strong>${f.employeeName || "[Employee Name]"}</strong>,</p>
<p>With reference to your offer letter and joining, we are pleased to appoint you as <strong>${f.designation || "[Designation]"}</strong> in the <strong>${f.department || "[Department]"}</strong> department at AZDeploy Academy, effective from <strong>${fmtDate(f.joiningDate)}</strong>.</p>
<p>You will report to <strong>${f.reportingTo || "[Reporting To]"}</strong> and your place of work shall be <strong>${f.workLocation || "Belagavi, Karnataka"}</strong>. Your employee code is <strong>${f.employeeCode || "[Employee Code]"}</strong>.</p>
<p>Your gross remuneration shall be <strong>${salaryClause}</strong>, subject to applicable statutory deductions and company policies.</p>
<p>You will be on probation for <strong>${f.probationPeriod || "3 months"}</strong> from the date of joining. Confirmation will be subject to satisfactory performance and management approval.</p>
<p>Either party may terminate this employment by giving <strong>${f.noticePeriod || "30 days'"}</strong> notice in writing, or as otherwise provided under applicable law and company policy.</p>
<p>You shall maintain confidentiality of all company, student and customer information and comply with all lawful policies of AZDeploy Academy.</p>
<p>We welcome you to the team and wish you success in your role.</p>
<div style="margin-top:14px">${companySignatoryHtml()}</div>`;
}

function buildExperienceBodyHtml(f: HrLetterFields): string {
  return `<p><strong>Subject:</strong> Experience / Relieving Letter</p>
<p>To Whom It May Concern,</p>
<p>This is to certify that <strong>${f.employeeName || "[Employee Name]"}</strong> (Employee Code: <strong>${f.employeeCode || "[Employee Code]"}</strong>) was employed with AZDeploy Academy as <strong>${f.designation || "[Designation]"}</strong> in the <strong>${f.department || "[Department]"}</strong> department.</p>
<p>${f.employeeName || "The employee"} joined our organisation on <strong>${fmtDate(f.joiningDate)}</strong> and was relieved on <strong>${fmtDate(f.issueDate)}</strong>. During the tenure, ${f.employeeName ? f.employeeName.split(" ")[0] : "the employee"} performed assigned duties with diligence and maintained professional conduct.</p>
<p>We wish ${f.employeeName ? f.employeeName.split(" ")[0] : "them"} success in future endeavours.</p>
<div style="margin-top:14px">${companySignatoryHtml()}</div>`;
}

export function buildDefaultBodyHtml(docType: HrDocType, fields: HrLetterFields): string {
  if (docType === "offer_letter") return buildOfferBodyHtml(fields);
  if (docType === "appointment_letter") return buildAppointmentBodyHtml(fields);
  return buildExperienceBodyHtml(fields);
}

export function buildDefaultSubject(docType: HrDocType, fields: HrLetterFields | string): string {
  const designation = typeof fields === "string" ? fields : fields.designation;
  if (docType === "offer_letter") return `Offer of Employment – ${designation || "Employee"}`;
  if (docType === "appointment_letter") return `Appointment Letter – ${designation || "Employee"}`;
  return "Experience / Relieving Letter";
}

/** @deprecated Use buildDefaultSubject */
export function defaultSubject(docType: HrDocType, designation?: string): string {
  return buildDefaultSubject(docType, designation || "");
}

export type HrFormFieldConfig = {
  key: keyof HrLetterFields | "docType";
  label: string;
  type?: "text" | "date" | "textarea" | "select";
  required?: boolean;
  readOnly?: boolean;
  placeholder?: string;
};

export const OFFER_LETTER_FORM_FIELDS: HrFormFieldConfig[] = [
  { key: "docType", label: "Document Type", type: "select", required: true },
  { key: "issueDate", label: "Issue Date", type: "date", required: true },
  { key: "refNo", label: "Ref No", type: "text", required: true },
  { key: "companyGstin", label: "Company GSTIN", type: "text" },
  { key: "employeeName", label: "Employee Name", type: "text", required: true },
  { key: "designation", label: "Designation", type: "text", required: true },
  { key: "department", label: "Department", type: "text", required: true },
  { key: "employeeCode", label: "Employee Code", type: "text", required: true },
  { key: "joiningDate", label: "Joining Date", type: "date", required: true },
  { key: "salaryAmount", label: "Salary (₹ per month)", type: "text", required: true, placeholder: "8000" },
  { key: "salaryInWords", label: "Salary in Words", type: "text", readOnly: true },
  { key: "probationPeriod", label: "Probation Period", type: "text", required: true },
  { key: "noticePeriod", label: "Notice Period", type: "text", required: true },
  { key: "workLocation", label: "Work Location", type: "text", required: true },
  { key: "reportingTo", label: "Reporting To", type: "text", required: true },
  { key: "employeePan", label: "Employee PAN", type: "text" },
  { key: "employeeAddress", label: "Employee Address", type: "textarea" },
  { key: "employeeEmail", label: "Employee Email", type: "text" },
  { key: "employeeMobile", label: "Employee Mobile", type: "text" },
];

export const APPOINTMENT_FORM_FIELDS: HrFormFieldConfig[] = [
  { key: "docType", label: "Document Type", type: "select", required: true },
  { key: "issueDate", label: "Issue Date", type: "date", required: true },
  { key: "refNo", label: "Ref No", type: "text", required: true },
  { key: "companyGstin", label: "Company GSTIN", type: "text" },
  { key: "employeeName", label: "Employee Name", type: "text", required: true },
  { key: "employeeCode", label: "Employee Code", type: "text", required: true },
  { key: "designation", label: "Designation", type: "text", required: true },
  { key: "department", label: "Department", type: "text", required: true },
  { key: "joiningDate", label: "Joining Date", type: "date", required: true },
  { key: "salaryAmount", label: "Salary (₹ per month)", type: "text", required: true },
  { key: "salaryInWords", label: "Salary in Words", type: "text", readOnly: true },
  { key: "probationPeriod", label: "Probation Period", type: "text", required: true },
  { key: "noticePeriod", label: "Notice Period", type: "text", required: true },
  { key: "workLocation", label: "Work Location", type: "text", required: true },
  { key: "reportingTo", label: "Reporting To", type: "text", required: true },
  { key: "employeePan", label: "Employee PAN", type: "text" },
  { key: "employeeAddress", label: "Employee Address", type: "textarea" },
];

export const EXPERIENCE_FORM_FIELDS: HrFormFieldConfig[] = [
  { key: "docType", label: "Document Type", type: "select", required: true },
  { key: "issueDate", label: "Issue / Relieving Date", type: "date", required: true },
  { key: "refNo", label: "Ref No", type: "text", required: true },
  { key: "companyGstin", label: "Company GSTIN", type: "text" },
  { key: "employeeName", label: "Employee Name", type: "text", required: true },
  { key: "employeeCode", label: "Employee Code", type: "text", required: true },
  { key: "designation", label: "Designation", type: "text", required: true },
  { key: "department", label: "Department", type: "text", required: true },
  { key: "joiningDate", label: "Joining Date", type: "date", required: true },
];

export function formFieldsForDocType(docType: HrDocType): HrFormFieldConfig[] {
  if (docType === "offer_letter") return OFFER_LETTER_FORM_FIELDS;
  if (docType === "appointment_letter") return APPOINTMENT_FORM_FIELDS;
  return EXPERIENCE_FORM_FIELDS;
}
