"use client";

export type StaffTab = "All" | "Active" | "Inactive";

export function StaffTabs({
  activeTab,
  onChange,
  counts,
}: {
  activeTab: StaffTab;
  onChange: (tab: StaffTab) => void;
  counts: Record<StaffTab, number>;
}) {
  const tabs: StaffTab[] = ["All", "Active", "Inactive"];

  return (
    <div className="flex gap-2">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => onChange(tab)}
          className={`px-4 py-2 rounded-xl text-sm font-medium border ${
            activeTab === tab
              ? "bg-gray-800 text-white"
              : "bg-white text-gray-700"
          }`}
        >
          {tab} <b>{counts[tab]}</b>
        </button>
      ))}
    </div>
  );
}
