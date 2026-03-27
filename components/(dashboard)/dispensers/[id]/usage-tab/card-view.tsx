// src/components/(dashboard)/dispensers/[id]/usage-card-view.tsx
"use client";

import { motion } from "framer-motion";
import { UsageCard } from "./card";

export function UsageCardView({ usage }: { usage: any[] }) {
  return (
    <div className="space-y-3">
      {usage.map((record) => (
        <motion.div
          key={record.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition"
        >
          <UsageCard record={record} />
        </motion.div>
      ))}
    </div>
  );
}
