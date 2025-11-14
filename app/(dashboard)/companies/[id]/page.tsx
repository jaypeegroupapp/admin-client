import { CompanyDetailsClient } from "@/components/(dashboard)/companies/[id]/client";
import { getCompanyById } from "@/data/company";
import { notFound } from "next/navigation";

export default async function CompanyDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const company = await getCompanyById(id);

  if (!company?.success || !company.data) return notFound();

  return (
    <div className="max-w-4xl mx-auto py-2 md:py-10 px-0 md:px-4">
      <CompanyDetailsClient company={company.data} />
    </div>
  );
}
