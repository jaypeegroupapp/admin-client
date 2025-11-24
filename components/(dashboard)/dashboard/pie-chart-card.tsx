"use client";

import { PieChart, Pie, Tooltip, Cell, ResponsiveContainer } from "recharts";
import ChartCard from "./chart-card";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

export interface PieChartCardProps<T extends Record<string, any>> {
  title: string;
  data: T[];
  dataKey: keyof T;
  nameKey: keyof T;
}

export default function PieChartCard<T extends Record<string, any>>({
  title,
  data,
  dataKey,
  nameKey,
}: PieChartCardProps<T>) {
  return (
    <ChartCard title={title}>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            dataKey={dataKey as string}
            nameKey={nameKey as string}
            outerRadius={100}
          >
            {data.map((_, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}
