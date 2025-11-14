"use client";

import { motion, AnimatePresence } from "framer-motion";
import { IOrder } from "@/definitions/order";
import { OrderCard } from "./card";

export function OrderList({ initialOrders }: { initialOrders: IOrder[] }) {
  return (
    <motion.div
      layout
      className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <AnimatePresence>
        {initialOrders.length === 0 ? (
          <motion.p
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-gray-500 text-center col-span-full py-10"
          >
            No orders yet. Add your first one!
          </motion.p>
        ) : (
          initialOrders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))
        )}
      </AnimatePresence>
    </motion.div>
  );
}
