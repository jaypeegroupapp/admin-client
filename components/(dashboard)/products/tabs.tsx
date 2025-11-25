"use client";

export type ProductTab = "All" | "Published" | "Draft";

export function ProductTabs({
  activeTab,
  onChange,
  counts,
}: {
  activeTab: ProductTab;
  onChange: (tab: ProductTab) => void;
  counts: Record<ProductTab, number>;
}) {
  const tabs: ProductTab[] = ["All", "Published", "Draft"];

  return (
    <div className="w-full lg:w-auto flex-none flex gap-2 flex-wrap md:flex-nowrap">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => onChange(tab)}
          className={`
              px-4 py-2 rounded-xl text-sm font-medium border
              transition-all
              ${
                activeTab === tab
                  ? "bg-gray-800 text-white"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
              }
            `}
        >
          {tab} ({counts[tab]})
        </button>
      ))}
    </div>
  );
}
