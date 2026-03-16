import z from "zod";

export const removeAttendantSchema = z.object({
  closingBalance: z.coerce
    .number()
    .min(0, "Closing balance must be 0 or greater"),
  notes: z.string().optional(),
});

export type RemoveAttendantForm = z.infer<typeof removeAttendantSchema>;

export const assignAttendantSchema = z.object({
  attendantId: z.string().min(1, "Please select an attendant"),
  openingBalance: z.coerce
    .number()
    .min(0, "Opening balance must be 0 or greater"),
  notes: z.string().optional(),
});

export type AssignAttendantForm = z.infer<typeof assignAttendantSchema>;

