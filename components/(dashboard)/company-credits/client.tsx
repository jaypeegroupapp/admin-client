"use client";

import { motion } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ICompanyCredit } from "@/definitions/company-credit";
import DateFilter from "@/components/ui/date-filter";
import { Pagination } from "@/components/ui/pagination";
import CompanyCreditList from "./list";
import CompanyCreditTabs from "./tabs";
import CompanyCreditFilter from "./filter";
import CompanyCreditHeader from "./header";

export function CompanyCreditClientPage({
  initialCredits,
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

  const [credits, setCredits] = useState<ICompanyCredit[]>(initialCredits);
  const [filterText, setFilterText] = useState(search);
  const [debounced, setDebounced] = useState(filterText);

  const pageCount = Math.ceil(totalCount / pageSize);

  useEffect(() => setCredits(initialCredits), [initialCredits]);

  useEffect(() => {
    const t = setTimeout(() => setDebounced(filterText), 300);
    return () => clearTimeout(t);
  }, [filterText]);

  useEffect(() => {
    const q = new URLSearchParams(params.toString());
    q.set("search", debounced);
    q.set("page", "0");
    router.push(`?${q.toString()}`);
  }, [debounced]);

  const onPageChange = (p: number) => {
    const q = new URLSearchParams(params.toString());
    q.set("page", String(p));
    q.set("pageSize", String(pageSize));
    router.push(`?${q.toString()}`);
  };

  return (
    <motion.div className="space-y-6">
      <CompanyCreditHeader />

      <div className="flex flex-col lg:flex-row gap-4 items-end">
        <CompanyCreditTabs
          active={status}
          counts={stats}
          onChange={(s: string) => router.push(`?status=${s}&page=0`)}
        />
        <CompanyCreditFilter
          initialValue={filterText}
          onFilterChange={setFilterText}
        />
        <DateFilter
          from={fromDate}
          to={toDate}
          onChange={(f, t) => router.push(`?fromDate=${f}&toDate=${t}&page=0`)}
        />
      </div>

      <CompanyCreditList items={credits} />

      <Pagination
        currentPage={currentPage}
        pageCount={pageCount}
        pageSize={pageSize}
        onPageChange={onPageChange}
      />
    </motion.div>
  );
}
