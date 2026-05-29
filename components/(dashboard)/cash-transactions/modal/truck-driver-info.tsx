"use client";

import { Truck, Phone } from "lucide-react";
import { ICashTransactionAggregated } from "@/definitions/cash-transactions";

export function TruckDriverInfo({
  item,
}: {
  item: ICashTransactionAggregated;
}) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <div className="flex items-center gap-2 text-sm text-gray-700 bg-gray-50 p-3 rounded-lg print:bg-white print:border print:border-gray-300">
        <Truck size={16} className="text-gray-500" />
        <div>
          <p className="text-xs text-gray-500">Truck</p>
          <p className="font-medium">{item.plateNumber}</p>
        </div>
      </div>
      <div className="flex items-center gap-2 text-sm text-gray-700 bg-gray-50 p-3 rounded-lg print:bg-white print:border print:border-gray-300">
        <div>
          <p className="text-xs text-gray-500">Driver</p>
          <p className="font-medium">{item.driverName}</p>
        </div>
      </div>
      <div className="col-span-2 flex items-center gap-2 text-sm text-gray-700 bg-gray-50 p-3 rounded-lg print:bg-white print:border print:border-gray-300">
        <Phone size={16} className="text-gray-500" />
        <div>
          <p className="text-xs text-gray-500">Phone</p>
          <p className="font-medium">{item.phoneNumber}</p>
        </div>
      </div>
    </div>
  );
}
