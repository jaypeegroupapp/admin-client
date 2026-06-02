// src/components/(dashboard)/orders/[id]/client.tsx
"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { OrderHeader } from "./header";
import { OrderSummary } from "./summary";
import { OrderItemsList } from "./item-list";

export function OrderDetailsClient({ order }: { order: any }) {
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
      <OrderItemsList
        sellingPrice={order.sellingPrice}
        items={order.items || []}
      />
    </motion.div>
  );
}
