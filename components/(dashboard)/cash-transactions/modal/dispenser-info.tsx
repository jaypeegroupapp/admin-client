"use client";

import { Droplet, User } from "lucide-react";

export function DispenserInfo({
  dispenserName,
  attendantName,
}: {
  dispenserName: string;
  attendantName?: string;
}) {
  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden print:border-gray-300">
      <div className="bg-blue-50 p-3 border-b border-blue-100 print:bg-gray-100 print:border-gray-300">
        <h3 className="text-sm font-medium text-blue-800 print:text-gray-800 flex items-center gap-2">
          <Droplet size={16} />
          Dispenser Information
        </h3>
      </div>
      <div className="p-3 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Dispenser:</span>
          <span className="font-medium">{dispenserName}</span>
        </div>
        {attendantName && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Attendant:</span>
            <span className="font-medium flex items-center gap-1">
              <User size={14} className="text-gray-400" />
              {attendantName}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
