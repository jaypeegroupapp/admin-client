import { CompanyCreditApprovalClientPage } from "@/components/(dashboard)/company-credit-approvals/client";
import { getCompanyCreditApprovals } from "@/data/company-credit-approval";

export const dynamic = "force-dynamic";

export default async function CompanyCreditApprovalsPage({
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

  const { data, totalCount, stats } = await getCompanyCreditApprovals(
    page,
    pageSize,
    search,
    status,
    fromDate,
    toDate
  );

  console.log({ stats });

  return (
    <CompanyCreditApprovalClientPage
      initialItems={data}
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
