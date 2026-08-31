"use client";

import { useEffect, useState } from "react";
import { hqFetch } from "@/lib/hq-client";
import { formatInr } from "@/lib/ebooks";
import type { PortalUser } from "@/lib/ebook-portal-types";
import { portalRoleLabel } from "@/lib/ebook-portal-types";

type EbookAdmin = {
  id: string;
  slug: string;
  title: string;
  pricePaise: number;
  priceInr: number;
  isActive: boolean;
  isPurchasable: boolean;
};

export default function HqEbooksPage() {
  const [ebooks, setEbooks] = useState<EbookAdmin[]>([]);
  const [users, setUsers] = useState<PortalUser[]>([]);
  const [orders, setOrders] = useState<Array<Record<string, unknown>>>([]);
  const [tab, setTab] = useState<"catalog" | "users" | "orders">("catalog");

  const [userForm, setUserForm] = useState({
    fullName: "",
    email: "",
    password: "",
    portalRole: "sales_rep",
    phone: "",
    commissionBps: 0,
  });

  async function load() {
    const [cat, portal, ord] = await Promise.all([
      hqFetch<{ items: EbookAdmin[] }>("/api/hq/ebooks"),
      hqFetch<{ items: PortalUser[] }>("/api/hq/ebook-portal-users"),
      hqFetch<{ items: Array<Record<string, unknown>> }>("/api/hq/ebook-orders"),
    ]);
    setEbooks(cat.items);
    setUsers(portal.items);
    setOrders(ord.items);
  }

  useEffect(() => {
    void load().catch(() => undefined);
  }, []);

  async function updateEbook(id: string, patch: Partial<EbookAdmin>) {
    await hqFetch(`/api/hq/ebooks/${id}`, {
      method: "PATCH",
      body: JSON.stringify({
        pricePaise: patch.pricePaise,
        isActive: patch.isActive,
        isPurchasable: patch.isPurchasable,
      }),
    });
    await load();
  }

  async function createUser(e: React.FormEvent) {
    e.preventDefault();
    await hqFetch("/api/hq/ebook-portal-users/create", {
      method: "POST",
      body: JSON.stringify(userForm),
    });
    setUserForm({ fullName: "", email: "", password: "", portalRole: "sales_rep", phone: "", commissionBps: 0 });
    await load();
  }

  return (
    <div className="max-w-6xl">
      <h1 className="text-2xl font-bold text-white">Ebooks control center</h1>
      <p className="mt-2 text-sm text-white/60">
        HQ-only: pricing, active/inactive, purchasable flag, and credentials for Studio + Sales dashboards.
      </p>

      <div className="mt-6 flex flex-wrap gap-2">
        {(["catalog", "users", "orders"] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`rounded-full px-4 py-1.5 text-xs font-mono uppercase tracking-wider border ${
              tab === t ? "border-[#00d4ff] bg-[#00d4ff]/15 text-[#7dd3fc]" : "border-white/15 text-white/60"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "catalog" ? (
        <div className="mt-6 space-y-3">
          {ebooks.map((e) => (
            <div key={e.id} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 grid gap-3 lg:grid-cols-[1fr_auto_auto_auto_auto] lg:items-center">
              <div>
                <p className="font-semibold text-white">{e.title}</p>
                <p className="text-xs text-white/50 font-mono">{e.slug}</p>
              </div>
              <label className="text-xs text-white/60">
                Price (₹)
                <input
                  type="number"
                  defaultValue={e.priceInr}
                  onBlur={(ev) => {
                    const v = Number(ev.target.value);
                    if (v > 0 && v !== e.priceInr) void updateEbook(e.id, { pricePaise: v * 100 });
                  }}
                  className="mt-1 block w-24 rounded-lg border border-white/15 bg-black/30 px-2 py-1.5 text-sm"
                />
              </label>
              <label className="flex items-center gap-2 text-xs text-white/70">
                <input type="checkbox" checked={e.isActive} onChange={(ev) => void updateEbook(e.id, { isActive: ev.target.checked })} />
                Active
              </label>
              <label className="flex items-center gap-2 text-xs text-white/70">
                <input type="checkbox" checked={e.isPurchasable} onChange={(ev) => void updateEbook(e.id, { isPurchasable: ev.target.checked })} />
                Purchasable
              </label>
              <span className="text-xs font-mono text-white/45">{formatInr(e.priceInr)}</span>
            </div>
          ))}
        </div>
      ) : null}

      {tab === "users" ? (
        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <form onSubmit={(e) => void createUser(e)} className="rounded-2xl border border-white/10 p-4 space-y-3">
            <h2 className="text-sm font-semibold text-white">Create portal user</h2>
            <input required placeholder="Full name" value={userForm.fullName} onChange={(e) => setUserForm({ ...userForm, fullName: e.target.value })} className="w-full rounded-lg border border-white/15 bg-black/30 px-3 py-2 text-sm" />
            <input required type="email" placeholder="Email" value={userForm.email} onChange={(e) => setUserForm({ ...userForm, email: e.target.value })} className="w-full rounded-lg border border-white/15 bg-black/30 px-3 py-2 text-sm" />
            <input required type="password" placeholder="Password" value={userForm.password} onChange={(e) => setUserForm({ ...userForm, password: e.target.value })} className="w-full rounded-lg border border-white/15 bg-black/30 px-3 py-2 text-sm" />
            <select value={userForm.portalRole} onChange={(e) => setUserForm({ ...userForm, portalRole: e.target.value })} className="w-full rounded-lg border border-white/15 bg-black/30 px-3 py-2 text-sm">
              <option value="sales_rep">Sales rep → /sales</option>
              <option value="studio_editor">Studio editor → /studio</option>
              <option value="studio_admin">Studio admin → /studio</option>
            </select>
            <input type="number" placeholder="Commission bps (sales only)" value={userForm.commissionBps} onChange={(e) => setUserForm({ ...userForm, commissionBps: Number(e.target.value) })} className="w-full rounded-lg border border-white/15 bg-black/30 px-3 py-2 text-sm" />
            <button type="submit" className="rounded-lg bg-[#7c3aed] px-4 py-2 text-sm font-semibold">Create access</button>
          </form>
          <div className="space-y-2">
            {users.map((u) => (
              <div key={u.id} className="rounded-xl border border-white/10 px-3 py-2.5 text-sm">
                <p className="text-white font-medium">{u.fullName}</p>
                <p className="text-xs text-white/50">{u.email} · {portalRoleLabel(u.portalRole)}</p>
                <p className="text-[10px] font-mono text-[#7dd3fc] mt-1">Pass: {u.password || "—"}</p>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {tab === "orders" ? (
        <div className="mt-6 space-y-2">
          {orders.map((o) => (
            <div key={String(o.id)} className="rounded-xl border border-white/10 px-3 py-2.5 text-sm flex flex-wrap justify-between gap-2">
              <div>
                <p className="text-white">{String(o.ebookTitle)}</p>
                <p className="text-xs text-white/50">{String(o.buyerName)} · {String(o.orderRef)}</p>
              </div>
              <div className="text-right text-xs">
                <p className="text-[#fde68a] font-mono">{formatInr(Number(o.amountInr) || 0)}</p>
                <p className="text-white/45">{String(o.referralCode || "direct")}</p>
              </div>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
