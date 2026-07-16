"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

const PREF_KEY = "azdeploy_translate_lang";
const PAGE_LANG = "en";

declare global {
  interface Window {
    googleTranslateElementInit?: () => void;
    google?: {
      translate?: {
        TranslateElement: new (
          options: Record<string, unknown>,
          elementId: string
        ) => void;
      };
    };
  }
}

function patchReactTranslateConflicts() {
  if (typeof Node === "undefined" || (Node.prototype as unknown as { __azGtPatched?: boolean }).__azGtPatched) {
    return;
  }
  const proto = Node.prototype as Node & {
    __azGtPatched?: boolean;
    removeChild: (child: Node) => Node;
    insertBefore: (newNode: Node, ref: Node | null) => Node;
  };
  proto.__azGtPatched = true;

  const originalRemoveChild = proto.removeChild;
  proto.removeChild = function <T extends Node>(child: T): T {
    if (child.parentNode !== this) return child;
    try {
      return originalRemoveChild.call(this, child) as T;
    } catch {
      return child;
    }
  };

  const originalInsertBefore = proto.insertBefore;
  proto.insertBefore = function <T extends Node>(newNode: T, ref: Node | null): T {
    if (ref && ref.parentNode !== this) return newNode;
    try {
      return originalInsertBefore.call(this, newNode, ref) as T;
    } catch {
      return newNode;
    }
  };
}

function clearGoogTransCookie() {
  const expire = "googtrans=;path=/;max-age=0;expires=Thu, 01 Jan 1970 00:00:00 GMT";
  document.cookie = expire;
  const host = window.location.hostname;
  if (host && host !== "localhost" && host !== "127.0.0.1") {
    const parts = host.split(".");
    const domain = parts.length >= 2 ? `.${parts.slice(-2).join(".")}` : host;
    document.cookie = `googtrans=;path=/;domain=${domain};max-age=0;expires=Thu, 01 Jan 1970 00:00:00 GMT`;
  }
}

function setGoogTransCookie(lang: string) {
  const value = !lang || lang === "en" ? "/en/en" : `/en/${lang}`;
  document.cookie = `googtrans=${value};path=/;max-age=31536000`;
  const host = window.location.hostname;
  if (host && host !== "localhost" && host !== "127.0.0.1" && !host.endsWith(".local")) {
    const parts = host.split(".");
    const domain = parts.length >= 2 ? `.${parts.slice(-2).join(".")}` : host;
    document.cookie = `googtrans=${value};path=/;domain=${domain};max-age=31536000`;
  }
}

function shouldHide(pathname: string | null): boolean {
  if (!pathname) return false;
  const hidden = ["/hq", "/proposal", "/academy", "/android-doc", "/python-doc", "/trainer/"];
  return hidden.some((p) => pathname === p || pathname.startsWith(p));
}

function prioritizeIndianLanguagesInCombo() {
  const combo = document.querySelector<HTMLSelectElement>(".goog-te-combo");
  if (!combo || combo.options.length < 8) return false;

  const priority = ["hi", "kn", "mr", "ta"];
  const options = Array.from(combo.options);
  const head = options[0];
  const byValue = new Map(options.map((o) => [o.value, o]));
  const used = new Set<string>(["", ...(head?.value ? [head.value] : [])]);

  const ordered: HTMLOptionElement[] = [];
  if (head) ordered.push(head);

  for (const code of priority) {
    const opt = byValue.get(code);
    if (opt && !used.has(code)) {
      ordered.push(opt);
      used.add(code);
    }
  }

  for (const opt of options) {
    if (!used.has(opt.value)) {
      ordered.push(opt);
      used.add(opt.value);
    }
  }

  combo.replaceChildren(...ordered);
  return true;
}

function scheduleIndianLanguageOrder() {
  let tries = 0;
  const tick = () => {
    tries += 1;
    if (prioritizeIndianLanguagesInCombo() || tries >= 20) return;
    window.setTimeout(tick, 150);
  };
  tick();
}

function resetToEnglishOnly() {
  localStorage.setItem(PREF_KEY, "en");
  clearGoogTransCookie();

  const combo = document.querySelector<HTMLSelectElement>(".goog-te-combo");
  if (combo) {
    combo.value = "en";
    if ([...combo.options].some((o) => o.value === "")) {
      combo.value = "";
    }
    combo.dispatchEvent(new Event("change"));
  }

  window.location.reload();
}

const INCLUDED_LANGUAGES = [
  "hi",
  "kn",
  "mr",
  "ta",
  "te",
  "ml",
  "gu",
  "bn",
  "ur",
  "pa",
  "en",
  "ar",
  "zh-CN",
  "zh-TW",
  "ja",
  "ko",
  "fr",
  "de",
  "es",
  "pt",
  "ru",
  "tr",
  "id",
  "th",
  "vi",
  "nl",
  "it",
  "pl",
].join(",");

