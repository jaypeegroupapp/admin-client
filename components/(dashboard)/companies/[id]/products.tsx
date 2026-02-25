"use client";

import { motion } from "framer-motion";
import { Package, Edit } from "lucide-react";
import { useState } from "react";
import { UpdateDiscountModal } from "./order-discount-modal";

interface Props {
  products: any[];
  discountAmount: number;
  isGridPlus: boolean;
  companyId: string;
}

export function CompanyProductsTab({
  products,
  discountAmount,
  isGridPlus,
  companyId,
}: Props) {
  const [showModal, setShowModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);

  const priceAdjustment = isGridPlus ? discountAmount : -discountAmount;

  return (
    <>
      <motion.div
        key="products"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <Package size={16} className="text-gray-500" />
            Product Prices
          </h3>

          <button
            onClick={() => {
              setSelectedOrder(null);
              setShowModal(true);
            }}
            className="flex items-center gap-2 rounded-lg p-2 text-sm font-medium bg-gray-900 text-white hover:bg-gray-700 transition"
          >
            <Edit size={16} />
            <span className="hidden md:block">Update Price</span>
          </button>
        </div>

        {products.length === 0 ? (
          <p className="text-sm text-gray-500">No products available.</p>
        ) : (
          <div className="divide-y divide-gray-200">
            {products.map((product) => (
              <div
                key={product.id}
                className="flex items-center justify-between py-3"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
                    <Package size={18} />
                  </div>

                  <div>
                    <p className="text-gray-800 text-sm font-medium">
                      {product.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {product.description}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-700">
                    R {(product.sellingPrice + priceAdjustment).toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>

      {showModal && (
        <UpdateDiscountModal
          companyId={companyId}
          discountAmount={discountAmount}
          isGridPlus={isGridPlus}
          open={showModal}
          onClose={() => {
            setShowModal(false);
            setSelectedOrder(null);
          }}
        />
      )}
    </>
  );
}
