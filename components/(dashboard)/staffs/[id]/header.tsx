"use client";

import { ArrowLeft, Pencil, Trash2 } from "lucide-react";

interface Props {
  staffName: string;
  onBack: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export function StaffHeader({ staffName, onBack, onEdit, onDelete }: Props) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <button onClick={onBack} className="p-2 rounded-lg hover:bg-gray-100">
          <ArrowLeft size={18} />
        </button>

        <h1 className="text-xl font-semibold text-gray-800">{staffName}</h1>
      </div>

      <div className="flex gap-2">
        <button
          onClick={onEdit}
          className="p-2 rounded-lg border hover:bg-gray-50"
        >
          <Pencil size={16} />
        </button>

        <button
          onClick={onDelete}
          className="p-2 rounded-lg border text-red-600 hover:bg-red-50"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
}
