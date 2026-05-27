"use client";

import { Fuel } from "lucide-react";

interface EmptyDispensersStateProps {
  onConnect: () => void;
}

export function EmptyDispensersState({ onConnect }: EmptyDispensersStateProps) {
  return (
    <div className="text-center py-8 bg-gray-50 rounded-lg">
      <Fuel size={32} className="mx-auto text-gray-400 mb-2" />
      <p className="text-sm text-gray-500">
        No dispensers connected to this tanker
      </p>
      <button
        onClick={onConnect}
        className="mt-2 text-sm text-blue-600 hover:text-blue-700"
      >
        Connect your first dispenser
      </button>
    </div>
  );
}
