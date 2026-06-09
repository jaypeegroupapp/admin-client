"use client";

import { Package, Clock, CheckCircle } from "lucide-react";

interface OrdersCardProps {
  pending: number;
  accepted: number;
  completed: number;
}

export function OrdersCard({ pending, accepted, completed }: OrdersCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">Orders</p>
          <p className="text-2xl font-bold text-gray-900">Total Orders</p>
        </div>
        <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
          <Package size={24} className="text-purple-600" />
        </div>
      </div>
      <div className="mt-3 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="flex items-center gap-1 text-yellow-600">
            <Clock size={14} /> Pending
          </span>
          <span className="font-semibold">{pending}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="flex items-center gap-1 text-blue-600">
            <Package size={14} /> Accepted
          </span>
          <span className="font-semibold">{accepted}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="flex items-center gap-1 text-green-600">
            <CheckCircle size={14} /> Completed
          </span>
          <span className="font-semibold">{completed}</span>
        </div>
      </div>
    </div>
  );
}
