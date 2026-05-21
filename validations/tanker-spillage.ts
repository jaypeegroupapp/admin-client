import { z } from "zod";

export const recordSpillageSchema = z.object({
  quantity: z.coerce
    .number()
    .min(0.1, "Quantity must be greater than 0")
    .max(100000, "Quantity too large"),
  type: z.enum(["TRANSFER", "STORAGE", "HANDLING"]),
  reason: z.string().min(1, "Please provide a reason"),
  estimatedCost: z.coerce.number().min(0).optional(),
  notes: z.string().optional(),
  spillageDate: z.string().optional(),
});

export const spillageFormData = [
  {
    name: "quantity",
    label: "Spillage Quantity (Litres)",
    type: "number",
    step: "0.1",
    min: "0.1",
    placeholder: "Enter litres spilled",
  },
  {
    name: "type",
    label: "Spillage Type",
    type: "select",
    options: [
      { value: "TRANSFER", label: "Transfer Spillage (during refill)" },
      { value: "STORAGE", label: "Storage Leakage / Evaporation" },
      { value: "HANDLING", label: "Handling / Operational Spillage" },
    ],
  },
  {
    name: "reason",
    label: "Reason / Cause",
    type: "text",
    placeholder: "e.g., Equipment failure, human error, etc.",
  },
  {
    name: "estimatedCost",
    label: "Estimated Cost (R)",
    type: "number",
    step: "0.01",
    min: "0",
    placeholder: "Enter estimated financial impact",
  },
  {
    name: "spillageDate",
    label: "Date of Spillage",
    type: "date",
  },
];

export type RecordSpillageForm = z.infer<typeof recordSpillageSchema>;
