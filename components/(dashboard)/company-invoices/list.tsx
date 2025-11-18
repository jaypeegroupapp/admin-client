"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ICompanyInvoice } from "@/definitions/company-invoice";
import { CompanyInvoiceCard } from "./card";

export function CompanyInvoiceList({
  initialInvoices,
}: {
  initialInvoices: ICompanyInvoice[];
}) {
  return (
    <motion.div
      layout
      className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <AnimatePresence>
        {initialInvoices.length === 0 ? (
          <motion.p
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-gray-500 text-center col-span-full py-10"
          >
            No invoices yet.
          </motion.p>
        ) : (
          initialInvoices.map((invoice) => (
            <CompanyInvoiceCard key={invoice.id} invoice={invoice} />
          ))
        )}
      </AnimatePresence>
    </motion.div>
  );
}
