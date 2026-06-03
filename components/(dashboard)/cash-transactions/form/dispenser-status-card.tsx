"use client";

import { useState, useEffect } from "react";
import { AlertCircle, Droplet, Fuel, Layers } from "lucide-react";
import { getAvailableStockForProduct } from "@/data/order";

export function DispenserStatusCard({
  userDispenser,
}: {
  userDispenser?: any;
}) {
  const [availableStock, setAvailableStock] = useState<number | null>(null);
  const [checkingStock, setCheckingStock] = useState(false);

  useEffect(() => {
    if (userDispenser?.dispenser?.productId) {
      fetchAvailableStock();
    }
  }, [userDispenser]);

  const fetchAvailableStock = async () => {
    if (!userDispenser?.dispenser?.productId) return;

    setCheckingStock(true);
    try {
      // Use the data function instead of fetch
      const result = await getAvailableStockForProduct(
        userDispenser.dispenser.productId,
      );
      if (result.success && result.data) {
        setAvailableStock(result.data.availableStock);
      }
    } catch (error) {
      console.error("Failed to fetch available stock:", error);
    } finally {
      setCheckingStock(false);
    }
  };

  if (!userDispenser) return null;

  if (!userDispenser.attendance) {
    return (
      <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start gap-2">
        <AlertCircle size={16} className="text-yellow-600 mt-0.5" />
        <p className="text-sm text-yellow-700">
          You are not logged into your dispenser. Please log in first.
        </p>
      </div>
    );
  }

  return (
    <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg space-y-2">
      <div className="flex items-center gap-2">
        <Droplet size={16} className="text-green-600" />
        <span className="font-medium text-green-800">Dispenser:</span>
        <span className="text-sm text-green-700">
          {userDispenser.dispenser.name}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <Fuel size={16} className="text-green-600" />
        <span className="font-medium text-green-800">Tanker:</span>
        <span className="text-sm text-green-700">
          {userDispenser.tankerName || "N/A"}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <Layers size={16} className="text-green-600" />
        <span className="font-medium text-green-800">Available for Sale:</span>
        <span
          className={`text-sm font-bold ${availableStock !== null && availableStock < 100 ? "text-red-600" : "text-green-700"}`}
        >
          {checkingStock
            ? "Loading..."
            : availableStock !== null
              ? `${availableStock.toLocaleString()}L`
              : "N/A"}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <span className="font-medium text-green-800">Attendant:</span>
        <span className="text-sm text-green-700">
          {userDispenser.attendance.attendantName || "Unknown"}
        </span>
      </div>
    </div>
  );
}
