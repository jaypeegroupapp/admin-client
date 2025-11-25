"use client";

import { useState } from "react";
import { Mountain } from "lucide-react";
import { IMine } from "@/definitions/mine";
import { EnableDisableMineModal } from "./enable-disable-modal";

export function MineSummary({ mine }: { mine: IMine }) {
  const [modalOpen, setModalOpen] = useState(false);

  const handleToggle = () => {
    setModalOpen(true);
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-4">
      {/* ICON + DETAILS */}
      <div className="flex items-start gap-4">
        <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
          <Mountain size={28} />
        </div>
        <div className="flex justify-between flex-1 items-start">
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-gray-800">{mine.name}</h2>

            <p className="text-sm text-gray-500 mt-2">
              Created on{" "}
              {mine.createdAt
                ? new Date(mine.createdAt).toLocaleDateString("en-ZA")
                : "Unknown"}
            </p>
          </div>
          {/* SWITCH */}
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600">
              Status:{" "}
              <strong
                className={mine.isActive ? "text-green-600" : "text-red-600"}
              >
                {mine.isActive ? "Enabled" : "Disabled"}
              </strong>
            </span>

            {/* TOGGLE SWITCH */}
            <div
              onClick={handleToggle}
              className={`relative inline-flex h-6 w-12 cursor-pointer rounded-full transition 
                ${mine.isActive ? "bg-green-500" : "bg-gray-300"}`}
            >
              <span
                className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform 
                  ${mine.isActive ? "translate-x-6" : "translate-x-1"}`}
              ></span>
            </div>
          </div>{" "}
        </div>
      </div>

      {/* ENABLE/DISABLE MODAL */}
      <EnableDisableMineModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        mineId={mine.id!}
        currentState={mine.isActive}
      />
    </div>
  );
}
