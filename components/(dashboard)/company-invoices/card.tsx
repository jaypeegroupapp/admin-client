"use client";

import { motion } from "framer-motion";
import { FileText } from "lucide-react";
import { ICompanyInvoice } from "@/definitions/company-invoice";
import Link from "next/link";

export function CompanyInvoiceCard({ invoice }: { invoice: ICompanyInvoice }) {
  const formatted = invoice.paymentDate
    ? new Date(invoice.paymentDate).toLocaleDateString("en-ZA")
    : "-";

  const invoiceNumber =
    invoice.id?.slice(-6).toUpperCase() || Math.floor(Math.random() * 9999);

  return (
    <Link href={`/company-invoices/${invoice.id}`} className="block">
      <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm hover:shadow-md transition-all flex flex-col justify-between cursor-pointer hover:border-gray-400"
      >
        <div className="flex items-start gap-3">
          <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
            <FileText />
          </div>

          <div className="flex flex-col flex-1">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-800">
                Invoice #{invoiceNumber}
              </h3>
              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-md font-mono">
                {invoice.status.toUpperCase()}
              </span>
            </div>

            <p className="text-sm text-gray-500 mt-1">
              Company: {invoice.companyName}
            </p>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
