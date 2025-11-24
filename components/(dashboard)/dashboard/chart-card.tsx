import { ReactNode } from "react";

export interface ChartCardProps {
  title: string;
  children: ReactNode;
}

export default function ChartCard({ title, children }: ChartCardProps) {
  return (
    <div className="px-2 py-4 md:px-4 bg-white rounded-xl shadow-md border">
      <h2 className="text-lg font-semibold mb-3 ml-3 md:ml-0">{title}</h2>
      <div className="w-full">{children}</div>
    </div>
  );
}
