import { OrderClientPage } from "@/components/(dashboard)/orders/client";
import { getOrders } from "@/data/order";

export const dynamic = "force-dynamic";

export default async function OrdersPage({
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
  const pageSize = Number(params?.pageSize) || 10;
  const search = params?.search || "";
  const status = params?.status || "all";

  const fromDate = params?.fromDate || "";
  const toDate = params?.toDate || "";

  const { data, totalCount, stats } = await getOrders(
    currentPage,
    pageSize,
    search,
    status,
    fromDate,
    toDate
  );

  return (
    <OrderClientPage
      initialOrders={data || []}
      totalCount={totalCount}
      currentPage={currentPage}
      pageSize={pageSize}
      search={search}
      status={status}
      stats={stats}
      fromDate={fromDate}
      toDate={toDate}
    />
  );
}