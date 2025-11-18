"use client";

import { motion } from "framer-motion";
import { Receipt, Truck } from "lucide-react";

interface InvoiceOrderItem {
  id: string;
  orderNumber: string;
  productName: string;
  totalAmount: number;
  items: {
    id: string;
    truckName: string;
    quantity: number;
  }[];
}

export function InvoiceOrdersList({ orders }: { orders: InvoiceOrderItem[] }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 mt-6"
    >
      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex gap-2 items-center">
        <Receipt size={18} />
        Linked Orders
      </h3>

      {orders.length === 0 ? (
        <p className="text-sm text-gray-500">
          No orders linked to this invoice.
        </p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const orderNumber =
              order.id?.slice(-6).toUpperCase() ||
              Math.floor(Math.random() * 9999);

            return (
              <div
                key={order.id}
                className="border rounded-xl p-4 hover:bg-gray-50 transition"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-gray-800">
                      Order #{orderNumber}
                    </p>
                    <p className="text-sm text-gray-600">
                      Product: {order.productName}
                    </p>
                  </div>

                  <p className="text-sm font-semibold text-gray-900">
                    R {order.totalAmount.toFixed(2)}
                  </p>
                </div>

                {/* Items List */}
                <div className="mt-3 pl-2 border-l space-y-2">
                  {order.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between text-sm"
                    >
                      <div className="flex items-center gap-2">
                        <Truck size={14} className="text-gray-500" />
                        <span className="text-gray-800">{item.truckName}</span>
                      </div>
                      <span className="text-gray-600">
                        Qty: <b>{item.quantity}</b>
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
}
