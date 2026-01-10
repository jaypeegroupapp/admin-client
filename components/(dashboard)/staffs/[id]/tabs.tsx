"use client";

import { StaffMinePermissions } from "./mines-permissions";

interface Props {
  activeTab: "info" | "mines";
  onTabChange: (tab: "info" | "mines") => void;
  staffId: string;
}

export function StaffTabs({ activeTab, onTabChange, staffId }: Props) {
  return (
    <>
      {/* Tab buttons (same as before) */}
      <div className="flex gap-6 border-b border-gray-200 mb-6">
        <button
          onClick={() => onTabChange("info")}
          className={`pb-2 font-medium text-sm ${
            activeTab === "info"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-500"
          }`}
        >
          Info
        </button>

        <button
          onClick={() => onTabChange("mines")}
          className={`pb-2 font-medium text-sm ${
            activeTab === "mines"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-500"
          }`}
        >
          Mines
        </button>
      </div>

      {activeTab === "info" && (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <p className="text-sm text-gray-600">
            This staff member only has access to assigned mines.
          </p>
        </div>
      )}

      {activeTab === "mines" && <StaffMinePermissions staffId={staffId} />}
    </>
  );
}
