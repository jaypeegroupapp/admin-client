"use client";
import { Banknote } from "lucide-react";

export function CashTransactionHeader({ onAdd }: { onAdd: () => void }) {
  return (
    <div className="flex flex-row justify-between items-center mb-4 gap-y-6">
      <div className="flex gap-2 items-center">
        <Banknote />
        <h1 className="text-xl font-semibold">Cash Transactions</h1>
      </div>

      <button
        onClick={onAdd}
        className="px-4 py-2 rounded-xl bg-gray-800 text-white"
      >
        New Transaction
      </button>
    </div>
  );
}
