// src/validations/product.ts
import { z } from "zod";

export const productFormSchema = z.object({
  name: z
    .string()
    .min(2, "Product name is required")
    .max(100, "Name is too long"),
  description: z
    .string()
    .min(5, "Description must be at least 5 characters")
    .max(500, "Description too long"),
});

export type ProductForm = z.infer<typeof productFormSchema>;

export const editProductFormSchema = z.object({
  name: z
    .string()
    .min(2, "Product name is required")
    .max(100, "Name is too long"),
  description: z
    .string()
    .min(5, "Description must be at least 5 characters")
    .max(500, "Description too long"),
  sellingPrice: z.coerce
    .number()
    .min(0)
    .nonnegative("Selling price cannot be negative"),
  purchasePrice: z.coerce
    .number()
    .min(0)
    .nonnegative("Cost Price cannot be negative"),
  isPublished: z
    .union([z.string(), z.boolean()])
    .transform((val) => val === "true" || val === true)
    .default(false),
});

export type EditProductForm = z.infer<typeof editProductFormSchema>;
