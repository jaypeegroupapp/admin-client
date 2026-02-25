"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Package, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { getOrdersByCompanyId } from "@/data/order";

export function CompanyOrdersTab({ companyId }: { companyId: string }) {
  const [orders, setOrders] = useState<any[]>([]);

  const loadOrders = async () => {
    try {
      const res = await getOrdersByCompanyId(companyId);
      setOrders(res || []);
    } catch (e) {
      console.error("Failed to fetch orders", e);
    }
  };

  useEffect(() => {
    loadOrders();
  }, [companyId]);

  return (
    <motion.div
      key="orders"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-medium text-gray-700 flex items-center gap-2">
          <Package size={16} className="text-gray-500" />
          Orders
        </h3>
      </div>

      {orders.length === 0 ? (
        <p className="text-sm text-gray-500">No orders yet.</p>
      ) : (
        <div className="divide-y divide-gray-200">
          {orders.map((order) => (
            <div
              key={order.id}
              className="flex items-center justify-between py-3"
            >
              <Link
                href={`/orders/${order.id}`}
                className="flex items-center gap-3"
              >
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
                  <Package size={18} />
                </div>
                <div>
                  <span className="text-gray-800 text-sm font-medium">
                    Order #{order.id?.slice(-6).toUpperCase()}
                  </span>
                  <p className="text-xs text-gray-600">
                    {new Date(order.createdAt).toLocaleDateString("en-ZA")}
                  </p>
                </div>
              </Link>

              <div className="flex items-center gap-3">
                <ChevronRight size={16} />
              </div>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
