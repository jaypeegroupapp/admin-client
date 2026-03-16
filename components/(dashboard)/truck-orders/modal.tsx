// src/components/(dashboard)/truck-orders/modal.tsx
"use client";

import { BaseModal } from "@/components/ui/base-modal";
import SignatureCanvas from "react-signature-canvas";
import { useRef, useState, useTransition } from "react";
import { IOrderItemAggregated } from "@/definitions/order-item";
import { useRouter } from "next/navigation";
import {
  Check,
  Truck,
  Factory,
  PackageCheck,
  Droplet,
  AlertCircle,
  User,
  Fuel,
} from "lucide-react";
import { completeOrderItemAction } from "@/actions/order-item";

export function OrderItemDetailModal({
  open,
  onClose,
  item,
  userDispenser,
}: {
  open: boolean;
  onClose: () => void;
  item: IOrderItemAggregated;
  userDispenser?: any;
}) {
  const sigPadRef = useRef<any>(null);
  const [signature, setSignature] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const orderItemNumber = item.id?.slice(-6).toUpperCase();

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
      const result = await completeOrderItemAction(item.id, signature);

      if (result.success) {
        setMessage(result.message || "✅ Order completed successfully!");
        router.refresh();
        setTimeout(() => onClose(), 2000);
      } else {
        setMessage(result.message || "❌ Failed to complete order.");
      }
    });
  };

  // Check if user can complete this order
  const canComplete =
    item.status === "accepted" &&
    userDispenser && // User has a dispenser assigned
    userDispenser.attendance && // User is logged into dispenser
    userDispenser.dispenser.litres >= item.quantity; // Enough stock

  const insufficientStock =
    userDispenser && userDispenser.dispenser.litres < item.quantity;

  const hasExistingSignature = Boolean(item.signature);

  return (
    <BaseModal open={open} onClose={onClose}>
      <div className="space-y-4 max-h-[90vh] overflow-y-auto p-1">
        <h2 className="text-lg font-semibold text-gray-800">
          Order Item Details
        </h2>

        {/* TRUCK */}
        <div className="flex items-center gap-2 text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">
          <Truck size={16} className="text-gray-500" />
          <span className="font-medium">{item.plateNumber}</span>
          <span className="text-gray-500">
            ({item.make} {item.model} {item.year})
          </span>
        </div>

        {/* PRODUCT & QUANTITY */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2 text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">
            <PackageCheck size={16} className="text-gray-500" />
            <div>
              <p className="text-xs text-gray-500">Product</p>
              <p className="font-medium">{item.productName || "Diesel"}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">
            <Fuel size={16} className="text-gray-500" />
            <div>
              <p className="text-xs text-gray-500">Quantity</p>
              <p className="font-medium text-blue-600">{item.quantity}L</p>
            </div>
          </div>
        </div>

        {/* COMPANY */}
        <div className="flex items-center gap-2 text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">
          <Factory size={16} className="text-gray-500" />
          <div>
            <p className="text-xs text-gray-500">Company</p>
            <p className="font-medium">{item.companyName || "N/A"}</p>
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
                      : item.status === "cancelled"
                        ? "bg-red-100 text-red-700"
                        : "bg-blue-100 text-blue-700"
                }`}
              >
                {item.status}
              </span>
            </div>
          </div>

          {item.status === "accepted" && (
            <div className="flex items-center gap-2 text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">
              <div>
                <p className="text-xs text-gray-500">PIN</p>
                <p className="font-mono font-bold">{orderItemNumber}</p>
              </div>
            </div>
          )}
        </div>

        {/* YOUR DISPENSER INFO */}
        {item.status === "accepted" && (
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="bg-blue-50 p-3 border-b border-blue-100">
              <h3 className="text-sm font-medium text-blue-800 flex items-center gap-2">
                <Droplet size={16} />
                Your Dispenser
              </h3>
            </div>

            <div className="p-3 space-y-3">
              {userDispenser ? (
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
                          userDispenser.dispenser.litres < item.quantity
                            ? "text-red-600"
                            : "text-green-600"
                        }`}
                      >
                        {userDispenser.dispenser.litres.toFixed(2)}L
                      </p>
                    </div>
                  </div>

                  {/* Attendant Status */}
                  {userDispenser.attendance ? (
                    <div className="bg-green-50 p-2 rounded-lg flex items-center gap-2">
                      <User size={14} className="text-green-600" />
                      <div>
                        <p className="text-xs text-green-700">
                          You are logged in
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
                        {item.quantity}L
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
        {(item.status === "accepted" || hasExistingSignature) && (
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <span>Collector Signature:</span>
              {item.status === "accepted" && canComplete && (
                <span className="text-xs text-green-600">(Required)</span>
              )}
            </p>

            {hasExistingSignature && item.signature && (
              <div className="border border-gray-300 rounded-md bg-white p-2">
                <img
                  src={item.signature}
                  className="w-full h-auto object-contain max-h-32"
                  alt="Existing signature"
                />
              </div>
            )}

            {item.status === "accepted" && !hasExistingSignature && (
              <>
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
              </>
            )}
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

          {item.status === "accepted" && (
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
              {isPending ? "Processing..." : "Complete Order"}
              <Check size={16} />
            </button>
          )}
        </div>
      </div>
    </BaseModal>
  );
}
