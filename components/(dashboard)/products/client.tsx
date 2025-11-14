"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { IProduct } from "@/definitions/product";
import { ProductHeader } from "./header";
import ProductModal from "@/components/ui/modal";
import ProductAddForm from "./add-form";
import { ProductList } from "./list";
import ProductFilter from "./filter";
import { getProducts } from "@/data/product";

interface Props {
  initialProducts: IProduct[];
}

export function ProductClientPage({ initialProducts }: Props) {
  const [products, setProducts] = useState<IProduct[]>(initialProducts || []);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<IProduct | null>(null);

  const [filterText, setFilterText] = useState("");

  const filtered = products.filter((p) =>
    `${p.name} ${p.description}`
      .toLowerCase()
      .includes(filterText.toLowerCase())
  );

  const fetchProducts = async () => {
    const res = await getProducts();
    if (res?.success) setProducts(res.data || []);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleAdd = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      <ProductHeader onAdd={handleAdd} />
      <ProductFilter onFilterChange={(text) => setFilterText(text)} />
      <ProductList initialProducts={filtered} />
      <ProductModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <ProductAddForm
          product={editingProduct}
          onClose={() => {
            fetchProducts();
          }}
        />
      </ProductModal>
    </motion.div>
  );
}
