"use client";

import { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface StockLevelsChartProps {
  stockByProduct: any[];
}

export function StockLevelsChart({ stockByProduct }: StockLevelsChartProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
        <h3 className="text-sm font-medium text-gray-700 mb-4">
          Stock by Product
        </h3>
        <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (!stockByProduct || stockByProduct.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
        <h3 className="text-sm font-medium text-gray-700 mb-4">
          Stock by Product
        </h3>
        <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-500">No stock data available</p>
        </div>
      </div>
    );
  }

  const data = stockByProduct.map((item) => ({
    name: item.product?.name || "Unknown",
    stock: item.totalStock,
    capacity: item.totalCapacity,
  }));

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
      <h3 className="text-sm font-medium text-gray-700 mb-4">
        Stock by Product
      </h3>
      <div style={{ width: "100%", height: 320 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="stock" fill="#3b82f6" name="Current Stock (L)" />
            <Bar dataKey="capacity" fill="#93c5fd" name="Capacity (L)" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
