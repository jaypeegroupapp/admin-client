// src/components/(dashboard)/returns/tabs.tsx
"use client";

export type RefundTab = "All" | "Returned" | "Closed";

export function RefundsTabs({
    activeTab,
    onChange,
    counts,
}: {
    activeTab: RefundTab;
    onChange: (tab: RefundTab) => void;
    counts: Record<RefundTab, number>;
}) {
    const tabs: RefundTab[] = ["All", "Returned", "Closed"];

    return (
        <div className="w-full lg:w-auto flex-none flex gap-2 flex-wrap md:flex-nowrap">
            {tabs.map((tab) => (
                <button
                    key={tab}
                    onClick={() => onChange(tab)}
                    className={`
            px-4 py-2 rounded-xl text-sm font-medium border
            transition-all
            ${activeTab === tab
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