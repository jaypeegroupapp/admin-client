"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { IMineInvoice, InvoiceTab } from "@/definitions/mine-invoice";
import { MineInvoiceHeader } from "./header";
import MineInvoiceFilter from "./filter";
import { MineInvoiceList } from "./list";
import { InvoiceTabs } from "../company-invoices/tabs";
import { getMineInvoices } from "@/data/mine-invoice";

interface Props {
  initialInvoices: IMineInvoice[];
}

export function MineInvoiceClientPage({ initialInvoices }: Props) {
  const [invoices, setInvoices] = useState<any[]>(initialInvoices);
  const [filterText, setFilterText] = useState("");
  const [activeTab, setActiveTab] = useState<InvoiceTab>("All");

  const fetchInvoices = async () => {
    const res = await getMineInvoices();
    if (Array.isArray(res)) setInvoices(res);
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  const counts: Record<InvoiceTab, number> = {
    All: invoices.length,
    Pending: invoices.filter((i) => i.status === "pending").length,
    Published: invoices.filter((i) => i.status === "published").length,
    Paid: invoices.filter((i) => i.status === "paid").length,
    Closed: invoices.filter((i) => i.status === "closed").length,
  };

  const filtered = invoices
    .filter((inv) =>
      `${inv.status} ${inv.totalAmount}`
        .toLowerCase()
        .includes(filterText.toLowerCase())
    )
    .filter((inv) =>
      activeTab === "All"
        ? true
        : inv.status.toLowerCase() === activeTab.toLowerCase()
    );

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      <MineInvoiceHeader />

      <div className="flex flex-col lg:flex-row items-center gap-4">
        <InvoiceTabs
          activeTab={activeTab}
          onChange={setActiveTab}
          counts={counts}
        />
        <MineInvoiceFilter onFilterChange={setFilterText} />
      </div>

      <MineInvoiceList initialInvoices={filtered} />
    </motion.div>
  );
}
