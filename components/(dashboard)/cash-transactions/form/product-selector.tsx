"use client";

import { useState, useEffect } from "react";
import { getPublishedProducts } from "@/data/product";
import { UseFormRegister, FieldErrors, UseFormSetValue } from "react-hook-form";
import Select from "@/components/ui/select-validated";

interface ProductSelectorProps {
  register: UseFormRegister<any>;
  errors: FieldErrors;
  setValue: UseFormSetValue<any>;
  productId: string;
  canCreateTransaction: boolean;
}

export function ProductSelector({
  register,
  errors,
  setValue,
  productId,
  canCreateTransaction,
}: ProductSelectorProps) {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [checkingStock, setCheckingStock] = useState(false);

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    if (productId && products.length > 0) {
      const product = products.find((p) => p.id === productId);
      if (product) {
        setValue("grid", product.grid || 0);
        setValue("plusDiscount", product.discount || 0);
      }
    }
  }, [productId, products, setValue]);

  const loadProducts = async () => {
    setLoading(true);
    const resProducts = await getPublishedProducts();
    if (resProducts.success && resProducts.data) {
      setProducts(resProducts.data);
    }
    setLoading(false);
  };

  const options = products.map((product) => ({
    _id: product.id,
    name: product.name,
  }));

  return (
    <Select
      label="Product"
      name="productId"
      register={register}
      errors={errors}
      options={options}
    />
  );
}
