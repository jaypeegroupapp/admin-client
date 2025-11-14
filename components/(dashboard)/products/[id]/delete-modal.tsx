"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { BaseModal } from "@/components/ui/base-modal";
import { deleteProductAction } from "@/actions/product";

interface Props {
  open: boolean;
  onClose: () => void;
  productId: string;
}

export function DeleteProductModal({ open, onClose, productId }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);

    const result = await deleteProductAction(productId);

    setLoading(false);

    if (result?.success) {
      onClose();
      router.push("/products");
    } else {
      alert(result?.message || "Failed to delete product");
    }
  };

  return (
    <BaseModal open={open} onClose={onClose}>
      <h3 className="text-lg font-semibold text-gray-800 mb-2">
        Delete Product
      </h3>

      <p className="text-sm text-gray-600 mb-6">
        Are you sure you want to delete this product? This action cannot be
        undone.
      </p>

      <div className="flex justify-end gap-3">
        <button
          onClick={onClose}
          className="px-4 py-2 text-sm border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition"
        >
          Cancel
        </button>

        <button
          onClick={handleDelete}
          disabled={loading}
          className="px-4 py-2 text-sm rounded-lg bg-red-600 text-white hover:bg-red-700 transition disabled:opacity-50"
        >
          {loading ? "Deleting..." : "Delete"}
        </button>
      </div>
    </BaseModal>
  );
}
