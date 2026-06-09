"use client";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";

interface OrderDistributionChartProps {
  orders: {
    pending: number;
    accepted: number;
    completed: number;
  };
}

export function OrderDistributionChart({
  orders,
}: OrderDistributionChartProps) {
  const data = [
    { name: "Pending", value: orders.pending, color: "#eab308" },
    { name: "Accepted", value: orders.accepted, color: "#3b82f6" },
    { name: "Completed", value: orders.completed, color: "#22c55e" },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
      <h3 className="text-sm font-medium text-gray-700 mb-4">
        Order Distribution
      </h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
              label
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
