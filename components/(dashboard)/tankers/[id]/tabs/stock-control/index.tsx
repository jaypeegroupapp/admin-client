"use client";

import { useState, useEffect } from "react";
import { Package, Plus } from "lucide-react";
import {
  getTankerStockHistory,
  getTankerStockAnalytics,
} from "@/data/tanker-stock";
import { RestockTankerModal } from "./restock-modal";
import { AnalyticsCards } from "./analytics-cards";
import { RestockHistoryList } from "./restock-history-list";

export function StockControlTab({
  tankerId,
  currentStock,
  capacity,
}: {
  tankerId: string;
  currentStock: number;
  capacity: number;
}) {
  const [stockRecords, setStockRecords] = useState<any[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);

  const loadData = async () => {
    const [records, analyticsData] = await Promise.all([
      getTankerStockHistory(tankerId),
      getTankerStockAnalytics(tankerId),
    ]);
    setStockRecords(records);
    setAnalytics(analyticsData);
  };

  useEffect(() => {
    loadData();
  }, [tankerId]);

  return (
    <>
      <AnalyticsCards
        currentStock={currentStock}
        capacity={capacity}
        analytics={analytics}
      />

      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-medium text-gray-700 flex items-center gap-2">
          <Package size={16} className="text-gray-500" />
          Restock History
        </h3>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition"
        >
          <Plus size={16} />
          Record Restock
        </button>
      </div>

      <RestockHistoryList records={stockRecords} onRefresh={loadData} />

      <RestockTankerModal
        open={showModal}
        onClose={() => {
          setShowModal(false);
          loadData();
        }}
        tankerId={tankerId}
        currentStock={currentStock}
        capacity={capacity}
      />
    </>
  );
}
