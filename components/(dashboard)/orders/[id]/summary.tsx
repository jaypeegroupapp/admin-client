"use client";

import { useState } from "react";
import { Package, Calendar, X, Ticket, Check } from "lucide-react";
import { IOrder } from "@/definitions/order";
import { OrderStatusBadge } from "./status-badge";
import { AcceptOrderModal } from "./accept-order-modal";
import { DeclineOrderModal } from "./decline-order-modal";

export function OrderSummary({
  order,
  totalStockToDeduct,
}: {
  order: IOrder;
  totalStockToDeduct: number;
}) {
  const [showAcceptModal, setShowAcceptModal] = useState(false);
  const [showDeclineModal, setShowDeclineModal] = useState(false);

  return (
    <>
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-4">
        <div className="flex md:flex-row flex-col space-y-4 md:space-y-0 justify-between">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
              <Package size={24} />
            </div>

            <div className="flex-1">
              <h2 className="text-lg font-semibold text-gray-800">
                Order #{order.id?.slice(-6).toUpperCase()}
              </h2>
              <p className="text-sm text-gray-500">
                Created on{" "}
                {new Date(order.createdAt!).toLocaleDateString("en-ZA")}
              </p>
              <div className="mt-2">
                <OrderStatusBadge status={order.status} />
              </div>
            </div>
          </div>

          {order.status === "pending" && (
            <div className="flex flex-row gap-2">
              {/* Accept */}
              <button
                onClick={() => setShowAcceptModal(true)}
                className="flex items-center justify-between gap-1 rounded-lg h-8 px-3 text-sm font-medium bg-green-600 text-white hover:bg-green-700 transition"
              >
                Accept
                <Check size={16} />
              </button>

              {/* Decline */}
              <button
                onClick={() => setShowDeclineModal(true)}
                className="flex items-center justify-between gap-1 rounded-lg h-8 px-3 text-sm font-medium bg-red-600 text-white hover:bg-red-700 transition"
              >
                Decline
                <X size={16} />
              </button>
            </div>
          )}
        </div>

        <div className="border-t border-gray-200 my-4" />

        <div className="grid grid-cols-2 gap-4 text-sm text-gray-700">
          <div>
            <p className="text-gray-500">Product</p>
            <p className="font-medium">{order.productName}</p>
          </div>
          <div>
            <p className="text-gray-500 flex items-center justify-between">
              Collection Date
            </p>
            <p className="font-medium">
              {new Date(order.collectionDate).toLocaleDateString("en-ZA")}
            </p>
          </div>
          <div>
            <p className="text-gray-500">Total Amount</p>
            <p className="font-semibold text-gray-900">
              R{order.totalAmount.toFixed(2)}
            </p>
          </div>{" "}
          <div>
            <p className="text-gray-500">Total Quantity</p>
            <p className="font-semibold text-gray-900">
              {totalStockToDeduct} Litres
            </p>
          </div>
        </div>
      </div>

      {/* Accept Modal */}
      {showAcceptModal && (
        <AcceptOrderModal
          orderId={order.id!}
          totalStockToDeduct={totalStockToDeduct}
          open={showAcceptModal}
          onClose={() => setShowAcceptModal(false)}
        />
      )}

      {/* Decline Modal */}
      {showDeclineModal && (
        <DeclineOrderModal
          orderId={order.id!}
          open={showDeclineModal}
          onClose={() => setShowDeclineModal(false)}
        />
      )}
    </>
  );
}
