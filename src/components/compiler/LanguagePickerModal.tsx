"use client";

import { useMemo, useState } from "react";
import { useCompilerTheme } from "@/components/compiler/CompilerThemeProvider";
import { compilerSurfaces } from "@/components/compiler/compiler-tokens";
import { LANGUAGE_BRAND } from "@/components/compiler/language-brand";
import { COMPILER_LANGUAGES, type CompilerLanguage } from "@/lib/compiler-languages";

type Props = {
  open: boolean;
  currentId: string;
  onClose: () => void;
  onSelect: (lang: CompilerLanguage) => void;
};

const SHOW_MORE_LIMIT = 12;

function LanguageTile({
  lang,
  active,
  onSelect,
  card,
  cardActive,
}: {
  lang: CompilerLanguage;
  active: boolean;
  onSelect: () => void;
  card: string;
  cardActive: string;
}) {
  const brand = LANGUAGE_BRAND[lang.id] || { bg: "#3e3e42", fg: "#ffffff", abbr: lang.label.slice(0, 2) };
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`group flex flex-col items-center gap-2 rounded-xl border p-3 transition-all ${active ? cardActive : card}`}
    >
      <span
        className="flex h-11 w-11 items-center justify-center rounded-xl text-xs font-bold shadow-sm"
        style={{ backgroundColor: brand.bg, color: brand.fg }}
      >
        {brand.abbr}
      </span>
      <span className="text-[13px] font-medium text-center leading-tight">{lang.label}</span>
    </button>
  );
}

function LanguageSection({
  title,
  items,
  currentId,
  onSelect,
  card,
  cardActive,
}: {
  title: string;
  items: CompilerLanguage[];
  currentId: string;
  onSelect: (lang: CompilerLanguage) => void;
  card: string;
  cardActive: string;
}) {
  const [expanded, setExpanded] = useState(false);
  if (!items.length) return null;
  const visible = expanded ? items : items.slice(0, SHOW_MORE_LIMIT);
  const more = items.length - SHOW_MORE_LIMIT;
  return (
    <section>
      <h3 className="text-[15px] font-semibold mb-3 opacity-90">{title}</h3>
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
        {visible.map((lang) => (
          <LanguageTile
            key={lang.id}
            lang={lang}
            active={currentId === lang.id}
            onSelect={() => onSelect(lang)}
            card={card}
            cardActive={cardActive}
          />
        ))}
      </div>
      {more > 0 && !expanded ? (
        <button
          type="button"
          onClick={() => setExpanded(true)}
          className="mt-3 text-sm text-[#4fc1ff] hover:underline"
        >
          Show {more} More
        </button>
      ) : null}
    </section>
  );
}

export default function LanguagePickerModal({ open, currentId, onClose, onSelect }: Props) {
  const { theme } = useCompilerTheme();
  const s = compilerSurfaces(theme);
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return COMPILER_LANGUAGES;
    return COMPILER_LANGUAGES.filter((l) => l.label.toLowerCase().includes(needle) || l.id.includes(needle));
  }, [q]);

  if (!open) return null;

  const groups = [
    { title: "Popular", items: filtered.filter((l) => l.category === "programming") },
    { title: "Web languages", items: filtered.filter((l) => l.category === "web") },
    { title: "Databases", items: filtered.filter((l) => l.category === "database") },
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/55 backdrop-blur-[2px]">
      <div className={`w-full max-w-[920px] max-h-[88vh] overflow-hidden rounded-xl border shadow-2xl flex flex-col ${s.modal}`}>
        <div className={`px-6 py-5 border-b ${s.border} relative`}>
          <button
            type="button"
            onClick={onClose}
            className={`absolute right-4 top-4 ${s.subtle} hover:opacity-100 opacity-70 text-lg leading-none`}
            aria-label="Close"
          >
            ×
          </button>
          <h2 className={`text-xl font-semibold ${s.modalTitle}`}>Choose a Language to Get Started</h2>
        </div>
        <div className={`px-6 py-4 border-b ${s.border}`}>
          <div className="relative">
            <span className={`absolute left-3 top-1/2 -translate-y-1/2 ${s.muted}`}>⌕</span>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search languages..."
              className={`w-full rounded-lg border pl-9 pr-4 py-2.5 text-sm ${s.input}`}
            />
          </div>
        </div>
        <div className="overflow-y-auto px-6 py-5 space-y-8">
          {groups.map((g) => (
            <LanguageSection
              key={g.title}
              title={g.title}
              items={g.items}
              currentId={currentId}
              card={s.card}
              cardActive={s.cardActive}
              onSelect={(lang) => {
                onSelect(lang);
                onClose();
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
