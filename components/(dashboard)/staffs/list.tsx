// list.tsx
"use client";

import { IStaff } from "@/definitions/staff";
import { StaffCard } from "./card";

export function StaffList({ staffs }: { staffs: IStaff[] }) {
  if (!staffs.length) return <p className="text-gray-500">No staff found.</p>;

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {staffs.map((staff) => (
        <StaffCard key={staff.id} staff={staff} />
      ))}
    </div>
  );
}
