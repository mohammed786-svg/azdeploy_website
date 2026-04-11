/** Strip characters that break or look bad in OS PDF filenames (Save as PDF uses document.title). */
export function sanitizeForPdfFilename(s: string, maxLen = 140): string {
  return s
    .replace(/[/\\:*?"<>|]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, maxLen);
}
