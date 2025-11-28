// components/(dashboard)/trucks/header.tsx
"use client";
import { Truck as TruckIcon } from "lucide-react";

export function OrderItemHeader() {
  return (
    <div className="flex flex-row justify-between items-center mb-4 gap-y-6">
      <div className="flex gap-2 items-center">
        <TruckIcon />
        <h1 className="text-xl font-semibold">Truck Orders</h1>
      </div>
    </div>
  );
}
