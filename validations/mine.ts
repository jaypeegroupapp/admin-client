import { z } from "zod";

export const mineFormSchema = z.object({
  name: z.string().min(2, "Mine name is required"),
});
