"use client";

import { useRouter } from "next/navigation";
import PortalShell from "@/components/portal/PortalShell";
import { portalRoleLabel } from "@/lib/ebook-portal-types";
import { studioFetch } from "@/lib/studio-client";
import { STUDIO_API_LOCAL_STORAGE_KEY, STUDIO_API_SESSION_STORAGE_KEY } from "@/lib/studio-session-keys";
import type { PortalUser } from "@/lib/ebook-portal-types";
import { useEffect, useState } from "react";

const NAV = [
  { href: "/studio", label: "Dashboard", match: (p: string) => p === "/studio" },
  { href: "/studio/projects", label: "Projects", match: (p: string) => p.startsWith("/studio/projects") },
  { href: "/studio/generations", label: "AI Images", match: (p: string) => p.startsWith("/studio/generations") },
  { href: "/studio/ebooks", label: "Catalog", match: (p: string) => p.startsWith("/studio/ebooks") },
];

export default function StudioShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [me, setMe] = useState<PortalUser | null>(null);

  useEffect(() => {
    void studioFetch<{ item: PortalUser }>("/api/studio/me")
      .then((d) => setMe(d.item))
      .catch(() => undefined);
  }, []);

  async function logout() {
    try {
      await studioFetch("/api/studio/logout", { method: "POST" }, { suppressSuccessToast: true });
    } catch {
      /* ignore */
    }
    window.sessionStorage.removeItem(STUDIO_API_SESSION_STORAGE_KEY);
    window.localStorage.removeItem(STUDIO_API_LOCAL_STORAGE_KEY);
    router.replace("/studio/login");
  }

  return (
    <PortalShell
      nav={NAV}
      title="Ebook Studio"
      subtitle="Content workspace"
      accent="#a78bfa"
      accentSoft="rgba(167,139,250,0.18)"
      userName={me?.fullName}
      userRole={portalRoleLabel(me?.portalRole || "")}
      onLogout={logout}
    >
      {children}
    </PortalShell>
  );
}
