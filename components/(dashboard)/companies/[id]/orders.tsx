"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Package, ChevronRight, Edit } from "lucide-react";
import { motion } from "framer-motion";

import { getOrdersByCompanyId } from "@/data/order";
import { UpdateDiscountModal } from "./order-discount-modal";

export function CompanyOrdersTab({ companyId, discountAmount }: { companyId: string, discountAmount: number }) {
  const [orders, setOrders] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);

  const loadOrders = async () => {
    try {
      const res = await getOrdersByCompanyId(companyId);
      setOrders(res || []);
    } catch (e) {
      console.error("Failed to fetch orders", e);
    }
  };

  useEffect(() => {
    loadOrders();
  }, [companyId]);

  return (
    <>
      <motion.div
        key="orders"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <Package size={16} className="text-gray-500" />
            Orders
          </h3>

          <button
            onClick={() => {
              setSelectedOrder(null);
              setShowModal(true);
            }}
            className="flex items-center gap-2 rounded-lg p-2 text-sm font-medium bg-gray-900 text-white hover:bg-gray-700 transition"
          >
            <Edit size={16} />
            <span className="hidden md:block">Update Discount</span>
          </button>
        </div>

        {orders.length === 0 ? (
          <p className="text-sm text-gray-500">No orders yet.</p>
        ) : (
          <div className="divide-y divide-gray-200">
            {orders.map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between py-3"
              >
                <Link
                  href={`/orders/${order.id}`}
                  className="flex items-center gap-3"
                >
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
                    <Package size={18} />
                  </div>
                  <div>
                    <span className="text-gray-800 text-sm font-medium">
                      Order #{order.id?.slice(-6).toUpperCase()}
                    </span>
                    <p className="text-xs text-gray-600">
                      {new Date(order.createdAt).toLocaleDateString("en-ZA")}
                    </p>
                  </div>
                </Link>

                <div className="flex items-center gap-3">                  
                  <ChevronRight size={16} />
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
          open={showModal}
          onClose={() => {
            setShowModal(false);
            setSelectedOrder(null);
            loadOrders();
          }}
        />
      )}
    </>
  );
}
