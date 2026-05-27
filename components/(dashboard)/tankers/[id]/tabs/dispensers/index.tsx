"use client";

import { useState, useCallback, useEffect } from "react";
import { Plus } from "lucide-react";
import { ConnectDispenserModal } from "./connect-dispenser-modal";
import { DispenserList } from "./list";
import { EmptyDispensersState } from "./empty-state";

interface ConnectedDispenser {
  id: string;
  name: string;
  currentStock: number;
  isPublished: boolean;
}

interface DispensersTabProps {
  tankerId: string;
  connectedDispensers: ConnectedDispenser[];
  tankerStock: number;
  onRefresh: () => void;
}

export function DispensersTab({
  tankerId,
  connectedDispensers,
  tankerStock,
  onRefresh,
}: DispensersTabProps) {
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [modalKey, setModalKey] = useState(0);

  const totalConnectedStock = connectedDispensers.reduce(
    (sum, d) => sum + d.currentStock,
    0,
  );

  const handleConnectSuccess = useCallback(() => {
    setShowConnectModal(false);
    // Refresh the data
    onRefresh();
    // Increment key to force modal remount on next open
    setModalKey((prev) => prev + 1);
  }, [onRefresh]);

  const handleOpenModal = useCallback(() => {
    setShowConnectModal(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setShowConnectModal(false);
  }, []);

  // Reset modal key when component unmounts
  useEffect(() => {
    return () => {
      setModalKey(0);
    };
  }, []);

  return (
    <div className="space-y-6">
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
          onClick={handleOpenModal}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition"
        >
          <Plus size={16} />
          Connect Dispenser
        </button>
      </div>

      {connectedDispensers.length === 0 ? (
        <EmptyDispensersState onConnect={handleOpenModal} />
      ) : (
        <DispenserList
          dispensers={connectedDispensers}
          tankerId={tankerId}
          tankerStock={tankerStock}
          onRefresh={onRefresh}
        />
      )}

      <ConnectDispenserModal
        key={modalKey}
        open={showConnectModal}
        onClose={handleCloseModal}
        onSuccess={handleConnectSuccess}
        tankerId={tankerId}
      />
    </div>
  );
}
