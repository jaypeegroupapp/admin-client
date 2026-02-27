import { z } from "zod";

export const stockFormSchema = z.object({
  quantity: z.coerce
    .string()
    .min(1, "Quantity is required")
    .refine((v) => Number(v) > 0, "Quantity must be greater than 0"),
  gridAtPurchase: z.coerce
    .string()
    .min(1, "Grid required")
    .refine((v) => Number(v) >= 0, "Must be a positive number"),
  discount: z.coerce
    .string()
    .min(1, "Discount is required")
    .refine((v) => Number(v) >= 0, "Must be a positive number"),
  supplierName: z.string().min(1, "Supplier name is required"),
  invoiceNumber: z.string().min(1, "Supplier name is required"),
  invoiceUnitPrice: z.coerce
    .string()
    .min(1, "Invoice unit price is required")
    .refine((v) => Number(v) >= 0, "Must be a positive number"),
  invoiceDate: z.string().min(1, "Invoice date is required"),
});
