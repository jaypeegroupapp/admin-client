// validations/truck.ts
import { z } from "zod";

export const truckFormSchema = z.object({
  plateNumber: z.string().min(3, "Plate number is required"),
  registrationNumber: z.string().min(3, "Registration number is required"),
  vinNumber: z.string().min(3, "VIN number is required"),
  make: z.string().optional(),
  model: z.string().optional(),
  year: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : undefined))
    .refine((val) => !val || val >= 1900, "Invalid year"),
  colour: z.string().optional(),
});

export type TruckForm = z.infer<typeof truckFormSchema>;
