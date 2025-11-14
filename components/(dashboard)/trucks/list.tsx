// components/(dashboard)/trucks/list.tsx
"use client";
import { motion, AnimatePresence } from "framer-motion";
import { ITruck } from "@/definitions/truck";
import { TruckCard } from "./card";

export function TruckList({
  initialTrucks,
  onEdit,
  onDelete,
}: {
  initialTrucks: ITruck[];
  onEdit: (t: ITruck) => void;
  onDelete: (t: ITruck) => void;
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
        {initialTrucks.length === 0 ? (
          <motion.p
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-gray-500 text-center col-span-full py-10"
          >
            No trucks yet. Add your first one!
          </motion.p>
        ) : (
          initialTrucks.map((truck) => (
            <TruckCard
              key={truck.id}
              truck={truck}
              onEdit={() => onEdit(truck)}
              onDelete={() => onDelete(truck)}
            />
          ))
        )}
      </AnimatePresence>
    </motion.div>
  );
}
