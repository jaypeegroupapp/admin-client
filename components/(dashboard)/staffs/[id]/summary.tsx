"use client";

import { useState } from "react";
import { Check, Copy, Link, User } from "lucide-react";
import { IStaff } from "@/definitions/staff";
import { EnableDisableStaffModal } from "./enable-disable-modal";

export function StaffSummary({ staff }: { staff: IStaff }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const registerLink = `${process.env.NEXT_PUBLIC_BASE_URL}/staff-set-password?id=${staff.userId}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(registerLink);
      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error("Copy failed", error);
    }
  };

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
                  staff.status === "active" ? "text-green-600" : "text-red-600"
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

      <div className="border-t border-gray-200 my-4" />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-700">
        {/* 🔥 Register Link with Copy */}
        <div className="flex items-center gap-2">
          <Link size={16} className="text-gray-500" />

          <div className="flex items-center gap-2 w-full">
            <span className="truncate text-gray-700">Set Password Link</span>

            <button
              onClick={handleCopy}
              className="flex items-center gap-1 px-3 py-1 text-xs font-medium rounded-lg border border-gray-300 hover:bg-gray-100 transition"
            >
              {copied ? (
                <>
                  <Check size={14} className="text-green-600" />
                  Copied
                </>
              ) : (
                <>
                  <Copy size={14} />
                  Copy
                </>
              )}
            </button>
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
