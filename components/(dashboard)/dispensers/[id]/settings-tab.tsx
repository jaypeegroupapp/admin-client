// src/components/(dashboard)/dispensers/[id]/settings-tab.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Settings, Trash2, AlertTriangle } from "lucide-react";
import { deleteDispenserAction } from "@/actions/dispenser";
import { DeleteDispenserModal } from "./delete-modal";

export function SettingsTab({ dispenserId }: { dispenserId: string }) {
  const router = useRouter();
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  return (
    <>
      <div className="space-y-6">
        {/* Configuration Section */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 flex items-center gap-2 mb-4">
            <Settings size={16} className="text-gray-500" />
            Configuration
          </h3>

          <div className="bg-gray-50 rounded-lg p-4 space-y-3">
            <p className="text-sm text-gray-600">
              Dispenser settings can be modified using the edit button in the
              header.
            </p>

            <ul className="text-sm text-gray-600 space-y-2">
              <li>• Change dispenser name</li>
              <li>• Update assigned product</li>
              <li>• Modify litres capacity</li>
              <li>• Assign to user</li>
            </ul>
          </div>
        </div>

        {/* Danger Zone */}
        <div>
          <h3 className="text-sm font-medium text-red-600 flex items-center gap-2 mb-4">
            <AlertTriangle size={16} />
            Danger Zone
          </h3>

          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-red-800">
                  Delete Dispenser
                </p>
                <p className="text-xs text-red-600 mt-1">
                  Once deleted, this dispenser cannot be recovered.
                </p>
              </div>

              <button
                onClick={() => setIsDeleteOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition"
              >
                <Trash2 size={16} />
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Modal */}
      <DeleteDispenserModal
        open={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        dispenserId={dispenserId}
      />
    </>
  );
}
