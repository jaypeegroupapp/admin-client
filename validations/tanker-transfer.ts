import { z } from "zod";

export const transferToDispenserSchema = z.object({
  quantity: z.coerce
    .number()
    .min(0.1, "Quantity must be greater than 0")
    .max(100000, "Quantity too large"),
  notes: z.string().optional(),
});

export type TransferToDispenserForm = z.infer<typeof transferToDispenserSchema>;

export type TransferFormState = {
  errors: {
    quantity?: string[];
    notes?: string[];
    global?: string[];
  };
  message: string;
};
