"use client";

import { BaseModal } from "@/components/ui/base-modal";
import SignatureCanvas from "react-signature-canvas";
import { useRef, useState, useTransition, useEffect } from "react";
import { IOrderItemAggregated } from "@/definitions/order-item";
import { useRouter } from "next/navigation";
import { Check, Truck, Factory, PackageCheck } from "lucide-react";
import { completeOrderItemAction } from "@/actions/order-item";

export function OrderItemDetailModal({
  open,
  onClose,
  item,
}: {
  open: boolean;
  onClose: () => void;
  item: IOrderItemAggregated;
}) {
  const sigPadRef = useRef<any>(null);
  const [signature, setSignature] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const orderItemNumber = item.id?.slice(-6).toUpperCase();

  // Load existing signature (if any)
  useEffect(() => {
    if (item.signature) {
      setSignature(item.signature);
    }
  }, [item.signature]);

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
        setMessage("✅ Order completed!");
        router.refresh();
        setTimeout(() => onClose(), 900);
      } else {
        setMessage(result.message || "❌ Failed to complete order.");
      }
    });
  };

  const hasExistingSignature = Boolean(item.signature);

  return (
    <BaseModal open={open} onClose={onClose}>
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-800">
          Order Item Details
        </h2>

        {/* TRUCK */}
        <div className="flex items-center gap-2 text-sm text-gray-700">
          <Truck size={16} />
          {item.plateNumber} ({item.make} {item.model} {item.year})
        </div>

        {/* PRODUCT */}
        <div className="flex items-center gap-2 text-sm text-gray-700">
          <PackageCheck size={16} />
          Product: {item.productName}
        </div>

        {/* COMPANY */}
        <div className="flex items-center gap-2 text-sm text-gray-700">
          <Factory size={16} />
          Company: {item.companyName}
        </div>

        {/* QUANTITY */}
        <div className="text-sm text-gray-700">
          Quantity: <span className="font-semibold">{item.quantity}</span>
        </div>

        {/* STATUS */}
        <div className="text-sm text-gray-700">
          Status:{" "}
          <span className="font-semibold capitalize">{item.status}</span>
        </div>

        {/* STATUS */}
        {item.status === "accepted" && (
          <div className="text-sm text-gray-700">
            PIN:{" "}
            <span className="font-semibold capitalize">{orderItemNumber}</span>
          </div>
        )}

        {/* SIGNATURE AREA */}
        {(item.status === "accepted" || hasExistingSignature) && (
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">
              Collector Signature:
            </p>

            {hasExistingSignature && item.signature && (
              // SHOW READ-ONLY IMAGE
              <div className="border border-gray-300 rounded-md bg-white p-2">
                <img
                  src={item.signature}
                  className="w-full h-auto object-contain"
                  alt="Existing signature"
                />
              </div>
            )}

            {item.status === "accepted" && (
              // SIGNATURE PAD
              <>
                <div className="border border-gray-300 rounded-md shadow-sm bg-white">
                  <SignatureCanvas
                    ref={sigPadRef}
                    penColor="black"
                    canvasProps={{
                      width: 450,
                      height: 180,
                      className: "signatureCanvas",
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

          {item.status === "accepted" && (
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
