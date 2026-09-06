"use client";

import { AGE_FILTERS } from "@/lib/kidzzy";

type Props = {
  age: string;
  tag: string;
  tags: string[];
  onAge: (v: string) => void;
  onTag: (v: string) => void;
};

function Pill({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold transition sm:px-3.5 sm:text-sm ${
        active
          ? "bg-blue-600 text-white shadow-sm"
          : "border border-slate-200 bg-white text-slate-700 hover:border-blue-300 hover:text-blue-700"
      }`}
    >
      {children}
    </button>
  );
}

export default function KidzzyFilters({ age, tag, tags, onAge, onTag }: Props) {
  const tagList = ["All", ...tags.filter((t) => t.toLowerCase() !== "all")];

  return (
    <div className="space-y-3 sm:space-y-4">
      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500 sm:text-sm sm:normal-case sm:tracking-normal sm:text-slate-700">
          Age Group
        </p>
        <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0 sm:pb-0 [&::-webkit-scrollbar]:hidden">
          {AGE_FILTERS.map((f) => (
            <Pill key={f.value} active={age === f.value} onClick={() => onAge(f.value)}>
              {f.label}
            </Pill>
          ))}
        </div>
      </div>
      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500 sm:text-sm sm:normal-case sm:tracking-normal sm:text-slate-700">
          Tags
        </p>
        <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0 sm:pb-0 [&::-webkit-scrollbar]:hidden">
          {tagList.map((t) => (
            <Pill
              key={t}
              active={(tag === "all" && t === "All") || tag.toLowerCase() === t.toLowerCase()}
              onClick={() => onTag(t === "All" ? "all" : t)}
            >
              {t}
            </Pill>
          ))}
        </div>
      </div>
    </div>
  );
}
