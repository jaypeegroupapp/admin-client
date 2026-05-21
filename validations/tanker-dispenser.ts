import { z } from "zod";

export const connectDispenserSchema = z.object({
  dispenserId: z.string().min(1, "Please select a dispenser"),
});

export type ConnectDispenserForm = z.infer<typeof connectDispenserSchema>;
