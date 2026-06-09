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
  const [data, setData] = useState([
    { day: "Mon", litres: 1200 },
    { day: "Tue", litres: 1450 },
    { day: "Wed", litres: 1100 },
    { day: "Thu", litres: 1680 },
    { day: "Fri", litres: 2100 },
    { day: "Sat", litres: 1850 },
    { day: "Sun", litres: 1300 },
  ]);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
      <h3 className="text-sm font-medium text-gray-700 mb-4">Sales Trend (Last 7 Days)</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip formatter={(value) => [`${value}L`, "Litres"]} />
            <Line
              type="monotone"
              dataKey="litres"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={{ fill: "#3b82f6" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}