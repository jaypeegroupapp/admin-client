import { z } from "zod";

export const confirmPaymentSchema = z
  .object({
    amount: z.coerce.number().positive("Amount must be greater than 0"),
    paymentDate: z.string().min(1, "Payment date is required"),
    outstanding: z.coerce.number().positive("Amount must be greater than 0"),
  })
  .superRefine(({ amount, outstanding }, ctx) => {
    if (outstanding > amount) {
      ctx.addIssue({
        code: "custom",
        message: "Please enter a valid outstanding amount or more",
        path: ["amount"],
      });
    }
  });

export const confirmMinePaymentSchema = z.object({
  amount: z.coerce.number().positive("Amount must be greater than 0"),
  paymentDate: z.string().min(1, "Payment date is required"),
});
