"use client";

import { useState, useRef, useTransition } from "react";
import { useRouter } from "next/navigation";
import SignatureCanvas from "react-signature-canvas";
import { completeOrderAction } from "@/actions/order";
import { BaseModal } from "@/components/ui/base-modal";
import { Check } from "lucide-react";

interface Props {
  orderId: string;
  open: boolean;
  onClose: () => void;
}

export function CompleteOrderModal({ orderId, open, onClose }: Props) {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [signature, setSignature] = useState<string | null>(null);
  const sigPadRef = useRef<any>(null);

  const [isPending, startTransition] = useTransition();

  const handleClear = () => {
    sigPadRef.current.clear();
    setSignature(null);
  };

  const handleSubmit = () => {
    if (!signature) {
      setMessage("❌ Please sign before completing.");
      return;
    }

    setMessage("");

    startTransition(async () => {
      const result = await completeOrderAction(orderId, signature);

      if (result.success) {
        setMessage("✅ Order completed successfully!");
        router.refresh();
        setTimeout(() => onClose(), 900);
      } else {
        setMessage(result.message || "❌ Failed to complete order.");
      }
    });
  };

  return (
    <BaseModal open={open} onClose={onClose}>
      <h3 className="text-lg font-semibold text-gray-800 mb-3">
        Complete Order
      </h3>

      <p className="text-sm text-gray-600 mb-4">
        A signature is required to confirm the collection and complete the
        order.
      </p>

      {/* Signature Pad */}
      <div>
        <p className="text-sm font-medium text-gray-700 mb-2">
          Collector Signature:
        </p>

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
              const data = sigPadRef.current
                ?.getTrimmedCanvas()
                .toDataURL("image/png");

              setSignature(data);
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

      {message && (
        <p
          className={`text-xs mt-3 ${
            message.includes("✅") ? "text-green-600" : "text-red-600"
          }`}
        >
          {message}
        </p>
      )}

      <div className="flex justify-end gap-3 pt-6 border-t border-gray-200 mt-4">
        <button
          onClick={onClose}
          className="px-4 py-2 text-sm border border-gray-300 rounded-md text-gray-600 hover:bg-gray-100"
        >
          Cancel
        </button>

        <button
          onClick={handleSubmit}
          disabled={isPending || !signature}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-medium text-white rounded-md ${
            isPending || !signature
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-700"
          }`}
        >
          {isPending ? "Processing..." : "Complete"}
          <Check size={16} />
        </button>
      </div>
    </BaseModal>
  );
}
