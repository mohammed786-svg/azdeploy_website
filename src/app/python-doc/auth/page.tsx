"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function PythonDocAuthPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/doc-auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ doc: "python-doc", password }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setError(data.error || "Invalid password");
        return;
      }
      router.push("/python-doc");
      router.refresh();
    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0e17] flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="border border-[#00d4ff]/30 rounded-lg p-6 bg-black/40">
          <h1 className="text-lg font-mono font-semibold text-[#00d4ff] mb-1 text-center">
            Python Doc
          </h1>
          <p className="text-xs text-white/50 font-mono text-center mb-6">
            Enter password to continue
          </p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full px-4 py-3 bg-black/60 border border-[#00d4ff]/40 rounded text-white font-mono text-sm placeholder-white/40 focus:outline-none focus:border-[#00d4ff]"
              autoFocus
              autoComplete="current-password"
            />
            {error && (
              <p className="text-xs text-red-400 font-mono text-center">{error}</p>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 border border-[#00d4ff] text-[#00d4ff] font-mono text-sm hover:bg-[#00d4ff]/10 transition-colors disabled:opacity-50"
            >
              {loading ? "..." : "Continue"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
