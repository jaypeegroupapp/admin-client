// src/components/(dashboard)/cash-transactions/modal.tsx
"use client";

import { BaseModal } from "@/components/ui/base-modal";
import { useState, useTransition, useEffect, useRef } from "react";
import { ICashTransactionAggregated } from "@/definitions/cash-transactions";
import {
  Check,
  Truck,
  Factory,
  Phone,
  Droplet,
  AlertCircle,
} from "lucide-react";
import { completeCashTransactionAction } from "@/actions/cash-transaction";
import { useRouter } from "next/navigation";
import SignatureCanvas from "react-signature-canvas";
import { getCurrentUserDispenser } from "@/data/dispenser";

export function CashTransactionDetailModal({
  open,
  onClose,
  item,
}: {
  open: boolean;
  onClose: () => void;
  item: ICashTransactionAggregated;
}) {
  const router = useRouter();
  const sigPadRef = useRef<any>(null);
  const [signature, setSignature] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();
  const [userDispenser, setUserDispenser] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const transactionNumber = item.id?.slice(-6).toUpperCase();

  useEffect(() => {
    if (open && item.status === "pending") {
      loadUserDispenser();
    }
  }, [open, item.status]);

  const loadUserDispenser = async () => {
    setLoading(true);
    const result = await getCurrentUserDispenser();
    if (result.success) {
      setUserDispenser(result.data);
    }
    setLoading(false);
  };

  const handleClear = () => {
    sigPadRef.current?.clear();
    setSignature(null);
  };

  const handleSubmit = () => {
    if (!signature) {
      setMessage("❌ Please sign before completing.");
      return;
    }

    setMessage("");

    startTransition(async () => {
      const result = await completeCashTransactionAction(item.id, signature);

      if (result.success) {
        setMessage(
          `✅ Transaction completed! Sold ${result.data?.litresSold}L from ${result.data?.dispenserName}`,
        );
        router.refresh();
        setTimeout(() => onClose(), 2000);
      } else {
        setMessage(result.message || "❌ Failed to complete transaction.");
      }
    });
  };

  // Check if user can complete this transaction
  const canComplete =
    item.status === "pending" &&
    userDispenser?.dispenser &&
    userDispenser?.attendance &&
    userDispenser.dispenser.litres >= item.litres;

  const insufficientStock =
    userDispenser?.dispenser && userDispenser.dispenser.litres < item.litres;

  return (
    <BaseModal open={open} onClose={onClose}>
      <div className="space-y-4 max-h-[90vh] overflow-y-auto p-1">
        <h2 className="text-lg font-semibold text-gray-800">
          Cash Transaction Details
        </h2>

        {/* COMPANY */}
        <div className="flex items-center gap-2 text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">
          <Factory size={16} className="text-gray-500" />
          <span className="font-medium">{item.companyName}</span>
        </div>

        {/* TRUCK */}
        <div className="flex items-center gap-2 text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">
          <Truck size={16} className="text-gray-500" />
          <span className="font-medium">{item.plateNumber}</span>
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
            <span className="text-gray-600">Grid:</span>
            <span className="font-medium">R {item.grid}/L</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Plus/Discount:</span>
            <span className="font-medium">R {item.plusDiscount}/L</span>
          </div>
          <div className="flex justify-between text-base font-semibold border-t border-gray-200 pt-2">
            <span>Total:</span>
            <span className="text-green-600">R {item.total.toFixed(2)}</span>
          </div>
        </div>

        {/* STATUS & PIN */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2 text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">
            <div>
              <p className="text-xs text-gray-500">Status</p>
              <span
                className={`inline-block px-2 py-1 text-xs font-semibold rounded-full capitalize ${
                  item.status === "completed"
                    ? "bg-green-100 text-green-700"
                    : item.status === "pending"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-red-100 text-red-700"
                }`}
              >
                {item.status}
              </span>
            </div>
          </div>

          {item.status === "pending" && (
            <div className="flex items-center gap-2 text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">
              <div>
                <p className="text-xs text-gray-500">Transaction PIN</p>
                <p className="font-mono font-bold">{transactionNumber}</p>
              </div>
            </div>
          )}
        </div>

        {/* YOUR DISPENSER INFO */}
        {item.status === "pending" && (
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="bg-blue-50 p-3 border-b border-blue-100">
              <h3 className="text-sm font-medium text-blue-800 flex items-center gap-2">
                <Droplet size={16} />
                Your Dispenser
              </h3>
            </div>

            <div className="p-3 space-y-3">
              {loading ? (
                <p className="text-sm text-gray-500 text-center py-2">
                  Loading dispenser info...
                </p>
              ) : userDispenser ? (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-xs text-gray-500">Dispenser</p>
                      <p className="font-medium">
                        {userDispenser.dispenser.name}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Current Stock</p>
                      <p
                        className={`font-medium text-lg ${
                          insufficientStock ? "text-red-600" : "text-green-600"
                        }`}
                      >
                        {userDispenser.dispenser.litres}L
                      </p>
                    </div>
                  </div>

                  {/* Attendant Status */}
                  {userDispenser.attendance ? (
                    <div className="bg-green-50 p-2 rounded-lg flex items-center gap-2">
                      <div>
                        <p className="text-xs text-green-700">
                          ✓ You are logged in
                        </p>
                        <p className="text-xs text-green-600">
                          Since:{" "}
                          {new Date(
                            userDispenser.attendance.loginTime,
                          ).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-yellow-50 p-2 rounded-lg flex items-center gap-2">
                      <AlertCircle size={14} className="text-yellow-600" />
                      <p className="text-sm text-yellow-700">
                        You are not logged into this dispenser
                      </p>
                    </div>
                  )}

                  {/* Warning for insufficient stock */}
                  {insufficientStock && (
                    <div className="bg-red-50 p-2 rounded-lg flex items-center gap-2">
                      <AlertCircle size={14} className="text-red-600" />
                      <p className="text-sm text-red-700">
                        Insufficient stock! Available:{" "}
                        {userDispenser.dispenser.litres}L, Required:{" "}
                        {item.litres}L
                      </p>
                    </div>
                  )}
                </>
              ) : (
                <div className="bg-yellow-50 p-2 rounded-lg flex items-center gap-2">
                  <AlertCircle size={14} className="text-yellow-600" />
                  <p className="text-sm text-yellow-700">
                    No dispenser assigned to you
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* SIGNATURE AREA */}
        {item.status === "pending" && (
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <span>Collector Signature:</span>
              {canComplete && (
                <span className="text-xs text-green-600">(Required)</span>
              )}
            </p>

            <div className="border border-gray-300 rounded-md shadow-sm bg-white">
              <SignatureCanvas
                ref={sigPadRef}
                penColor="black"
                canvasProps={{
                  width: 450,
                  height: 150,
                  className: "signatureCanvas w-full",
                }}
                onEnd={() => {
                  const dataURL = sigPadRef.current
                    ?.getTrimmedCanvas()
                    .toDataURL("image/png");
                  setSignature(dataURL);
                }}
              />
            </div>

            <button
              onClick={handleClear}
              className="mt-2 text-xs text-red-600 underline"
            >
              Clear signature
            </button>
          </div>
        )}

        {/* MESSAGE */}
        {message && (
          <div
            className={`p-3 rounded-lg ${
              message.includes("✅") ? "bg-green-50" : "bg-red-50"
            }`}
          >
            <p
              className={`text-sm ${
                message.includes("✅") ? "text-green-700" : "text-red-700"
              }`}
            >
              {message}
            </p>
          </div>
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
              disabled={isPending || !signature || !canComplete}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium text-white rounded-md ${
                !signature || isPending || !canComplete
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700"
              }`}
              title={
                !userDispenser
                  ? "No dispenser assigned to you"
                  : !userDispenser.attendance
                    ? "You are not logged into the dispenser"
                    : insufficientStock
                      ? "Insufficient stock"
                      : ""
              }
            >
              {isPending ? "Processing..." : "Complete Transaction"}
              <Check size={16} />
            </button>
          )}
        </div>
      </div>
    </BaseModal>
  );
}
