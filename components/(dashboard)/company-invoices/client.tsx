"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { ICompanyInvoice } from "@/definitions/company-invoice";
import { CompanyInvoiceHeader } from "./header";
import CompanyInvoiceFilter from "./filter";
import { CompanyInvoiceList } from "./list";
import { getCompanyInvoices } from "@/data/company-invoice";

interface Props {
  initialInvoices: ICompanyInvoice[];
}

export function CompanyInvoiceClientPage({ initialInvoices }: Props) {
  const [invoices, setInvoices] = useState<ICompanyInvoice[]>(initialInvoices);
  const [filterText, setFilterText] = useState("");

  const router = useRouter();

  const filtered = invoices.filter((i) =>
    `${i.status} ${i.totalAmount}`
      .toLowerCase()
      .includes(filterText.toLowerCase())
  );

  const fetchInvoices = async () => {
    const res = await getCompanyInvoices();
    if (res?.length) setInvoices(res);
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  const handleAdd = () => {
    router.push("/company-invoices/add");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      <CompanyInvoiceHeader />
      <CompanyInvoiceFilter onFilterChange={(text) => setFilterText(text)} />
      <CompanyInvoiceList initialInvoices={filtered} />
    </motion.div>
  );
}
