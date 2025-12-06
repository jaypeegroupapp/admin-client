import { z } from "zod";

export const creditFormSchema = z.object({
  amount: z.coerce
    .string()
    .min(1, "Amount is required")
    .refine((val) => Number(val) > 0, "Amount must be greater than 0"),
  issuedDate: z.string().min(1, "Issued Date is required"),
});

export const creditMineFormSchema = z.object({
  creditLimit: z.string().min(1, "Credit limit is required"),
  mineId: z.string().optional(),
  requester: z.string().min(1, "Requester is required"),
  reason: z.string().min(1, "Reason is required"),
  document: z.any(),
});
