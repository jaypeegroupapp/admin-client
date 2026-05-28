"use client";

import { Clock, CheckCircle, RefreshCw } from "lucide-react";

interface StatusBadgeProps {
  status: string;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  switch (status) {
    case "active":
      return (
        <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-700 flex items-center gap-1">
          <Clock size={12} /> Active
        </span>
      );
    case "completed":
      return (
        <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-700 flex items-center gap-1">
          <CheckCircle size={12} /> Completed
        </span>
      );
    case "reconciled":
      return (
        <span className="px-2 py-1 text-xs rounded-full bg-purple-100 text-purple-700 flex items-center gap-1">
          <RefreshCw size={12} /> Reconciled
        </span>
      );
    default:
      return (
        <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-700">
          {status}
        </span>
      );
  }
}
