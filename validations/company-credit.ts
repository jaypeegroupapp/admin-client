import { z } from "zod";

export const creditFormSchema = z.object({
  amount: z
    .string()
    .min(1, "Amount is required")
    .refine((val) => Number(val) > 0, "Amount must be greater than 0"),
  issuedDate: z.string().min(1, "Issued Date is required"),
});
