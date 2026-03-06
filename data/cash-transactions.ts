import { getCashTransactionsService } from "@/services/cash-transactions";
import { ICashTransactionAggregated } from "@/definitions/cash-transactions";
import { cashTransactionMap } from "./mapper";

export async function getCashTransactions(
  page = 0,
  pageSize = 12,
  search = "",
  status = "all",
  fromDate = "",
  toDate = "",
): Promise<{
  data: ICashTransactionAggregated[];
  totalCount: number;
  stats: Record<string, number>;
}> {
  try {
    const { data, totalCount, stats } = await getCashTransactionsService(
      page,
      pageSize,
      search,
      status,
      fromDate,
      toDate,
    );

    return {
      data: data.map(cashTransactionMap),
      totalCount,
      stats,
    };
  } catch (err) {
    console.error("❌ getCashTransactions error:", err);
    return { data: [], totalCount: 0, stats: {} };
  }
}
