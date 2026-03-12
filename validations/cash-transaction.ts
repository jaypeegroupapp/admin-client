// src/validations/cash-transaction.ts
import { z } from "zod";

export const cashTransactionFormSchema = z.object({
  companyName: z.string().min(1, "Company name is required"),
  plateNumber: z.string().min(1, "Truck number is required"),
  driverName: z.string().min(1, "Driver name is required"),
  phoneNumber: z.string().min(1, "Phone number is required"),
  litresPurchased: z.coerce.number().min(0.1, "Litres must be greater than 0"),
  productId: z.string().min(1, "Product selection is required"),
  grid: z.coerce.number().optional(),
  plusDiscount: z.coerce.number().optional(),
});

export type CashTransactionForm = z.infer<typeof cashTransactionFormSchema>;
