"use client";

import { Check, AlertCircle } from "lucide-react";

export function MessageDisplay({ message }: { message: string }) {
  if (!message) return null;

  const isSuccess = message.includes("✅");
  return (
    <div
      className={`p-3 rounded-lg ${isSuccess ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"}`}
    >
      <p
        className={`text-sm ${isSuccess ? "text-green-700" : "text-red-700"} flex items-center gap-2`}
      >
        {isSuccess ? <Check size={16} /> : <AlertCircle size={16} />}
        {message}
      </p>
    </div>
  );
}
