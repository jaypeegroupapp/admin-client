"use client";

interface InfoTabProps {
  dispenserId: string;
}

export function InfoTab({ dispenserId }: InfoTabProps) {
  return (
    <div className="space-y-4">
      <p className="text-gray-700">
        A dispenser is a metering device that measures and records the volume of
        product dispensed. It does not store product - it only tracks flow
        through the meter.
      </p>

      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="font-medium text-gray-800 mb-2">Dispenser Details</h3>
        <ul className="space-y-2 text-sm">
          <li className="flex justify-between">
            <span className="text-gray-500">Dispenser ID:</span>
            <span className="font-mono">{dispenserId}</span>
          </li>
          <li className="flex justify-between">
            <span className="text-gray-500">Type:</span>
            <span>Flow Meter (Cumulative)</span>
          </li>
          <li className="flex justify-between">
            <span className="text-gray-500">Tracking Method:</span>
            <span>Total litres dispensed since installation</span>
          </li>
          <li className="flex justify-between">
            <span className="text-gray-500">Status:</span>
            <span>Active/Inactive toggle available</span>
          </li>
        </ul>
      </div>

      <div className="bg-blue-50 p-4 rounded-lg">
        <h3 className="font-medium text-blue-800 mb-2">How It Works</h3>
        <ul className="space-y-2 text-sm text-blue-700">
          <li>• Attendant logs in to start shift</li>
          <li>• Records opening meter reading</li>
          <li>• Dispenses product to customers</li>
          <li>• System calculates total dispensed per shift</li>
          <li>• Closing reading is reconciled at shift end</li>
        </ul>
      </div>
    </div>
  );
}
