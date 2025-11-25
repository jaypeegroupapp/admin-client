"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

import {
  ISupplierInvoice,
  SupplierInvoiceTab,
} from "@/definitions/supplier-invoice";
import { SupplierInvoiceHeader } from "./header";
import SupplierInvoiceFilter from "./filter";
import { SupplierInvoiceList } from "./list";
import { SupplierInvoiceTabs } from "./tabs";
import { getSupplierInvoices } from "@/data/supplier-invoice";

interface Props {
  initialInvoices: ISupplierInvoice[];
}

export function SupplierInvoiceClientPage({ initialInvoices }: Props) {
  const [invoices, setInvoices] = useState<ISupplierInvoice[]>(
    initialInvoices || []
  );

  const [filterText, setFilterText] = useState("");
  const [activeTab, setActiveTab] = useState<SupplierInvoiceTab>("All");

  const router = useRouter();

  const fetchInvoices = async () => {
    const res = await getSupplierInvoices();
    if (Array.isArray(res)) setInvoices(res);
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  /** --------------------------------
   * STATUS COUNTS
   --------------------------------*/
  const counts: Record<SupplierInvoiceTab, number> = {
    All: invoices.length,
    Pending: invoices.filter((i) => i.status === "pending").length,
    Paid: invoices.filter((i) => i.status === "paid").length,
    Closed: invoices.filter((i) => i.status === "closed").length,
  };

  /** --------------------------------
   * FILTERING: Search + Tabs
   --------------------------------*/
  const filtered = invoices
    .filter((inv) =>
      `${inv.status} ${inv.totalAmount}`
        .toLowerCase()
        .includes(filterText.toLowerCase())
    )
    .filter((inv) => {
      if (activeTab === "All") return true;
      return inv.status.toLowerCase() === activeTab.toLowerCase();
    });

  /** --------------------------------
   * PAGE UI
   --------------------------------*/
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      <SupplierInvoiceHeader />

      <div className="flex flex-col lg:flex-row items-center gap-4">
        {/* TABS */}
        <SupplierInvoiceTabs
          activeTab={activeTab}
          onChange={setActiveTab}
          counts={counts}
        />

        {/* SEARCH */}
        <SupplierInvoiceFilter onFilterChange={(text) => setFilterText(text)} />
      </div>

      {/* LIST */}
      <SupplierInvoiceList initialInvoices={filtered} />
    </motion.div>
  );
}
