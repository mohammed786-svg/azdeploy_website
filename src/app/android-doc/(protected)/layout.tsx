import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const COOKIE_NAME = "doc_android_access";
const SECRET_ENV = "DOC_COOKIE_SECRET_ANDROID";

export default async function AndroidDocProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const secret = process.env[SECRET_ENV];
  if (!secret) {
    redirect("/android-doc/auth");
  }
  const cookieStore = await cookies();
  const cookieValue = cookieStore.get(COOKIE_NAME)?.value;
  if (cookieValue !== secret) {
    redirect("/android-doc/auth");
  }
  return <>{children}</>;
}
