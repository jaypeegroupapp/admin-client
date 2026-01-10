"use client";

import { useState } from "react";
import { User } from "lucide-react";
import { IStaff } from "@/definitions/staff";
import { EnableDisableStaffModal } from "./enable-disable-modal";

export function StaffSummary({ staff }: { staff: IStaff }) {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-4">
      <div className="flex items-start gap-4">
        <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
          <User size={28} />
        </div>

        <div className="flex justify-between flex-1 items-start">
          <div>
            <h2 className="text-lg font-semibold text-gray-800">
              {staff.name}
            </h2>

            <p className="text-sm text-gray-500 mt-2">
              Created on{" "}
              {staff.createdAt
                ? new Date(staff.createdAt).toLocaleDateString("en-ZA")
                : "Unknown"}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-sm">
              Status:{" "}
              <strong
                className={
                  staff.status === "active"
                    ? "text-green-600"
                    : "text-red-600"
                }
              >
                {staff.status}
              </strong>
            </span>

            <div
              onClick={() => setModalOpen(true)}
              className={`relative inline-flex h-6 w-12 cursor-pointer rounded-full transition 
                ${staff.status === "active" ? "bg-green-500" : "bg-gray-300"}`}
            >
              <span
                className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform 
                  ${
                    staff.status === "active"
                      ? "translate-x-6"
                      : "translate-x-1"
                  }`}
              />
            </div>
          </div>
        </div>
      </div>

      <EnableDisableStaffModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        staffId={staff.id!}
        currentState={staff.status === "active"}
      />
    </div>
  );
}
