// app/(dashboard)/refunds/page.tsx
import { RefundsClientPage } from "@/components/(dashboard)/returns/client";
import { getOrderItems } from "@/data/order-item";

export const dynamic = "force-dynamic";

export default async function RefundsPage({
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
    const status = params?.status || "returned";
    const fromDate = params?.fromDate || "";
    const toDate = params?.toDate || "";

    const { data, totalCount, stats } = await getOrderItems(
        page,
        pageSize,
        search,
        status,
        fromDate,
        toDate,
    );

    return (
        <RefundsClientPage
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