"use client";

interface UsageTabProps {
  dispenserId: string;
}

export function UsageTab({ dispenserId }: UsageTabProps) {
  return (
    <div className="space-y-4">
      <p className="text-gray-500 text-sm">
        Usage history will be implemented here.
      </p>
      <div className="bg-gray-50 p-4 rounded-lg text-center text-gray-400">
        Features coming soon:
        <ul className="mt-2 text-xs">
          <li>• Transaction history (sales, transfers, adjustments)</li>
          <li>• Filter by transaction type</li>
          <li>• Order vs Cash transaction split</li>
          <li>• Customer information (company, truck, driver)</li>
          <li>• Export to CSV/PDF</li>
        </ul>
      </div>
    </div>
  );
}
