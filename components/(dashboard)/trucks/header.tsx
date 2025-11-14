// components/(dashboard)/trucks/header.tsx
"use client";
import { PlusCircle, Truck as TruckIcon } from "lucide-react";

interface TruckHeaderProps {
  onAdd: () => void;
}

export function TruckHeader({ onAdd }: TruckHeaderProps) {
  return (
    <div className="flex flex-row justify-between items-center mb-4 gap-y-6">
      <div className="flex gap-2 items-center">
        <TruckIcon />
        <h1 className="text-xl font-semibold">Trucks</h1>
      </div>
      <div className="flex gap-3">
        <button
          onClick={onAdd}
          className="flex items-center gap-2 bg-gray-900 text-white px-3 py-2 rounded-lg hover:bg-gray-800 transition"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add Truck</span>
        </button>
      </div>
    </div>
  );
}
