"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import { IOrder, OrderTab } from "@/definitions/order";
import { OrderHeader } from "./header";
import OrderFilter from "./filter";
import { OrderList } from "./list";
import { OrderTabs } from "./tabs";
import { Pagination } from "./pagination";

export function OrderClientPage({
  initialOrders,
  totalCount,
  currentPage,
  pageSize,
  search,
  status,
  stats,
}: {
  initialOrders: IOrder[];
  totalCount: number;
  currentPage: number;
  pageSize: number;
  search: string;
  status: string;
  stats: Record<string, number>;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [orders, setOrders] = useState<IOrder[]>(initialOrders);
  const [filterText, setFilterText] = useState(search || "");
  const [debouncedSearch, setDebouncedSearch] = useState(filterText);

  const [activeTab, setActiveTab] = useState<OrderTab>(
    (status === "all"
      ? "All"
      : status.charAt(0).toUpperCase() + status.slice(1)) as OrderTab
  );

  const pageCount = Math.ceil(totalCount / pageSize);

  /** --------------------------------
   * UPDATE ORDERS WHEN SSR CHANGES
   * --------------------------------*/
  useEffect(() => {
    setOrders(initialOrders);
  }, [initialOrders]);

  /** --------------------------------
   * DEBOUNCE HANDLER (300ms)
   * --------------------------------*/
  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedSearch(filterText);
    }, 300);

    return () => clearTimeout(timeout);
  }, [filterText]);

  /** --------------------------------
   * UPDATE URL WHEN DEBOUNCED SEARCH CHANGES
   * --------------------------------*/
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());

    params.set("search", debouncedSearch || "");
    params.set("page", "0");

    router.push(`?${params.toString()}`);
  }, [debouncedSearch]);

  /** --------------------------------
   * TABS → URL UPDATE
   * --------------------------------*/
  const handleTabChange = (tab: OrderTab) => {
    setActiveTab(tab);

    const params = new URLSearchParams(searchParams.toString());
    params.set("status", tab === "All" ? "all" : tab.toLowerCase());
    params.set("page", "0");

    router.push(`?${params.toString()}`);
  };

  /** --------------------------------
   * PAGINATION HANDLER
   * --------------------------------*/
  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(newPage));
    params.set("pageSize", String(pageSize));

    router.push(`?${params.toString()}`);
  };

  /** --------------------------------
   * COUNTS (client UI only)
   * --------------------------------*/
  const counts = {
    All: stats.All || 0,
    Pending: stats.Pending || 0,
    Accepted: stats.Accepted || 0,
    Completed: stats.Completed || 0,
    Cancelled: stats.Cancelled || 0,
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      <OrderHeader />

      <div className="flex flex-col lg:flex-row items-center gap-4">
        <OrderTabs
          activeTab={activeTab}
          onChange={handleTabChange}
          counts={counts}
        />

        {/* 🔥 SEARCH NOW USES DEBOUNCE */}
        <OrderFilter initialValue={filterText} onFilterChange={setFilterText} />
      </div>

      <OrderList initialOrders={orders} />

      <Pagination
        currentPage={currentPage}
        pageCount={pageCount}
        pageSize={pageSize}
        onPageChange={handlePageChange}
      />
    </motion.div>
  );
}
