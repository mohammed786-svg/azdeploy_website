"use client";

/** Forces A4 landscape for workshop certificate screen + PDF/print export. */
export default function LandscapePrintShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `
          @page {
            size: A4 landscape;
            margin: 0;
          }
          @media print {
            html, body {
              margin: 0 !important;
              padding: 0 !important;
              width: 297mm !important;
              height: 210mm !important;
              background: #fff !important;
              overflow: hidden !important;
            }
            .hq-landscape-screen {
              background: #fff !important;
              padding: 0 !important;
              margin: 0 !important;
              min-height: 0 !important;
              display: block !important;
            }
            .hq-landscape-sheet {
              box-shadow: none !important;
              margin: 0 !important;
              width: 297mm !important;
              height: 210mm !important;
              max-width: none !important;
              page-break-after: avoid;
              page-break-inside: avoid;
            }
            .workshop-cert-bg, .workshop-cert-bg * {
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
          }
        `,
        }}
      />
      <div className="hq-landscape-screen min-h-screen bg-neutral-200 print:bg-white flex justify-center py-4 print:py-0 print:block">
        <div
          className="hq-landscape-sheet w-[297mm] h-[210mm] max-w-[calc(100vw-1rem)] max-h-[calc(100vh-2rem)] bg-white shadow-xl print:shadow-none box-border overflow-hidden"
          style={{ fontFamily: 'system-ui, "Segoe UI", Roboto, "Helvetica Neue", sans-serif' }}
        >
          {children}
        </div>
      </div>
    </>
  );
}
