"use client";

import { FieldErrors, UseFormRegister } from "react-hook-form";

interface NotesFieldProps {
  register: UseFormRegister<any>;
  errors: FieldErrors;
  isPending: boolean;
}

export function RestockNotesField({
  register,
  errors,
  isPending,
}: NotesFieldProps) {
  return (
    <div className="flex flex-col mb-4">
      <label className="text-black text-sm mb-1">Notes (Optional)</label>
      <textarea
        {...register("notes")}
        rows={3}
        placeholder="Add any notes about this restock..."
        disabled={isPending}
        className="w-full px-4 py-2 rounded-lg bg-white text-black border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:bg-gray-100"
      />
      {errors.notes && (
        <span className="text-red-400 text-xs mt-1">
          {errors.notes.message as string}
        </span>
      )}
    </div>
  );
}