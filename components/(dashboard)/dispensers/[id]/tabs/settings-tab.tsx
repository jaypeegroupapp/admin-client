"use client";

interface SettingsTabProps {
  dispenserId: string;
}

export function SettingsTab({ dispenserId }: SettingsTabProps) {
  return (
    <div className="space-y-4">
      <p className="text-gray-500 text-sm">
        Dispenser settings will be implemented here.
      </p>
      <div className="bg-gray-50 p-4 rounded-lg text-center text-gray-400">
        Features coming soon:
        <ul className="mt-2 text-xs">
          <li>• Edit dispenser name and product</li>
          <li>• Reset meter reading (admin only)</li>
          <li>• Calibration settings</li>
          <li>• Notification preferences</li>
          <li>• Delete dispenser</li>
        </ul>
      </div>
    </div>
  );
}
