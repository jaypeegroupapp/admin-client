"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { IOrder } from "@/definitions/order";
import { OrderHeader } from "./header";
import { OrderSummary } from "./summary";
import { OrderItemsList } from "./item-list";

export function OrderDetailsClient({ order }: { order: IOrder }) {
  const router = useRouter();

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-8"
    >
      <OrderHeader order={order} onBack={() => router.back()} />

      <OrderSummary order={order} />

      {/* 🧩 Order Items Section */}
      <OrderItemsList items={order.items || []} />
    </motion.div>
  );
}
