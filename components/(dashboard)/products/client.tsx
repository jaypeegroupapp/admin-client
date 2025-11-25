"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { IProduct } from "@/definitions/product";
import { ProductHeader } from "./header";
import { ProductList } from "./list";
import { ProductTabs, ProductTab } from "./tabs";
import ProductModal from "@/components/ui/modal";
import ProductAddForm from "./add-form";
import { getProducts } from "@/data/product";
import ProductFilter from "./filter";

interface Props {
  initialProducts: IProduct[];
}

export function ProductClientPage({ initialProducts }: Props) {
  const [products, setProducts] = useState<IProduct[]>(initialProducts || []);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<IProduct | null>(null);

  const [filterText, setFilterText] = useState("");
  const [activeTab, setActiveTab] = useState<ProductTab>("All");

  const fetchProducts = async () => {
    const res = await getProducts();
    if (res?.success) setProducts(res.data || []);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  /** ----------------------------------------
   * TAB COUNTS
   ----------------------------------------*/
  const counts = {
    All: products.length,
    Published: products.filter((p) => p.isPublished).length,
    Draft: products.filter((p) => !p.isPublished).length,
  };

  /** ----------------------------------------
   * SEARCH + TAB FILTERING
   ----------------------------------------*/
  const filtered = products
    .filter((p) =>
      `${p.name} ${p.description}`
        .toLowerCase()
        .includes(filterText.toLowerCase())
    )
    .filter((p) => {
      if (activeTab === "Published") return p.isPublished === true;
      if (activeTab === "Draft") return p.isPublished === false;
      return true;
    });

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

      {/* TABS + SEARCH ROW */}
      <div className="flex flex-col lg:flex-row items-center gap-4">
        <ProductTabs
          activeTab={activeTab}
          onChange={setActiveTab}
          counts={counts}
        />

        <ProductFilter onFilterChange={(text) => setFilterText(text)} />
      </div>

      <ProductList initialProducts={filtered} />

      {/* MODAL */}
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
