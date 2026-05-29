"use client";

import { Check, Printer } from "lucide-react";

export function ActionButtons({
  status,
  hasExistingSignature,
  isCompleted,
  isPending,
  signature,
  canFulfill,
  hasDispenser,
  hasAttendance,
  insufficientStock,
  onClose,
  onSubmit,
  onPrint,
}: any) {
  if (isCompleted) {
    return (
      <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
        <button
          onClick={onClose}
          className="px-4 py-2 text-sm border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 transition print:hidden"
        >
          Close
        </button>
        <button
          onClick={onPrint}
          className="flex items-center gap-2 px-5 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition print:hidden"
        >
          <Printer size={16} />
          Print Receipt
        </button>
      </div>
    );
  }

  return (
    <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
      <button
        onClick={onClose}
        className="px-4 py-2 text-sm border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 transition print:hidden"
      >
        Close
      </button>

      {status === "accepted" && !hasExistingSignature && (
        <button
          onClick={onSubmit}
          disabled={isPending || !signature || !canFulfill}
          className={`flex items-center gap-2 px-5 py-2 text-sm font-medium text-white rounded-lg transition print:hidden ${
            !signature || isPending || !canFulfill
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-700"
          }`}
          title={
            !hasDispenser
              ? "No dispenser assigned to you"
              : !hasAttendance
                ? "You are not logged into the dispenser"
                : insufficientStock
                  ? "Insufficient stock in tanker"
                  : !signature
                    ? "Please sign first"
                    : ""
          }
        >
          {isPending ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
              Processing...
            </>
          ) : (
            <>
              Complete Order <Check size={16} />
            </>
          )}
        </button>
      )}
    </div>
  );
}
