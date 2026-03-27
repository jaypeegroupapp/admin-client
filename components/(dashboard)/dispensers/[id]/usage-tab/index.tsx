// src/components/(dashboard)/dispensers/[id]/usage-tab.tsx
"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Droplet, LayoutGrid, Table } from "lucide-react";
import {
  getDispenserUsageHistory,
  getDispenserUsageHistoryPaginated,
} from "@/data/dispenser-usage";
import { UsageStats } from "./stats";
import { UsageFilters } from "./filters";
import { UsageCardView } from "./card-view";
import { UsageTableView } from "./table-view";
import { UsageLoadingState } from "./loading-state";
import { UsageEmptyState } from "./empty-state";
import { Pagination } from "@/components/ui/pagination";

export type ViewMode = "card" | "table";
export type TransactionFilter = "all" | "orders" | "cash";

interface PaginatedData {
  data: any[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export function UsageTab({ dispenserId }: { dispenserId: string }) {
  const [usage, setUsage] = useState<any[]>([]);
  const [filter, setFilter] = useState<TransactionFilter>("all");
  const [viewMode, setViewMode] = useState<ViewMode>("card");
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 0,
    pageSize: 10,
    totalCount: 0,
    totalPages: 0,
  });

  const loadUsage = async (page: number = 0) => {
    setLoading(true);
    const res = await getDispenserUsageHistoryPaginated(
      dispenserId,
      page,
      pagination.pageSize,
      filter,
    );

    if (res) {
      setUsage(res.data);
      setPagination({
        page: res.page,
        pageSize: res.pageSize,
        totalCount: res.totalCount,
        totalPages: res.totalPages,
      });
    }
    setLoading(false);
  };

  useEffect(() => {
    loadUsage(0);
  }, [dispenserId, filter]);

  const handlePageChange = (newPage: number) => {
    loadUsage(newPage);
  };

  // Calculate totals from all data (not just current page)
  const totalLitres = usage.reduce((sum, r) => sum + r.litresDispensed, 0);
  const orderCount = usage.filter((r) => r.orderId).length;
  const cashCount = usage.filter((r) => r.cashTransactionId).length;

  if (loading && usage.length === 0) {
    return <UsageLoadingState />;
  }

  return (
    <div className="space-y-4">
      {/* Header with View Toggle */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h3 className="text-sm font-medium text-gray-700 flex items-center gap-2">
          <Droplet size={16} className="text-gray-500" />
          Usage History
        </h3>

        <div className="flex items-center gap-4">
          {/* Filter Buttons */}
          <UsageFilters
            filter={filter}
            onFilterChange={setFilter}
            counts={{
              all: pagination.totalCount,
              orders: 0,
              cash: 0,
            }}
          />

          {/* View Toggle */}
          <div className="flex gap-1 bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => setViewMode("card")}
              className={`p-1.5 rounded-md transition ${
                viewMode === "card"
                  ? "bg-white text-gray-800 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              title="Card View"
            >
              <LayoutGrid size={18} />
            </button>
            <button
              onClick={() => setViewMode("table")}
              className={`p-1.5 rounded-md transition ${
                viewMode === "table"
                  ? "bg-white text-gray-800 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              title="Table View"
            >
              <Table size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      {pagination.totalCount > 0 && (
        <UsageStats
          totalLitres={totalLitres}
          orderCount={orderCount}
          cashCount={cashCount}
          transactionCount={pagination.totalCount}
        />
      )}

      {/* Usage List */}
      {usage.length === 0 ? (
        <UsageEmptyState filter={filter} />
      ) : viewMode === "card" ? (
        <UsageCardView usage={usage} />
      ) : (
        <UsageTableView usage={usage} />
      )}

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex justify-center pt-4">
          <Pagination
            currentPage={pagination.page}
            pageCount={pagination.totalPages}
            pageSize={pagination.pageSize}
            onPageChange={handlePageChange}
          />
        </div>
      )}

      {/* Showing X of Y records */}
      {pagination.totalCount > pagination.pageSize && (
        <div className="text-center text-xs text-gray-500">
          Showing {pagination.page * pagination.pageSize + 1} -{" "}
          {Math.min(
            (pagination.page + 1) * pagination.pageSize,
            pagination.totalCount,
          )}{" "}
          of {pagination.totalCount} records
        </div>
      )}
    </div>
  );
}
