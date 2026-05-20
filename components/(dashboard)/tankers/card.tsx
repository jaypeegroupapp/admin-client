"use client";
import { motion } from "framer-motion";
import { Fuel } from "lucide-react";
import { ITanker } from "@/definitions/tanker";
import { toggleTankerPublishAction } from "@/actions/tanker";
import Link from "next/link";

export function TankerCard({
  tanker,
  onEdit,
  onRefresh,
}: {
  tanker: ITanker;
  onEdit: (tanker: ITanker) => void;
  onRefresh: () => void;
}) {
  const handleTogglePublish = async (e: React.MouseEvent) => {
    e.preventDefault();
    await toggleTankerPublishAction(tanker.id!, !tanker.isPublished);
    onRefresh();
  };

  const stockPercentage = (tanker.stockLevel / tanker.capacity) * 100;
  const getStockColor = () => {
    if (stockPercentage <= 20) return "bg-red-500";
    if (stockPercentage <= 50) return "bg-yellow-500";
    return "bg-green-500";
  };

  return (
    <Link href={`/tankers/${tanker.id}`} className="block">
      <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
      >
        <div className="flex items-start gap-3">
          <div className="w-16 h-16 bg-blue-50 rounded-lg flex items-center justify-center text-blue-500">
            <Fuel size={32} />
          </div>

          <div className="flex flex-col flex-1">
            <h3 className="font-semibold text-gray-800">{tanker.name}</h3>
            <p className="text-sm text-gray-500">
              Product: {tanker.productName}
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Stock: {tanker.stockLevel} / {tanker.capacity} L
            </p>
            {tanker.userId && (
              <p className="text-xs text-gray-400">
                User: {tanker.attendanceName}
              </p>
            )}
          </div>
        </div>

        {/* Stock progress bar */}
        <div className="mt-3">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`${getStockColor()} h-2 rounded-full transition-all`}
              style={{ width: `${Math.min(stockPercentage, 100)}%` }}
            />
          </div>
        </div>

        <div className="flex justify-between items-center mt-3">
          <button
            onClick={handleTogglePublish}
            className={`px-2.5 py-0.5 text-xs font-semibold rounded-full ${
              tanker.isPublished
                ? "bg-green-100 text-green-700"
                : "bg-gray-200 text-gray-600"
            }`}
          >
            {tanker.isPublished ? "Published" : "Draft"}
          </button>
        </div>
      </motion.div>
    </Link>
  );
}
