// src/components/(dashboard)/dispensers/[id]/usage-tab.tsx
"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Droplet, Calendar, ShoppingCart } from "lucide-react";
import { getDispenserUsageHistory } from "@/data/dispenser-usage";
import Link from "next/link";

export function UsageTab({ dispenserId }: { dispenserId: string }) {
  const [usage, setUsage] = useState<any[]>([]);

  const loadUsage = async () => {
    const res = await getDispenserUsageHistory(dispenserId);
    setUsage(res || []);
  };

  useEffect(() => {
    loadUsage();
  }, [dispenserId]);

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-medium text-gray-700 flex items-center gap-2">
          <Droplet size={16} className="text-gray-500" />
          Usage History
        </h3>
      </div>

      {usage.length === 0 ? (
        <p className="text-sm text-gray-500">
          No usage records found for this dispenser.
        </p>
      ) : (
        <div className="divide-y divide-gray-200">
          {usage.map((record) => (
            <div
              key={record.id}
              className="py-3 flex justify-between items-start"
            >
              {/* LEFT SIDE */}
              <div>
                <p className="text-sm font-medium text-gray-800">
                  Dispensed: {record.litresDispensed}L
                </p>

                <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                  <Calendar size={12} />
                  {new Date(record.timestamp).toLocaleDateString(
                    "en-ZA",
                  )} at {new Date(record.timestamp).toLocaleTimeString("en-ZA")}
                </p>

                {record.orderId && (
                  <Link
                    href={`/orders/${record.orderId}`}
                    className="text-xs text-blue-500 hover:text-blue-700 flex items-center gap-1 mt-1"
                  >
                    <ShoppingCart size={12} />
                    View Order
                  </Link>
                )}
              </div>

              {/* RIGHT SIDE */}
              <span className="px-2 py-1 text-xs rounded-md bg-blue-100 text-blue-700">
                {record.litresDispensed}L
              </span>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
