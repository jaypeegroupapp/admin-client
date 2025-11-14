import { CompanyClientPage } from "@/components/(dashboard)/companies/client";
import { getCompanies } from "@/data/company";
import { ICompany } from "@/definitions/company";

export const dynamic = "force-dynamic";

export default async function CompaniesPage() {
  const response = await getCompanies();
  if (!response.success) {
    return <CompanyClientPage initialCompanies={[]} />;
  }

  const initialCompanies: ICompany[] = response.data ?? [];
  return <CompanyClientPage initialCompanies={initialCompanies} />;
}
