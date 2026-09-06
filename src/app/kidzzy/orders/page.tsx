"use client";

import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import {
  claimKidzzySession,
  clearKidzzyBuyerSession,
  downloadKidzzyInvoice,
  fetchKidzzyMyOrders,
  formatInr,
  getKidzzyBuyerEmail,
  getKidzzyBuyerSession,
  kidzzyDownloadUrl,
  kidzzyMediaUrl,
  type KidzzyOrderItem,
} from "@/lib/kidzzy";

function OrdersInner() {
  const [email, setEmail] = useState("");
  const [items, setItems] = useState<KidzzyOrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [tab, setTab] = useState<"all" | "printable" | "storybook">("all");
  const [invoiceBusy, setInvoiceBusy] = useState<string | null>(null);
  const [restoreToken, setRestoreToken] = useState("");
  const [restoring, setRestoring] = useState(false);

  async function load() {
    setLoading(true);
    setErr("");
    try {
      if (!getKidzzyBuyerSession()) {
        setItems([]);
        setEmail("");
        setErr("NO_SESSION");
        return;
      }
      const data = await fetchKidzzyMyOrders();
      setItems(data.items);
      setEmail(data.email || getKidzzyBuyerEmail());
    } catch (ex) {
      const msg = ex instanceof Error ? ex.message : "Failed to load orders";
      setErr(msg);
      setItems([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  function signOut() {
    clearKidzzyBuyerSession();
    setItems([]);
    setEmail("");
    setErr("NO_SESSION");
  }

  async function onInvoice(orderRef: string) {
    setInvoiceBusy(orderRef);
    setErr("");
    try {
      await downloadKidzzyInvoice(orderRef);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Invoice failed");
    } finally {
      setInvoiceBusy(null);
    }
  }

  const filtered = tab === "all" ? items : items.filter((i) => i.productType === tab);
  const locked = err === "NO_SESSION" || (!getKidzzyBuyerSession() && !loading);

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-3xl font-black text-slate-900">My Orders</h1>
          <p className="mt-1 text-sm text-slate-500">
            Orders unlock only after a successful checkout on this browser.
          </p>
        </div>
        {email ? (
          <button
            type="button"
            onClick={signOut}
            className="rounded-full border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50"
          >
            Sign out
          </button>
        ) : null}
      </div>

      {locked ? (
        <div className="mt-8 space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <p className="text-sm font-bold text-slate-800">Already purchased on this device?</p>
            <p className="mt-1 text-xs text-slate-500">
              Paste the download token from your success page URL (<code className="text-[10px]">?token=…</code>) to
              restore access.
            </p>
            <form
              className="mt-3 flex flex-col gap-2 sm:flex-row"
              onSubmit={(e) => {
                e.preventDefault();
                void (async () => {
                  if (!restoreToken.trim()) return;
                  setRestoring(true);
                  setErr("");
                  try {
                    await claimKidzzySession(restoreToken.trim());
                    await load();
                  } catch (ex) {
                    setErr(ex instanceof Error ? ex.message : "Could not restore session");
                  } finally {
                    setRestoring(false);
                  }
                })();
              }}
            >
              <input
                value={restoreToken}
                onChange={(e) => setRestoreToken(e.target.value)}
                placeholder="Download token"
                className="flex-1 rounded-full border border-slate-200 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500/30"
              />
              <button
                type="submit"
                disabled={restoring || !restoreToken.trim()}
                className="rounded-full bg-slate-900 px-5 py-2.5 text-xs font-bold text-white disabled:opacity-50"
              >
                {restoring ? "Restoring…" : "Restore access"}
              </button>
            </form>
            {err && err !== "NO_SESSION" ? (
              <p className="mt-2 text-xs text-red-600">{err}</p>
            ) : null}
          </div>
          <p className="text-center text-sm text-slate-500">
            No orders yet?{" "}
            <Link href="/kidzzy/printables" className="font-semibold text-blue-600 hover:underline">
              Browse printables
            </Link>
          </p>
        </div>
      ) : (
        <>
          {email ? (
            <p className="mt-4 rounded-full bg-slate-100 px-4 py-2 text-sm text-slate-600">
              Signed in as <span className="font-semibold text-slate-900">{email}</span>
            </p>
          ) : null}

          {err && err !== "NO_SESSION" ? (
            <p className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{err}</p>
          ) : null}

          <div className="mt-8 flex gap-2">
            {(
              [
                ["all", "All Orders"],
                ["printable", "Printables"],
                ["storybook", "Storybooks"],
              ] as const
            ).map(([value, label]) => (
              <button
                key={value}
                type="button"
                onClick={() => setTab(value)}
                className={`rounded-full px-4 py-1.5 text-sm font-semibold ${
                  tab === value ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-600"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="mt-6 space-y-4">
            {loading ? (
              <p className="py-10 text-center text-slate-500">Loading orders…</p>
            ) : !filtered.length ? (
              <p className="rounded-2xl border border-dashed border-slate-200 bg-white py-10 text-center text-slate-500">
                No paid orders for this session yet.{" "}
                <Link href="/kidzzy/printables" className="font-semibold text-blue-600 hover:underline">
                  Browse printables
                </Link>
              </p>
            ) : (
              filtered.map((o) => {
                const thumb = kidzzyMediaUrl(o.coverImageUrl);
                return (
                  <div
                    key={`${o.orderRef}-${o.productSlug}`}
                    className="flex flex-col gap-4 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm sm:flex-row sm:items-center"
                  >
                    <div
                      className="flex h-20 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-slate-50 sm:h-16 sm:w-16"
                      style={{ background: thumb ? undefined : `${o.coverAccent}22` }}
                    >
                      {thumb ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={thumb} alt="" className="h-full w-full object-cover object-top" />
                      ) : (
                        <span className="text-2xl">📘</span>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-xs text-slate-400">Order #{o.orderRef}</p>
                        <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold uppercase text-emerald-700">
                          Paid
                        </span>
                      </div>
                      <p className="mt-1 font-bold text-slate-900">{o.productTitle}</p>
                      <p className="text-sm text-slate-500">
                        {o.ageLabel}
                        {o.quantity && o.quantity > 1 ? ` · Qty ${o.quantity}` : ""} · {formatInr(o.amountInr)}
                      </p>
                    </div>
                    <div className="flex flex-col gap-2 sm:items-stretch">
                      {o.downloadToken ? (
                        <a
                          href={kidzzyDownloadUrl(o.downloadToken)}
                          className="rounded-full bg-blue-600 px-4 py-2 text-center text-xs font-bold text-white hover:bg-blue-700"
                        >
                          Download PDF
                        </a>
                      ) : null}
                      <button
                        type="button"
                        disabled={invoiceBusy === o.orderRef}
                        onClick={() => void onInvoice(o.orderRef)}
                        className="rounded-full border border-slate-200 bg-white px-4 py-2 text-center text-xs font-bold text-slate-800 hover:bg-slate-50 disabled:opacity-50"
                      >
                        {invoiceBusy === o.orderRef ? "Preparing…" : "Download invoice"}
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default function KidzzyOrdersPage() {
  return (
    <Suspense fallback={<p className="py-16 text-center text-slate-500">Loading…</p>}>
      <OrdersInner />
    </Suspense>
  );
}
