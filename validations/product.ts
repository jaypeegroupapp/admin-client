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
  price: z.coerce.number().min(0).nonnegative("Price cannot be negative"),
  stock: z.coerce.number().min(0).int().nonnegative("Stock cannot be negative"),
  isPublished: z
    .union([z.string(), z.boolean()])
    .transform((val) => val === "true" || val === true)
    .default(false),
});

export type ProductForm = z.infer<typeof productFormSchema>;
