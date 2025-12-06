"use client";

import { useState, useEffect } from "react";
import { Edit, Wallet } from "lucide-react";

import { getCompanyCreditsByCompanyId } from "@/data/company-credit";
import { getMines } from "@/data/mine";
import { CreateCompanyCreditModal } from "./create-company-credit-modal";

export function CreditFacilityTab({ companyId }: { companyId: string }) {
  const [credits, setCredits] = useState<any[]>([]);
  const [mines, setMines] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingCredit, setEditingCredit] = useState<any | null>(null);

  const loadCredits = async () => {
    const resCredit = await getCompanyCreditsByCompanyId(companyId);
    if (resCredit.success) setCredits(resCredit.data);

    const creditMineNames = resCredit.data.map((c: any) => c.mineName);

    const res = await getMines();
    if (res.success && res.data) {
      setMines(
        res.data
          .filter((mine: any) => !creditMineNames.includes(mine.name))
          .map((mine: any) => ({ _id: mine.id, name: mine.name }))
      );
    }
  };

  useEffect(() => {
    loadCredits();
  }, [companyId]);

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-medium text-gray-700 flex items-center gap-2">
          <Wallet size={16} className="text-gray-500" />
          Credit Facility
        </h3>

        <button
          onClick={() => {
            setEditingCredit(null);
            setShowModal(true);
          }}
          className="flex items-center gap-2 rounded-lg p-2 text-sm font-medium bg-gray-900 text-white hover:bg-gray-700 transition"
        >
          <Edit size={16} />
          <span className="hidden md:block">Add Credit</span>
        </button>
      </div>

      {credits.length === 0 ? (
        <p className="text-sm text-gray-500">
          No credit assigned to this company yet.
        </p>
      ) : (
        <div className="divide-y divide-gray-200">
          {credits.map((item: any) => (
            <div
              key={item.id}
              className="py-3 flex justify-between items-center"
            >
              <div>
                <p className="text-sm font-medium text-gray-800">
                  {item.mineName}
                </p>
                <p className="text-xs text-gray-500">
                  Limit: R{item.creditLimit.toLocaleString()}
                </p>
                <p className="text-xs text-gray-500">
                  Used: R{item.usedCredit.toLocaleString()}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <span className="px-2 py-1 text-xs rounded-md bg-gray-100 text-gray-700">
                  {item.usedCredit >= item.creditLimit
                    ? "Fully Used"
                    : "Active"}
                </span>

                <button
                  onClick={() => {
                    setEditingCredit(item);
                    setShowModal(true);
                  }}
                  className="text-blue-600 hover:text-blue-800 text-xs flex items-center gap-1"
                >
                  <Edit size={14} />
                  Update
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <CreateCompanyCreditModal
          companyId={companyId}
          mines={
            editingCredit
              ? mines.concat({
                  _id: editingCredit.mineId,
                  name: editingCredit.mineName,
                })
              : mines
          }
          editingCredit={editingCredit}
          open={showModal}
          onClose={() => {
            setShowModal(false);
            setEditingCredit(null);
            loadCredits();
          }}
        />
      )}
    </>
  );
}
