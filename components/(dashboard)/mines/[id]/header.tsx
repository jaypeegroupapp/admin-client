"use client";

import { ArrowLeft, Pencil, Trash2 } from "lucide-react";

export function MineHeader({
  mineName,
  onBack,
  onEdit,
  onDelete,
}: {
  mineName: string;
  onBack: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="flex items-center justify-between">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-gray-600 hover:text-black transition"
      >
        <ArrowLeft size={18} />
        Back
      </button>

      <h1 className="text-xl font-semibold text-gray-800">{mineName}</h1>

      <div className="flex items-center gap-3">
        <button
          onClick={onEdit}
          className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition"
        >
          <Pencil size={18} />
        </button>

        <button
          onClick={onDelete}
          className="p-2 rounded-lg text-red-600 hover:bg-red-50 transition"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
}
