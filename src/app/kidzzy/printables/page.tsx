import { Suspense } from "react";
import KidzzyPrintablesClient from "./printables-client";

export default function KidzzyPrintablesPage() {
  return (
    <Suspense fallback={<p className="py-16 text-center text-slate-500">Loading printables…</p>}>
      <KidzzyPrintablesClient />
    </Suspense>
  );
}
