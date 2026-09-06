"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import KidzzyFilters from "@/components/kidzzy/KidzzyFilters";
import KidzzyProductCard from "@/components/kidzzy/KidzzyProductCard";
import { DEFAULT_TAGS, fetchKidzzyProducts, type KidzzyProduct } from "@/lib/kidzzy";

export default function KidzzyPrintablesClient() {
  const searchParams = useSearchParams();
  const initialQ = searchParams.get("q") || "";
  const [age, setAge] = useState("all");
  const [tag, setTag] = useState("all");
  const [q] = useState(initialQ);
  const [items, setItems] = useState<KidzzyProduct[]>([]);
  const [tags, setTags] = useState<string[]>([...DEFAULT_TAGS].slice(1));
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setErr("");
    try {
      const data = await fetchKidzzyProducts({
        type: "printable",
        age,
        tag,
        q: q || undefined,
      });
      setItems(data.items);
      if (data.tags.length) setTags(data.tags);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }, [age, tag, q]);

  useEffect(() => {
    void load();
  }, [load]);

  const tagOptions = useMemo(() => {
    const set = new Set([...DEFAULT_TAGS.slice(1), ...tags]);
    return Array.from(set);
  }, [tags]);

  return (
    <>
      <section className="relative hidden overflow-hidden bg-[#FFF6D8] md:block">
        <div className="pointer-events-none absolute inset-0 opacity-40">
          <div className="absolute left-[8%] top-10 text-5xl">⭐</div>
          <div className="absolute right-[18%] top-8 text-4xl">⚙️</div>
          <div className="absolute bottom-4 right-[10%] text-5xl">📄</div>
        </div>
        <div className="relative mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-14">
          <h1 className="text-4xl font-black text-slate-900 sm:text-5xl">Printables</h1>
          <p className="mt-3 max-w-xl text-base text-slate-600 sm:text-lg">
            Worksheets, coloring pages and activities your kids can print at home.
          </p>
        </div>
        <svg className="relative -mb-px block w-full text-white" viewBox="0 0 1440 48" preserveAspectRatio="none" aria-hidden>
          <path fill="currentColor" d="M0,32 C240,48 480,0 720,16 C960,32 1200,48 1440,24 L1440,48 L0,48 Z" />
        </svg>
      </section>

      <section className="mx-auto max-w-6xl space-y-5 px-4 py-6 sm:space-y-8 sm:px-6 sm:py-8">
        <div className="md:hidden">
          <h1 className="text-2xl font-black text-slate-900">Printables</h1>
          <p className="mt-1 text-sm text-slate-500">Worksheets, coloring pages & activities</p>
        </div>

        <KidzzyFilters age={age} tag={tag} tags={tagOptions} onAge={setAge} onTag={setTag} />

        {err ? (
          <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{err}</p>
        ) : null}

        {loading ? (
          <p className="py-12 text-center text-slate-500">Loading printables…</p>
        ) : !items.length ? (
          <p className="rounded-2xl border border-dashed border-slate-200 bg-white py-12 text-center text-slate-500">
            No printables match these filters.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
            {items.map((p) => (
              <KidzzyProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}
