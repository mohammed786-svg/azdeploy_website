"use client";

import Image from "next/image";
import { HR_COMPANY } from "@/lib/hr-letter-templates";

/**
 * Fixed A4 sheet with company letterhead as a 1:1 background.
 * Positions are in mm so Ref No / Date sit on the printed underlines.
 */
export default function LetterheadSheet({
  refNo,
  dateLabel,
  children,
  editableMeta,
  onRefNoChange,
  onDateChange,
  embedded = false,
}: {
  refNo: string;
  dateLabel: string;
  children: React.ReactNode;
  editableMeta?: boolean;
  onRefNoChange?: (v: string) => void;
  onDateChange?: (v: string) => void;
  /** When true, omit outer gray chrome (for scaled live preview). */
  embedded?: boolean;
}) {
  const sheet = (
    <div
      className="lh-sheet relative h-[297mm] w-[210mm] overflow-hidden bg-white text-neutral-900 shadow-xl print:shadow-none"
      style={{ fontFamily: 'Georgia, "Times New Roman", Times, serif' }}
    >
      <div className="lh-bg pointer-events-none absolute inset-0">
        <Image
          src={HR_COMPANY.letterheadSrc}
          alt="AZDeploy Academy letterhead"
          fill
          className="object-fill"
          sizes="210mm"
          priority
          unoptimized
        />
      </div>

      {/* Value after printed "Ref No :" — same baseline as letterhead label */}
      <div
        className="absolute z-20 flex items-center text-[10.5pt] leading-none text-black"
        style={{ top: "45.2mm", left: "20mm", height: "5mm", width: "90mm" }}
      >
        {editableMeta ? (
          <input
            value={refNo}
            onChange={(e) => onRefNoChange?.(e.target.value)}
            className="h-full w-full border-0 bg-transparent p-0 text-[10.5pt] leading-none outline-none focus:underline"
            placeholder="AZD/HR/2026/001"
          />
        ) : (
          <span className="block truncate font-medium tracking-wide leading-none">{refNo}</span>
        )}
      </div>

      {/* Value after printed "Date :" — same baseline as letterhead label */}
      <div
        className="absolute z-20 flex items-center justify-end text-[10.5pt] leading-none text-black"
        style={{ top: "45.2mm", right: "14mm", height: "5mm", width: "60mm" }}
      >
        {editableMeta ? (
          <input
            value={dateLabel}
            onChange={(e) => onDateChange?.(e.target.value)}
            className="h-full w-full border-0 bg-transparent p-0 text-right text-[10.5pt] leading-none outline-none focus:underline"
            placeholder="DD/MM/YYYY"
          />
        ) : (
          <span className="block font-medium leading-none">{dateLabel}</span>
        )}
      </div>

      {/* Body below Ref/Date band */}
      <div
        className="absolute z-10 overflow-hidden text-[10.5pt] leading-[1.55] text-black"
        style={{ top: "62mm", left: "14mm", right: "14mm", bottom: "18mm" }}
      >
        <div className="hr-letter-body [&_p]:my-[0.5em] [&_strong]:font-semibold">{children}</div>
      </div>
    </div>
  );

  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `
          @page { size: A4; margin: 0; }
          @media print {
            html, body {
              margin: 0 !important;
              padding: 0 !important;
              background: #fff !important;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            .lh-screen { background: #fff !important; padding: 0 !important; }
            .lh-sheet {
              box-shadow: none !important;
              width: 210mm !important;
              height: 297mm !important;
            }
            .lh-bg {
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            .print\\:hidden { display: none !important; }
          }
        `,
        }}
      />
      {embedded ? (
        sheet
      ) : (
        <div className="lh-screen flex justify-center bg-neutral-200 py-4 print:bg-white print:py-0">{sheet}</div>
      )}
    </>
  );
}
