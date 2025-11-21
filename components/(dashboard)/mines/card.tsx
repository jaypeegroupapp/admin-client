"use client";

import { motion } from "framer-motion";
import { Mountain } from "lucide-react";
import { IMine } from "@/definitions/mine";
import Link from "next/link";

export function MineCard({ mine }: { mine: IMine }) {
  return (
    <Link href={`/mines/${mine.id}`} className="block">
      <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="
          bg-white rounded-2xl border border-gray-200 p-4 shadow-sm 
          hover:shadow-md transition-all flex flex-col justify-between
          cursor-pointer
        "
      >
        <div className="flex items-start gap-3">
          <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 text-sm">
            <Mountain />
          </div>

          <div className="flex flex-col flex-1">
            <h3 className="font-semibold text-gray-800">{mine.name}</h3>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
