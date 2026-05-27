"use client";

import { Fuel } from "lucide-react";

interface DispenserListProps {
  dispensers: any[];
  selectedDispenser: any;
  loading: boolean;
  onSelect: (dispenser: any) => void;
}

export function DispenserList({
  dispensers,
  selectedDispenser,
  loading,
  onSelect,
}: DispenserListProps) {
  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (dispensers.length === 0) {
    return (
      <div className="text-center py-8 bg-gray-50 rounded-lg">
        <p className="text-sm text-gray-500">
          No unassigned dispensers available
        </p>
      </div>
    );
  }

  return (
    <div className="max-h-60 overflow-y-auto border border-gray-200 rounded-lg divide-y">
      {dispensers.map((dispenser) => (
        <div
          key={dispenser.id}
          onClick={() => onSelect(dispenser)}
          className={`p-3 flex items-center gap-3 cursor-pointer hover:bg-gray-50 transition ${
            selectedDispenser?.id === dispenser.id ? "bg-blue-50" : ""
          }`}
        >
          <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
            <Fuel size={16} className="text-gray-500" />
          </div>
          <div>
            <p className="font-medium text-sm">{dispenser.name}</p>
            <p className="text-xs text-gray-500">
              Current stock: {dispenser.litres || 0}L
            </p>
          </div>
          {selectedDispenser?.id === dispenser.id && (
            <div className="ml-auto w-2 h-2 bg-blue-600 rounded-full"></div>
          )}
        </div>
      ))}
    </div>
  );
}
