"use client";

import { UseFormRegister } from "react-hook-form";

interface TextareaProps {
  label: string;
  name: string;
  register: UseFormRegister<any>;
  errors?: Record<string, any>;
  placeholder?: string;
}

export default function Textarea({
  label,
  name,
  register,
  errors,
  placeholder,
}: TextareaProps) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={name} className="font-medium text-gray-800">
        {label}
      </label>
      <textarea
        id={name}
        placeholder={placeholder}
        {...register(name)}
        className="rounded-md border px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-300 bg-white min-h-[100px]"
      />
      {errors?.[name] && (
        <p className="text-sm text-red-500">{errors[name]?.message}</p>
      )}
    </div>
  );
}
