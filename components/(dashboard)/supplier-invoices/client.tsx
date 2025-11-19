"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { ISupplierInvoice } from "@/definitions/supplier-invoice";
import { SupplierInvoiceHeader } from "./header";
import SupplierInvoiceFilter from "./filter";
import { SupplierInvoiceList } from "./list";
import { getSupplierInvoices } from "@/data/supplier-invoice";

interface Props {
  initialInvoices: ISupplierInvoice[];
}

export function SupplierInvoiceClientPage({ initialInvoices }: Props) {
  const [invoices, setInvoices] = useState<ISupplierInvoice[]>(initialInvoices);
  const [filterText, setFilterText] = useState("");

  const router = useRouter();

  const filtered = invoices.filter((i) =>
    `${i.status} ${i.totalAmount}`
      .toLowerCase()
      .includes(filterText.toLowerCase())
  );

  const fetchInvoices = async () => {
    const res = await getSupplierInvoices();
    if (res?.length) setInvoices(res);
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  const handleAdd = () => {
    router.push("/supplier-invoices/add");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      <SupplierInvoiceHeader />
      <SupplierInvoiceFilter onFilterChange={(text) => setFilterText(text)} />
      <SupplierInvoiceList initialInvoices={filtered} />
    </motion.div>
  );
}
