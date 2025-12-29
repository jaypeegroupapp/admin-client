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
  name: z.string().min(2, "Staff name is required"),
  email: z.string().email("Valid email is required"),
  role: z.enum(STAFF_ROLES),
  status: z.enum(["active", "inactive"]).default("active"),
});

export type StaffForm = z.infer<typeof staffFormSchema>;
