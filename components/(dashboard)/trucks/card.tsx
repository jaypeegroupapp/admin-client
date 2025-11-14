// components/(dashboard)/trucks/card.tsx
"use client";
import { motion } from "framer-motion";
import { Edit3, Trash2, Truck } from "lucide-react";
import { ITruck } from "@/definitions/truck";

export function TruckCard({
  truck,
  onEdit,
  onDelete,
}: {
  truck: ITruck;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
    >
      <div className="flex items-start gap-3">
        <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 text-sm">
          <Truck />
        </div>

        <div className="flex flex-col flex-1">
          <h3 className="font-semibold text-gray-800">{truck.plateNumber}</h3>
          <p className="text-sm text-gray-500">
            {[truck.make, truck.model].filter(Boolean).join(" ") ||
              "No make/model"}
          </p>
          <p className="text-xs text-gray-400 mt-1">Year: {truck.year}</p>
        </div>
      </div>

      <div className="flex justify-between items-center mt-4">
        <span
          className={`px-2.5 py-0.5 text-xs font-semibold rounded-full ${
            truck.isActive
              ? "bg-green-100 text-green-700"
              : "bg-gray-200 text-gray-600"
          }`}
        >
          {/* {truck.isActive ? "Active" : "Inactive"} */}
        </span>

        <div className="flex items-center gap-2">
          <button
            onClick={onEdit}
            className="text-gray-600 hover:text-gray-900 p-1.5 rounded-md hover:bg-gray-100"
            title="Edit"
          >
            <Edit3 size={16} />
          </button>
          <button
            onClick={onDelete}
            className="text-red-500 hover:text-red-700 p-1.5 rounded-md hover:bg-red-50"
            title="Delete"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
