"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Banknote, Factory, Truck } from "lucide-react";
import { ICashTransactionAggregated } from "@/definitions/cash-transactions";
import { CashTransactionDetailModal } from "./modal";

export default function CashTransactionCard({
  item,
}: {
  item: ICashTransactionAggregated;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative bg-white rounded-2xl border p-4 shadow-sm hover:shadow-md cursor-pointer"
        onClick={() => setOpen(true)}
      >
        <span
          className={`absolute top-3 right-3 px-2 py-0.5 text-xs rounded-full capitalize ${
            item.status === "completed"
              ? "bg-green-100 text-green-700"
              : item.status === "pending"
                ? "bg-yellow-100 text-yellow-700"
                : "bg-red-100 text-red-700"
          }`}
        >
          {item.status}
        </span>

        <div className="flex items-center gap-3">
          <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
            <Banknote />
          </div>
          <div>
            <h3 className="font-semibold">{item.driverName}</h3>
            <p className="text-sm text-gray-500 flex items-center gap-1">
              <Truck size={14} />
              {item.plateNumber}
            </p>
            <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
              <Factory size={14} />
              {item.companyName || "No company"}
            </p>
          </div>
        </div>

        <div className="mt-3 text-sm">
          Litres: <b>{item.litres}</b>
        </div>

        <div className="mt-1 text-sm">
          Total: <b>R {item.total.toFixed(2)}</b>
        </div>
      </motion.div>

      <CashTransactionDetailModal
        open={open}
        onClose={() => setOpen(false)}
        item={item}
      />
    </>
  );
}
