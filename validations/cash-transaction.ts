import { z } from "zod";

export const cashTransactionFormSchema = z.object({
  companyName: z.string().min(2, "Company name is required"),
  plateNumber: z.string().min(2, "Plate number is required"),
  driverName: z.string().min(2, "Driver name is required"),
  phoneNumber: z.string().min(7, "Phone number is required"),

  litresPurchased: z.coerce
    .number()
    .min(1, "Litres purchased must be greater than 0"),

  grid: z.coerce.number().min(0, "Grid price is required"),

  plusDiscount: z.coerce.number().optional().default(0),
});

export type CashTransactionFormData = z.infer<typeof cashTransactionFormSchema>;
