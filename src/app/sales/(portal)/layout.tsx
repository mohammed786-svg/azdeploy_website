import SalesShell from "@/components/sales/SalesShell";

export default function SalesPortalLayout({ children }: { children: React.ReactNode }) {
  return <SalesShell>{children}</SalesShell>;
}
