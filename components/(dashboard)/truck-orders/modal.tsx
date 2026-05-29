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
  Gauge,
  X,
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

  const tankerStock = userDispenser?.tankerStock || 0;
  const tankerName = userDispenser?.tankerName || "Unknown";
  const totalDispensed = userDispenser?.dispenser?.totalDispensed || 0;
  const insufficientStock = tankerStock < item.quantity;
  const hasAttendance = !!userDispenser?.attendance;
  const hasDispenser = !!userDispenser?.dispenser;

  const canFulfill =
    item.status === "accepted" &&
    hasDispenser &&
    hasAttendance &&
    !insufficientStock;

  const hasExistingSignature = Boolean(item.signature);

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
        setMessage("✅ Order completed successfully!");
        router.refresh();
        setTimeout(() => onClose(), 1500);
      } else {
        setMessage(result.message || "❌ Failed to complete order.");
      }
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-ZA", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <BaseModal open={open} onClose={onClose}>
      <div className="space-y-5 max-h-[90vh] overflow-y-auto p-1">
        {/* Header */}
        <div className="flex justify-between items-center border-b border-gray-200 pb-3">
          <h2 className="text-lg font-semibold text-gray-800">Order Details</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={20} />
          </button>
        </div>

        {/* Truck Info */}
        <div className="flex items-center gap-3 text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">
          <div className="bg-white p-2 rounded-lg">
            <Truck size={18} className="text-gray-600" />
          </div>
          <div>
            <p className="text-xs text-gray-500">Truck</p>
            <p className="font-medium">{item.plateNumber}</p>
            <p className="text-xs text-gray-400">
              {item.make} {item.model} {item.year}
            </p>
          </div>
        </div>

        {/* Product & Quantity */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-3 text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">
            <div className="bg-white p-2 rounded-lg">
              <PackageCheck size={18} className="text-gray-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Product</p>
              <p className="font-medium">{item.productName || "Diesel"}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">
            <div className="bg-white p-2 rounded-lg">
              <Fuel size={18} className="text-gray-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Quantity</p>
              <p className="font-medium text-blue-600 text-lg">
                {item.quantity}L
              </p>
            </div>
          </div>
        </div>

        {/* Company */}
        <div className="flex items-center gap-3 text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">
          <div className="bg-white p-2 rounded-lg">
            <Factory size={18} className="text-gray-600" />
          </div>
          <div>
            <p className="text-xs text-gray-500">Company</p>
            <p className="font-medium">{item.companyName || "N/A"}</p>
          </div>
        </div>

        {/* Status & PIN */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-xs text-gray-500">Status</p>
            <span
              className={`inline-block mt-1 px-2 py-1 text-xs font-semibold rounded-full capitalize ${
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
          {item.status === "accepted" && (
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-xs text-gray-500">PIN / Reference</p>
              <p className="font-mono font-bold text-sm mt-1">
                {orderItemNumber}
              </p>
            </div>
          )}
        </div>

        {/* Tanker & Dispenser Info - Only for accepted orders */}
        {item.status === "accepted" && (
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="bg-blue-50 p-3 border-b border-blue-100">
              <h3 className="text-sm font-medium text-blue-800 flex items-center gap-2">
                <Droplet size={16} />
                Tanker & Dispenser Information
              </h3>
            </div>
            <div className="p-4 space-y-4">
              {/* Tanker Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500 flex items-center gap-1">
                    <Fuel size={12} /> Connected Tanker
                  </p>
                  <p className="font-medium text-gray-800 mt-1">{tankerName}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 flex items-center gap-1">
                    <Gauge size={12} /> Tanker Stock
                  </p>
                  <p
                    className={`font-bold text-xl mt-1 ${insufficientStock ? "text-red-600" : "text-green-600"}`}
                  >
                    {tankerStock.toFixed(2)}L
                  </p>
                </div>
              </div>

              {/* Dispenser Meter Info */}
              <div className="border-t border-gray-100 pt-3">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500">Dispenser</p>
                    <p className="font-medium text-gray-800 mt-1">
                      {userDispenser?.dispenser?.name || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Meter Reading</p>
                    <p className="font-medium text-blue-600 mt-1">
                      {totalDispensed.toLocaleString()}L
                    </p>
                  </div>
                </div>
              </div>

              {/* Attendant Status */}
              {hasAttendance ? (
                <div className="bg-green-50 p-3 rounded-lg flex items-center gap-3">
                  <div className="bg-green-100 p-1.5 rounded-full">
                    <User size={14} className="text-green-600" />
                  </div>
                  <div>
                    <p className="text-xs text-green-700 font-medium">
                      ✓ Active Shift
                    </p>
                    <p className="text-xs text-green-600">
                      Started: {formatTime(userDispenser.attendance.loginTime)}
                    </p>
                    <p className="text-xs text-green-600">
                      Opening Meter:{" "}
                      {userDispenser.attendance.openingBalance?.toLocaleString() ||
                        0}
                      L
                    </p>
                  </div>
                </div>
              ) : (
                <div className="bg-yellow-50 p-3 rounded-lg flex items-center gap-3">
                  <AlertCircle size={16} className="text-yellow-600" />
                  <div>
                    <p className="text-sm text-yellow-700 font-medium">
                      No Active Shift
                    </p>
                    <p className="text-xs text-yellow-600">
                      Please start your shift before fulfilling orders
                    </p>
                  </div>
                </div>
              )}

              {/* Insufficient Stock Warning */}
              {insufficientStock && (
                <div className="bg-red-50 p-3 rounded-lg flex items-start gap-3">
                  <AlertCircle size={16} className="text-red-600 mt-0.5" />
                  <div>
                    <p className="text-sm text-red-700 font-medium">
                      Insufficient Tanker Stock
                    </p>
                    <p className="text-xs text-red-600">
                      Available: {tankerStock.toFixed(2)}L, Required:{" "}
                      {item.quantity}L
                    </p>
                    <p className="text-xs text-red-600 mt-1">
                      Please restock the tanker before fulfilling this order.
                    </p>
                  </div>
                </div>
              )}

              {/* Ready to Fulfill Indicator */}
              {canFulfill && (
                <div className="bg-green-100 p-3 rounded-lg flex items-center gap-3">
                  <Check size={16} className="text-green-600" />
                  <div>
                    <p className="text-sm text-green-700 font-medium">
                      Ready to Fulfill
                    </p>
                    <p className="text-xs text-green-600">
                      All conditions met. Please collect signature below.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Signature Section */}
        {(item.status === "accepted" || hasExistingSignature) && (
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <span>Collector Signature:</span>
              {item.status === "accepted" && canFulfill && (
                <span className="text-xs text-green-600 bg-green-100 px-2 py-0.5 rounded-full">
                  Required
                </span>
              )}
            </p>

            {hasExistingSignature && item.signature && (
              <div className="border border-gray-300 rounded-md bg-white p-3">
                <img
                  src={item.signature}
                  className="w-full h-auto object-contain max-h-28"
                  alt="Collected signature"
                />
                <p className="text-xs text-gray-400 text-center mt-2">
                  ✓ Signature already collected
                </p>
              </div>
            )}

            {item.status === "accepted" &&
              !hasExistingSignature &&
              canFulfill && (
                <>
                  <div className="border-2 border-dashed border-gray-300 rounded-md bg-white p-2">
                    <SignatureCanvas
                      ref={sigPadRef}
                      penColor="black"
                      canvasProps={{
                        width: 450,
                        height: 140,
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
                  <div className="flex justify-between items-center mt-2">
                    <button
                      onClick={handleClear}
                      className="text-xs text-red-600 hover:text-red-700 underline"
                    >
                      Clear signature
                    </button>
                    <p className="text-xs text-gray-400">
                      Sign in the box above
                    </p>
                  </div>
                </>
              )}
          </div>
        )}

        {/* Message */}
        {message && (
          <div
            className={`p-3 rounded-lg ${message.includes("✅") ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"}`}
          >
            <p
              className={`text-sm ${message.includes("✅") ? "text-green-700" : "text-red-700"} flex items-center gap-2`}
            >
              {message.includes("✅") ? (
                <Check size={16} />
              ) : (
                <AlertCircle size={16} />
              )}
              {message}
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 transition"
          >
            Close
          </button>

          {item.status === "accepted" && !hasExistingSignature && (
            <button
              onClick={handleSubmit}
              disabled={isPending || !signature || !canFulfill}
              className={`flex items-center gap-2 px-5 py-2 text-sm font-medium text-white rounded-lg transition ${
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
      </div>
    </BaseModal>
  );
}
