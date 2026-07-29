/** Company letterhead + default HR letter templates (editable). */

export const HR_COMPANY = {
  name: "AZDeploy Academy",
  legalName: "AZDeploy Academy",
  address:
    "Plot No. 516, Main Road, Auto Nagar, VFF Group Building, First Floor, Belagavi - 590016, Karnataka, India.",
  phones: "+91 8296565587 | +91 8971244513 | +91 7338360607",
  website: "www.azdeploy.com",
  email: "info@azdeploy.com",
  /** Edit per company GST registration */
  gstNo: "",
  udyam: "UDYAM-KR-04-0178755",
  letterheadSrc: "/company_letter_head_a4.jpg",
};

export type HrDocType = "offer_letter" | "appointment_letter" | "experience_certificate";

export const HR_DOC_TYPE_LABELS: Record<HrDocType, string> = {
  offer_letter: "Offer Letter",
  appointment_letter: "Appointment Letter",
  experience_certificate: "Experience Certificate",
};

export type HrLetterFields = {
  employeeName: string;
  fatherName: string;
  address: string;
  designation: string;
  department: string;
  employeeCode: string;
  joiningDate: string;
  lastWorkingDate: string;
  salaryAmount: string;
  salaryInWords: string;
  probationMonths: string;
  noticePeriodDays: string;
  workLocation: string;
  reportingTo: string;
  companyGstNo: string;
  employeePan: string;
  subject: string;
  salutation: string;
  closing: string;
  authorizedSignatory: string;
  signatoryTitle: string;
};

export function emptyHrFields(partial?: Partial<HrLetterFields>): HrLetterFields {
  return {
    employeeName: "",
    fatherName: "",
    address: "",
    designation: "",
    department: "",
    employeeCode: "",
    joiningDate: "",
    lastWorkingDate: "",
    salaryAmount: "",
    salaryInWords: "",
    probationMonths: "3",
    noticePeriodDays: "30",
    workLocation: "Belagavi, Karnataka",
    reportingTo: "Reporting Manager",
    companyGstNo: HR_COMPANY.gstNo,
    employeePan: "",
    subject: "",
    salutation: "Dear",
    closing: "Yours sincerely,",
    authorizedSignatory: "Authorized Signatory",
    signatoryTitle: "AZDeploy Academy",
    ...partial,
  };
}

function moneyLine(amount: string, words: string) {
  if (!amount && !words) return "as mutually agreed";
  if (amount && words) return `₹${amount}/- (${words}) per month`;
  if (amount) return `₹${amount}/- per month`;
  return words;
}

export function buildDefaultBodyHtml(docType: HrDocType, f: HrLetterFields): string {
  const name = f.employeeName || "[Employee Name]";
  const desig = f.designation || "[Designation]";
  const join = f.joiningDate || "[Joining Date]";
  const salary = moneyLine(f.salaryAmount, f.salaryInWords);

  if (docType === "offer_letter") {
    return `<p>${f.salutation} <strong>${name}</strong>,</p>
<p>We are pleased to offer you the position of <strong>${desig}</strong>${f.department ? ` in the <strong>${f.department}</strong> department` : ""} at <strong>${HR_COMPANY.name}</strong>.</p>
<p>Your proposed date of joining is <strong>${join}</strong>. Your work location will be <strong>${f.workLocation}</strong>. You will report to <strong>${f.reportingTo}</strong>.</p>
<p>Your compensation will be <strong>${salary}</strong>, subject to statutory deductions as applicable. GST (if applicable for billing/services): <strong>${f.companyGstNo || "—"}</strong>.</p>
<p>This offer is subject to successful completion of documentation and a probation period of <strong>${f.probationMonths || "3"} months</strong>. Either party may terminate employment with <strong>${f.noticePeriodDays || "30"} days</strong> written notice (or payment in lieu thereof), as per company policy.</p>
<p>Please sign and return a copy of this letter as acceptance of the offer. We look forward to welcoming you to AZDeploy Academy.</p>
<p>${f.closing}</p>
<p><strong>${f.authorizedSignatory}</strong><br/>${f.signatoryTitle}</p>`;
  }

  if (docType === "appointment_letter") {
    return `<p>${f.salutation} <strong>${name}</strong>,</p>
<p>Further to your selection, we are pleased to appoint you as <strong>${desig}</strong>${f.department ? ` (${f.department})` : ""} at <strong>${HR_COMPANY.name}</strong>, with effect from <strong>${join}</strong>.</p>
<p><strong>Employee Code:</strong> ${f.employeeCode || "—"}<br/>
<strong>Work Location:</strong> ${f.workLocation}<br/>
<strong>Reporting To:</strong> ${f.reportingTo}<br/>
<strong>Compensation:</strong> ${salary}<br/>
<strong>Company GSTIN:</strong> ${f.companyGstNo || "—"}<br/>
${f.employeePan ? `<strong>Employee PAN:</strong> ${f.employeePan}<br/>` : ""}
<strong>Probation:</strong> ${f.probationMonths || "3"} months<br/>
<strong>Notice Period:</strong> ${f.noticePeriodDays || "30"} days</p>
<p>You shall abide by the policies, code of conduct, confidentiality, and attendance rules of the company (including official check-in at 9:30 AM IST). Your duties may be modified as per business requirements.</p>
<p>Please acknowledge receipt of this appointment letter by signing below.</p>
<p>${f.closing}</p>
<p><strong>${f.authorizedSignatory}</strong><br/>${f.signatoryTitle}</p>
<p style="margin-top:24px"><strong>Employee Acknowledgement</strong><br/>I accept the terms of this appointment.<br/><br/>Signature: ______________________ &nbsp;&nbsp; Date: ______________</p>`;
  }

  // experience_certificate
  const last = f.lastWorkingDate || "[Last Working Date]";
  return `<p>TO WHOMSOEVER IT MAY CONCERN</p>
<p>This is to certify that <strong>${name}</strong>${f.fatherName ? `, S/o / D/o <strong>${f.fatherName}</strong>,` : ""} was employed with <strong>${HR_COMPANY.name}</strong> as <strong>${desig}</strong>${f.department ? ` in the <strong>${f.department}</strong> department` : ""}.</p>
<p>He/She worked with us from <strong>${join}</strong> to <strong>${last}</strong>${f.employeeCode ? ` (Employee Code: <strong>${f.employeeCode}</strong>)` : ""}.</p>
<p>During the tenure, he/she performed duties diligently and maintained professional conduct. We wish him/her success in future endeavours.</p>
${f.companyGstNo ? `<p><strong>Company GSTIN:</strong> ${f.companyGstNo}</p>` : ""}
<p>${f.closing}</p>
<p><strong>${f.authorizedSignatory}</strong><br/>${f.signatoryTitle}<br/>${HR_COMPANY.name}</p>`;
}

export function defaultSubject(docType: HrDocType, designation?: string): string {
  if (docType === "offer_letter") return `Offer of Employment — ${designation || "Position"}`;
  if (docType === "appointment_letter") return `Appointment Letter — ${designation || "Position"}`;
  return "Experience Certificate";
}
