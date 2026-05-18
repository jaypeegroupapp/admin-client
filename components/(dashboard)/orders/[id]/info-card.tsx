// src/components/(dashboard)/orders/[id]/info-card.tsx
"use client";

import { LucideIcon } from "lucide-react";

interface InfoCardProps {
  icon: LucideIcon;
  label: string;
  value: string;
  valueClassName?: string;
}

export function OrderInfoCard({
  icon: Icon,
  label,
  value,
  valueClassName,
}: InfoCardProps) {
  return (
    <div className="flex items-center gap-2">
      <Icon size={16} className="text-gray-500" />
      <div>
        <p className="text-xs text-gray-500">{label}</p>
        <p className={`font-medium ${valueClassName || "text-gray-800"}`}>
          {value}
        </p>
      </div>
    </div>
  );
}
