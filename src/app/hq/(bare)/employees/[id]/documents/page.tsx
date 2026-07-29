"use client";

import { Suspense } from "react";
import HqEmployeeHrDocumentEditorPage from "./editor-client";

export default function Page() {
  return (
    <Suspense fallback={<div className="p-6 text-neutral-700">Loading letter editor…</div>}>
      <HqEmployeeHrDocumentEditorPage />
    </Suspense>
  );
}
