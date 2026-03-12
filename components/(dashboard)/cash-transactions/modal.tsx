// src/components/(dashboard)/cash-transactions/modal.tsx
"use client";

import { BaseModal } from "@/components/ui/base-modal";
import { ICashTransactionAggregated } from "@/definitions/cash-transactions";
import {
  Truck,
  Factory,
  Phone,
  Banknote,
  Droplet,
  Calendar,
  User,
} from "lucide-react";

export function CashTransactionDetailModal({
  open,
  onClose,
  item,
}: {
  open: boolean;
  onClose: () => void;
  item: ICashTransactionAggregated;
}) {
  const transactionNumber = item.id?.slice(-6).toUpperCase();

  return (
    <BaseModal open={open} onClose={onClose}>
      <div className="space-y-4 max-h-[90vh] overflow-y-auto p-1">
        <h2 className="text-lg font-semibold text-gray-800">
          Cash Transaction Details
        </h2>

        {/* Status Badge */}
        <div className="flex justify-between items-center">
          <span
            className={`px-3 py-1 text-sm font-semibold rounded-full capitalize ${
              item.status === "completed"
                ? "bg-green-100 text-green-700"
                : item.status === "pending"
                  ? "bg-yellow-100 text-yellow-700"
                  : "bg-red-100 text-red-700"
            }`}
          >
            {item.status}
          </span>
          <span className="text-sm text-gray-500 flex items-center gap-1">
            <Calendar size={14} />
            {new Date(item.createdAt).toLocaleString("en-ZA")}
          </span>
        </div>

        {/* COMPANY */}
        <div className="flex items-center gap-2 text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">
          <Factory size={16} className="text-gray-500" />
          <div>
            <p className="text-xs text-gray-500">Company</p>
            <p className="font-medium">{item.companyName}</p>
          </div>
        </div>

        {/* TRUCK */}
        <div className="flex items-center gap-2 text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">
          <Truck size={16} className="text-gray-500" />
          <div>
            <p className="text-xs text-gray-500">Truck</p>
            <p className="font-medium">{item.plateNumber}</p>
          </div>
        </div>

        {/* DRIVER & PHONE */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2 text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">
            <div>
              <p className="text-xs text-gray-500">Driver</p>
              <p className="font-medium">{item.driverName}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">
            <Phone size={16} className="text-gray-500" />
            <div>
              <p className="text-xs text-gray-500">Phone</p>
              <p className="font-medium">{item.phoneNumber}</p>
            </div>
          </div>
        </div>

        {/* PRODUCT & LITRES */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2 text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">
            <div>
              <p className="text-xs text-gray-500">Product</p>
              <p className="font-medium">{item.productName}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">
            <Droplet size={16} className="text-gray-500" />
            <div>
              <p className="text-xs text-gray-500">Litres</p>
              <p className="font-medium text-blue-600">{item.litres}L</p>
            </div>
          </div>
        </div>

        {/* PRICING */}
        <div className="bg-gray-50 p-3 rounded-lg space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Grid Price:</span>
            <span className="font-medium">R {item.grid}/L</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Plus/Discount:</span>
            <span className="font-medium">R {item.plusDiscount}/L</span>
          </div>
          <div className="flex justify-between text-base font-semibold border-t border-gray-200 pt-2">
            <span>Total Amount:</span>
            <span className="text-green-600">R {item.total.toFixed(2)}</span>
          </div>
        </div>

        {/* Transaction PIN */}
        <div className="flex items-center gap-2 text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">
          <Banknote size={16} className="text-gray-500" />
          <div>
            <p className="text-xs text-gray-500">Transaction Reference</p>
            <p className="font-mono font-bold">{transactionNumber}</p>
          </div>
        </div>

        {/* Dispenser Info (if available) */}
        {item.dispenserName && (
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="bg-blue-50 p-3 border-b border-blue-100">
              <h3 className="text-sm font-medium text-blue-800 flex items-center gap-2">
                <Droplet size={16} />
                Dispenser Information
              </h3>
            </div>
            <div className="p-3 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Dispenser:</span>
                <span className="font-medium">{item.dispenserName}</span>
              </div>
              {item.attendantName && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Attendant:</span>
                  <span className="font-medium flex items-center gap-1">
                    <User size={14} className="text-gray-400" />
                    {item.attendantName}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* CLOSE BUTTON */}
        <div className="flex justify-end pt-5 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-6 py-2 text-sm bg-gray-800 text-white rounded-md hover:bg-gray-700"
          >
            Close
          </button>
        </div>
      </div>
    </BaseModal>
  );
}
