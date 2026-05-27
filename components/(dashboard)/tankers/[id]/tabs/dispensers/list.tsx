"use client";

import { motion } from "framer-motion";
import { DispenserCard } from "./card";

interface DispenserListProps {
  dispensers: any[];
  tankerId: string;
  tankerStock: number;
  onRefresh: () => void;
}

export function DispenserList({
  dispensers,
  tankerId,
  tankerStock,
  onRefresh,
}: DispenserListProps) {
  return (
    <div className="grid gap-4">
      {dispensers.map((dispenser, index) => (
        <motion.div
          key={dispenser.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
        >
          <DispenserCard
            dispenser={dispenser}
            tankerId={tankerId}
            tankerStock={tankerStock}
            onRefresh={onRefresh}
          />
        </motion.div>
      ))}
    </div>
  );
}
