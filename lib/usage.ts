// src/components/(dashboard)/dispensers/[id]/usage-utils.ts
import { ShoppingCart, Banknote, Droplet } from "lucide-react";

export function getTransactionType(record: any) {
  if (record.cashTransactionId) {
    return {
      label: "Cash Sale",
      bgColor: "bg-green-100",
      textColor: "text-green-700",
      icon: Banknote,
      link: `/cash-transactions/${record.cashTransactionId}`,
    };
  } else if (record.orderId) {
    return {
      label: "Order Sale",
      bgColor: "bg-blue-100",
      textColor: "text-blue-700",
      icon: ShoppingCart,
      link: `/orders/${record.orderId}`,
    };
  } else if (record.type === "STOCK_IN") {
    return {
      label: "Stock In",
      bgColor: "bg-purple-100",
      textColor: "text-purple-700",
      icon: Droplet,
      link: null,
    };
  }
  return {
    label: "Adjustment",
    bgColor: "bg-gray-100",
    textColor: "text-gray-700",
    icon: Droplet,
    link: null,
  };
}

export function getStockRemainingPercentage(balanceBefore: number, balanceAfter: number): number {
  if (!balanceBefore || balanceBefore === 0) return 0;
  return (balanceAfter / balanceBefore) * 100;
}

export function getStockUsedPercentage(balanceBefore: number, balanceAfter: number): number {
  if (!balanceBefore || balanceBefore === 0) return 0;
  return ((balanceBefore - balanceAfter) / balanceBefore) * 100;
}