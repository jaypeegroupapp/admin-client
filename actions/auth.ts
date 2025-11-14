"use server";
import {
  loginUserformSchema,
  LoginUserState,
  registerUserformSchema,
  RegisterUserState,
} from "@/validations/auth";
import bcrypt from "bcrypt";
import { redirect } from "next/navigation";
import { createSession, deleteSession, setCookie } from "@/lib/session";
import { createUser, updateExistingUser } from "@/services/auth";
import { getUser, isUserExists } from "@/data/user";

export async function regsiterUser(
  prevState: RegisterUserState | undefined,
  formData: FormData
) {
  const validatedFields = registerUserformSchema.safeParse(
    Object.fromEntries(formData)
  );

  if (!validatedFields.success) {
    const state: RegisterUserState = {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Oops, I think there's a mistake with your inputs.",
    };
    return state;
  }

  const { email, name, password } = validatedFields.data;

  try {
    const isUserExist = await isUserExists(email);
    if (isUserExist) {
      const state: RegisterUserState = {
        errors: { email: ["Company already exists"] },
      };
      return state;
    }
  } catch (error) {
    throw new Error("Error fetching company:" + error);
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const user = await createUser(email, hashedPassword);
    await createSession(user.id);
    await setCookie("registrationStep", "0");
  } catch (error) {
    throw new Error("Error creating company:" + error);
  }

  redirect("/register/company");
}
