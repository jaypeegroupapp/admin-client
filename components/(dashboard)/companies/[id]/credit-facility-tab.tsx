"use client";

import { useState, useEffect } from "react";
import { Plus, Wallet } from "lucide-react";
import { motion } from "framer-motion";
import { getCompanyCreditsByCompanyId } from "@/data/company-credit";
import { AddCreditModal } from "./add-credit-modal";

export function CreditFacilityTab({ companyId }: { companyId: string }) {
  const [credit, setCredit] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);

  const loadCredit = async () => {
    const res = await getCompanyCreditsByCompanyId(companyId);
    console.log(res);
    setCredit(res || { balance: 0, limit: 0, trail: [] });
  };

  useEffect(() => {
    loadCredit();
  }, [companyId]);

  return (
    <>
      {/* HEADER */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-medium text-gray-700 flex items-center gap-2">
          <Wallet size={16} className="text-gray-500" />
          Credit Facility
        </h3>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 rounded-lg p-2 text-sm font-medium bg-gray-900 text-white hover:bg-gray-700 transition"
        >
          <Plus size={16} />
          <span className="hidden md:block">Add Credit</span>
        </button>
      </div>

      {/* TRAIL LIST */}
      {!credit?.trail?.length ? (
        <p className="text-sm text-gray-500">No credit movements yet.</p>
      ) : (
        <div className="divide-y divide-gray-200">
          {credit.trail.map((item: any, index: number) => (
            <div key={index} className="py-3 flex justify-between items-start">
              {/* LEFT */}
              <div>
                <p className="text-sm font-medium text-gray-800">{item.type}</p>

                <p className="text-xs text-gray-500 mb-1">
                  {new Date(item.date).toLocaleDateString("en-ZA")} • Amount: R
                  {item.amount}
                </p>

                {item.note && (
                  <p className="text-xs text-gray-500 italic">
                    Note: {item.note}
                  </p>
                )}
              </div>

              {/* BADGE */}
              <span
                className={`px-2 py-1 text-xs rounded-md ${
                  item.type === "CREDIT_ADDED"
                    ? "bg-green-100 text-green-700"
                    : item.type === "CREDIT_USED"
                    ? "bg-red-100 text-red-700"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                {item.type}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* MODAL */}
      {showModal && (
        <AddCreditModal
          companyId={companyId}
          open={showModal}
          onClose={() => {
            setShowModal(false);
            loadCredit();
          }}
        />
      )}
    </>
  );
}
