import StaffShell from "@/components/staff/StaffShell";

export default function StaffPortalLayout({ children }: { children: React.ReactNode }) {
  return <StaffShell>{children}</StaffShell>;
}
