"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import { IOrderItemAggregated, OrderItemTab } from "@/definitions/order-item";

import { OrderItemHeader } from "./header";
import OrderItemFilter from "./filter";
import OrderItemList from "./list";
import { OrderItemTabs } from "./tabs";
import DateFilter from "@/components/ui/date-filter";
import { Pagination } from "@/components/ui/pagination";

export function OrderItemsClientPage({
  initialItems,
  totalCount,
  currentPage,
  pageSize,
  search,
  status,
  stats,
  fromDate,
  toDate,
}: any) {
  const router = useRouter();
  const params = useSearchParams();

  /** Local State */
  const [items, setItems] = useState(initialItems);
  const [filterText, setFilterText] = useState(search || "");
  const [debouncedSearch, setDebouncedSearch] = useState(filterText);

  const [from, setFrom] = useState(fromDate);
  const [to, setTo] = useState(toDate);

  const [activeTab, setActiveTab] = useState<OrderItemTab>(
    (status === "all"
      ? "All"
      : status.charAt(0).toUpperCase() + status.slice(1)) as OrderItemTab
  );

  const pageCount = Math.ceil(totalCount / pageSize);

  useEffect(() => setItems(initialItems), [initialItems]);

  /** Debounced Search */
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(filterText), 300);
    return () => clearTimeout(t);
  }, [filterText]);

  /** Update URL on search */
  useEffect(() => {
    const q = new URLSearchParams(params.toString());
    q.set("search", debouncedSearch);
    q.set("page", "0");
    router.push(`?${q.toString()}`);
  }, [debouncedSearch]);

  /** Date Change */
  const handleDateChange = (f: string, t: string) => {
    setFrom(f);
    setTo(t);

    const q = new URLSearchParams(params.toString());
    f ? q.set("fromDate", f) : q.delete("fromDate");
    t ? q.set("toDate", t) : q.delete("toDate");
    q.set("page", "0");

    router.push(`?${q.toString()}`);
  };

  /** Tab Change */
  const handleTabChange = (tab: OrderItemTab) => {
    setActiveTab(tab);

    const q = new URLSearchParams(params.toString());
    q.set("status", tab === "All" ? "all" : tab.toLowerCase());
    q.set("page", "0");

    router.push(`?${q.toString()}`);
  };

  /** Pagination */
  const handlePageChange = (p: number) => {
    const q = new URLSearchParams(params.toString());
    q.set("page", String(p));
    q.set("pageSize", String(pageSize));
    router.push(`?${q.toString()}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      <OrderItemHeader />

      <div className="flex flex-col lg:flex-row items-end gap-4">
        <OrderItemTabs
          activeTab={activeTab}
          onChange={handleTabChange}
          counts={stats}
        />

        <OrderItemFilter
          initialValue={filterText}
          onFilterChange={setFilterText}
        />

        <DateFilter from={from} to={to} onChange={handleDateChange} />
      </div>

      <OrderItemList initialItems={items} />

      <Pagination
        currentPage={currentPage}
        pageCount={pageCount}
        pageSize={pageSize}
        onPageChange={handlePageChange}
      />
    </motion.div>
  );
}
