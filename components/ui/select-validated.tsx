"use client";

import { UseFormRegister } from "react-hook-form";

interface SelectProps {
  label: string;
  name: string;
  register: UseFormRegister<any>;
  errors?: Record<string, any>;
  options: { _id: string; name: string }[];
}

export default function Select({
  label,
  name,
  register,
  errors,
  options,
}: SelectProps) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={name} className="font-medium text-gray-800">
        {label}
      </label>
      <select
        id={name}
        {...register(name)}
        className="rounded-md border px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-300 bg-white"
      >
        <option value="">Select {label}</option>
        {options.map((opt) => (
          <option key={opt._id} value={opt._id}>
            {opt.name}
          </option>
        ))}
      </select>
      {errors?.[name] && (
        <p className="text-sm text-red-500">{errors[name]?.message}</p>
      )}
    </div>
  );
}
