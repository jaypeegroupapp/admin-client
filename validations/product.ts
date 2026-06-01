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
  grid: z.coerce.number().min(0, "Grid must be 0 or greater").optional(),
  discount: z.coerce
    .number()
    .min(0, "Discount must be 0 or greater")
    .optional(),
  minStockThreshold: z.coerce
    .number()
    .min(0, "Minimum threshold must be 0 or greater")
    .optional(),
});

export type ProductFormData = z.infer<typeof productFormSchema>;

export const editProductFormSchema = z.object({
  name: z
    .string()
    .min(2, "Product name is required")
    .max(100, "Name is too long"),
  description: z
    .string()
    .min(5, "Description must be at least 5 characters")
    .max(500, "Description too long"),
  grid: z.coerce.number().min(0).nonnegative("Grid cannot be negative"),
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
