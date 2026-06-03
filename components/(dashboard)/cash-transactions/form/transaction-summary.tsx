"use client";

import { useState, useEffect } from "react";
import { AlertCircle } from "lucide-react";
import { getProductById } from "@/data/product";
import { getAvailableStockForProduct } from "@/data/order";

interface TransactionSummaryProps {
  productId: string;
  litresPurchased: number;
  stateMessage?: string;
}

export function TransactionSummary({
  productId,
  litresPurchased,
  stateMessage,
}: TransactionSummaryProps) {
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [availableStock, setAvailableStock] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (productId) {
      loadProductDetails();
      fetchAvailableStock();
    }
  }, [productId]);

  const loadProductDetails = async () => {
    const resProducts = await getProductById(productId);
    if (resProducts.success && resProducts.data) {
      const product = resProducts.data;
      setSelectedProduct(product);
    }
  };

  const fetchAvailableStock = async () => {
    setLoading(true);
    try {
      // Use the data function instead of fetch
      const result = await getAvailableStockForProduct(productId);
      if (result.success && result.data) {
        setAvailableStock(result.data.availableStock);
      }
    } catch (error) {
      console.error("Failed to fetch available stock:", error);
    } finally {
      setLoading(false);
    }
  };

  const calculatedTotal =
    litresPurchased *
    ((selectedProduct?.grid || 0) + (selectedProduct?.discount || 0));

  if (!selectedProduct || litresPurchased === 0) return null;

  const hasEnoughStock =
    availableStock !== null && litresPurchased <= availableStock;

  return (
    <div className="bg-blue-50 p-4 rounded-lg space-y-2">
      <h3 className="text-sm font-medium text-blue-800">Transaction Summary</h3>
      <div className="flex justify-between text-sm">
        <span>Price per Litre:</span>
        <span className="font-medium">
          R{" "}
          {(
            (selectedProduct.grid || 0) + (selectedProduct.discount || 0)
          ).toFixed(2)}
        </span>
      </div>
      <div className="flex justify-between text-sm">
        <span>Litres:</span>
        <span className="font-medium">{litresPurchased}L</span>
      </div>
      <div className="flex justify-between text-base font-semibold border-t border-blue-200 pt-2">
        <span>Total Amount:</span>
        <span className="text-green-600">R {calculatedTotal.toFixed(2)}</span>
      </div>

      {availableStock !== null && !hasEnoughStock && (
        <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded flex items-start gap-2">
          <AlertCircle size={14} className="text-red-600 mt-0.5" />
          <p className="text-xs text-red-700">
            Insufficient available stock! Available for sale:{" "}
            {availableStock.toLocaleString()}L
          </p>
        </div>
      )}
      {availableStock !== null && hasEnoughStock && (
        <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded flex items-start gap-2">
          <p className="text-xs text-green-700">
            ✓ Stock available. After sale,{" "}
            {Math.max(0, availableStock - litresPurchased).toLocaleString()}L
            will remain.
          </p>
        </div>
      )}

      {stateMessage && (
        <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded flex items-start gap-2">
          <AlertCircle size={14} className="text-red-600 mt-0.5" />
          <p className="text-xs text-red-700">{stateMessage}</p>
        </div>
      )}
    </div>
  );
}
