"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Truck, Factory, PackageCheck } from "lucide-react";
import { IOrderItemAggregated } from "@/definitions/order-item";
import { OrderItemDetailModal } from "./modal";

export default function OrderItemCard({
  item,
}: {
  item: IOrderItemAggregated;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* CARD */}
      <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="relative bg-white rounded-2xl border border-gray-200 p-4 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
        onClick={() => setOpen(true)}
      >
        {/* Expand Icon */}
        {/* STATUS BADGE */}
        <span
          className={`absolute top-3 right-3 inline-block mt-3 px-2.5 py-0.5 text-xs font-semibold rounded-full capitalize ${
            item.status === "completed"
              ? "bg-green-100 text-green-700"
              : item.status === "pending"
              ? "bg-yellow-100 text-yellow-700"
              : item.status === "cancelled"
              ? "bg-red-100 text-red-700"
              : "bg-gray-200 text-gray-600"
          }`}
        >
          {item.status}
        </span>

        <div className="flex items-start gap-3">
          <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 text-sm">
            <Truck />
          </div>

          <div className="flex flex-col flex-1">
            <h3 className="font-semibold text-gray-800">{item.plateNumber}</h3>

            <p className="text-sm text-gray-500 flex items-center gap-1">
              <PackageCheck size={14} />
              {item.productName || "No product"}
            </p>

            <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
              <Factory size={14} />
              {item.companyName || "No company"}
            </p>
          </div>
        </div>

        {/* QUANTITY */}
        <div className="mt-3 text-sm text-gray-700">
          Quantity: <span className="font-semibold">{item.quantity}</span>
        </div>
      </motion.div>

      {/* MODAL */}
      <OrderItemDetailModal
        open={open}
        onClose={() => setOpen(false)}
        item={item}
      />
    </>
  );
}
