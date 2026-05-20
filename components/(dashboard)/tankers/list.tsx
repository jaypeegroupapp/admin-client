"use client";
import { motion, AnimatePresence } from "framer-motion";
import { ITanker } from "@/definitions/tanker";
import { TankerCard } from "./card";

interface Props {
  initialTankers: ITanker[];
  onEdit: (tanker: ITanker) => void;
  onRefresh: () => void;
}

export function TankerList({ initialTankers, onEdit, onRefresh }: Props) {
  return (
    <motion.div
      layout
      className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <AnimatePresence>
        {initialTankers.length === 0 ? (
          <motion.p
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-gray-500 text-center col-span-full py-10"
          >
            No tankers yet. Add your first one!
          </motion.p>
        ) : (
          initialTankers.map((tanker) => (
            <TankerCard
              key={tanker.id}
              tanker={tanker}
              onEdit={onEdit}
              onRefresh={onRefresh}
            />
          ))
        )}
      </AnimatePresence>
    </motion.div>
  );
}
