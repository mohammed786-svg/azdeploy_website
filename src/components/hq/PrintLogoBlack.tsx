"use client";

import type { CSSProperties } from "react";

type PrintLogoBlackProps = {
  /** Horizontal alignment of the artwork inside the box */
  align?: "left" | "center";
  className?: string;
};

const printLogoStyle: CSSProperties = {
  WebkitPrintColorAdjust: "exact",
  printColorAdjust: "exact",
};

/**
 * Black logo for A4 print/PDF. Uses a real &lt;img&gt; (not CSS masks) because Chromium
 * often omits mask-image in print preview — the logo would disappear when saving as PDF.
 * `brightness(0)` turns the artwork black; works best with a transparent-background PNG.
 */
export function PrintLogoBlack({ align = "left", className = "" }: PrintLogoBlackProps) {
  const objectPos = align === "center" ? "object-center" : "object-left";

  return (
    // eslint-disable-next-line @next/next/no-img-element -- masks don't print; native img + filter is reliable for PDF
    <img
      src="/logo_gold.png"
      alt="AZ Deploy Academy"
      width={240}
      height={80}
      className={`hq-print-logo block max-h-none max-w-full ${objectPos} object-contain brightness-0 ${className}`.trim()}
      style={printLogoStyle}
      decoding="async"
    />
  );
}
