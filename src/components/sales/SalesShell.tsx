"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import PortalShell from "@/components/portal/PortalShell";
import type { PortalUser } from "@/lib/ebook-portal-types";
import { portalRoleLabel } from "@/lib/ebook-portal-types";
import { salesFetch } from "@/lib/sales-client";
import { SALES_API_LOCAL_STORAGE_KEY, SALES_API_SESSION_STORAGE_KEY } from "@/lib/sales-session-keys";

const NAV = [
  { href: "/sales", label: "Dashboard", match: (p: string) => p === "/sales" },
  { href: "/sales/links", label: "My links", match: (p: string) => p.startsWith("/sales/links") },
];

export default function SalesShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [me, setMe] = useState<PortalUser | null>(null);

  useEffect(() => {
    void salesFetch<{ item: PortalUser }>("/api/sales/me")
      .then((d) => setMe(d.item))
      .catch(() => undefined);
  }, []);

  async function logout() {
    try {
      await salesFetch("/api/sales/logout", { method: "POST" }, { suppressSuccessToast: true });
    } catch {
      /* ignore */
    }
    window.sessionStorage.removeItem(SALES_API_SESSION_STORAGE_KEY);
    window.localStorage.removeItem(SALES_API_LOCAL_STORAGE_KEY);
    router.replace("/sales/login");
  }

  return (
    <PortalShell
      nav={NAV}
      title="Sales Desk"
      subtitle="Referral tracking"
      accent="#fbbf24"
      accentSoft="rgba(251,191,36,0.16)"
      userName={me?.fullName}
      userRole={portalRoleLabel(me?.portalRole || "")}
      onLogout={logout}
    >
      {children}
    </PortalShell>
  );
}
