"use client";

import { motion } from "framer-motion";

type InvoiceOrderItem = {
  id: string;
  orderId: string;
  updateDate: string;
  quantity: number;
  sellingPrice: number;
  truckId: {
    name: string;
    plateNumber: string;
    registrationNumber: string;
  };
};

export function InvoiceOrdersTable({ data }: { data: InvoiceOrderItem[] }) {
  const formatCurrency = (value: number) => {
    return `R ${value.toFixed(2)}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl border p-6"
    >
      <h3 className="text-lg font-semibold mb-6">Invoice Order Items</h3>

      {data.length === 0 ? (
        <p className="text-sm text-gray-500">No records found.</p>
      ) : (
        <>
          {/* ====================== */}
          {/* ✅ DESKTOP TABLE VIEW */}
          {/* ====================== */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-gray-500">
                  <th className="pb-3">Slip</th>
                  <th className="pb-3">Order</th>
                  <th className="pb-3">Plate</th>
                  <th className="pb-3 text-right">Qty</th>
                  <th className="pb-3 text-right">Total</th>
                  <th className="pb-3 text-right">Date</th>
                </tr>
              </thead>
              <tbody>
                {data.map((item) => {
                  const lineTotal = item.quantity * item.sellingPrice;

                  return (
                    <tr
                      key={item.id}
                      className="border-b last:border-none hover:bg-gray-50 transition"
                    >
                      <td className="py-4 font-medium">
                        #{item.id.slice(-6).toUpperCase()}
                      </td>
                      <td className="py-4 font-medium">
                        #{item.orderId.slice(-6).toUpperCase()}
                      </td>

                      <td className="py-4">{item.truckId.plateNumber}</td>

                      <td className="py-4 text-right">{item.quantity}</td>

                      <td className="py-4 text-right font-semibold">
                        {formatCurrency(lineTotal)}
                      </td>

                      <td className="py-4 text-right text-gray-500">
                        {new Date(item.updateDate).toLocaleDateString()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* ====================== */}
          {/* ✅ MOBILE CARD VIEW */}
          {/* ====================== */}
          <div className="md:hidden space-y-4">
            {data.map((item) => {
              const lineTotal = item.quantity * item.sellingPrice;

              return (
                <div key={item.id} className="border rounded-xl p-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <p className="font-semibold">
                      Order #{item.orderId.slice(-6).toUpperCase()}
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(item.updateDate).toLocaleDateString()}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm font-medium">{item.truckId.name}</p>
                    <p className="text-xs text-gray-500">
                      {item.truckId.plateNumber} •{" "}
                      {item.truckId.registrationNumber}
                    </p>
                  </div>

                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Qty</p>
                      <p className="font-medium">{item.quantity}</p>
                    </div>

                    <div>
                      <p className="text-gray-500">Price</p>
                      <p className="font-medium">
                        {formatCurrency(item.sellingPrice)}
                      </p>
                    </div>

                    <div>
                      <p className="text-gray-500">Total</p>
                      <p className="font-semibold">
                        {formatCurrency(lineTotal)}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </motion.div>
  );
}
