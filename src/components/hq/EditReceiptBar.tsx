"use client";

import { useEffect, useState } from "react";
import { hqFetch } from "@/lib/hq-client";

function toDateInputValue(receivedAt?: string | number): string {
  if (!receivedAt) return new Date().toISOString().slice(0, 10);
  const d = new Date(receivedAt);
  if (Number.isNaN(d.getTime())) return new Date().toISOString().slice(0, 10);
  return d.toISOString().slice(0, 10);
}

type SavedReceipt = {
  receivedAt?: string;
  amount?: number;
};

type Props = {
  apiPath: string;
  receivedAt?: string | number;
  amount?: number;
  currency?: string;
  onSaved: (patch: SavedReceipt) => void;
};

export default function EditReceiptBar({ apiPath, receivedAt, amount, currency = "INR", onSaved }: Props) {
  const [date, setDate] = useState(() => toDateInputValue(receivedAt));
  const [amountVal, setAmountVal] = useState(() => (amount != null ? String(amount) : ""));
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    setDate(toDateInputValue(receivedAt));
  }, [receivedAt]);

  useEffect(() => {
    setAmountVal(amount != null ? String(amount) : "");
  }, [amount]);

  async function save() {
    setSaving(true);
    setMsg("");
    try {
      const parsed = Number(amountVal);
      if (!amountVal.trim() || !Number.isFinite(parsed) || parsed <= 0) {
        throw new Error("Enter a valid amount greater than zero");
      }
      const res = await hqFetch<{ item: SavedReceipt }>(apiPath, {
        method: "PATCH",
        body: JSON.stringify({ receivedAt: date, amount: parsed }),
      });
      onSaved({
        receivedAt: res.item?.receivedAt || date,
        amount: res.item?.amount ?? parsed,
      });
      setMsg("Saved");
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="print:hidden mb-4 flex flex-wrap items-end gap-2 text-sm rounded border border-neutral-300 bg-neutral-50 px-3 py-2">
      <label className="flex flex-col gap-0.5">
        <span className="text-[10px] uppercase text-neutral-500">Received date</span>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="rounded border border-neutral-400 px-2 py-1 text-neutral-900"
        />
      </label>
      <label className="flex flex-col gap-0.5">
        <span className="text-[10px] uppercase text-neutral-500">Amount ({currency})</span>
        <input
          type="number"
          min={0.01}
          step="0.01"
          value={amountVal}
          onChange={(e) => setAmountVal(e.target.value)}
          className="rounded border border-neutral-400 px-2 py-1 text-neutral-900 w-32"
        />
      </label>
      <button
        type="button"
        onClick={() => void save()}
        disabled={saving}
        className="rounded border border-neutral-400 px-3 py-1 text-neutral-800 hover:bg-neutral-100 disabled:opacity-50"
      >
        {saving ? "Saving…" : "Save"}
      </button>
      {msg ? <span className="text-xs text-neutral-600 pb-1">{msg}</span> : null}
    </div>
  );
}
