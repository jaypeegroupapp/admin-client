import { z } from "zod";

export const dispenserFormSchema = z.object({
  name: z
    .string()
    .min(2, "Dispenser name is required")
    .max(100, "Name is too long"),
  productId: z.string().min(1, "Product selection is required"),
  totalDispensed: z.coerce
    .number()
    .min(0, "Total dispensed must be 0 or greater")
    .optional(),
  isPublished: z.boolean().optional(),
  userId: z.string().optional(),
});

export type DispenserForm = z.infer<typeof dispenserFormSchema>;
