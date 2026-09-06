"use client";

import { useCallback, useEffect, useState, type ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
  label?: string;
};

/**
 * Best-effort sample protection for free previews:
 * - no right-click / drag / select / copy / print shortcuts
 * - black curtain on blur, tab hide, print, PrintScreen heuristics
 * - blocks navigator.share while mounted
 *
 * OS screenshots cannot be fully blocked in browsers; content blacks out
 * when focus is lost (common with screenshot UIs).
 */
export default function KidzzyProtectedPreview({ children, className = "", label }: Props) {
  const [shielded, setShielded] = useState(false);

  const raiseShield = useCallback(() => setShielded(true), []);
  const lowerShield = useCallback(() => setShielded(false), []);

  useEffect(() => {
    const onVis = () => {
      if (document.hidden) raiseShield();
      else lowerShield();
    };
    const onBlur = () => raiseShield();
    const onFocus = () => {
      if (!document.hidden) lowerShield();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "PrintScreen" || e.key === "Print") {
        raiseShield();
        window.setTimeout(lowerShield, 2500);
      }
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && ["3", "4", "5", "s", "S"].includes(e.key)) {
        raiseShield();
        window.setTimeout(lowerShield, 2500);
      }
      if ((e.metaKey || e.ctrlKey) && ["p", "P", "s", "S"].includes(e.key)) {
        e.preventDefault();
        raiseShield();
        window.setTimeout(lowerShield, 1500);
      }
    };
    const block = (e: Event) => {
      e.preventDefault();
      e.stopPropagation();
    };

    document.addEventListener("visibilitychange", onVis);
    window.addEventListener("blur", onBlur);
    window.addEventListener("focus", onFocus);
    window.addEventListener("keydown", onKey, true);
    document.addEventListener("contextmenu", block, true);
    document.addEventListener("dragstart", block, true);
    document.addEventListener("copy", block, true);
    document.addEventListener("cut", block, true);

    const origShare = typeof navigator !== "undefined" && navigator.share ? navigator.share.bind(navigator) : null;
    if (origShare) {
      navigator.share = async () => {
        raiseShield();
        throw new DOMException("Sharing sample previews is not allowed", "NotAllowedError");
      };
    }

    const style = document.createElement("style");
    style.setAttribute("data-kidzzy-protect", "1");
    style.textContent = `
      @media print {
        body * { visibility: hidden !important; }
        body::after {
          content: "";
          position: fixed;
          inset: 0;
          background: #000 !important;
          z-index: 999999;
        }
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("blur", onBlur);
      window.removeEventListener("focus", onFocus);
      window.removeEventListener("keydown", onKey, true);
      document.removeEventListener("contextmenu", block, true);
      document.removeEventListener("dragstart", block, true);
      document.removeEventListener("copy", block, true);
      document.removeEventListener("cut", block, true);
      if (origShare) navigator.share = origShare;
      style.remove();
    };
  }, [raiseShield, lowerShield]);

  return (
    <div
      className={`kidzzy-protected relative select-none ${className}`}
      onContextMenu={(e) => e.preventDefault()}
      onDragStart={(e) => e.preventDefault()}
      style={{
        WebkitUserSelect: "none",
        userSelect: "none",
        WebkitTouchCallout: "none",
      }}
    >
      <div
        className="transition-opacity duration-75"
        style={{ opacity: shielded ? 0 : 1 }}
        aria-hidden={shielded}
      >
        {children}
      </div>

      {shielded ? (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black text-center">
          <p className="text-sm font-bold uppercase tracking-widest text-white/80">Preview protected</p>
          <p className="mt-2 max-w-[16rem] px-4 text-xs text-white/50">
            {label || "Screenshots, download, print, and sharing are disabled for free samples."}
          </p>
        </div>
      ) : null}
    </div>
  );
}
