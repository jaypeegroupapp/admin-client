// components/Toast.tsx
"use client";

import { useEffect } from "react";

interface ToastProps {
  message: string;
  type?: "success" | "error";
  onClose: () => void;
}

export default function Toast({
  message,
  type = "success",
  onClose,
}: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => onClose(), 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      className={`fixed bottom-6 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded-md shadow-lg text-white text-sm transition-opacity z-50
        ${type === "success" ? "bg-gray-800" : "bg-red-500"}`}
    >
      {message}
    </div>
  );
}
