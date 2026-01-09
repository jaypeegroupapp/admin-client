"use server";
import {
  loginUserformSchema,
  LoginUserState,
  registerUserformSchema,
  RegisterUserState,
  setPasswordFormSchema,
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

export async function loginUser(
  prevState: LoginUserState | undefined,
  formData: FormData
) {
  const validatedFields = loginUserformSchema.safeParse(
    Object.fromEntries(formData)
  );

  if (!validatedFields.success) {
    const state: LoginUserState = {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Oops, I think there's a mistake with your inputs.",
    };
    return state;
  }

  const { email, password } = validatedFields.data;

  try {
    const user = (await getUser({ email })) as any;
    if (!user) {
      const state: LoginUserState = {
        errors: { email: ["User does not exists"] },
      };
      return state;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      const state: LoginUserState = {
        errors: { password: ["Incorrect password"] },
      };
      return state;
    }

    // ⬇️ Resolve user + permissions ONCE (Node runtime)

    await createSession({
      id: user.id,
      email: user.email,
      permissions: user.permissions,
    });
  } catch (error) {
    console.error("Error: fetching Something went Wrong:", error);
  }

  redirect("/");
}

export async function registerExistingUser(
  id: string,
  prevState: any,
  formData: FormData
) {
  const validatedFields = setPasswordFormSchema.safeParse(
    Object.fromEntries(formData)
  );

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Please fix the errors below",
    };
  }

  const { password } = validatedFields.data;
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    await updateExistingUser(id, hashedPassword);

    await createSession(id);
  } catch (error) {
    throw new Error("Failed to set password");
  }

  redirect("/");
}

export async function logout() {
  await deleteSession();
  redirect("/login");
}
