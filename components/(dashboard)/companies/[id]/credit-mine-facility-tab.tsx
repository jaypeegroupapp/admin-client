"use client";

import { useState, useEffect } from "react";
import { Plus, Wallet } from "lucide-react";
import { getCompanyCreditsByCompanyId } from "@/data/company-credit";
import { getMines } from "@/data/mine";
import { CreateCompanyCreditModal } from "./create-company-credit-modal";
import { motion } from "framer-motion";
import { CreditFacilityItem } from "./item";

export function CreditMineFacilityTab({ companyId }: { companyId: string }) {
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
          .map((mine: any) => ({ _id: mine.id, name: mine.name })),
      );
    }
  };

  useEffect(() => {
    loadCredits();
  }, [companyId]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
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
          <Plus size={16} />
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
            <CreditFacilityItem
              key={item.id}
              item={item}
              companyId={companyId}
              onEdit={(credit) => {
                setEditingCredit(credit);
                setShowModal(true);
              }}
              onClose={() => loadCredits()}
            />
          ))}
        </div>
      )}

      {/* Create / Update */}
      {showModal && (
        <CreateCompanyCreditModal
          companyId={companyId}
          mines={mines}
          editingCredit={editingCredit}
          open={showModal}
          onClose={() => {
            setShowModal(false);
            setEditingCredit(null);
            loadCredits();
          }}
        />
      )}
    </motion.div>
  );
}
