"use client";

import { Plus, Package, RefreshCw, FileText } from "lucide-react";
import Link from "next/link";

export function QuickActions() {
  const actions = [
    {
      name: "Record Restock",
      icon: Plus,
      href: "/tankers",
      color: "bg-blue-600 hover:bg-blue-700",
    },
    {
      name: "Add Order",
      icon: Package,
      href: "/orders/new",
      color: "bg-green-600 hover:bg-green-700",
    },
    {
      name: "Sync Data",
      icon: RefreshCw,
      href: "#",
      color: "bg-gray-600 hover:bg-gray-700",
    },
    {
      name: "Generate Report",
      icon: FileText,
      href: "#",
      color: "bg-purple-600 hover:bg-purple-700",
    },
  ];

  return (
    <div className="flex gap-2">
      {actions.map((action) => (
        <Link
          key={action.name}
          href={action.href}
          className={`flex items-center gap-2 px-3 py-2 text-sm text-white rounded-lg transition ${action.color}`}
        >
          <action.icon size={14} />
          <span className="hidden sm:inline">{action.name}</span>
        </Link>
      ))}
    </div>
  );
}