/**
 * Small round language button → opens modal with Google Translate.
 * Default English. Hindi / Kannada / Marathi / Tamil listed first.
 */
export default function GoogleTranslate() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const inited = useRef(false);
  const hidden = shouldHide(pathname);

  useEffect(() => {
    patchReactTranslateConflicts();
  }, []);

  useEffect(() => {
    const onOpen = () => setOpen(true);
    window.addEventListener("azdeploy:open-language", onOpen);
    return () => window.removeEventListener("azdeploy:open-language", onOpen);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => {
    if (hidden || !open || inited.current) return;
    inited.current = true;

    const saved = localStorage.getItem(PREF_KEY);
    if (!saved || saved === "en") {
      localStorage.setItem(PREF_KEY, "en");
      clearGoogTransCookie();
    } else {
      setGoogTransCookie(saved);
    }

    window.googleTranslateElementInit = () => {
      if (!window.google?.translate?.TranslateElement) return;
      if (!document.getElementById("google_translate_element")) return;
      // eslint-disable-next-line no-new
      new window.google.translate.TranslateElement(
        {
          pageLanguage: PAGE_LANG,
          includedLanguages: INCLUDED_LANGUAGES,
          autoDisplay: false,
          multilanguagePage: true,
        },
        "google_translate_element"
      );

      scheduleIndianLanguageOrder();

      const combo = document.querySelector<HTMLSelectElement>(".goog-te-combo");
      combo?.addEventListener("change", () => {
        const val = combo.value;
        if (!val || val === "en") {
          localStorage.setItem(PREF_KEY, "en");
          clearGoogTransCookie();
          return;
        }
        localStorage.setItem(PREF_KEY, val);
        setGoogTransCookie(val);
      });
    };

    if (!document.getElementById("google-translate-script")) {
      const script = document.createElement("script");
      script.id = "google-translate-script";
      script.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      script.async = true;
      document.body.appendChild(script);
    } else if (window.google?.translate?.TranslateElement) {
      window.googleTranslateElementInit();
    }
  }, [hidden, open]);

  if (hidden) return null;

  return (
    <div
      className={`fixed inset-0 z-[85] flex items-end sm:items-center justify-center p-4 bg-black/55 backdrop-blur-[2px] ${
        open ? "" : "invisible pointer-events-none opacity-0"
      }`}
      onClick={() => setOpen(false)}
      role="presentation"
      aria-hidden={!open}
    >
      <div
        className="google-translate-wrap relative w-full max-w-sm rounded-2xl border border-[#00d4ff]/30 bg-[#0a0a12]/96 shadow-[0_0_40px_rgba(0,0,0,0.45)] p-5"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="lang-modal-title"
      >
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="notranslate absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-lg border border-white/15 text-white/60 hover:text-white hover:border-white/30"
          aria-label="Close"
        >
          ×
        </button>
        <h2 id="lang-modal-title" className="notranslate text-base font-semibold text-white pr-8">
          Language
        </h2>
        <p className="notranslate mt-1 text-xs text-white/55">
          Default is English. Hindi, Kannada, Marathi, and Tamil are listed first.
        </p>
        <div className="mt-4 rounded-xl border border-white/10 bg-black/40 p-3">
          <p className="notranslate text-[10px] font-mono uppercase tracking-[0.16em] text-[#7dd3fc] mb-2">
            Translate page
          </p>
          <div id="google_translate_element" className="google-translate-element" />
        </div>
        <button
          type="button"
          onClick={resetToEnglishOnly}
          className="notranslate mt-3 w-full rounded-xl border border-white/20 bg-white/[0.06] px-4 py-2.5 text-sm font-semibold text-white/90 hover:border-[#00d4ff]/50 hover:bg-[#00d4ff]/15 hover:text-[#00d4ff] transition-colors"
        >
          English only
        </button>
      </div>
    </div>
  );
}

/** Round FAB — place inside FloatingActions stack (opens language modal). */
export function LanguageFab() {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event("azdeploy:open-language"))}
      className="notranslate flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-white/25 bg-[#0f172a]/90 text-white/80 shadow-lg backdrop-blur-sm hover:border-[#00d4ff]/55 hover:text-[#00d4ff] transition-colors"
      aria-label="Change language"
      title="Language"
    >
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
        <circle cx="12" cy="12" r="9" />
        <path d="M3 12h18M12 3c2.5 2.7 3.75 5.7 3.75 9S14.5 18.3 12 21c-2.5-2.7-3.75-5.7-3.75-9S9.5 5.7 12 3z" />
      </svg>
    </button>
  );
}
