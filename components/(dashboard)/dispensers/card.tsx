// src/components/(dashboard)/dispensers/card.tsx
"use client";
import { motion } from "framer-motion";
import { Droplet } from "lucide-react";
import { IDispenser } from "@/definitions/dispenser";
import { toggleDispenserPublishAction } from "@/actions/dispenser";
import Link from "next/link";

export function DispenserCard({
  dispenser,
  onEdit,
  onRefresh,
}: {
  dispenser: IDispenser;
  onEdit: (dispenser: IDispenser) => void;
  onRefresh: () => void;
}) {
  const handleTogglePublish = async () => {
    await toggleDispenserPublishAction(dispenser.id!, !dispenser.isPublished);
    onRefresh();
  };

  return (
    <Link href={`/dispensers/${dispenser.id}`} className="block">
      <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="
        bg-white rounded-2xl border border-gray-200 p-4 shadow-sm 
        hover:shadow-md transition-all flex flex-col justify-between
      "
      >
        <div className="flex items-start gap-3">
          <div className="w-16 h-16 bg-blue-50 rounded-lg flex items-center justify-center text-blue-500 text-sm">
            <Droplet size={32} />
          </div>

          <div className="flex flex-col flex-1">
            <h3 className="font-semibold text-gray-800">{dispenser.name}</h3>
            <p className="text-sm text-gray-500 line-clamp-2">
              Product: {dispenser.productName}
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Litres: {dispenser.litres ?? 0}L
            </p>
            {dispenser.userId && (
              <p className="text-xs text-gray-400">
                User ID: {dispenser.attendanceName}
              </p>
            )}
          </div>
        </div>

        <div className="flex justify-between items-center mt-4">
          <button
            onClick={handleTogglePublish}
            className={`px-2.5 py-0.5 text-xs font-semibold rounded-full ${
              dispenser.isPublished
                ? "bg-green-100 text-green-700"
                : "bg-gray-200 text-gray-600"
            }`}
          >
            {dispenser.isPublished ? "Published" : "Draft"}
          </button>
        </div>
      </motion.div>
    </Link>
  );
}
