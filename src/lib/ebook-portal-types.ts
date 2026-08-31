export type PortalUser = {
  id: string;
  email: string;
  fullName: string;
  phone: string;
  portalRole: "studio_admin" | "studio_editor" | "sales_rep";
  isActive: boolean;
  commissionBps: number;
  notes: string;
  lastLoginAt?: string;
  createdAt?: string;
  password?: string;
};

export type SalesLink = {
  id: string;
  code: string;
  label: string;
  ebookId: string;
  ebookTitle: string;
  ebookSlug: string;
  clickCount: number;
  isActive: boolean;
  referralUrl: string;
  createdAt?: string;
};

export type StudioProject = {
  id: string;
  title: string;
  status: string;
  ebookTitle: string;
  ebookSlug: string;
  createdAt?: string;
  updatedAt?: string;
};

export function portalRoleLabel(role: string): string {
  const map: Record<string, string> = {
    studio_admin: "Studio Admin",
    studio_editor: "Studio Editor",
    sales_rep: "Sales Rep",
  };
  return map[role] || role;
}
