// src/components/(dashboard)/returns/list.tsx
"use client";

import { motion, AnimatePresence } from "framer-motion";
import { IOrderItemAggregated } from "@/definitions/order-item";
import RefundCard from "./card";

export default function RefundsList({
    initialItems,
}: {
    initialItems: IOrderItemAggregated[];
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
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="text-gray-500 text-center col-span-full py-10"
                    >
                        No returned items found.
                    </motion.p>
                ) : (
                    initialItems.map((item) => (
                        <RefundCard key={item.id} item={item} />
                    ))
                )}
            </AnimatePresence>
        </motion.div>
    );
}