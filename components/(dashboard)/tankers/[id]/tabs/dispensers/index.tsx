"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Fuel, Plus, ArrowRightLeft, AlertCircle } from "lucide-react";
import Link from "next/link";
import { TransferToDispenserModal } from "./transfer-modal";
import { ConnectDispenserModal } from "./connect-dispenser-modal";

interface ConnectedDispenser {
  id: string;
  name: string;
  currentStock: number;
  isPublished: boolean;
}

export function DispensersTab({
  tankerId,
  connectedDispensers,
  tankerStock,
}: {
  tankerId: string;
  connectedDispensers: ConnectedDispenser[];
  tankerStock: number;
}) {
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [selectedDispenser, setSelectedDispenser] =
    useState<ConnectedDispenser | null>(null);

  const totalConnectedStock = connectedDispensers.reduce(
    (sum, d) => sum + d.currentStock,
    0,
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-sm font-medium text-gray-700">
            Connected Dispensers
          </h3>
          <p className="text-xs text-gray-500 mt-1">
            Total stock in dispensers: {totalConnectedStock}L
          </p>
        </div>
        <button
          onClick={() => setShowConnectModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition"
        >
          <Plus size={16} />
          Connect Dispenser
        </button>
      </div>

      {/* Dispenser List */}
      {connectedDispensers.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <Fuel size={32} className="mx-auto text-gray-400 mb-2" />
          <p className="text-sm text-gray-500">
            No dispensers connected to this tanker
          </p>
          <button
            onClick={() => setShowConnectModal(true)}
            className="mt-2 text-sm text-blue-600 hover:text-blue-700"
          >
            Connect your first dispenser
          </button>
        </div>
      ) : (
        <div className="grid gap-4">
          {connectedDispensers.map((dispenser) => (
            <motion.div
              key={dispenser.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition"
            >
              <div className="flex justify-between items-start">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                    <Fuel size={20} className="text-gray-500" />
                  </div>
                  <div>
                    <Link
                      href={`/dispensers/${dispenser.id}`}
                      className="font-medium text-gray-800 hover:text-blue-600 transition"
                    >
                      {dispenser.name}
                    </Link>
                    <p className="text-sm text-gray-500">
                      Current Stock: {dispenser.currentStock}L
                    </p>
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
                    onClick={() => {
                      setSelectedDispenser(dispenser);
                      setShowTransferModal(true);
                    }}
                    disabled={tankerStock <= 0}
                    className={`flex items-center gap-1 px-3 py-1.5 text-sm rounded-lg transition ${
                      tankerStock > 0
                        ? "bg-blue-50 text-blue-600 hover:bg-blue-100"
                        : "bg-gray-100 text-gray-400 cursor-not-allowed"
                    }`}
                  >
                    <ArrowRightLeft size={14} />
                    ArrowRightLeft
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Warning when tanker is empty */}
      {tankerStock <= 0 && connectedDispensers.length > 0 && (
        <div className="flex items-center gap-2 p-3 bg-yellow-50 rounded-lg">
          <AlertCircle size={16} className="text-yellow-500" />
          <p className="text-xs text-yellow-700">
            Tanker is empty. Please restock before transferring to dispensers.
          </p>
        </div>
      )}

      {/* Modals */}
      <TransferToDispenserModal
        open={showTransferModal}
        onClose={() => {
          setShowTransferModal(false);
          setSelectedDispenser(null);
        }}
        tankerId={tankerId}
        dispenserId={selectedDispenser?.id || ""}
        dispenserName={selectedDispenser?.name || ""}
        currentTankerStock={tankerStock}
      />

      <ConnectDispenserModal
        open={showConnectModal}
        onClose={() => setShowConnectModal(false)}
        tankerId={tankerId}
      />
    </div>
  );
}
