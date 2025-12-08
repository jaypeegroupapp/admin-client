"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  User,
  ClipboardList,
  Factory,
  PackageCheck,
  Truck,
  FileCheck2,
  Mountain,
} from "lucide-react";
import { ICompanyCreditApproval } from "@/definitions/company-credit-approval";
import Link from "next/link";

export default function CreditApprovalCard({
  item,
}: {
  item: ICompanyCreditApproval & {
    companyName?: string;
    mineName?: string;
  };
}) {
  const [open, setOpen] = useState(false);

  const badge =
    item.requester === "Transporter"
      ? "bg-blue-100 text-blue-700"
      : item.requester === "Business"
      ? "bg-green-100 text-green-700"
      : "bg-yellow-100 text-yellow-700";

  return (
    <Link href={`/company-credit-approvals/${item.id}`} className="block">
      <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="relative bg-white rounded-2xl border border-gray-200 p-4 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
        onClick={() => setOpen(true)}
      >
        {/* Expand Icon */}
        {/* STATUS BADGE */}
        <span
          className={`absolute top-3 right-3 inline-block mt-3 px-2.5 py-0.5 text-xs font-semibold rounded-full capitalize ${
            item.status === "approved"
              ? "bg-green-100 text-green-700"
              : item.status === "pending"
              ? "bg-yellow-100 text-yellow-700"
              : item.status === "declined"
              ? "bg-red-100 text-red-700"
              : "bg-gray-200 text-gray-600"
          }`}
        >
          {item.status}
        </span>

        <div className="flex items-start gap-3">
          <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 text-sm">
            <FileCheck2 />
          </div>

          <div className="flex flex-col flex-1">
            <h3 className="font-semibold text-gray-800">{item.companyName}</h3>
            <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
              <Mountain size={14} />
              {item.mineName || "No mine"}
            </p>{" "}
            <p className="text-sm text-gray-500 flex items-center gap-1">
              <User size={14} />
              {item.requester || "No product"}
            </p>
          </div>
        </div>

        {/* QUANTITY */}
        <div className="mt-3 text-sm text-gray-700">
          Credit Limit:{" "}
          <span className="font-semibold">
            {item.creditLimit ? "R" + item.creditLimit : "No limit"}
          </span>
        </div>
      </motion.div>
    </Link>
  );
}
