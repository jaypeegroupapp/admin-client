import { z } from "zod";

export const stockFormSchema = z.object({
  quantity: z.coerce
    .string()
    .min(1, "Quantity is required")
    .refine((v) => Number(v) > 0, "Quantity must be greater than 0"),
  purchasePrice: z.coerce
    .string()
    .min(1, "Purchased price is required")
    .refine((v) => Number(v) >= 0, "Must be a positive number"),

  sellingPriceAtPurchase: z.coerce
    .string()
    .min(1, "Selling price required")
    .refine((v) => Number(v) >= 0, "Must be a positive number"),
  supplierName: z.string().min(1, "Supplier name is required"),
  invoiceNumber: z.string().min(1, "Supplier name is required"),
  invoiceDate: z.string().min(1, "Supplier name is required"),
});
