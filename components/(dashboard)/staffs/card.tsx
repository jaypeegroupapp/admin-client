"use client";

import { motion } from "framer-motion";
import { User } from "lucide-react";
import Link from "next/link";
import { IStaff } from "@/definitions/staff";

export function StaffCard({ staff }: { staff: IStaff }) {
  return (
    <Link href={`/staffs/${staff.id}`} className="block">
      <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="
          bg-white rounded-2xl border border-gray-200 p-4 shadow-sm
          hover:shadow-md transition-all cursor-pointer
          flex flex-row justify-between items-start gap-4
        "
      >
        {/* LEFT: ICON + STAFF INFO */}
        <div className="flex items-center gap-3 flex-1">
          <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center text-gray-400">
            <User className="w-6 h-6" />
          </div>

          <div className="flex flex-col">
            <h3 className="font-semibold text-gray-800 leading-tight">
              {staff.name}
            </h3>

            <p className="text-sm text-gray-500">
              Mines: {staff.mines?.length || 0}
            </p>
          </div>
        </div>

        {/* RIGHT: STATUS BADGE */}
        <span
          className={`
            text-xs font-medium px-2 py-1 rounded-lg
            ${
              staff.status === "active"
                ? "bg-green-100 text-green-700"
                : "bg-gray-200 text-gray-700"
            }
          `}
        >
          {staff.status === "active" ? "Active" : "Inactive"}
        </span>
      </motion.div>
    </Link>
  );
}
