"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { ICompanyInvoice } from "@/definitions/company-invoice";
import { CompanyInvoiceHeader } from "./header";
import CompanyInvoiceFilter from "./filter";
import { CompanyInvoiceList } from "./list";
import { InvoiceTabs } from "./tabs";
import { InvoiceTab } from "@/definitions/company-invoice";
import { getCompanyInvoices } from "@/data/company-invoice";

interface Props {
  initialInvoices: ICompanyInvoice[];
}

export function CompanyInvoiceClientPage({ initialInvoices }: Props) {
  const [invoices, setInvoices] = useState<ICompanyInvoice[]>(
    initialInvoices || []
  );

  const [filterText, setFilterText] = useState("");
  const [activeTab, setActiveTab] = useState<InvoiceTab>("All");

  const router = useRouter();

  const fetchInvoices = async () => {
    const res = await getCompanyInvoices();
    if (Array.isArray(res)) setInvoices(res);
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  /** --------------------------------
   * STATUS COUNTS
   --------------------------------*/
  const counts: Record<InvoiceTab, number> = {
    All: invoices.length,
    Pending: invoices.filter((i) => i.status === "pending").length,
    Published: invoices.filter((i) => i.status === "published").length,
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
      <CompanyInvoiceHeader />

      <div className="flex flex-col lg:flex-row items-center gap-4">
        <InvoiceTabs
          activeTab={activeTab}
          onChange={setActiveTab}
          counts={counts}
        />

        <CompanyInvoiceFilter onFilterChange={(text) => setFilterText(text)} />
      </div>

      <CompanyInvoiceList initialInvoices={filtered} />
    </motion.div>
  );
}
