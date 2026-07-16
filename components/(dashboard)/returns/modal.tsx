// src/components/(dashboard)/returns/modal.tsx
"use client";

import { useState, useTransition } from "react";
import { BaseModal } from "@/components/ui/base-modal";
import { IOrderItemAggregated } from "@/definitions/order-item";
import { useRouter } from "next/navigation";
import { closeReturnAction } from "@/actions/order-item";
import {
    Truck,
    Factory,
    PackageCheck,
    RefreshCw,
    CheckCircle,
    User,
    Calendar,
    Check,
} from "lucide-react";

export function RefundDetailModal({
    open,
    onClose,
    item,
}: {
    open: boolean;
    onClose: () => void;
    item: IOrderItemAggregated;
}) {
    const router = useRouter();
    const [message, setMessage] = useState("");
    const [isPending, startTransition] = useTransition();
    const [localItem, setLocalItem] = useState(item);

    const isClosed = localItem.status === "closed";

    const handleCloseReturn = () => {
        setMessage("");
        startTransition(async () => {
            const result = await closeReturnAction(localItem.id);

            if (result.success) {
                setLocalItem({
                    ...localItem,
                    status: "closed",
                    closedAt: new Date().toISOString(),
                });
                setMessage("✅ Return closed successfully! Stock restored.");
                router.refresh();
                setTimeout(() => {
                    setMessage("");
                }, 3000);
            } else {
                setMessage(`❌ ${result.message}`);
            }
        });
    };

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
        <BaseModal open={open} onClose={onClose}>
            <div className="space-y-5 max-h-[90vh] overflow-y-auto p-1">
                {/* Header */}
                <div className="flex justify-between items-center border-b border-gray-200 pb-3">
                    <div className="flex items-center gap-2">
                        <RefreshCw size={20} className="text-amber-600" />
                        <h2 className="text-lg font-semibold text-gray-800">Return Details</h2>
                    </div>
                    <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-full ${status.bg} ${status.text}`}
                    >
                        <StatusIcon size={12} />
                        {status.label}
                    </span>
                </div>

                {/* Order Info */}
                <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                        <Calendar size={14} className="text-gray-400" />
                        <span className="text-gray-500">Order #:</span>
                        <span className="font-medium">
                            {localItem.orderNumber?.slice(-8).toUpperCase() || "N/A"}
                        </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                        <User size={14} className="text-gray-400" />
                        <span className="text-gray-500">Returned by:</span>
                        <span className="font-medium">
                            {localItem.returnedBy || "System"}
                        </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                        <Calendar size={14} className="text-gray-400" />
                        <span className="text-gray-500">Returned at:</span>
                        <span className="font-medium">
                            {localItem.returnedAt
                                ? new Date(localItem.returnedAt).toLocaleString()
                                : "N/A"}
                        </span>
                    </div>
                    {isClosed && localItem.closedAt && (
                        <div className="flex items-center gap-2 text-sm text-green-700">
                            <CheckCircle size={14} className="text-green-500" />
                            <span className="text-gray-500">Closed at:</span>
                            <span className="font-medium">
                                {new Date(localItem.closedAt).toLocaleString()}
                            </span>
                        </div>
                    )}
                </div>

                {/* Item Details */}
                <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-center gap-3 text-sm bg-gray-50 p-3 rounded-lg">
                        <div className="bg-white p-2 rounded-lg">
                            <Truck size={18} className="text-gray-600" />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500">Truck</p>
                            <p className="font-medium">{localItem.plateNumber}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 text-sm bg-gray-50 p-3 rounded-lg">
                        <div className="bg-white p-2 rounded-lg">
                            <PackageCheck size={18} className="text-gray-600" />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500">Product</p>
                            <p className="font-medium">{localItem.productName || "Diesel"}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 text-sm bg-gray-50 p-3 rounded-lg">
                        <div className="bg-white p-2 rounded-lg">
                            <Factory size={18} className="text-gray-600" />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500">Company</p>
                            <p className="font-medium">{localItem.companyName || "N/A"}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 text-sm bg-gray-50 p-3 rounded-lg">
                        <div className="bg-white p-2 rounded-lg">
                            <PackageCheck size={18} className="text-gray-600" />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500">Quantity</p>
                            <p className="font-medium text-blue-600 text-lg">{localItem.quantity}L</p>
                        </div>
                    </div>
                </div>

                {/* Return Reason */}
                {localItem.returnedReason && (
                    <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                        <p className="text-xs text-yellow-600 font-medium">Return Reason</p>
                        <p className="text-sm text-yellow-800 mt-1">
                            {localItem.returnedReason}
                        </p>
                    </div>
                )}

                {/* Action Button */}
                {!isClosed && (
                    <div className="space-y-3 pt-2 border-t border-gray-200">
                        <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                            <p className="text-sm text-blue-700">
                                Closing this return will restore {localItem.quantity}L back to stock.
                            </p>
                        </div>
                        <button
                            onClick={handleCloseReturn}
                            disabled={isPending}
                            className="w-full flex items-center justify-center gap-2 px-5 py-3 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition disabled:opacity-50"
                        >
                            <Check size={16} />
                            {isPending ? "Processing..." : "Close Return"}
                        </button>
                    </div>
                )}

                {/* Message */}
                {message && (
                    <div
                        className={`p-3 rounded-lg ${message.includes("✅")
                            ? "bg-green-50 border border-green-200"
                            : "bg-red-50 border border-red-200"
                            }`}
                    >
                        <p
                            className={`text-sm ${message.includes("✅") ? "text-green-700" : "text-red-700"
                                }`}
                        >
                            {message}
                        </p>
                    </div>
                )}

                {/* Close Button */}
                <div className="flex justify-end pt-4 border-t border-gray-200">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 transition"
                    >
                        Close
                    </button>
                </div>
            </div>
        </BaseModal>
    );
}