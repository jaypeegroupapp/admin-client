"use client";

interface TransfersTabProps {
  dispenserId: string;
  totalDispensed: number;
}

export function TransfersTab({
  dispenserId,
  totalDispensed,
}: TransfersTabProps) {
  return (
    <div className="space-y-4">
      <p className="text-gray-500 text-sm">
        Tanker transfers will be implemented here.
      </p>
      <div className="bg-gray-50 p-4 rounded-lg text-center text-gray-400">
        Features coming soon:
        <ul className="mt-2 text-xs">
          <li>• Connect dispenser to source tanker</li>
          <li>• Transfer product from tanker to dispenser</li>
          <li>• Track product source and batch numbers</li>
          <li>• View transfer history</li>
          <li>• Current meter reading: {totalDispensed.toLocaleString()}L</li>
        </ul>
      </div>
    </div>
  );
}
