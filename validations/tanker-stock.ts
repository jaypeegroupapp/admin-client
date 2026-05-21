import { z } from "zod";

export const restockTankerSchema = z.object({
  quantityAdded: z.coerce
    .number()
    .min(0.1, "Quantity must be greater than 0")
    .max(100000, "Quantity too large"),
  supplierName: z.string().optional(),
  invoiceNumber: z.string().optional(),
  notes: z.string().optional(),
  restockDate: z.string().optional(),
});

export const restockInputFormData = [
  {
    name: "quantityAdded",
    label: "Quantity Added (Litres)",
    type: "number",
    step: "0.1",
    min: "0.1",
    placeholder: "Enter litres added",
  },
  {
    name: "supplierName",
    label: "Supplier Name",
    type: "text",
    placeholder: "Enter supplier name",
  },
  {
    name: "invoiceNumber",
    label: "Invoice Number",
    type: "text",
    placeholder: "Enter invoice number",
  },
  {
    name: "restockDate",
    label: "Restock Date",
    type: "date",
  },
];

export type RestockTankerForm = z.infer<typeof restockTankerSchema>;
