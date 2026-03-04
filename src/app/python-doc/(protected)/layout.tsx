import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const COOKIE_NAME = "doc_python_access";
const SECRET_ENV = "DOC_COOKIE_SECRET_PYTHON";

export default async function PythonDocProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const secret = process.env[SECRET_ENV];
  if (!secret) {
    redirect("/python-doc/auth");
  }
  const cookieStore = await cookies();
  const cookieValue = cookieStore.get(COOKIE_NAME)?.value;
  if (cookieValue !== secret) {
    redirect("/python-doc/auth");
  }
  return <>{children}</>;
}
