import { redirect } from "next/navigation";
import { readAcademySessionFromCookies } from "@/lib/academy-session";

export default async function AcademyPortalLayout({ children }: { children: React.ReactNode }) {
  const session = await readAcademySessionFromCookies();
  if (!session) redirect("/academy/login");
  return <>{children}</>;
}
