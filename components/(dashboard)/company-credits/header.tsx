"use client";

import { CreditCard } from "lucide-react";

export default function CompanyCreditHeader() {
  return (
    <div className="flex flex-row justify-between items-center mb-4">
      <div className="flex gap-2 items-center">
        <CreditCard className="w-5 h-5" />
        <h1 className="text-xl font-semibold">Company Credits</h1>
      </div>
    </div>
  );
}
