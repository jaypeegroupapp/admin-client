import { z } from "zod";

export const roleFormSchema = z.object({
  name: z
    .string()
    .regex(
      /^[a-z]+(-[a-z]+)*$/,
      "Role name must be lower case e.g. station-attendant"
    ),

  description: z.string().min(3, "Description is required"),
});

export type RoleForm = z.infer<typeof roleFormSchema>;
