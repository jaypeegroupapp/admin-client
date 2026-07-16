import { WaitingListClientPage } from "@/components/(dashboard)/waiting-list/client";
import { getOrders } from "@/data/order";

export const dynamic = "force-dynamic";

export default async function WaitingListsPage({
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

  const currentPage = Number(params?.page) || 0;
  const pageSize = Number(params?.pageSize) || 12;
  const search = params?.search || "";
  const status = "pending";

  const fromDate = params?.fromDate || "";
  const toDate = params?.toDate || "";

  const { data, totalCount } = await getOrders(
    currentPage,
    pageSize,
    search,
    status,
    fromDate,
    toDate
  );

  return (
    <WaitingListClientPage
      initialWaitingLists={data || []}
      totalCount={totalCount}
      currentPage={currentPage}
      pageSize={pageSize}
      search={search}
      fromDate={fromDate}
      toDate={toDate}
    />
  );
}
