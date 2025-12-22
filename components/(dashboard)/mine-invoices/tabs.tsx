"use client";

import { InvoiceTab } from "@/definitions/company-invoice";

export function InvoiceTabs({
  activeTab,
  onChange,
  counts,
}: {
  activeTab: InvoiceTab;
  onChange: (tab: InvoiceTab) => void;
  counts: Record<InvoiceTab, number>;
}) {
  const tabs: InvoiceTab[] = ["All", "Pending", "Published", "Paid", "Closed"];

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
          {tab} <b>{counts[tab]}</b>
        </button>
      ))}
    </div>
  );
}
