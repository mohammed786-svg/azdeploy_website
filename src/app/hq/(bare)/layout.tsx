import { requireHqSession } from "@/lib/hq-server-auth";

/** Routes without HQ sidebar: A4 print views and full-width student profile. */
export default async function HqBareLayout({ children }: { children: React.ReactNode }) {
  await requireHqSession();
  return <>{children}</>;
}
