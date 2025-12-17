import { CompanyCreditClientPage } from "@/components/(dashboard)/company-credits/client";
import { getCompanyCredits } from "@/data/company-credit";

export const dynamic = "force-dynamic";

export default async function CompanyCreditsPage({
  searchParams,
}: {
  searchParams: Promise<{
    page?: string;
    pageSize?: string;
    search?: string;
    status?: string;
    fromDate?: string;
    toDate?: string;
  }>;
}) {
  const params = await searchParams;

  const page = Number(params?.page) || 0;
  const pageSize = Number(params?.pageSize) || 12;
  const search = params?.search || "";
  const status = params?.status || "all";
  const fromDate = params?.fromDate || "";
  const toDate = params?.toDate || "";

  const { data, totalCount, stats } = await getCompanyCredits(
    page,
    pageSize,
    search,
    status,
    fromDate,
    toDate
  );

  return (
    <CompanyCreditClientPage
      initialCredits={data}
      totalCount={totalCount}
      currentPage={page}
      pageSize={pageSize}
      search={search}
      status={status}
      stats={stats}
      fromDate={fromDate}
      toDate={toDate}
    />
  );
}
