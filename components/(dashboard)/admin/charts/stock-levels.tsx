"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface StockLevelsChartProps {
  stockByProduct: any[];
}

export function StockLevelsChart({ stockByProduct }: StockLevelsChartProps) {
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
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="stock" fill="#3b82f6" name="Current Stock (L)" />
            <Bar dataKey="capacity" fill="#93c5fd" name="Capacity (L)" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
