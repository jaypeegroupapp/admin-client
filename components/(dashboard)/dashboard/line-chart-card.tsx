"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import ChartCard from "./chart-card";

export interface LineChartCardProps<T extends Record<string, any>> {
  title: string;
  data: T[];
  dataKey: keyof T;
  /** X axis defaults to "month" */
}

export default function LineChartCard<T extends Record<string, any>>({
  title,
  data,
  dataKey,
}: LineChartCardProps<T>) {
  return (
    <ChartCard title={title}>
      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={data}>
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey={dataKey as string} />
        </LineChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}
