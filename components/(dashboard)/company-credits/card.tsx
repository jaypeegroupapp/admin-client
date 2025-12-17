"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Factory, Landmark, CreditCard } from "lucide-react";
import { ICompanyCredit } from "@/definitions/company-credit";
import { ReceivePaymentModal } from "./modal";

export default function CompanyCreditCard({
  credit,
}: {
  credit: ICompanyCredit;
}) {
  const [open, setOpen] = useState(false);

  const remainingCredit = credit.creditLimit - credit.usedCredit;

  return (
    <>
      {/* CARD */}
      <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="relative bg-white rounded-2xl border border-gray-200 p-4 shadow-sm hover:shadow-md transition-all cursor-pointer"
        onClick={() => setOpen(true)}
      >
        {/* STATUS */}
        <span
          className={`absolute top-3 right-3 px-2.5 py-0.5 text-xs font-semibold rounded-full capitalize ${
            credit.status === "settled"
              ? "bg-green-100 text-green-700"
              : "bg-yellow-100 text-yellow-700"
          }`}
        >
          {credit.status}
        </span>

        <div className="flex items-start gap-3">
          <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
            <CreditCard />
          </div>

          <div className="flex flex-col flex-1">
            <h3 className="font-semibold text-gray-800">
              {credit.companyName}
            </h3>

            <p className="text-sm text-gray-500 flex items-center gap-1">
              <Landmark size={14} />
              {credit.mineName}
            </p>
          </div>
        </div>

        {/* CREDIT INFO */}
        <div className="mt-4 text-sm space-y-1 text-gray-700">
          <p>
            Credit Limit:{" "}
            <span className="font-semibold">
              R{credit.creditLimit.toLocaleString()}
            </span>
          </p>

          <p>
            Used Credit:{" "}
            <span className="font-semibold text-red-600">
              R{credit.usedCredit.toLocaleString()}
            </span>
          </p>

          <p>
            Remaining:{" "}
            <span className="font-semibold text-green-600">
              R{remainingCredit.toLocaleString()}
            </span>
          </p>
        </div>
      </motion.div>

      {/* RECEIVE PAYMENT MODAL */}
      <ReceivePaymentModal
        companyCreditId={credit.id!}
        open={open}
        onClose={() => setOpen(false)}
      />
    </>
  );
}
