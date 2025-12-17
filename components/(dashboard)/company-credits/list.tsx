"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ICompanyCredit } from "@/definitions/company-credit";
import CompanyCreditCard from "./card";

export default function CompanyCreditList({
  items,
}: {
  items: ICompanyCredit[];
}) {
  return (
    <motion.div
      layout
      className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <AnimatePresence>
        {items.length === 0 ? (
          <motion.p
            key="empty"
            className="text-gray-500 text-center col-span-full py-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            No company credits found.
          </motion.p>
        ) : (
          items.map((credit) => (
            <CompanyCreditCard key={credit.id} credit={credit} />
          ))
        )}
      </AnimatePresence>
    </motion.div>
  );
}
