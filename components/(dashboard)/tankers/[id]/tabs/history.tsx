"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  History,
  Calendar,
  Package,
  AlertTriangle,
  ArrowRightLeft,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { getTankerTransactionHistory } from "@/data/tanker-history";

export function HistoryTab({ tankerId }: { tankerId: string }) {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedTransaction, setExpandedTransaction] = useState<string | null>(
    null,
  );

  useEffect(() => {
    loadTransactions();
  }, [tankerId]);

  const loadTransactions = async () => {
    setLoading(true);
    const result = await getTankerTransactionHistory(tankerId);
    setTransactions(result);
    setLoading(false);
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case "RESTOCK":
        return <Package size={14} className="text-green-600" />;
      case "TRANSFER_OUT":
        return <ArrowRightLeft size={14} className="text-blue-600" />;
      case "SPILLAGE":
        return <AlertTriangle size={14} className="text-red-600" />;
      default:
        return <History size={14} className="text-gray-500" />;
    }
  };

  const getTransactionColor = (type: string) => {
    switch (type) {
      case "RESTOCK":
        return "text-green-600";
      case "TRANSFER_OUT":
        return "text-blue-600";
      case "SPILLAGE":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  const getQuantityDisplay = (transaction: any) => {
    if (transaction.type === "RESTOCK") {
      return (
        <span className="text-green-600 font-medium">
          +{transaction.quantity}L
        </span>
      );
    }
    if (transaction.type === "TRANSFER_OUT") {
      return (
        <span className="text-blue-600 font-medium">
          -{transaction.quantity}L (to dispenser)
        </span>
      );
    }
    if (transaction.type === "SPILLAGE") {
      return (
        <span className="text-red-600 font-medium">
          -{transaction.quantity}L (spillage)
        </span>
      );
    }
    return <span>{transaction.quantity}L</span>;
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium text-gray-700 flex items-center gap-2">
        <History size={16} className="text-gray-500" />
        Transaction History
      </h3>

      {transactions.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <History size={32} className="mx-auto text-gray-400 mb-2" />
          <p className="text-sm text-gray-500">No transaction history found</p>
        </div>
      ) : (
        <div className="space-y-3">
          {transactions.map((tx) => (
            <motion.div
              key={tx.id}
              className="border border-gray-200 rounded-lg overflow-hidden"
            >
              <div
                className="p-4 bg-white hover:bg-gray-50 cursor-pointer"
                onClick={() =>
                  setExpandedTransaction(
                    expandedTransaction === tx.id ? null : tx.id,
                  )
                }
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="flex items-center gap-2">
                      {getTransactionIcon(tx.type)}
                      <span
                        className={`text-sm font-medium ${getTransactionColor(tx.type)}`}
                      >
                        {tx.type}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar size={14} className="text-gray-400" />
                      <span className="text-sm text-gray-600">
                        {new Date(tx.timestamp).toLocaleString("en-ZA")}
                      </span>
                    </div>
                    <div>{getQuantityDisplay(tx)}</div>
                  </div>
                  {expandedTransaction === tx.id ? (
                    <ChevronUp size={18} />
                  ) : (
                    <ChevronDown size={18} />
                  )}
                </div>

                <div className="flex gap-4 mt-2 text-xs text-gray-500">
                  <span>Before: {tx.beforeStock}L</span>
                  <span>→</span>
                  <span>After: {tx.afterStock}L</span>
                </div>
              </div>

              {expandedTransaction === tx.id && tx.details && (
                <div className="border-t border-gray-200 bg-gray-50 p-4">
                  <div className="grid grid-cols-2 gap-4">
                    {tx.details.dispenserName && (
                      <div>
                        <p className="text-xs text-gray-500">Dispenser</p>
                        <p className="text-sm">{tx.details.dispenserName}</p>
                      </div>
                    )}
                    {tx.details.reason && (
                      <div>
                        <p className="text-xs text-gray-500">Reason</p>
                        <p className="text-sm">{tx.details.reason}</p>
                      </div>
                    )}
                    {tx.details.notes && (
                      <div className="col-span-2">
                        <p className="text-xs text-gray-500">Notes</p>
                        <p className="text-sm">{tx.details.notes}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
