"use client";

import { useState, useEffect } from "react";
import { AlertCircle, Droplet, Fuel, Layers, User, UserX } from "lucide-react";
import { getAvailableStockForProduct } from "@/data/order";

export function DispenserStatusCard({
  userDispenser,
}: {
  userDispenser?: any;
}) {
  const [availableStock, setAvailableStock] = useState<number | null>(null);
  const [checkingStock, setCheckingStock] = useState(false);

  const hasDispenser = !!userDispenser?.dispenser;
  const hasAttendance = !!userDispenser?.attendance;
  const hasTanker = !!userDispenser?.tankerName;
  const tankerName = userDispenser?.tankerName || "N/A";
  const dispenserName = userDispenser?.dispenser?.name;
  const attendantName = userDispenser?.attendance?.name;

  useEffect(() => {
    if (hasDispenser && hasTanker && userDispenser?.dispenser?.productId) {
      fetchAvailableStock();
    }
  }, [userDispenser, hasDispenser, hasTanker]);

  const fetchAvailableStock = async () => {
    if (!userDispenser?.dispenser?.productId) return;

    setCheckingStock(true);
    try {
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

  // No user dispenser at all
  if (!userDispenser) {
    return (
      <div className="mb-4 p-3 bg-gray-50 border border-gray-200 rounded-lg">
        <div className="flex items-center gap-2">
          <AlertCircle size={16} className="text-gray-500" />
          <p className="text-sm text-gray-600">
            No dispenser information available
          </p>
        </div>
      </div>
    );
  }

  // Has dispenser but no active shift
  if (hasDispenser && !hasAttendance) {
    return (
      <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg space-y-2">
        <div className="flex items-center gap-2">
          <Droplet size={16} className="text-yellow-600" />
          <span className="font-medium text-yellow-800">Dispenser:</span>
          <span className="text-sm text-yellow-700">{dispenserName}</span>
        </div>
        <div className="flex items-center gap-2 mt-2 p-2 bg-yellow-100 rounded-lg">
          <UserX size={16} className="text-yellow-600" />
          <div>
            <p className="text-sm font-medium text-yellow-800">
              No Active Shift
            </p>
            <p className="text-xs text-yellow-700">
              You are assigned to this dispenser but not logged in. Please start
              your shift first.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Has dispenser and active shift, but no tanker connected
  if (hasDispenser && hasAttendance && !hasTanker) {
    return (
      <div className="mb-4 p-3 bg-orange-50 border border-orange-200 rounded-lg space-y-2">
        <div className="flex items-center gap-2">
          <Droplet size={16} className="text-orange-600" />
          <span className="font-medium text-orange-800">Dispenser:</span>
          <span className="text-sm text-orange-700">{dispenserName}</span>
        </div>
        <div className="flex items-center gap-2">
          <User size={16} className="text-orange-600" />
          <span className="font-medium text-orange-800">Attendant:</span>
          <span className="text-sm text-orange-700">
            {attendantName || "Unknown"}
          </span>
        </div>
        <div className="flex items-center gap-2 mt-2 p-2 bg-orange-100 rounded-lg">
          <Fuel size={16} className="text-orange-600" />
          <div>
            <p className="text-sm font-medium text-orange-800">
              No Tanker Connected
            </p>
            <p className="text-xs text-orange-700">
              This dispenser has no tanker connected. Please contact your
              manager.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Full information - has dispenser, active shift, and tanker
  const lowStock = availableStock !== null && availableStock < 100;

  return (
    <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg space-y-2">
      <div className="flex items-center gap-2">
        <Droplet size={16} className="text-green-600" />
        <span className="font-medium text-green-800">Dispenser:</span>
        <span className="text-sm text-green-700">{dispenserName}</span>
      </div>
      <div className="flex items-center gap-2">
        <User size={16} className="text-green-600" />
        <span className="font-medium text-green-800">Attendant:</span>
        <span className="text-sm text-green-700">
          {attendantName || "Unknown"}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <Fuel size={16} className="text-green-600" />
        <span className="font-medium text-green-800">Tanker:</span>
        <span className="text-sm text-green-700">{tankerName}</span>
      </div>
      <div className="flex items-center gap-2">
        <Layers size={16} className="text-green-600" />
        <span className="font-medium text-green-800">Available for Sale:</span>
        <span
          className={`text-sm font-bold ${lowStock ? "text-red-600" : "text-green-700"}`}
        >
          {checkingStock
            ? "Loading..."
            : availableStock !== null
              ? `${availableStock.toLocaleString()}L`
              : "N/A"}
        </span>
      </div>
      {lowStock && availableStock !== null && (
        <div className="mt-2 p-2 bg-red-100 rounded-lg flex items-center gap-2">
          <AlertCircle size={14} className="text-red-600" />
          <p className="text-xs text-red-700">
            Low stock alert! Only {availableStock.toLocaleString()}L available
            for sale.
          </p>
        </div>
      )}
    </div>
  );
}
