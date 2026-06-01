"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Fuel, ExternalLink, AlertCircle, Gauge } from "lucide-react";
import { getTankersByProduct } from "@/data/tanker";
import { ITanker } from "@/definitions/tanker";

export function TankersTab({ productId }: { productId: string }) {
  const [tankers, setTankers] = useState<ITanker[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTankers();
  }, [productId]);

  const loadTankers = async () => {
    setLoading(true);
    const result = await getTankersByProduct(productId);
    if (result.success) {
      setTankers(result.data);
    }
    setLoading(false);
  };

  const totalStock = tankers.reduce((sum, t) => sum + t.stockLevel, 0);
  const totalCapacity = tankers.reduce((sum, t) => sum + t.capacity, 0);
  const overallFillPercentage =
    totalCapacity > 0 ? (totalStock / totalCapacity) * 100 : 0;

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (tankers.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg">
        <Fuel size={48} className="mx-auto text-gray-300 mb-3" />
        <p className="text-gray-500">No tankers found for this product</p>
        <Link
          href="/tankers"
          className="inline-block mt-3 text-sm text-blue-600 hover:text-blue-700"
        >
          Add a tanker →
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 rounded-lg p-4">
          <p className="text-xs text-blue-600 font-medium">Total Tankers</p>
          <p className="text-2xl font-bold text-blue-700">{tankers.length}</p>
        </div>
        <div className="bg-green-50 rounded-lg p-4">
          <p className="text-xs text-green-600 font-medium">Total Stock</p>
          <p className="text-2xl font-bold text-green-700">
            {totalStock.toLocaleString()}L
          </p>
        </div>
        <div className="bg-purple-50 rounded-lg p-4">
          <p className="text-xs text-purple-600 font-medium">Total Capacity</p>
          <p className="text-2xl font-bold text-purple-700">
            {totalCapacity.toLocaleString()}L
          </p>
        </div>
      </div>

      {/* Overall Fill Rate Bar */}
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Overall Fill Rate</span>
          <span className="font-semibold">
            {overallFillPercentage.toFixed(1)}%
          </span>
        </div>
        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-500 rounded-full transition-all"
            style={{ width: `${Math.min(overallFillPercentage, 100)}%` }}
          />
        </div>
      </div>

      {/* Tankers List */}
      <div className="space-y-3">
        {tankers.map((tanker) => {
          const fillPercentage = (tanker.stockLevel / tanker.capacity) * 100;
          const isLowStock = fillPercentage < 20;

          return (
            <motion.div
              key={tanker.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition"
            >
              <div className="flex justify-between items-start">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Fuel size={20} className="text-blue-600" />
                  </div>
                  <div>
                    <Link
                      href={`/tankers/${tanker.id}`}
                      className="font-semibold text-gray-800 hover:text-blue-600 transition flex items-center gap-1"
                    >
                      {tanker.name}
                      <ExternalLink size={12} />
                    </Link>
                    <p className="text-xs text-gray-500 mt-1">
                      Capacity: {tanker.capacity.toLocaleString()}L
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Current Stock</p>
                  <p
                    className={`text-lg font-bold ${isLowStock ? "text-red-600" : "text-green-600"}`}
                  >
                    {tanker.stockLevel.toLocaleString()}L
                  </p>
                </div>
              </div>

              {/* Fill Rate Bar */}
              <div className="mt-3">
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>Fill Rate</span>
                  <span
                    className={isLowStock ? "text-red-600" : "text-green-600"}
                  >
                    {fillPercentage.toFixed(1)}%
                  </span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${isLowStock ? "bg-red-500" : "bg-green-500"}`}
                    style={{ width: `${Math.min(fillPercentage, 100)}%` }}
                  />
                </div>
              </div>

              {/* Low Stock Warning */}
              {isLowStock && (
                <div className="mt-3 flex items-center gap-2 text-xs text-red-600 bg-red-50 p-2 rounded">
                  <AlertCircle size={14} />
                  <span>
                    Low stock alert! Only {tanker.stockLevel.toLocaleString()}L
                    remaining
                  </span>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
