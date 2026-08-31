"use client";

import { PrintLogoBlack } from "@/components/hq/PrintLogoBlack";
import { INVOICE_ORG } from "@/lib/invoice-org";
import type { EbookPage } from "@/lib/ebooks/ai-engineering-content";
import { AI_ENGINEERING_META, AI_ENGINEERING_PAGES } from "@/lib/ebooks/ai-engineering-content";

function Sheet({
  children,
  pageNo,
  total,
  last = false,
}: {
  children: React.ReactNode;
  pageNo: number;
  total: number;
  last?: boolean;
}) {
  return (
    <div
      className={`ebook-a4-sheet box-border flex h-[297mm] w-[210mm] max-w-[calc(100vw-2rem)] flex-col overflow-hidden bg-white text-neutral-900 shadow-xl print:max-w-none print:w-[210mm] print:shadow-none ${
        last ? "ebook-sheet-last" : ""
      }`}
      style={{ fontFamily: 'system-ui, "Segoe UI", Roboto, "Helvetica Neue", sans-serif' }}
    >
      <div className="flex min-h-0 flex-1 flex-col px-[10mm] py-[7mm] text-[10pt] leading-snug text-black">
        <div className="mb-3 flex items-start justify-between gap-3 border-b border-neutral-300 pb-2">
          <div className="min-w-0">
            <PrintLogoBlack align="left" className="h-9 w-[150px]" />
            <p className="mt-1 text-[8px] uppercase tracking-[0.22em] text-neutral-500">
              {AI_ENGINEERING_META.edition}
            </p>
          </div>
          <div className="text-right text-[8px] leading-relaxed text-neutral-500">
            <p className="font-semibold text-neutral-800">{INVOICE_ORG.legalName}</p>
            <p>GSTIN: {INVOICE_ORG.gstin}</p>
            <p>{INVOICE_ORG.website}</p>
          </div>
        </div>
        <div className="flex min-h-0 flex-1 flex-col">{children}</div>
        <footer className="mt-3 flex items-center justify-between border-t border-neutral-200 pt-2 text-[8px] text-neutral-500">
          <span>Confidential · Licensed digital copy · Not for redistribution</span>
          <span className="font-mono">
            {pageNo} / {total}
          </span>
        </footer>
      </div>
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mb-2 border-b-2 border-blue-900 pb-1 text-[12pt] font-bold uppercase tracking-wide text-blue-950">
      {children}
    </h2>
  );
}

function RuleLines({ count }: { count: number }) {
  return (
    <div className="mt-1 space-y-3">
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="border-b border-dotted border-neutral-400 h-5" />
      ))}
    </div>
  );
}

function BlankBoxes({ count }: { count: number }) {
  return (
    <div className="mt-2 grid gap-2">
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="min-h-[14mm] rounded border border-neutral-300 bg-neutral-50" />
      ))}
    </div>
  );
}

