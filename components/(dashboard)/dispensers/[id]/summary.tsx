// src/components/(dashboard)/dispensers/[id]/summary.tsx
"use client";

import { Droplet, Package, User, Calendar, Activity, TrendingUp } from "lucide-react";
import { useState } from "react";
import { IDispenser } from "@/definitions/dispenser";
import { IProduct } from "@/definitions/product";
import { EnableDisableDispenserModal } from "./enable-disable-modal";

export function DispenserSummary({
  dispenser,
  totalUsage,
  product,
}: {
  dispenser: IDispenser;
  totalUsage: number;
  product: IProduct | null;
}) {
  const [modalOpen, setModalOpen] = useState(false);

  const handleToggle = () => {
    setModalOpen(true);
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-4">
      {/* ICON + DETAILS */}
      <div className="flex items-start gap-4">
        <div className="w-16 h-16 bg-blue-50 rounded-lg flex items-center justify-center text-blue-500">
          <Droplet size={32} />
        </div>

        <div className="flex justify-between flex-1 items-start">
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-gray-800">
              {dispenser.name}
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Capacity: <span className="font-medium">{dispenser.litres ?? 0}L</span>
            </p>

            <p className="text-sm text-gray-500 mt-2">
              Created on{" "}
              {new Date(dispenser.createdAt!).toLocaleDateString("en-ZA")}
            </p>
          </div>

          {/* STATUS + SWITCH */}
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600">
              Status:{" "}
              <strong
                className={
                  dispenser.isPublished ? "text-green-600" : "text-red-600"
                }
              >
                {dispenser.isPublished ? "Active" : "Inactive"}
              </strong>
            </span>

            {/* TOGGLE SWITCH */}
            <div
              onClick={handleToggle}
              className={`relative inline-flex h-6 w-12 cursor-pointer rounded-full transition
                ${dispenser.isPublished ? "bg-green-500" : "bg-gray-300"}`}
            >
              <span
                className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform
                  ${dispenser.isPublished ? "translate-x-6" : "translate-x-1"}`}
              ></span>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-200 my-4" />

      {/* DISPENSER DETAILS GRID */}
      <div className="grid grid-cols-2 gap-4 text-sm text-gray-700">
        <div className="flex items-center gap-2">
          <Package size={16} className="text-gray-500" />
          <span>Product: {product?.name || "N/A"}</span>
        </div>
        <div className="flex items-center gap-2">
          <Activity size={16} className="text-gray-500" />
          <span>Total Usage: {totalUsage}L</span>
        </div>
        <div className="flex items-center gap-2">
          <TrendingUp size={16} className="text-gray-500" />
          <span>Remaining: {((dispenser.litres ?? 0) - totalUsage).toFixed(1)}L</span>
        </div>
        <div className="flex items-center gap-2">
          <User size={16} className="text-gray-500" />
          <span>Assigned User: {dispenser.userId ? "Yes" : "No"}</span>
        </div>
        <div className="flex items-center gap-2">
          <Calendar size={16} className="text-gray-500" />
          <span>Last Updated: {new Date(dispenser.updatedAt!).toLocaleDateString("en-ZA")}</span>
        </div>
      </div>

      {/* USAGE PROGRESS BAR */}
      <div className="mt-4">
        <div className="flex justify-between text-xs text-gray-500 mb-1">
          <span>Usage Progress</span>
          <span>{Math.min(100, Math.round((totalUsage / (dispenser.litres || 1)) * 100))}%</span>
        </div>
        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-blue-500 rounded-full"
            style={{ 
              width: `${Math.min(100, (totalUsage / (dispenser.litres || 1)) * 100)}%` 
            }}
          />
        </div>
      </div>

      {/* ENABLE/DISABLE MODAL */}
      <EnableDisableDispenserModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        dispenserId={dispenser.id!}
        currentState={dispenser.isPublished!}
      />
    </div>
  );
}