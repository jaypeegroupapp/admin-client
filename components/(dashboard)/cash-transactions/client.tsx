// src/components/(dashboard)/cash-transactions/client.tsx
"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ICashTransactionAggregated,
  CashTransactionTab,
} from "@/definitions/cash-transactions";

import { CashTransactionHeader } from "./header";
import { DispenserInfoHeader } from "./dispenser-info"; // New component
import CashTransactionFilter from "./filter";
import CashTransactionList from "./list";
import { CashTransactionTabs } from "./tabs";
import DateFilter from "@/components/ui/date-filter";
import { Pagination } from "@/components/ui/pagination";
import CashTransactionForm from "./form";
import CashTransactionFormModal from "@/components/ui/modal";

interface Props {
  initialItems: ICashTransactionAggregated[];
  totalCount: number;
  currentPage: number;
  pageSize: number;
  search: string;
  status: string;
  stats: Record<CashTransactionTab, number>;
  fromDate: string;
  toDate: string;
  userDispenser?: any; // Add user dispenser info
}

export function CashTransactionsClientPage({
  initialItems,
  totalCount,
  currentPage,
  pageSize,
  search,
  status,
  stats,
  fromDate,
  toDate,
  userDispenser,
}: Props) {
  const router = useRouter();
  const params = useSearchParams();

  const [items, setItems] = useState(initialItems);
  const [filterText, setFilterText] = useState(search || "");
  const [debouncedSearch, setDebouncedSearch] = useState(filterText);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [from, setFrom] = useState(fromDate);
  const [to, setTo] = useState(toDate);

  const [activeTab, setActiveTab] = useState<CashTransactionTab>(
    (status === "all"
      ? "All"
      : status.charAt(0).toUpperCase() + status.slice(1)) as CashTransactionTab,
  );

  const pageCount = Math.ceil(totalCount / pageSize);

  useEffect(() => setItems(initialItems), [initialItems]);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(filterText), 300);
    return () => clearTimeout(t);
  }, [filterText]);

  useEffect(() => {
    const q = new URLSearchParams(params.toString());
    q.set("search", debouncedSearch);
    q.set("page", "0");
    router.push(`?${q.toString()}`);
  }, [debouncedSearch]);

  const handleDateChange = (f: string, t: string) => {
    setFrom(f);
    setTo(t);

    const q = new URLSearchParams(params.toString());
    f ? q.set("fromDate", f) : q.delete("fromDate");
    t ? q.set("toDate", t) : q.delete("toDate");
    q.set("page", "0");

    router.push(`?${q.toString()}`);
  };

  const handleTabChange = (tab: CashTransactionTab) => {
    setActiveTab(tab);

    const q = new URLSearchParams(params.toString());
    q.set("status", tab === "All" ? "all" : tab.toLowerCase());
    q.set("page", "0");

    router.push(`?${q.toString()}`);
  };

  const handlePageChange = (p: number) => {
    const q = new URLSearchParams(params.toString());
    q.set("page", String(p));
    q.set("pageSize", String(pageSize));
    router.push(`?${q.toString()}`);
  };

  const handleAdd = () => setIsModalOpen(true);
  const handleClose = () => {
    setIsModalOpen(false);
    router.refresh(); // Refresh to show new transaction
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      <CashTransactionHeader onAdd={handleAdd} />

      {/* Dispenser Info for Station Attendant */}
      {userDispenser && (
        <DispenserInfoHeader
          dispenser={userDispenser.dispenser}
          attendance={userDispenser.attendance}
        />
      )}

      <div className="flex flex-col lg:flex-row items-end gap-4">
        <CashTransactionTabs
          activeTab={activeTab}
          onChange={handleTabChange}
          counts={stats}
        />

        <CashTransactionFilter
          initialValue={filterText}
          onFilterChange={setFilterText}
        />

        <DateFilter from={from} to={to} onChange={handleDateChange} />
      </div>

      <CashTransactionList initialItems={items} />

      <Pagination
        currentPage={currentPage}
        pageCount={pageCount}
        pageSize={pageSize}
        onPageChange={handlePageChange}
      />

      <CashTransactionFormModal isOpen={isModalOpen} onClose={handleClose}>
        <CashTransactionForm userDispenser={userDispenser} />
      </CashTransactionFormModal>
    </motion.div>
  );
}
