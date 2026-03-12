// src/components/(dashboard)/truck-orders/dispenser-info-header.tsx
"use client";
import { Droplet, User, AlertCircle } from "lucide-react";

export function DispenserInfoHeader({
  dispenser,
  attendance,
}: {
  dispenser: any;
  attendance: any;
}) {
  const remainingLitres = dispenser.litres || 0;
  const lowStock = remainingLitres < 100; // Threshold for low stock warning

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

        {/* Stock Info */}
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-xs text-gray-500">Current Stock</p>
            <div className="flex items-center gap-2">
              <span
                className={`text-2xl font-bold ${lowStock ? "text-red-600" : "text-green-600"}`}
              >
                {remainingLitres}L
              </span>
              {lowStock && (
                <span className="flex items-center gap-1 text-xs text-red-600 bg-red-50 px-2 py-1 rounded-full">
                  <AlertCircle size={12} />
                  Low Stock
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Attendance Info */}
        {attendance && (
          <div className="flex items-center gap-4 bg-white px-4 py-2 rounded-lg">
            <User size={18} className="text-gray-500" />
            <div>
              <p className="text-xs text-gray-500">Your Shift</p>
              <p className="text-sm font-medium">
                Opened: {new Date(attendance.loginTime).toLocaleTimeString()}
              </p>
              <p className="text-xs text-gray-600">
                Opening: {attendance.openingBalance}L | Sold:{" "}
                {attendance.totalDispensed}L
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Progress Bar */}
      {attendance && attendance.openingBalance > 0 && (
        <div className="mt-3">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>Shift Progress</span>
            <span>
              {Math.min(
                100,
                Math.round(
                  (attendance.totalDispensed / attendance.openingBalance) * 100,
                ),
              )}
              % used
            </span>
          </div>
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 rounded-full"
              style={{
                width: `${Math.min(100, (attendance.totalDispensed / attendance.openingBalance) * 100)}%`,
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
