"use client";

import { BaseModal } from "@/components/ui/base-modal";
import { useState, useTransition } from "react";
import { ICashTransactionAggregated } from "@/definitions/cash-transactions";
import { Check, Truck, Factory, Phone, Banknote } from "lucide-react";

export function CashTransactionDetailModal({
  open,
  onClose,
  item,
}: {
  open: boolean;
  onClose: () => void;
  item: ICashTransactionAggregated;
}) {
  const [signature, setSignature] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();
  const transactionNumber = item.id?.slice(-6).toUpperCase();

  const handleSubmit = () => {
    if (!signature) {
      setMessage("❌ Please sign before completing.");
      return;
    }

    setMessage("");
  };

  return (
    <BaseModal open={open} onClose={onClose}>
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-800">
          Cash Transaction Details
        </h2>

        {/* COMPANY */}
        <div className="flex items-center gap-2 text-sm text-gray-700">
          <Factory size={16} />
          Company: {item.companyName}
        </div>

        {/* TRUCK */}
        <div className="flex items-center gap-2 text-sm text-gray-700">
          <Truck size={16} />
          {item.plateNumber}
        </div>

        {/* DRIVER */}
        <div className="text-sm text-gray-700">
          Driver: <span className="font-semibold">{item.driverName}</span>
        </div>

        {/* PHONE */}
        <div className="flex items-center gap-2 text-sm text-gray-700">
          <Phone size={16} />
          {item.phoneNumber}
        </div>

        {/* LITRES */}
        <div className="text-sm text-gray-700">
          Litres Purchased: <span className="font-semibold">{item.litres}</span>
        </div>

        {/* PRICING */}
        <div className="text-sm text-gray-700">
          Grid: <span className="font-semibold">R {item.grid}</span>
        </div>

        <div className="text-sm text-gray-700">
          Plus/Discount:{" "}
          <span className="font-semibold">R {item.plusDiscount}</span>
        </div>

        {/* TOTAL */}
        <div className="flex items-center gap-2 text-sm text-gray-800">
          <Banknote size={16} />
          Total:{" "}
          <span className="font-semibold">R {item.total.toFixed(2)}</span>
        </div>

        {/* STATUS */}
        <div className="text-sm text-gray-700">
          Status:{" "}
          <span className="font-semibold capitalize">{item.status}</span>
        </div>

        {/* TRANSACTION PIN */}
        {item.status === "pending" && (
          <div className="text-sm text-gray-700">
            Transaction PIN:{" "}
            <span className="font-semibold">{transactionNumber}</span>
          </div>
        )}

        {/* MESSAGE */}
        {message && (
          <p
            className={`text-xs mt-2 ${
              message.includes("✅") ? "text-green-600" : "text-red-600"
            }`}
          >
            {message}
          </p>
        )}

        {/* ACTION BUTTONS */}
        <div className="flex justify-end gap-3 pt-5 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm border border-gray-300 rounded-md text-gray-600 hover:bg-gray-100"
          >
            Close
          </button>

          {item.status === "pending" && (
            <button
              onClick={handleSubmit}
              disabled={isPending || !signature}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium text-white rounded-md ${
                !signature || isPending
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700"
              }`}
            >
              {isPending ? "Processing..." : "Complete"}
              <Check size={16} />
            </button>
          )}
        </div>
      </div>
    </BaseModal>
  );
}
