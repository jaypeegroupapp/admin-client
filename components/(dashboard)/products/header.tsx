"use client";

import { Button } from "@/components/ui/button";

export function ProductHeader({ onAdd }: { onAdd: () => void }) {
  return (
    <div className="flex items-center justify-between">
      <h1 className="text-lg font-semibold text-gray-800">Products</h1>
      <Button onClick={onAdd}>Add Product</Button>
    </div>
  );
}
