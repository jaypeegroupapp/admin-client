"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import { IOrder } from "@/definitions/order";
import { WaitingListHeader } from "./header";
import WaitingListFilter from "./filter";
import { WaitingListList } from "./list";
import { Pagination } from "@/components/ui/pagination";
import DateFilter from "@/components/ui/date-filter"; // ⭐ NEW COMPONENT

export function WaitingListClientPage({
  initialWaitingLists,
  totalCount,
  currentPage,
  pageSize,
  search,
  fromDate,
  toDate,
}: {
  initialWaitingLists: IOrder[];
  totalCount: number;
  currentPage: number;
  pageSize: number;
  search: string;
  fromDate: string;
  toDate: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [orders, setWaitingLists] = useState<IOrder[]>(initialWaitingLists);

  // Search
  const [filterText, setFilterText] = useState(search || "");
  const [debouncedSearch, setDebouncedSearch] = useState(filterText);

  // Dates
  const [from, setFrom] = useState(fromDate || "");
  const [to, setTo] = useState(toDate || "");

  const pageCount = Math.ceil(totalCount / pageSize);

  useEffect(() => setWaitingLists(initialWaitingLists), [initialWaitingLists]);

  /** Debounced search */
  useEffect(() => {
    const timeout = setTimeout(() => setDebouncedSearch(filterText), 300);
    return () => clearTimeout(timeout);
  }, [filterText]);

  /** Update URL on search */
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());

    params.set("search", debouncedSearch);
    params.set("page", "0");

    router.push(`?${params.toString()}`);
  }, [debouncedSearch]);

  /** Handle Dates */
  const handleDateChange = (newFrom: string, newTo: string) => {
    setFrom(newFrom);
    setTo(newTo);

    const params = new URLSearchParams(searchParams.toString());

    newFrom ? params.set("fromDate", newFrom) : params.delete("fromDate");
    newTo ? params.set("toDate", newTo) : params.delete("toDate");

    params.set("page", "0"); // reset pagination

    router.push(`?${params.toString()}`);
  };

  /** Pagination handler */
  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(newPage));
    params.set("pageSize", String(pageSize));

    router.push(`?${params.toString()}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      <WaitingListHeader />

      <div className="flex flex-col lg:flex-row items-end gap-4">

        <WaitingListFilter initialValue={filterText} onFilterChange={setFilterText} />

        <DateFilter from={from} to={to} onChange={handleDateChange} />
      </div>

      <WaitingListList initialWaitingList={orders} />

      <Pagination
        currentPage={currentPage}
        pageCount={pageCount}
        pageSize={pageSize}
        onPageChange={handlePageChange}
      />
    </motion.div>
  );
}
