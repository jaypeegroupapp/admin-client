"use client";

import { useState, useTransition, useEffect } from "react";
import { useRouter } from "next/navigation";
import { BaseModal } from "@/components/ui/base-modal";
import { acceptOrderAction } from "@/actions/order";
import { getAvailableStockForProduct } from "@/data/order";
import { Check, AlertTriangle, Package } from "lucide-react";

interface Props {
  orderId: string;
  totalQuantity: number;
  productId: string;
  open: boolean;
  onClose: () => void;
}

export function AcceptOrderModal({
  orderId,
  totalQuantity,
  productId,
  open,
  onClose,
}: Props) {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [stockInfo, setStockInfo] = useState<{
    totalTankerStock: number;
    totalAccepted: number;
    availableStock: number;
  } | null>(null);
  const [loadingStock, setLoadingStock] = useState(false);
  const [isPending, startTransition] = useTransition();

  const hasEnoughStock = stockInfo
    ? stockInfo.availableStock >= totalQuantity
    : false;
  const shortfall = stockInfo ? totalQuantity - stockInfo.availableStock : 0;

  useEffect(() => {
    loadStockInfo();
  }, []);

  const loadStockInfo = async () => {
    setLoadingStock(true);
    const result = await getAvailableStockForProduct(productId);
    if (result.success) {
      setStockInfo(result.data);
    }
    setLoadingStock(false);
  };

  const handleSubmit = () => {
    setMessage("");

    if (!hasEnoughStock) {
      setMessage(
        `❌ Insufficient stock. Shortfall: ${shortfall}L. Please restock first.`,
      );
      return;
    }

    startTransition(async () => {
      const result = await acceptOrderAction(orderId, totalQuantity);

      if (result.success) {
        setMessage("✅ Order accepted successfully!");
        router.refresh();
        setTimeout(() => onClose(), 800);
      } else {
        setMessage(result.message || "❌ Failed to accept order.");
      }
    });
  };

  return (
    <BaseModal open={open} onClose={onClose}>
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800">Accept Order</h3>

        {/* Stock Information */}
        <div className="bg-gray-50 p-4 rounded-lg space-y-2">
          <p className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <Package size={16} />
            Stock Availability Check
          </p>

          {loadingStock ? (
            <div className="flex justify-center py-2">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
            </div>
          ) : stockInfo ? (
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Order Required:</span>
                <span className="font-semibold">{totalQuantity}L</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Tanker Stock:</span>
                <span className="font-semibold">
                  {stockInfo.totalTankerStock.toLocaleString()}L
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Already Accepted:</span>
                <span className="font-semibold text-blue-600">
                  {stockInfo.totalAccepted.toLocaleString()}L
                </span>
              </div>
              <div className="flex justify-between border-t border-gray-200 pt-2">
                <span className="text-gray-600">Available Stock:</span>
                <span
                  className={`font-semibold ${hasEnoughStock ? "text-green-600" : "text-red-600"}`}
                >
                  {stockInfo.availableStock.toLocaleString()}L
                </span>
              </div>
              {!hasEnoughStock && (
                <div className="flex justify-between text-red-600">
                  <span>Shortfall:</span>
                  <span className="font-semibold">{shortfall}L</span>
                </div>
              )}
            </div>
          ) : (
            <p className="text-sm text-red-600">
              Failed to load stock information
            </p>
          )}
        </div>

        {/* Warning for insufficient stock */}
        {!hasEnoughStock && stockInfo && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
            <AlertTriangle size={16} className="text-red-500 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-red-700">
                Insufficient Stock Available
              </p>
              <p className="text-xs text-red-600 mt-1">
                This order requires {totalQuantity}L but only{" "}
                {stockInfo.availableStock}L is available. Please restock{" "}
                {shortfall}L before accepting this order.
              </p>
            </div>
          </div>
        )}

        {/* Success message for sufficient stock */}
        {hasEnoughStock && stockInfo && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg flex items-start gap-2">
            <Check size={16} className="text-green-500 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-green-700">
                Sufficient Stock Available
              </p>
              <p className="text-xs text-green-600 mt-1">
                After accepting this order,{" "}
                {stockInfo.availableStock - totalQuantity}L will remain
                available.
              </p>
            </div>
          </div>
        )}

        <p className="text-sm text-gray-600">
          Are you sure you want to accept this order?
        </p>

        {message && (
          <p
            className={`text-xs p-2 rounded ${
              message.includes("✅")
                ? "text-green-600 bg-green-50"
                : message.includes("❌")
                  ? "text-red-600 bg-red-50"
                  : "text-gray-500"
            }`}
          >
            {message}
          </p>
        )}

        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm border border-gray-300 rounded-md text-gray-600 hover:bg-gray-100"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            disabled={isPending || !hasEnoughStock || loadingStock}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium text-white rounded-md ${
              isPending || !hasEnoughStock || loadingStock
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700"
            }`}
          >
            {isPending ? "Processing..." : "Accept Order"}
            <Check size={16} />
          </button>
        </div>
      </div>
    </BaseModal>
  );
}
