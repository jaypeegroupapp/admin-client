// src/components/(dashboard)/dispensers/list.tsx
"use client";
import { motion, AnimatePresence } from "framer-motion";
import { IDispenser } from "@/definitions/dispenser";
import { DispenserCard } from "./card";

interface Props {
  initialDispensers: IDispenser[];
  onEdit: (dispenser: IDispenser) => void;
  onRefresh: () => void;
}

export function DispenserList({ initialDispensers, onEdit, onRefresh }: Props) {
  return (
    <motion.div
      layout
      className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <AnimatePresence>
        {initialDispensers.length === 0 ? (
          <motion.p
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-gray-500 text-center col-span-full py-10"
          >
            No dispensers yet. Add your first one!
          </motion.p>
        ) : (
          initialDispensers.map((dispenser) => (
            <DispenserCard
              key={dispenser.id}
              dispenser={dispenser}
              onEdit={onEdit}
              onRefresh={onRefresh}
            />
          ))
        )}
      </AnimatePresence>
    </motion.div>
  );
}
