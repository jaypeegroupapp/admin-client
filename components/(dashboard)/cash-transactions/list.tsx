"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ICashTransactionAggregated } from "@/definitions/cash-transactions";
import CashTransactionCard from "./card";

export default function CashTransactionList({
  initialItems,
}: {
  initialItems: ICashTransactionAggregated[];
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
        {initialItems.length === 0 ? (
          <motion.p
            key="empty"
            className="text-gray-500 text-center col-span-full py-10"
          >
            No cash transactions found.
          </motion.p>
        ) : (
          initialItems.map((item) => (
            <CashTransactionCard key={item.id} item={item} />
          ))
        )}
      </AnimatePresence>
    </motion.div>
  );
}
