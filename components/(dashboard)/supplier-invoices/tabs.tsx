"use client";

import { SupplierInvoiceTab } from "@/definitions/supplier-invoice";

export function SupplierInvoiceTabs({
  activeTab,
  onChange,
  counts,
}: {
  activeTab: SupplierInvoiceTab;
  onChange: (tab: SupplierInvoiceTab) => void;
  counts: Record<SupplierInvoiceTab, number>;
}) {
  const tabs: SupplierInvoiceTab[] = ["All", "Pending", "Paid", "Closed"];

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
