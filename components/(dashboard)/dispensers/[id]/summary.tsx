"use client";

import {
  Droplet,
  Package,
  User,
  Calendar,
  Activity,
  Gauge,
} from "lucide-react";
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
              Meter Type: <span className="font-medium">Flow Meter</span>
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
          <span>Total Dispensed: {totalUsage.toLocaleString()}L</span>
        </div>
        <div className="flex items-center gap-2">
          <Gauge size={16} className="text-gray-500" />
          <span>
            Current Meter Reading:{" "}
            {dispenser.totalDispensed?.toLocaleString() ?? 0}L
          </span>
        </div>
        <div className="flex items-center gap-2">
          <User size={16} className="text-gray-500" />
          <span>Assigned Attendant: {dispenser.userId ? "Yes" : "No"}</span>
        </div>
        <div className="flex items-center gap-2">
          <Calendar size={16} className="text-gray-500" />
          <span>
            Last Updated:{" "}
            {new Date(dispenser.updatedAt!).toLocaleDateString("en-ZA")}
          </span>
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
