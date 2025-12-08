"use client";

import { FileCheck2 } from "lucide-react";

export function CompanyCreditApprovalHeader() {
  return (
    <div className="flex flex-row justify-between items-center mb-4 gap-y-6">
      <div className="flex gap-2 items-center">
        <FileCheck2 />
        <h1 className="text-xl font-semibold">Credit Approval Requests</h1>
      </div>
    </div>
  );
}
