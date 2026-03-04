"use client";

import { Mountain, Edit } from "lucide-react";
import { useState } from "react";
import { EnableDisableCompanyCreditModal } from "./enable-disable-modal";
import { DisableCompanyCreditModal } from "./disable-modal";

interface Props {
  item: any;
  companyId: string;
  onEdit: (item: any) => void;
  onClose: () => void;
}

export function CreditFacilityItem({
  item,
  companyId,
  onEdit,
  onClose,
}: Props) {
  const [enableModalOpen, setEnableModalOpen] = useState(false);
  const [disableModalOpen, setDisableModalOpen] = useState(false);

  const handleToggle = () => {
    if (item.isActive) {
      // disabling
      setDisableModalOpen(true);
    } else {
      // enabling
      setEnableModalOpen(true);
    }
  };
  console.log("Rendering CreditFacilityItem with item:", item);
  return (
    <>
      <div className="py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
            <Mountain />
          </div>

          <div>
            <p className="text-sm font-medium text-gray-800">{item.mineName}</p>

            <div className="flex items-center gap-3">
              <p className="text-xs text-gray-500">
                Limit: R{item.creditLimit.toLocaleString()}
              </p>

              <p className="text-xs text-gray-500">
                Used: R{item.usedCredit.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-600">
              Status:{" "}
              <strong
                className={item.isActive ? "text-green-600" : "text-red-600"}
              >
                {item.isActive ? "Active" : "Disabled"}
              </strong>
            </span>

            {/* TOGGLE SWITCH */}
            <div
              onClick={handleToggle}
              className={`relative inline-flex h-6 w-12 cursor-pointer rounded-full transition
                ${item.isActive ? "bg-green-500" : "bg-gray-300"}`}
            >
              <span
                className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform
                  ${item.isActive ? "translate-x-6" : "translate-x-1"}`}
              />
            </div>
          </div>

          <button
            onClick={() => onEdit(item)}
            className="text-blue-600 hover:text-blue-800 text-xs flex items-center gap-1"
          >
            <Edit size={14} />
            Update
          </button>
        </div>
      </div>

      {/* ENABLE MODAL */}
      <EnableDisableCompanyCreditModal
        open={enableModalOpen}
        onClose={() => {
          setEnableModalOpen(false);
          onClose();
        }}
        creditId={item.id}
        companyId={companyId}
        currentState={item.isActive}
      />

      {/* DISABLE MODAL (Uses CreateCompanyCreditModal) */}
      <DisableCompanyCreditModal
        companyId={companyId}
        mines={[]} // not needed for disable
        editingCredit={item}
        open={disableModalOpen}
        onClose={() => {
          setDisableModalOpen(false);
          onClose();
        }}
        isDisableMode
      />
    </>
  );
}
