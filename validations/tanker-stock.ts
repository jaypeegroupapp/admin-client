import { z } from "zod";

export const restockTankerSchema = z.object({
  // Quantity fields
  quantityAdded: z.coerce
    .number()
    .min(0.1, "Quantity must be greater than 0")
    .max(100000, "Quantity too large"),
  actualMeterReading: z.coerce
    .number()
    .min(0, "Meter reading must be 0 or greater"),
  manualDippingReading: z.coerce
    .number()
    .min(0, "Manual dipping reading must be 0 or greater"),
  beforeStock: z.coerce.number().optional(),

  // Supplier invoice fields (required)
  supplierName: z.string().min(1, "Supplier name is required"),
  invoiceNumber: z.string().min(1, "Invoice number is required"),
  invoiceUnitPrice: z.coerce
    .number()
    .min(0.01, "Unit price must be greater than 0"),
  invoiceDate: z.string().min(1, "Invoice date is required"),

  // Pricing fields (required)
  gridAtPurchase: z.coerce
    .number()
    .min(0.01, "Grid selling price must be greater than 0"),
  discount: z.coerce
    .number()
    .min(0, "Discount must be 0 or greater")
    .max(100, "Discount cannot exceed 100%")
    .default(0),

  // Other fields
  notes: z.string().optional(),
  restockDate: z.string().min(1, "Restock date is required"),
});

export const financialFormData = [
  {
    name: "supplierName",
    label: "Supplier Name",
    placeholder: "Enter supplier name",
    type: "text",
    required: true,
  },
  {
    name: "invoiceNumber",
    label: "Invoice Number",
    placeholder: "Enter invoice number",
    type: "text",
    required: true,
  },
  {
    name: "invoiceUnitPrice",
    label: "Invoice Unit Price (R)",
    type: "number",
    step: "0.01",
    min: "0.01",
    placeholder: "Enter price per litre",
    required: true,
  },
  {
    name: "gridAtPurchase",
    label: "Grid Selling Price (R)",
    type: "number",
    step: "0.01",
    min: "0.01",
    placeholder: "Enter selling price per litre",
    required: true,
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
    required: true,
  },
];

export type RestockTankerFormData = z.infer<typeof restockTankerSchema>;
