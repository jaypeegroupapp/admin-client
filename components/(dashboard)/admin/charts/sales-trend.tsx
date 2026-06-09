"use client";

import { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export function SalesTrendChart() {
  const [mounted, setMounted] = useState(false);
  const [data, setData] = useState([
    { day: "Mon", litres: 1200 },
    { day: "Tue", litres: 1450 },
    { day: "Wed", litres: 1100 },
    { day: "Thu", litres: 1680 },
    { day: "Fri", litres: 2100 },
    { day: "Sat", litres: 1850 },
    { day: "Sun", litres: 1300 },
  ]);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
        <h3 className="text-sm font-medium text-gray-700 mb-4">
          Sales Trend (Last 7 Days)
        </h3>
        <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
      <h3 className="text-sm font-medium text-gray-700 mb-4">
        Sales Trend (Last 7 Days)
      </h3>
      <div style={{ width: "100%", height: 320 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip formatter={(value) => [`${value}L`, "Litres"]} />
            <Line
              type="monotone"
              dataKey="litres"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={{ fill: "#3b82f6", r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
