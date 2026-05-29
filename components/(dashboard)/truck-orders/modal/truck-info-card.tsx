"use client";

import { Truck } from "lucide-react";

export function TruckInfoCard({ item }: { item: any }) {
  return (
    <div className="flex items-center gap-3 text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">
      <div className="bg-white p-2 rounded-lg">
        <Truck size={18} className="text-gray-600" />
      </div>
      <div>
        <p className="text-xs text-gray-500">Truck</p>
        <p className="font-medium">{item.plateNumber}</p>
        <p className="text-xs text-gray-400">
          {item.make} {item.model} {item.year}
        </p>
      </div>
    </div>
  );
}
