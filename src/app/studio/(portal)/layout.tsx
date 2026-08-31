import StudioShell from "@/components/studio/StudioShell";

export default function StudioPortalLayout({ children }: { children: React.ReactNode }) {
  return <StudioShell>{children}</StudioShell>;
}
