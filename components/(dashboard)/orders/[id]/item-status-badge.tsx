// src/components/(dashboard)/orders/[id]/order-item-status-badge.tsx
"use client";

import { CheckCircle, Clock, XCircle, AlertCircle } from "lucide-react";

const statusConfig = {
  completed: {
    bg: "bg-green-100",
    text: "text-green-700",
    icon: CheckCircle,
    label: "Completed",
  },
  accepted: {
    bg: "bg-blue-100",
    text: "text-blue-700",
    icon: AlertCircle,
    label: "Accepted",
  },
  pending: {
    bg: "bg-yellow-100",
    text: "text-yellow-700",
    icon: Clock,
    label: "Pending",
  },
  cancelled: {
    bg: "bg-red-100",
    text: "text-red-700",
    icon: XCircle,
    label: "Cancelled",
  },
};

export function OrderItemStatusBadge({ status }: { status: string }) {
  const config =
    statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
  const Icon = config.icon;

  return (
    <div
      className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}
    >
      <Icon size={12} />
      {config.label}
    </div>
  );
}
