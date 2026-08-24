import { notFound } from "next/navigation";
import CompanyProfileDocument from "@/components/company-profile/CompanyProfileDocument";
import { isCompanyProfileToken } from "@/lib/company-profile";

export default async function CompanyProfilePage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  if (!isCompanyProfileToken(token)) notFound();
  return <CompanyProfileDocument />;
}
