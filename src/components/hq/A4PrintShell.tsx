"use client";

/** White A4-sized block for print/PDF — only this region should appear when printing. */
export default function A4PrintShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `
          @page { size: A4; margin: 6mm; }
          @media print {
            html, body { margin: 0 !important; padding: 0 !important; background: #fff !important; }
            .hq-a4-screen { background: #fff !important; padding: 0 !important; }
            .hq-a4-sheet { box-shadow: none !important; max-width: none !important; width: 100% !important; min-height: auto !important; }
            /* Ensure logos & filters appear in Save as PDF (Chromium often drops masks; img + filter needs explicit color adjust). */
            .hq-print-logo {
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
              filter: brightness(0) !important;
            }
          }
        `,
        }}
      />
      <div className="hq-a4-screen min-h-screen bg-neutral-200 print:bg-white flex justify-center py-4 print:py-0">
        <div
          className="hq-a4-sheet w-[210mm] max-w-[calc(100vw-2rem)] min-h-[297mm] bg-white text-neutral-900 shadow-xl print:shadow-none box-border"
          style={{ fontFamily: 'system-ui, "Segoe UI", Roboto, "Helvetica Neue", sans-serif' }}
        >
          <div className="px-[9mm] py-[7mm] print:px-[7mm] print:py-[5mm] text-[10pt] leading-snug text-black">{children}</div>
        </div>
      </div>
    </>
  );
}
