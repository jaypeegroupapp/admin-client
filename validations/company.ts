import { z } from "zod";

export const companyFormSchema = z.object({
  name: z.string().min(2, "Company name is required"),
  registrationNumber: z.string().min(2, "Registration number is required"),
  contactEmail: z.string().email("Invalid email address"),
  contactPhone: z.string().min(7, "Phone number too short"),
  billingAddress: z.string().min(5, "Billing address required"),
  vatNumber: z.string().optional(),

  // ✅ Server-safe validation for uploaded file
  invoiceFile: z
    .any()
    .refine(
      (file) =>
        !file ||
        (typeof file === "object" &&
          "size" in file &&
          "type" in file &&
          typeof file.name === "string"),
      "Invalid file format"
    )
    .refine(
      (file) => !file || file.size <= 5 * 1024 * 1024,
      "File size must be under 5MB"
    )
    .refine(
      (file) =>
        !file ||
        ["application/pdf", "image/png", "image/jpeg"].includes(file.type),
      "Only PDF, PNG, or JPEG files are allowed"
    )
    .optional(),
});

export type CompanyFormData = z.infer<typeof companyFormSchema>;
