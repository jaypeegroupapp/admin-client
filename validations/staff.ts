// validations/staff.ts
import { z } from "zod";

export const STAFF_ROLES = [
  "Admin",
  "Ops Manager",
  "Accountant",
  "Station Attendant",
  "Super Admin",
] as const;


export const staffFormSchema = z.object({
  name: z.string().min(2),
  email: z.string().email().optional(),
  role: z.string().min(1, "Role is required"),
  status: z.enum(["active", "inactive"]),
});

export type StaffForm = z.infer<typeof staffFormSchema>;
