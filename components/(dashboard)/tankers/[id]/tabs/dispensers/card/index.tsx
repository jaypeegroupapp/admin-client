"use client";

import { useState } from "react";
import Link from "next/link";
import { Fuel, ExternalLink, AlertCircle } from "lucide-react";
import { TransferToDispenserModal } from "../transfer-modal";
import { DisconnectDispenserModal } from "./disconnect-modal";
import { StockIndicator } from "./stock-indicator";

interface DispenserCardProps {
  dispenser: any;
  tankerId: string;
  tankerStock: number;
  onRefresh: () => void;
}

export function DispenserCard({
  dispenser,
  tankerId,
  tankerStock,
  onRefresh,
}: DispenserCardProps) {
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [showDisconnectModal, setShowDisconnectModal] = useState(false);

  const handleDisconnectSuccess = () => {
    // Close disconnect modal first
    setShowDisconnectModal(false);
    // Then refresh the parent data
    onRefresh();
  };

  const handleTransferSuccess = () => {
    setShowTransferModal(false);
    onRefresh();
  };

  return (
    <>
      <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
        <div className="flex justify-between items-start">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
              <Fuel size={20} className="text-gray-500" />
            </div>
            <div>
              <Link
                href={`/dispensers/${dispenser.id}`}
                className="font-medium text-gray-800 hover:text-blue-600 transition flex items-center gap-1"
              >
                {dispenser.name}
                <ExternalLink size={12} />
              </Link>
              <StockIndicator currentStock={dispenser.currentStock} />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`px-2 py-1 text-xs rounded-full ${
                dispenser.isPublished
                  ? "bg-green-100 text-green-700"
                  : "bg-gray-100 text-gray-500"
              }`}
            >
              {dispenser.isPublished ? "Active" : "Inactive"}
            </span>
            <button
              onClick={() => setShowDisconnectModal(true)}
              className="text-xs text-red-600 hover:text-red-700 px-2 py-1"
            >
              Disconnect
            </button>
          </div>
        </div>

        <div className="flex justify-end mt-3">
          <button
            onClick={() => setShowTransferModal(true)}
            disabled={tankerStock <= 0}
            className={`flex items-center gap-2 px-3 py-1.5 text-sm rounded-lg transition ${
              tankerStock > 0
                ? "bg-blue-50 text-blue-600 hover:bg-blue-100"
                : "bg-gray-100 text-gray-400 cursor-not-allowed"
            }`}
          >
            Transfer Product
          </button>
        </div>

        {tankerStock <= 0 && (
          <div className="flex items-center gap-2 mt-2 p-2 bg-yellow-50 rounded">
            <AlertCircle size={14} className="text-yellow-500" />
            <p className="text-xs text-yellow-600">
              Tanker is empty. Please restock before transferring.
            </p>
          </div>
        )}
      </div>

      <TransferToDispenserModal
        open={showTransferModal}
        onClose={handleTransferSuccess}
        tankerId={tankerId}
        dispenserId={dispenser.id}
        dispenserName={dispenser.name}
        currentTankerStock={tankerStock}
      />

      <DisconnectDispenserModal
        open={showDisconnectModal}
        onClose={() => setShowDisconnectModal(false)}
        onSuccess={handleDisconnectSuccess}
        tankerId={tankerId}
        dispenserId={dispenser.id}
        dispenserName={dispenser.name}
      />
    </>
  );
}
