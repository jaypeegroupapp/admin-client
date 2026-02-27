"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus, Package } from "lucide-react";
import { getStockMovementsByProductId } from "@/data/stock-movement";
import { AddStockModal } from "./add-stock-modal";
import { ADDEDSTOCK } from "@/constants/stock-movement";

export function InventoryTab({ productId }: { productId: string }) {
  const [movements, setMovements] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);

  const loadMovements = async () => {
    const res = await getStockMovementsByProductId(productId);
    setMovements(res || []);
  };

  useEffect(() => {
    loadMovements();
  }, [productId]);

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-medium text-gray-700 flex items-center gap-2">
          <Package size={16} className="text-gray-500" />
          Inventory Movements
        </h3>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 rounded-lg p-2 text-sm font-medium bg-gray-900 text-white hover:bg-gray-700 transition"
        >
          <Plus size={16} />
          <span className="hidden md:block">Add Stock</span>
        </button>
      </div>

      {movements.length === 0 ? (
        <p className="text-sm text-gray-500">No stock movements yet.</p>
      ) : (
        <div className="divide-y divide-gray-200">
          {movements.map((m) => (
            <div key={m.id} className="py-3 flex justify-between items-start">
              {/* LEFT SIDE */}
              <div>
                <p className="text-sm font-medium text-gray-800">
                  {m.type === ADDEDSTOCK ? "Stock Added" : "Stock Removed"}
                </p>

                <p className="text-xs text-gray-500 mb-1">
                  {new Date(m.createdAt).toLocaleDateString("en-ZA")} • Qty:{" "}
                  {m.quantity}
                  {/* Prices */}
                  {m.purchasePrice !== undefined && <> • Purchase Price: R{}</>}
                  {m.gridAtPurchase !== undefined && (
                    <> • Grid Then: R{m.gridAtPurchase.toFixed(2)}</>
                  )}
                </p>

                {/* Optional Reason */}
                {m.reason && (
                  <p className="text-xs text-gray-500 italic mt-1">
                    Reason: {m.reason}
                  </p>
                )}
              </div>

              {/* RIGHT SIDE: TYPE BADGE */}
              <span
                className={`px-2 py-1 text-xs rounded-md ${
                  m.type === ADDEDSTOCK
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {m.type}
              </span>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <AddStockModal
          productId={productId}
          open={showModal}
          onClose={() => {
            setShowModal(false);
            loadMovements();
          }}
        />
      )}
    </>
  );
}
