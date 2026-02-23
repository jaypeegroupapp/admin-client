"use client";

import { motion } from "framer-motion";
import { Building2, FileText, Mountain } from "lucide-react";
import { IMineInvoice } from "@/definitions/mine-invoice";
import Link from "next/link";

export function MineInvoiceCard({ invoice }: { invoice: IMineInvoice }) {
  const invoiceNumber =
    invoice.id?.slice(-6).toUpperCase() || Math.floor(Math.random() * 9999);

  return (
    <Link href={`/mine-invoices/${invoice.id}`}>
      <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-2xl border p-4 shadow-sm hover:shadow-md"
      >
        <div className="flex items-center gap-3">
          <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
            <FileText />
          </div>

          <div className="flex flex-col flex-1">
            <h3 className="font-semibold text-gray-800">
              Invoice #{invoiceNumber}
            </h3>
            <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
              <Building2 size={14} />
              {invoice.companyName || "No company"}
            </p>{" "}
            <p className="text-sm text-gray-500 flex items-center gap-1">
              <Mountain size={14} />
              {invoice.mineName || "No Mine"}
            </p>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
