import HqShell from "@/components/hq/HqShell";
import { requireHqSession } from "@/lib/hq-server-auth";

export default async function HqShellLayout({ children }: { children: React.ReactNode }) {
  await requireHqSession();
  return <HqShell>{children}</HqShell>;
}
