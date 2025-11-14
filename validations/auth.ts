import { z } from "zod";

export const registerUserformSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(3, "company name must be at least 3 characters")
      .regex(/^\S+$/, "company name must not contain spaces"),
    email: z.email(),
    password: z
      .string()
      .min(8, { message: "Be at least 8 characters long" })
      .regex(/[a-zA-Z]/, { message: "Contain at least one letter." })
      .regex(/[a-z]/, { message: "Contain at least one lowercase letter." })
      .regex(/[0-9]/, { message: "Contain at least one number." })
      .regex(/[^a-zA-Z0-9]/, {
        message: "Contain at least one special character.",
      })
      .trim(),
    confirmPassword: z.string().transform((pwd) => pwd.trim()),
  })
  .superRefine(({ password, confirmPassword }, ctx) => {
    if (password !== confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Passwords don't match.",
        path: ["confirmPassword"],
      });
    }
  });

export type RegisterUserForm = z.infer<typeof registerUserformSchema>;

export type RegisterUserState = {
  errors?: {
    username?: string[];
    email?: string[];
    password?: string[];
    confirmPassword?: string[];
  };
  message?: string | null;
};

export const loginUserformSchema = z.object({
  email: z.string().trim(),
  password: z
    .string()
    .min(8, { message: "Be at least 8 characters long" })
    .regex(/[a-zA-Z]/, { message: "Contain at least one letter." })
    .regex(/[a-z]/, { message: "Contain at least one lowercase letter." })
    .regex(/[0-9]/, { message: "Contain at least one number." })
    // .regex(/[^a-zA-Z0-9]/, {
    //   message: "Contain at least one special character.",
    // })
    .trim(),
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
