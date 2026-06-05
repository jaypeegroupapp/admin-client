"use client";

import { useEffect, useState } from "react";
import { Droplet, User, AlertCircle, Gauge, Fuel, Layers } from "lucide-react";
import { getAvailableStockForProduct } from "@/data/order";

interface DispenserInfoHeaderProps {
  dispenser: any;
  attendance: any;
  tankerStock?: number;
  tankerName?: string;
  showAvailableStock?: boolean; // For cash transactions page
}

export function DispenserInfoHeader({
  dispenser,
  attendance,
  tankerStock,
  tankerName,
  showAvailableStock = false,
}: DispenserInfoHeaderProps) {
  const [mounted, setMounted] = useState(false);
  const [availableStock, setAvailableStock] = useState<number | null>(null);
  const [checkingStock, setCheckingStock] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (showAvailableStock && dispenser?.productId) {
      fetchAvailableStock();
    }
  }, [showAvailableStock, dispenser?.productId]);

  const fetchAvailableStock = async () => {
    if (!dispenser?.productId) return;

    setCheckingStock(true);
    try {
      const result = await getAvailableStockForProduct(dispenser.productId);
      if (result.success && result.data) {
        setAvailableStock(result.data.availableStock);
      }
    } catch (error) {
      console.error("Failed to fetch available stock:", error);
    } finally {
      setCheckingStock(false);
    }
  };

  const formatTime = (dateString: string) => {
    if (!mounted) return "--:--:--";
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-ZA", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
  };

  const totalDispensed = dispenser.totalDispensed || 0;
  const hasAttendance = !!attendance;
  const openingBalance = attendance?.openingBalance || 0;
  const totalDispensedShift = attendance?.totalDispensed || 0;

  // Calculate progress percentage
  const progressPercentage =
    openingBalance > 0
      ? Math.min(100, Math.round((totalDispensedShift / openingBalance) * 100))
      : 0;

  // Determine stock display and low stock status
  const displayStock = showAvailableStock ? availableStock : tankerStock;
  const stockLabel = showAvailableStock
    ? "Available for Sale"
    : `Tanker: ${tankerName || "N/A"}`;
  const stockIcon = showAvailableStock ? (
    <Layers size={12} />
  ) : (
    <Fuel size={12} />
  );
  const lowStock =
    displayStock !== null && displayStock !== undefined && displayStock < 100;

  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4 shadow-sm">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Dispenser Info */}
        <div className="flex items-start gap-3">
          <div className="bg-blue-100 p-2 rounded-lg">
            <Droplet className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-800">
              {dispenser.name}
            </h2>
            <p className="text-sm text-gray-600">
              Product: {dispenser.productId?.name || "Diesel"}
            </p>
          </div>
        </div>

        {/* Stock Info - Either Available for Sale or Tanker Stock */}
        {displayStock !== undefined && displayStock !== null && (
          <div className="flex items-center gap-6">
            <div className="text-right">
              <p className="text-xs text-gray-500 flex items-center gap-1">
                {stockIcon} {stockLabel}
              </p>
              <div className="flex items-center gap-2">
                <span
                  className={`text-2xl font-bold ${
                    lowStock ? "text-red-600" : "text-green-600"
                  }`}
                >
                  {checkingStock ? "..." : `${displayStock.toLocaleString()}L`}
                </span>
                {lowStock && (
                  <span className="flex items-center gap-1 text-xs text-red-600 bg-red-50 px-2 py-1 rounded-full">
                    <AlertCircle size={12} />
                    Low Stock
                  </span>
                )}
              </div>
              {showAvailableStock && (
                <p className="text-xs text-gray-400 mt-1">
                  Physical Stock - Reserved Orders
                </p>
              )}
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500 flex items-center gap-1">
                <Gauge size={12} /> Meter Reading
              </p>
              <p className="text-xl font-semibold text-blue-600">
                {totalDispensed.toLocaleString()}L
              </p>
            </div>
          </div>
        )}

        {/* Attendance Info */}
        {hasAttendance && (
          <div className="flex items-center gap-4 bg-white px-4 py-2 rounded-lg">
            <User size={18} className="text-gray-500" />
            <div>
              <p className="text-xs text-gray-500">Your Shift</p>
              <p className="text-sm font-medium">
                Opened: {formatTime(attendance.loginTime)}
              </p>
              <p className="text-xs text-gray-600">
                Opening Meter: {openingBalance.toLocaleString()}L | Dispensed:{" "}
                {totalDispensedShift}L
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Shift Meter Progress Bar - Aligned for both pages */}
      {hasAttendance && openingBalance > 0 && mounted && (
        <div className="mt-3">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>Shift Meter Progress</span>
            <span>{progressPercentage}% of opening meter</span>
          </div>
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 rounded-full transition-all"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>0L</span>
            <span>Opening: {openingBalance.toLocaleString()}L</span>
            <span>Dispensed: {totalDispensedShift}L</span>
          </div>
        </div>
      )}
    </div>
  );
}
