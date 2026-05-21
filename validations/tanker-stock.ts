import { z } from "zod";

export const restockTankerSchema = z.object({
  // Quantity fields
  quantityAdded: z.coerce
    .number()
    .min(0.1, "Quantity must be greater than 0")
    .max(100000, "Quantity too large"),

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
    .max(100, "Discount cannot exceed 100%")
    .default(0),

  // Other fields
  notes: z.string().optional(),
  restockDate: z.string().optional(),
});

export const restockInputFormData = [
  {
    name: "supplierName",
    label: "Supplier Name",
    placeholder: "Enter supplier name",
    type: "text",
  },
  {
    name: "invoiceNumber",
    label: "Invoice Number",
    placeholder: "Enter invoice number",
    type: "text",
  },
  {
    name: "invoiceUnitPrice",
    label: "Invoice Unit Price (R)",
    type: "number",
    step: "0.01",
    min: "0",
    placeholder: "Enter price per litre",
  },
  {
    name: "gridAtPurchase",
    label: "Grid Selling Price (R)",
    type: "number",
    step: "0.01",
    min: "0",
    placeholder: "Enter selling price per litre",
  },
  {
    name: "discount",
    label: "Discount (%)",
    type: "number",
    step: "0.1",
    min: "0",
    max: "100",
    placeholder: "Enter discount percentage",
  },
  {
    name: "invoiceDate",
    label: "Invoice Date",
    type: "date",
    placeholder: "Select invoice date",
  },
];

export type RestockTankerFormData = z.infer<typeof restockTankerSchema>;
