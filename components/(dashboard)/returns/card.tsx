// src/components/(dashboard)/returns/card.tsx
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
    Truck,
    Factory,
    PackageCheck,
    RefreshCw,
    CheckCircle,
} from "lucide-react";
import { IOrderItemAggregated } from "@/definitions/order-item";
import { RefundDetailModal } from "./modal";

export default function RefundCard({ item }: { item: IOrderItemAggregated }) {
    const [open, setOpen] = useState(false);

    const isClosed = item.status === "closed";

    const status = isClosed
        ? {
            label: "Closed",
            bg: "bg-green-100",
            text: "text-green-700",
            icon: CheckCircle,
        }
        : {
            label: "Returned",
            bg: "bg-yellow-100",
            text: "text-yellow-700",
            icon: RefreshCw,
        };

    const StatusIcon = status.icon;

    return (
        <>
            <motion.div
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className={`relative bg-white rounded-2xl border p-4 shadow-sm hover:shadow-md transition-all flex flex-col justify-between cursor-pointer ${isClosed
                    ? "border-green-200 bg-green-50/30"
                    : "border-yellow-200 bg-yellow-50/30"
                    }`}
                onClick={() => setOpen(true)}
            >
                <span
                    className={`absolute top-3 right-3 inline-flex items-center gap-1 px-2.5 py-0.5 text-xs font-semibold rounded-full ${status.bg} ${status.text}`}
                >
                    <StatusIcon size={12} />
                    {status.label}
                </span>

                <div className="flex items-start gap-3">
                    <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
                        <Truck size={28} />
                    </div>
                    <div className="flex flex-col flex-1">
                        <h3 className="font-semibold text-gray-800">{item.plateNumber}</h3>
                        <p className="text-sm text-gray-500 flex items-center gap-1">
                            <PackageCheck size={14} />
                            {item.productName || "No product"}
                        </p>
                        <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                            <Factory size={14} />
                            {item.companyName || "No company"}
                        </p>
                    </div>
                </div>

                <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                    <div>
                        <span className="text-gray-500">Quantity:</span>
                        <span className="font-semibold ml-1">{item.quantity}L</span>
                    </div>
                    <div>
                        <span className="text-gray-500">Status:</span>
                        <span className={`font-semibold ml-1 ${isClosed ? "text-green-600" : "text-yellow-600"}`}>
                            {status.label}
                        </span>
                    </div>
                </div>

                {item.returnedReason && (
                    <div className="mt-2 text-xs text-gray-500 bg-gray-50 p-1.5 rounded truncate">
                        Reason: {item.returnedReason}
                    </div>
                )}

                {isClosed && item.closedAt && (
                    <div className="mt-2 text-xs text-green-600">
                        ✓ Closed {new Date(item.closedAt).toLocaleDateString()}
                    </div>
                )}
            </motion.div>

            <RefundDetailModal
                open={open}
                onClose={() => setOpen(false)}
                item={item}
            />
        </>
    );
}