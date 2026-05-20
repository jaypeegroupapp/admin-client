import { z } from "zod";

export const tankerFormSchema = z.object({
  name: z
    .string()
    .min(2, "Tanker name is required")
    .max(100, "Name is too long"),
  productId: z.string().min(1, "Product selection is required"),
  stockLevel: z.coerce.number().min(0, "Stock level must be 0 or greater"),
  capacity: z.coerce.number().min(1, "Capacity must be at least 1 litre"),
  isPublished: z.boolean().optional(),
  userId: z.string().optional(),
});

export type TankerForm = z.infer<typeof tankerFormSchema>;

export const tankerCompleteFormData = [
  {
    name: "name",
    label: "Tanker Name",
    placeholder: "Enter tanker name",
    type: "text",
  },
  {
    name: "stockLevel",
    label: "Stock Level (Litres)",
    placeholder: "Enter current stock",
    type: "number",
    step: "0.1",
    min: "0",
  },
  {
    name: "capacity",
    label: "Capacity (Litres)",
    placeholder: "Enter maximum capacity",
    type: "number",
    step: "0.1",
    min: "1",
  },
];
