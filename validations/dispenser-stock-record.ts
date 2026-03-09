import z from "zod";

export const fillDispenserSchema = z.object({
  // Quantity fields
  purchasedQuantity: z.coerce
    .number()
    .min(0.1, "Purchased quantity must be greater than 0"),
  //.max(10000, "Quantity too large"),
  actualMeterReading: z.coerce
    .number()
    .min(0, "Meter reading must be 0 or greater"),

  // Supplier invoice fields (from stock movement)
  supplierName: z.string().optional(),
  invoiceNumber: z.string().optional(),
  invoiceUnitPrice: z.coerce
    .number()
    .min(0, "Unit price must be 0 or greater")
    .optional(),
  invoiceDate: z.string().optional(),

  // Pricing fields
  gridAtPurchase: z.coerce
    .number()
    .min(0, "Grid price must be 0 or greater")
    .optional(),
  discount: z.coerce
    .number()
    .min(0, "Discount must be 0 or greater")
    .default(0),

  // Other fields
  notes: z.string().optional(),
  fillDate: z.string().optional(),
});

export type FillDispenserFormData = z.infer<typeof fillDispenserSchema>;
