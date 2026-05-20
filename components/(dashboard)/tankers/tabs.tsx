"use client";

export type TankerTab = "All" | "Published" | "Draft";

export function TankerTabs({
  activeTab,
  onChange,
  counts,
}: {
  activeTab: TankerTab;
  onChange: (tab: TankerTab) => void;
  counts: Record<TankerTab, number>;
}) {
  const tabs: TankerTab[] = ["All", "Published", "Draft"];

  return (
    <div className="w-full lg:w-auto flex-none flex gap-2 flex-wrap md:flex-nowrap">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => onChange(tab)}
          className={`
            px-4 py-2 rounded-xl text-sm font-medium border transition-all
            ${
              activeTab === tab
                ? "bg-gray-800 text-white"
                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
            }
          `}
        >
          {tab} <b>{counts[tab]}</b>
        </button>
      ))}
    </div>
  );
}