function RenderPage({ page }: { page: EbookPage }) {
  switch (page.type) {
    case "cover":
      return (
        <div className="flex flex-1 flex-col justify-center text-center">
          <p className="text-[9px] font-mono uppercase tracking-[0.35em] text-blue-800">{page.badge}</p>
          <h1 className="mt-4 text-[26pt] font-bold leading-tight text-neutral-900">{page.title}</h1>
          <p className="mt-3 text-[12pt] text-neutral-600">{page.subtitle}</p>
          <div className="mx-auto mt-8 max-w-[150mm] rounded border-2 border-neutral-900 px-5 py-4 text-left">
            <p className="text-[9px] uppercase tracking-wider text-neutral-500">What you get</p>
            <ul className="mt-2 space-y-1.5 text-[10.5pt]">
              {page.bullets.map((b) => (
                <li key={b} className="flex gap-2">
                  <span className="text-blue-900">▸</span>
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </div>
          <p className="mt-10 text-[9px] text-neutral-500">
            Price reference: ₹{AI_ENGINEERING_META.priceInr} · Industry-ready skills workbook
          </p>
        </div>
      );

    case "intro":
      return (
        <div>
          <SectionTitle>{page.title}</SectionTitle>
          <div className="space-y-2 text-[10.5pt] text-neutral-800">
            {page.body.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
          <p className="mt-5 text-[9px] font-semibold uppercase tracking-wide text-neutral-500">Session guide</p>
          <table className="mt-1.5 w-full border-collapse text-[10pt]">
            <tbody>
              {page.howToUse.map((item, i) => (
                <tr key={item} className="border border-neutral-300">
                  <td className="w-8 bg-blue-50 px-2 py-2 text-center font-mono text-blue-900">{i + 1}</td>
                  <td className="px-3 py-2">{item}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );

    case "roadmap":
      return (
        <div>
          <SectionTitle>{page.title}</SectionTitle>
          <div className="grid gap-3">
            {page.stages.map((s, idx) => (
              <div key={s.name} className="rounded border border-neutral-300 overflow-hidden">
                <div className="flex items-center gap-2 bg-blue-50 px-3 py-1.5 border-b border-neutral-300">
                  <span className="font-mono text-[9px] text-blue-900">STAGE {idx + 1}</span>
                  <span className="font-semibold text-neutral-900">{s.name}</span>
                </div>
                <div className="grid grid-cols-2 gap-px bg-neutral-200">
                  {s.topics.map((t) => (
                    <div key={t} className="bg-white px-3 py-2 text-[10pt]">
                      {t}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      );

    case "module":
      return (
        <div>
          <p className="text-[9px] font-mono uppercase tracking-[0.2em] text-blue-800">Module {page.moduleNo}</p>
          <SectionTitle>{page.title}</SectionTitle>
          <div className="mb-3 rounded border border-neutral-900 px-3 py-2">
            <p className="text-[8px] uppercase tracking-wider text-neutral-500">Goal</p>
            <p className="mt-0.5 text-[10.5pt] font-medium">{page.goal}</p>
          </div>
          <p className="text-[9px] font-semibold uppercase tracking-wide text-neutral-500">Key concepts</p>
          <ul className="mt-1.5 space-y-1.5 text-[10pt]">
            {page.concepts.map((c) => (
              <li key={c} className="flex gap-2 border-b border-neutral-100 pb-1.5">
                <span className="mt-0.5 text-blue-900">●</span>
                <span>{c}</span>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-[9px] font-semibold uppercase tracking-wide text-neutral-500">Production tips</p>
          <div className="mt-1.5 grid gap-1.5">
            {page.tips.map((t) => (
              <div key={t} className="rounded border border-neutral-300 bg-neutral-50 px-3 py-1.5 text-[10pt]">
                {t}
              </div>
            ))}
          </div>
        </div>
      );

    case "worksheet":
      return (
        <div>
          <SectionTitle>{page.title}</SectionTitle>
          <p className="mb-3 text-[10pt] text-neutral-700">{page.instructions}</p>
          <div className="space-y-3">
            {page.fields.map((f) => (
              <div key={f.label}>
                <p className="text-[9px] font-semibold uppercase tracking-wide text-neutral-500">{f.label}</p>
                <RuleLines count={f.lines ?? 2} />
              </div>
            ))}
          </div>
        </div>
      );

    case "fillblank":
      return (
        <div>
          <SectionTitle>{page.title}</SectionTitle>
          <p className="mb-3 text-[9px] text-neutral-500">Fill in the blanks. Keep answers short and interview-ready.</p>
          <div className="space-y-4">
            {page.prompts.map((p, i) => (
              <div key={p.q}>
                <p className="text-[10.5pt]">
                  <span className="mr-2 font-mono text-blue-900">{i + 1}.</span>
                  {p.q}
                </p>
                <RuleLines count={Math.max(1, p.blanks)} />
              </div>
            ))}
          </div>
        </div>
      );

    case "diagram":
      return (
        <div>
          <SectionTitle>{page.title}</SectionTitle>
          <p className="mb-3 text-[10pt] text-neutral-700">{page.caption}</p>
          <div className="grid grid-cols-2 gap-2">
            {page.boxes.map((b) => (
              <div
                key={b}
                className="flex min-h-[22mm] items-center justify-center rounded border-2 border-dashed border-neutral-400 px-2 text-center text-[9.5pt] font-medium text-neutral-700"
              >
                {b}
              </div>
            ))}
          </div>
          <p className="mt-4 text-[9px] font-semibold uppercase tracking-wide text-neutral-500">Annotate</p>
          <ul className="mt-1 space-y-1 text-[10pt]">
            {page.notes.map((n) => (
              <li key={n}>☐ {n}</li>
            ))}
          </ul>
          <BlankBoxes count={2} />
        </div>
      );

    case "checklist":
      return (
        <div>
          <SectionTitle>{page.title}</SectionTitle>
          <table className="w-full border-collapse text-[10pt]">
            <tbody>
              {page.items.map((item, i) => (
                <tr key={item} className="border border-neutral-300">
                  <td className="w-8 px-2 py-2 text-center font-mono text-neutral-500">{i + 1}</td>
                  <td className="w-8 px-2 py-2 text-center text-[12pt]">☐</td>
                  <td className="px-3 py-2">{item}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );

    case "interview":
      return (
        <div>
          <SectionTitle>{page.title}</SectionTitle>
          <div className="space-y-3">
            {page.pairs.map((pair, i) => (
              <div key={pair.q} className="rounded border border-neutral-300 overflow-hidden">
                <div className="bg-blue-50 px-3 py-1.5 text-[10pt] font-semibold text-blue-950">
                  Q{i + 1}. {pair.q}
                </div>
                <div className="px-3 py-2 text-[10pt] text-neutral-800">
                  <span className="text-[8px] font-semibold uppercase tracking-wide text-neutral-500">Model answer · </span>
                  {pair.a}
                </div>
              </div>
            ))}
          </div>
        </div>
      );

    case "notes":
      return (
        <div>
          <SectionTitle>{page.title}</SectionTitle>
          <p className="mb-2 text-[9px] text-neutral-500">Use this page for examples from your projects and interview stories.</p>
          <RuleLines count={page.lines} />
        </div>
      );

    default:
      return null;
  }
}

export default function AiEngineeringEbook({
  orderRef,
  buyerLabel,
  viewOnly = false,
}: {
  orderRef?: string;
  buyerLabel?: string;
  /** Library mode: block print / save-as-PDF */
  viewOnly?: boolean;
}) {
  const pages = AI_ENGINEERING_PAGES;
  const total = pages.length;

  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: viewOnly
            ? `
          @media print {
            body * { visibility: hidden !important; }
            body::before {
              visibility: visible !important;
              content: "Printing and PDF export are disabled. Read this ebook inside your AZ Deploy Library only.";
              display: block;
              padding: 40px;
              font-size: 16px;
              font-family: system-ui, sans-serif;
            }
          }
          .ebook-view-only {
            -webkit-user-select: none;
            user-select: none;
          }
        `
            : `
          @page { size: A4; margin: 0; }
          @media print {
            html, body {
              margin: 0 !important;
              padding: 0 !important;
              background: #fff !important;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            .ebook-print-chrome { display: none !important; }
            .ebook-a4-screen { background: #fff !important; padding: 0 !important; gap: 0 !important; }
            .ebook-a4-sheet {
              box-shadow: none !important;
              max-width: none !important;
              width: 210mm !important;
              height: 297mm !important;
              page-break-after: always;
              break-after: page;
            }
            .ebook-sheet-last {
              page-break-after: auto !important;
              break-after: auto !important;
            }
            .hq-print-logo {
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
              filter: brightness(0) !important;
            }
          }
        `,
        }}
      />
      {viewOnly ? (
        <div className="ebook-print-chrome mb-3 rounded-xl border border-amber-500/40 bg-amber-50 px-4 py-3 text-sm text-amber-950 dark:bg-amber-500/10 dark:text-amber-100">
          View-only · Printing / Save as PDF / download disabled · Licensed to {buyerLabel || "you"}
          {orderRef ? ` · ${orderRef}` : ""}
        </div>
      ) : (orderRef || buyerLabel) ? (
        <div className="ebook-print-chrome mb-3 rounded border border-neutral-300 bg-white px-4 py-2 text-xs text-neutral-600 print:hidden">
          Licensed to {buyerLabel || "purchaser"}
          {orderRef ? ` · Order ${orderRef}` : ""}
        </div>
      ) : null}
      <div
        className={`ebook-a4-screen flex flex-col items-center gap-6 bg-neutral-200 py-4 print:gap-0 print:bg-white print:py-0 ${
          viewOnly ? "ebook-view-only" : ""
        }`}
        onContextMenu={viewOnly ? (e) => e.preventDefault() : undefined}
      >
        {pages.map((page, idx) => (
          <Sheet key={idx} pageNo={idx + 1} total={total} last={idx === total - 1}>
            <RenderPage page={page} />
          </Sheet>
        ))}
      </div>
    </>
  );
}
