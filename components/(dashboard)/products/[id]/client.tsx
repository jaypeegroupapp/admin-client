"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { IProduct } from "@/definitions/product";
import { ProductHeader } from "./header";
import { ProductSummary } from "./summary";
import { ProductTabs } from "./tabs";
import ProductAddForm from "../add-form";
import ProductModal from "@/components/ui/modal";
import { DeleteProductModal } from "./delete-modal";

export function ProductDetailsClient({
  product,
  totalOrderQuantity,
}: {
  product: IProduct;
  totalOrderQuantity: number;
}) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"info" | "inventory" | "orders">(
    "inventory"
  );

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="space-y-8"
      >
        <ProductHeader
          productName={product.name}
          onBack={() => router.back()}
          onEdit={() => setIsEditOpen(true)}
          onDelete={() => setIsDeleteOpen(true)}
        />

        <ProductSummary
          product={product}
          totalOrderQuantity={totalOrderQuantity}
        />

        <ProductTabs
          productId={product.id!}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
      </motion.div>

      {/* 🟦 EDIT PRODUCT */}
      <ProductModal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)}>
        <ProductAddForm
          product={product}
          onClose={() => {
            setIsEditOpen(false);
            router.refresh(); // refresh product details
          }}
        />
      </ProductModal>

      {/* 🟥 DELETE PRODUCT */}
      <DeleteProductModal
        open={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        productId={product.id!}
      />
    </>
  );
}
