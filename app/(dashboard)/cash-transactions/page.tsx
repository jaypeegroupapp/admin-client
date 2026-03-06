// app/(dashboard)/cash-transactions/page.tsx

import { CashTransactionsClientPage } from "@/components/(dashboard)/cash-transactions/client";
import { getCashTransactions } from "@/data/cash-transactions";

export const dynamic = "force-dynamic";

interface CashTransactionSearchParams {
  page?: string;
  pageSize?: string;
  search?: string;
  status?: string;
  fromDate?: string;
  toDate?: string;
}

export default async function CashTransactionsPage({
  searchParams,
}: {
  searchParams: Promise<CashTransactionSearchParams>;
}) {
  const params = await searchParams;

  const page = Number(params?.page) || 0;
  const pageSize = Number(params?.pageSize) || 12;
  const search = params?.search || "";
  const status = params?.status || "all";
  const fromDate = params?.fromDate || "";
  const toDate = params?.toDate || "";

  const { data, totalCount, stats } = await getCashTransactions(
    page,
    pageSize,
    search,
    status,
    fromDate,
    toDate,
  );

  return (
    <CashTransactionsClientPage
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
