"use client";

import { useEffect, useState } from "react";
import { libraryFetch } from "@/lib/library-client";
import { useLibraryTheme } from "@/components/library/LibraryShell";

type Me = {
  item: {
    email: string;
    ipSlotsUsed: number;
    ipSlotsMax: number;
    boundIps: { ip: string; lastSeenAt?: string }[];
  };
  currentIp?: string;
};

export default function LibraryDevicesPage() {
  const { theme } = useLibraryTheme();
  const dark = theme === "dark";
  const [data, setData] = useState<Me | null>(null);

  useEffect(() => {
    void libraryFetch<Me>("/api/library/me").then(setData).catch(() => undefined);
  }, []);

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold">Devices & IP addresses</h1>
      <p className={`mt-2 text-sm ${dark ? "text-white/60" : "text-slate-600"}`}>
        You may use at most <strong>{data?.item.ipSlotsMax ?? 2}</strong> IP addresses. Signing out clears the IP you are on now so you can log in elsewhere.
      </p>
      <p className={`mt-4 text-xs font-mono ${dark ? "text-sky-300" : "text-sky-700"}`}>
        Current IP: {data?.currentIp || "—"}
      </p>
      <div className="mt-6 space-y-2">
        {(data?.item.boundIps || []).map((ip) => (
          <div
            key={ip.ip}
            className={`rounded-xl border px-4 py-3 text-sm flex justify-between gap-3 ${
              dark ? "border-white/10 bg-white/[0.03]" : "border-slate-200 bg-white"
            }`}
          >
            <span className="font-mono">{ip.ip}</span>
            <span className={dark ? "text-white/45" : "text-slate-400"}>
              {ip.lastSeenAt ? new Date(ip.lastSeenAt).toLocaleString("en-IN") : ""}
            </span>
          </div>
        ))}
        {!data?.item.boundIps?.length ? (
          <p className={`text-sm ${dark ? "text-white/50" : "text-slate-500"}`}>No IPs bound yet.</p>
        ) : null}
      </div>
    </div>
  );
}
