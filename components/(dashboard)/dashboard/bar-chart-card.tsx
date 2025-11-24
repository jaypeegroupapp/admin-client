"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import ChartCard from "./chart-card";

export interface BarChartCardProps<T extends Record<string, any>> {
  title: string;
  data: T[];
  xKey: keyof T;
  barKey: keyof T;
  stackedKey?: keyof T; // ⬅️ NEW optional stacked bar
}

export default function BarChartCard<T extends Record<string, any>>({
  title,
  data,
  xKey,
  barKey,
  stackedKey,
}: BarChartCardProps<T>) {
  return (
    <ChartCard title={title}>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data}>
          <XAxis dataKey={xKey as string} />
          <YAxis />
          <Tooltip />

          {/* Main bar */}
          <Bar
            dataKey={barKey as string}
            stackId={stackedKey ? "stack" : undefined}
          />

          {/* Optional stacked bar */}
          {stackedKey && <Bar dataKey={stackedKey as string} stackId="stack" />}
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}
