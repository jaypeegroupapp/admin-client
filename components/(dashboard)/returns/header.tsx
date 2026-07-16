// src/components/(dashboard)/refunds/header.tsx
"use client";
import { RefreshCw } from "lucide-react";

export function RefundsHeader() {
    return (
        <div className="flex flex-row justify-between items-center mb-4 gap-y-6">
            <div className="flex gap-2 items-center">
                <RefreshCw className="w-6 h-6 text-amber-600" />
                <h1 className="text-xl font-semibold">Refund Management</h1>
            </div>
        </div>
    );
}