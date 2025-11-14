// /definitions/auth.ts
import { z } from "zod";

export const loginUserformSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type LoginUserForm = z.infer<typeof loginUserformSchema>;

export type LoginUserState = {
  errors?: {
    email?: string[];
    password?: string[];
  };
  message?: string | null;
};

export type SessionPayload = {
  userId: string;
  expiresAt: Date;
};
