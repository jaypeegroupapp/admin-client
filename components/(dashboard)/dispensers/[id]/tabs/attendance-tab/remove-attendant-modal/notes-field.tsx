"use client";

import { FieldErrors, UseFormRegister } from "react-hook-form";

interface NotesFieldProps {
  register: UseFormRegister<any>;
  errors: any;
  isPending: boolean;
}

export function NotesField({ register, errors, isPending }: NotesFieldProps) {
  return (
    <div className="flex flex-col">
      <label className="text-sm font-medium text-gray-700 mb-1">
        Notes (Optional)
      </label>
      <textarea
        {...register("notes")}
        rows={2}
        placeholder="Add any notes about this shift..."
        disabled={isPending}
        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:bg-gray-100"
      />
      {errors.notes && (
        <p className="text-sm text-red-600 mt-1">{errors.notes.message}</p>
      )}
    </div>
  );
}
