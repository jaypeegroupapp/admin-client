"use client";

import { Droplet, Truck, Banknote } from "lucide-react";

interface RecentTransactionsProps {
  transactions: any[];
}

export function RecentTransactions({ transactions }: RecentTransactionsProps) {
  const getTransactionIcon = (type: string) => {
    if (type === "SALE")
      return <Banknote size={14} className="text-green-500" />;
    return <Droplet size={14} className="text-blue-500" />;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
      <h3 className="text-sm font-medium text-gray-700 mb-4">
        Recent Transactions
      </h3>
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {transactions.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-8">
            No recent transactions
          </p>
        ) : (
          transactions.map((tx) => (
            <div
              key={tx._id}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gray-200 rounded-lg flex items-center justify-center">
                  {getTransactionIcon(tx.type)}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800">
                    {tx.litresDispensed}L dispensed
                  </p>
                  <p className="text-xs text-gray-500">
                    {tx.dispenserId?.name || "Unknown dispenser"}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500">
                  {new Date(tx.timestamp).toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
