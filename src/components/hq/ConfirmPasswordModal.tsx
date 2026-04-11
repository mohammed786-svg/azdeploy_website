"use client";

import { useEffect, useState } from "react";

type Props = {
  open: boolean;
  title: string;
  message?: string;
  confirmLabel?: string;
  onClose: () => void;
  onConfirm: (password: string) => void | Promise<void>;
};

export default function ConfirmPasswordModal({
  open,
  title,
  message = "Enter your HQ password to confirm.",
  confirmLabel = "Confirm",
  onClose,
  onConfirm,
}: Props) {
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      setPassword("");
      setErr("");
    }
  }, [open]);

  if (!open) return null;

  async function submit() {
    setErr("");
    if (!password.trim()) {
      setErr("Password is required.");
      return;
    }
    setLoading(true);
    try {
      await onConfirm(password);
      onClose();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div
        role="dialog"
        aria-modal
        className="w-full max-w-md rounded-2xl border border-white/10 bg-[#0c0c12] p-6 shadow-2xl"
      >
        <h2 className="text-lg font-semibold text-white">{title}</h2>
        <p className="mt-2 text-sm text-[#94a3b8]">{message}</p>
        <label className="mt-4 block">
          <span className="text-[10px] font-mono uppercase text-[#64748b]">Password</span>
          <input
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && void submit()}
            className="mt-1.5 w-full rounded-xl border border-white/10 bg-black/50 px-3 py-2.5 text-sm text-white"
          />
        </label>
        {err && (
          <p className="mt-2 text-sm text-amber-400/90 font-mono" role="alert">
            {err}
          </p>
        )}
        <div className="mt-6 flex flex-wrap gap-2 justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-white/10 px-4 py-2 text-xs font-mono uppercase text-[#94a3b8] hover:bg-white/5"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={loading}
            onClick={() => void submit()}
            className="rounded-xl bg-[#f87171]/20 border border-[#f87171]/40 px-4 py-2 text-xs font-mono uppercase text-[#fca5a5] hover:bg-[#f87171]/30 disabled:opacity-50"
          >
            {loading ? "…" : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
