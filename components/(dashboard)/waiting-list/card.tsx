"use client";

import { motion } from "framer-motion";
import { Building2, Mountain, PackageCheck } from "lucide-react";
import { IOrder } from "@/definitions/order";
import { useRouter } from "next/navigation";
import Link from "next/link";

export function OrderCard({ order }: { order: IOrder }) {
  const router = useRouter();
  const date = new Date(order.collectionDate);

  // Generate a readable order number (e.g. ORD-2025-0001)
  const orderNumber =
    order.id?.slice(-6).toUpperCase() || Math.floor(Math.random() * 9999);

  return (
    <>
      <Link href={`/orders/${order.id}`}>
        <motion.div
          layout
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="relative bg-white rounded-2xl border border-gray-200 p-4 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
        >
          {/* Expand Icon */}
          {/* STATUS BADGE */}
          <span
            className={`absolute top-3 right-3 inline-block mt-3 px-2.5 py-0.5 text-xs font-semibold rounded-full capitalize ${
              order.status === "completed"
                ? "bg-green-100 text-green-700"
                : order.status === "pending"
                ? "bg-yellow-100 text-yellow-700"
                : order.status === "cancelled"
                ? "bg-red-100 text-red-700"
                : "bg-gray-200 text-gray-600"
            }`}
          >
            {order.status}
          </span>

          <div className="flex items-start gap-3">
            <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 text-sm">
              <PackageCheck />
            </div>

            <div className="flex flex-col flex-1">
              <h3 className="font-semibold text-gray-800">
                Order #{orderNumber}
              </h3>
              <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                <Building2 size={14} />
                {order.companyName || "No company"}
              </p>{" "}
              <p className="text-sm text-gray-500 flex items-center gap-1">
                <Mountain size={14} />
                {order.mineName || "No Mine"}
              </p>
            </div>
          </div>

          {/* QUANTITY */}
          <div className="mt-3 text-sm text-gray-700">
            Amount:{" "}
            <span className="font-semibold">
              R{order.totalAmount?.toFixed(2) || "0.00"}
            </span>
          </div>
        </motion.div>
      </Link>
    </>
  );
}
