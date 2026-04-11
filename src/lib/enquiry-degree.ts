export const ENQUIRY_DEGREE_OPTIONS = [
  { value: "", label: "Select degree / program" },
  { value: "btech_be", label: "B.Tech / B.E." },
  { value: "bca", label: "BCA" },
  { value: "bsc_cs_it", label: "B.Sc (CS / IT)" },
  { value: "mca", label: "MCA" },
  { value: "mtech_ms", label: "M.Tech / M.S." },
  { value: "diploma_cs", label: "Diploma (CS / IT)" },
  { value: "other_degree", label: "Other — specify below" },
  { value: "pursuing", label: "Currently pursuing (no degree yet)" },
] as const;

export function formatEnquiryDegreeLabel(degree: string, degreeOther?: string | null): string {
  if (degree === "other_degree" && degreeOther?.trim()) {
    return `Other — ${degreeOther.trim()}`;
  }
  const row = ENQUIRY_DEGREE_OPTIONS.find((o) => o.value === degree);
  if (row?.label) return row.label;
  return degree?.trim() ? degree : "—";
}
