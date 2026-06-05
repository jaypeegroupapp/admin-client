"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Truck, Factory, PackageCheck, AlertCircle, UserX } from "lucide-react";
import { IOrderItemAggregated } from "@/definitions/order-item";
import { OrderItemDetailModal } from "./modal";

export default function OrderItemCard({
  item,
  userDispenser,
}: {
  item: IOrderItemAggregated;
  userDispenser?: any;
}) {
  const [open, setOpen] = useState(false);

  const tankerStock = userDispenser?.tankerStock || 0;
  const hasDispenser = !!userDispenser?.dispenser;
  const hasAttendance = !!userDispenser?.attendance;
  const hasTanker = !!userDispenser?.tankerName;

  const canFulfill =
    item.status === "accepted" &&
    hasDispenser &&
    hasAttendance &&
    hasTanker &&
    tankerStock >= item.quantity;

  const insufficientStock = hasTanker && tankerStock < item.quantity;
  const noDispenser = !hasDispenser && item.status === "accepted";
  const noAttendance =
    hasDispenser && !hasAttendance && item.status === "accepted";
  const noTanker =
    hasDispenser && hasAttendance && !hasTanker && item.status === "accepted";

  return (
    <>
      <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className={`relative bg-white rounded-2xl border p-4 shadow-sm hover:shadow-md transition-all flex flex-col justify-between cursor-pointer ${
          canFulfill ? "border-green-200 bg-green-50/30" : "border-gray-200"
        }`}
        onClick={() => setOpen(true)}
      >
        <span
          className={`absolute top-3 right-3 inline-block px-2.5 py-0.5 text-xs font-semibold rounded-full capitalize ${
            item.status === "completed"
              ? "bg-green-100 text-green-700"
              : item.status === "pending"
                ? "bg-yellow-100 text-yellow-700"
                : item.status === "cancelled"
                  ? "bg-red-100 text-red-700"
                  : "bg-blue-100 text-blue-700"
          }`}
        >
          {item.status}
        </span>

        <div className="flex items-start gap-3">
          <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
            <Truck size={28} />
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

        <div className="mt-3 text-sm text-gray-700">
          Quantity: <span className="font-semibold">{item.quantity}L</span>
        </div>

        {/* No Dispenser Warning */}
        {item.status === "accepted" && noDispenser && (
          <div className="mt-2 text-xs text-orange-600 bg-orange-50 p-1.5 rounded text-center flex items-center justify-center gap-1">
            <UserX size={12} />
            ⚠️ No dispenser assigned to you
          </div>
        )}

        {/* No Active Shift Warning */}
        {item.status === "accepted" && noAttendance && (
          <div className="mt-2 text-xs text-yellow-600 bg-yellow-50 p-1.5 rounded text-center flex items-center justify-center gap-1">
            <AlertCircle size={12} />
            ⚠️ No active shift - Please log in
          </div>
        )}

        {/* No Tanker Connected Warning */}
        {item.status === "accepted" && noTanker && (
          <div className="mt-2 text-xs text-orange-600 bg-orange-50 p-1.5 rounded text-center flex items-center justify-center gap-1">
            <AlertCircle size={12} />
            ⚠️ No tanker connected to dispenser
          </div>
        )}

        {/* Insufficient Stock Warning */}
        {item.status === "accepted" && insufficientStock && (
          <div className="mt-2 text-xs text-red-600 bg-red-50 p-1.5 rounded text-center flex items-center justify-center gap-1">
            <AlertCircle size={12} />
            ⚠️ Insufficient stock (Available: {tankerStock.toFixed(1)}L)
          </div>
        )}

        {/* Ready to Fulfill */}
        {item.status === "accepted" && canFulfill && (
          <div className="mt-2 text-xs text-green-600 bg-green-100 p-1.5 rounded text-center">
            ✓ Ready to fulfill
          </div>
        )}
      </motion.div>

      <OrderItemDetailModal
        open={open}
        onClose={() => setOpen(false)}
        item={item}
        userDispenser={userDispenser}
      />
    </>
  );
}
