"use client";

import { AlertTriangle } from "lucide-react";
import { VolumeCalculationSection } from "./volume-calculation";
import { PurchaseDetailsSection } from "./purchase-details";
import { NotesSection } from "./notes-section";
import { DiscrepancyWarning } from "./discrepancy-warning";

export function RestockExpandedDetails({ record }: { record: any }) {
  return (
    <div className="p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <VolumeCalculationSection record={record} />
        <PurchaseDetailsSection record={record} />
        <NotesSection record={record} />
      </div>
      <DiscrepancyWarning record={record} />
    </div>
  );
}
